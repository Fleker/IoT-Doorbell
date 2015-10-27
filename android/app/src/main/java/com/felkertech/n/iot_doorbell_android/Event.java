package com.felkertech.n.iot_doorbell_android;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by guest1 on 10/26/2015.
 */
public class Event {

    @SerializedName("result")
    @Expose
    private Long result;
    @SerializedName("timestamp")
    @Expose
    private Object timestamp;
    @SerializedName("event_id")
    @Expose
    private Long eventId;

    /**
     *
     * @return
     * The result
     */
    public Long getResult() {
        return result;
    }

    /**
     *
     * @param result
     * The result
     */
    public void setResult(Long result) {
        this.result = result;
    }

    /**
     *
     * @return
     * The timestamp
     */
    public Object getTimestamp() {
        return timestamp;
    }

    /**
     *
     * @param timestamp
     * The timestamp
     */
    public void setTimestamp(Object timestamp) {
        this.timestamp = timestamp;
    }

    /**
     *
     * @return
     * The eventId
     */
    public Long getEventId() {
        return eventId;
    }

    /**
     *
     * @param eventId
     * The event_id
     */
    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

}