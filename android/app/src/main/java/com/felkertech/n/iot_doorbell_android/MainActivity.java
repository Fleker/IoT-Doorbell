package com.felkertech.n.iot_doorbell_android;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    @Override
    protected void onResume() {
        super.onResume();
        Button doorbell = (Button) findViewById(R.id.doorbell);
        final TextView event_id = (TextView) findViewById(R.id.event_id);
        final TextView status = (TextView) findViewById(R.id.status);

        doorbell.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                event_id.setText(R.string.searching);
                status.setText(getString(R.string.status_is, Constants.STATUS_UNKNOWN));
            }
        });

        Button busy = (Button) findViewById(R.id.button_busy);
        Button free = (Button) findViewById(R.id.button_free);
        Button unlocked = (Button) findViewById(R.id.button_unlocked);

        busy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                status.setText(getString(R.string.status_is, Constants.STATUS_BUSY));
            }
        });
        free.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                status.setText(getString(R.string.status_is, Constants.STATUS_FREE));
            }
        });
        unlocked.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                status.setText(getString(R.string.status_is, Constants.STATUS_UNLOCKED));
            }
        });
    }

}
