package com.felkertech.n.iot_doorbell_android;

/**
 * Created by guest1 on 10/26/2015.
 */
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class NewEvent {

    @SerializedName("event_id")
    @Expose
    private Integer eventId;

    /**
     *
     * @return
     * The eventId
     */
    public Integer getEventId() {
        return eventId;
    }

    /**
     *
     * @param eventId
     * The event_id
     */
    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

}
