<body>
<!--form html here-->
    <script src="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js" class=""></script>
    <script type="text/javascript" src="js/bootstrapValidator.min.js"></script>
    <script type="text/javascript">
      $(document).ready(function() {
        $('#userForm').bootstrapValidator({
            live: 'submitted',
            message: 'This value is not valid',
            feedbackIcons: {
              valid: 'glyphicon glyphicon-ok',
              invalid: 'glyphicon glyphicon-remove',
              validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
              number: {
                message: 'The number is not valid',
                validators: {
        				  remote: {
        						required: true,
                    url: 'http://clientdomain.com/NumberExists.php',
                    // Send { number: 'number value' } to back-end
        						type: 'post',
                    data: function(validator) {
                      return {
                        number: validator.getFieldElements('number').val()
                      };
                    },
                    message: 'That number is already being used or is not valid. Please try another.'
                  },
                  notEmpty: { message: 'A valid number is required and cannot be empty' },
                  regexp: { regexp: /^[+]?([0-9]*[\.\s\-\(\)]|[0-9]+){3,24}$/, message: 'The number does not match the format. +123-333-444-5555' }
                }
              },
            },
            submitHandler: function(validator, form) {

              $.post('Form-Validated.php', form.serialize(), function(response) {
                //replace the current form with the response HTML
              });

            }
        });

      });
</script>
</body>
</html>

<!--Contents of NumberExists.php: -->

<?php
  require_once $_SERVER['DOCUMENT_ROOT'].'/query_db.php';
    $number = $_POST['number'];
    $database = new queryDB();
    if($database->connect() === FALSE){
      error_log("Not connected to db for NumberExists.php number validation.", 3, "/numberExists.log");
    }
	$is_valid = true; 
	$newnumber = $database->formatNumber($number); 
	//format number cleans out non-numerical characters
	
	if($newnumber === FALSE) {
		$is_valid = false;
      error_log("New number " . $newnumber . " appears to be incorrect. Please re-enter it.", 3, "/numberExists.log");
	}
	if($is_valid === TRUE && $database->numberExists($newnumber) === TRUE){
		$is_valid = false;
      error_log("That Phone Number already exists in our system. Please use another.", 3, "/numberExists.log");
	}
	$database->disconnect();

	// Finally, return a JSON
	echo json_encode(array(
		'valid' => $is_valid,
	));
?>
