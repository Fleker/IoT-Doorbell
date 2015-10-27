package com.felkertech.n.iot_doorbell_android;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by guest1 on 10/26/2015.
 */
public class ResponseEvent {
    @SerializedName("resppnse")
    @Expose
    private Long resppnse;

    /**
     *
     * @return
     * The resppnse
     */
    public Long getResppnse() {
        return resppnse;
    }

    /**
     *
     * @param resppnse
     * The resppnse
     */
    public void setResppnse(Long resppnse) {
        this.resppnse = resppnse;
    }
}