package com.felkertech.n.iot_doorbell_android;

import android.app.Notification;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.support.v4.app.NotificationCompat;

/**
 * Created by guest1 on 10/26/2015.
 */
public class DoorbellNotification {
    public static Notification createDoorbellNotification(Context mContext) {
        Notification n = new NotificationCompat.Builder(mContext)
                .setContentTitle("Doorbell Event")
                .setContentText("Doorbell was pressed")
                .setColor(Color.CYAN)
                .setPriority(Notification.PRIORITY_MAX)
                .setSmallIcon(R.mipmap.ic_launcher)
                .build();
        return n;
    }
}
