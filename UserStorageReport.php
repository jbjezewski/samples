#!/usr/local/bin/php -q
<?php
	$_SERVER['DOCUMENT_ROOT'] = 'APPLICATION_ROOT';
	$dbfile = 'DB_CONNECTION_CLASS';
	$logfile = 'LOG_FILE';
	if (file_exists($dbfile) && is_readable($dbfile)) {
		require_once $dbfile;
	}else{
		error_log("Could not require dbclass file", 3, $logfile);	
	}
	$db = new DBclass();
	$db->connect("readonly_user");
		//get plans
		$query = "SELECT * FROM database_name.plans";
		$result = mysql_query($query); 
		if (empty($result) || (mysql_num_rows($result) === 0)){
			error_log("Storage Report select plan query failed\n", 3, $logfile);	
			return FALSE;
		}
		while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
			$plans[$row['id']] = $row['data'];
		}	
		//produces an array: $plans['1'] = '100', $plans['2'] = '1024', $plans['3'] = '2048';
		
	$id = array();
		//get sum of transaction size for this user
		$query = "SELECT id, SUM(transactionSize) as userSize FROM database_name.transactions GROUP BY id";
		$result = mysql_query($query); // $result is similar to Resource id #21 or false
		if (empty($result) || (mysql_num_rows($result) === 0)){
			error_log("Storage Report select transaction size query failed\n", 3, $logfile);	
			return FALSE;
		}
		while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
			$id[$row['id']]['size'] = $row['userSize'];
			$id[$row['id']]['statusCheck'] = false; 
			//statusCheck can be used for error checking later, to indicate a user's status needs to be changed
		}	

	foreach($id as $thisuser => $thisuserarray){
		//get this user's param1, the first directory under BASEDIR/
		$query = "SELECT * FROM database_name.userEntries UI LEFT JOIN database_name.users U on UI.id = U.uid WHERE id = '".$thisuser."'";
		$result = mysql_query($query);
		if (empty($result) || (mysql_num_rows($result) === 0)){
			error_log("Storage Report select userEntries query failed\n", 3, $logfile);	
			return FALSE;
		}
		while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
			$id[$row['id']]['param1'] = $row['param1'];
			$id[$row['id']]['plan'] = $row['plan_id'];
		}	
	}
	
	//produces an array like this
	/*$id = array(
		['832'] => array(
			['size'] = '127378',
			['param1'] = '329',
	      ['plan'] = '2',
			['statusCheck'] = false,
			)
		['719'] => array(
			['size'] = '18344800',
			['param1'] = '674',
	      ['plan'] = '0',
			['statusCheck'] = false,
			)
		)*/

	$db->disconnect();
	$basedir = "/BASE_DIRECTORY"; //followed by /param1/id
	
	//once we have an array of the id values and the corresponding expected user storage sizes and param1 values, 
	//we want to iterate through the array and check the size of the corresponding directories under /BASE_DIRECTORY/param1/id/

	$sizeCheckStatus = false;
	$sizeCheckReport = ''; //this will be content of email reporting on each directory/db comparison

	foreach ($id as $userkey => $userval){
		// build the directory path for each user and device
			$thisdir = $basedir . $id[$userkey]['param1'] . "/" . $userkey . "/";
			$user_id = $userkey;
			$usersize = $id[$userkey]['size'];
			$userplan = $id[$userkey]['plan'];
		//check that directory exists
		if (file_exists($thisdir) && is_readable($thisdir)) {
			//get directory size
			$size = 0; 
			$countfiles = 0;
			foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($thisdir)) as $file){ 
				$isfile = $file->isFile();
				$isreadable = $file->isReadable();
				if($isfile === true && $isreadable === true){ 
					//only add size if it's a file, not a directory		
					
					$size+=$file->getSize(); 			
					$countfiles++;
				}
			} 
			$thisdirUsage = $size; 	
			// $size is in bytes
			//now we have the size of the user's directory in $thisdirUsage, which we want to get in MB and compare to their plan value
			
			$thisdirUsage = $thisdirUsage / (1024 * 1024);
			if($plans[$userplan] == '' || $plans[$userplan] == 0 || $plans[$userplan] == '0'){
			
				error_log("Did not update user with id " . $userkey . " to status 4 because they are not assigned to a plan.\n", 3, $logfile);
				$sizeCheckReport .= "Did not update user with id " . $userkey. " to status 4 because they are not assigned to a plan.\n";	
				
			}else if($plans[$userplan] != '' && $thisdirUsage > $plans[$userplan]){
			
				$query = "UPDATE database_name.users SET status = 4 WHERE id = '".$userkey."'";
				$result = mysql_query($query);
				if (empty($result) || (mysql_num_rows($result) === 0)){
					error_log("Storage Report update user status query failed\n", 3, $logfile);	
					return FALSE;
				}		
				error_log("Updated user with id " . $userkey. " to status 4 because they have exceeded their plan size limit.\n", 3, $logfile);
				$sizeCheckReport .= "Updated user with id " . $userkey. " to status 4 because they have exceeded their plan size limit.\n";
				
			}else if($plans[$userplan] != '' && $thisdirUsage <= $plans[$userplan]){
			
			  //comment out the following two lines if you only want the report email to contain errors
			  
				error_log("Did not change user status with id " . $userkey. " because they have not exceeded their plan size limit.\n", 3, $logfile);
				$sizeCheckReport .= "Did not change user status with id " . $userkey. " because they have not exceeded their plan size limit.\n";
				
			}
		}else{
				error_log("Directory " . $thisdir . " does not exist or is unreadable\n", 3, $logfile);
				$sizeCheckReport .= "Directory " . $thisdir . " does not exist or is unreadable \n";
				$id[$userkey]['statusCheck'] = false;
		}
	}
		
		//now send email with report content for each user status
				$messageContent = $sizeCheckReport;
				$to      = 'adminemail@gmail.com';
				$subject = "User Storage Check Alert for Users";
				$headers   = array();
				$headers[] = "MIME-Version: 1.0";
				$headers[] = "Content-type: text/plain; charset=iso-8859-1";
				$headers[] = "From: Sender Name <CompareDirectoriesReport@clientdomain.com>";
				$headers[] = "Reply-To: Recipient Name <adminemail@gmail.com>";
				$headers[] = "Subject: {$subject}";
				$headers[] = "X-Mailer: PHP/".phpversion();
			$todaysmail =	mail($to, $subject, $messageContent, implode("\r\n", $headers));
		if(!$todaysmail){
					error_log("This mail " . $todaysmail . " was not sent successfully", 3, $logfile);
		}
		
//cron job for Apache nobody user
//crontab -u nobody -e
//MAILTO=adminemail@gmail.com
//0 0 * * * /usr/local/bin/php BASE_DIR/UserStorageReport.php

?>
