package com.felkertech.n.iot_doorbell_android;

import retrofit.Call;
import retrofit.http.GET;
import retrofit.http.Path;
import retrofit.http.Query;

/**
 * Created by guest1 on 10/26/2015.
 */
public interface ServerCommands {
    @GET("new")
    Call<NewEvent> newEvent();

    @GET("event")
    Call<Event> getEvent(@Query("event") int event_id);

    @GET("respond")
    Call<ResponseEvent> respond(@Query("event_id") int event_id,
                             @Query("result") int status);

}
