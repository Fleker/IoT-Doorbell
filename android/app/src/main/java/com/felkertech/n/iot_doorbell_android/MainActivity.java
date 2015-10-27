package com.felkertech.n.iot_doorbell_android;

import android.app.NotificationManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import retrofit.Callback;
import retrofit.GsonConverterFactory;
import retrofit.Response;
import retrofit.Retrofit;

public class MainActivity extends AppCompatActivity {
    private int event_id_int;
    private ServerCommands server;
    private TextView status;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    @Override
    protected void onResume() {
        super.onResume();
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://iotdoorbell.herokuapp.com/api/v1/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        server = retrofit.create(ServerCommands.class);

        Button doorbell = (Button) findViewById(R.id.doorbell);
        final TextView event_id = (TextView) findViewById(R.id.event_id);
        status = (TextView) findViewById(R.id.status);

        doorbell.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                event_id.setText(R.string.searching);
                status.setText(getString(R.string.status_is, Constants.STATUS_UNKNOWN));
                server.newEvent().enqueue(new Callback<NewEvent>() {
                    @Override
                    public void onResponse(Response<NewEvent> response, Retrofit retrofit) {
                        NewEvent newEvent = response.body();
                        Log.d("door", "About to do something");
                        Log.d("door", response.raw().toString());
                        Log.d("door", response.message());
                        Log.d("door", response.headers().toString());
                        Log.d("door", (newEvent==null)+"");
                        Log.d("door", newEvent.getEventId()+"");
                        event_id.setText(newEvent.getEventId()+"");
                        event_id_int = newEvent.getEventId();
                        ((NotificationManager) getSystemService(NOTIFICATION_SERVICE))
                                .notify(1, DoorbellNotification.createDoorbellNotification(getApplication()));
                    }

                    @Override
                    public void onFailure(Throwable t) {

                    }
                });
            }
        });

        Button busy = (Button) findViewById(R.id.button_busy);
        Button free = (Button) findViewById(R.id.button_free);
        Button unlocked = (Button) findViewById(R.id.button_unlocked);

        busy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                respond(Constants.STATUS_BUSY);
            }
        });
        free.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                respond(Constants.STATUS_FREE);
            }
        });
        unlocked.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                respond(Constants.STATUS_UNLOCKED);
            }
        });
    }

    public void respond(final int response_code) {
        server.respond(event_id_int, response_code).enqueue(new Callback<ResponseEvent>() {
            @Override
            public void onResponse(Response<ResponseEvent> response, Retrofit retrofit) {
                ResponseEvent responseEvent = response.body();
                if(responseEvent.getResppnse() == 200) {
                    status.setText(getString(R.string.status_is, response_code));
                }
            }

            @Override
            public void onFailure(Throwable t) {

            }
        });
    }

}
