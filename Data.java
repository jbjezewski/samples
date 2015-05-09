package com.clientproject.rest.api.data;

import com.clientproject.business.DataObject;
import com.clientproject.query.DataQueryObject;
import com.clientproject.service.GetDataService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by jbj on 9/3/2014.
 */

@Path("/data")
public class Data {

    @Autowired
    GetDataService getDataService;

    @GET @Path("/all")
    @Produces(MediaType.APPLICATION_XML)
    public List<DataObject> getAllData() {
        DataQueryObject queryObject = new DataQueryObject();
        List<DataObject> data = getDataService.listDataByQuery(queryObject);
        return data;
    }

    @GET @Path("/query")
    @Produces(MediaType.APPLICATION_XML)
    public List<DataObject> getData(@QueryParam("userID") String userID, 
                                    @QueryParam("dataDate") String dataDate )
      {
                                    
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date converted_dataDate = null;
        try {
            converted_dataDate = sdf.parse(dataDate);

        } catch (ParseException e) {
            e.printStackTrace();
        }
        Integer converted_userID = Integer.parseInt(userID);
        Integer converted_dataAmount = Integer.parseInt(dataAmount);

        DataQueryObject queryObject = new DataQueryObject();
        if(userID != null) {
            queryObject.setUserID(converted_userID);
        }
        if(dataDate != null) {
            queryObject.setDataDate(converted_dataDate);
        }

        List<DataObject> data = getDataService.listDataByQuery(queryObject);
        return data;
    }

}
