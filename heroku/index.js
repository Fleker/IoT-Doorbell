var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var pg = require('pg');
//79241106-13c5-4b2d-b23d-1cfa6bfb94fd

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
    var result = '';
    console.log(process, process.env, process.env.TIMES);
    var times = process.env.TIMES || 5;
    for(i=0;i<times;i++) {
        result += cool();   
    }
  response.send(result);
});

app.get('/db', function(request, response) {
   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM events', function(err, result) {
          done();
          if (err)
           { console.error(err); response.send("Error " + err); }
          else
           { response.render('pages/db', {results: result.rows} ); }
        });
  });
});
/**
 function(err, result) {  
          done();
          if(err) {
              console.error(err);
              response.send('Error '+err);
          } else {
              response.render('pages/db', {results:result.rows});   
          }
      } **/

/**
    DATABASE `events`
    
    --------------------------------------------------------
    |  EVENT_ID integer |  TIME bigint  | RESPONSE integer |
    |                                                      |
    |                                                      |
    --------------------------------------------------------
**/
app.get('/api/v1/new', function(request, response) {
    //Add item to db
    //Get that id
    console.log('1');
    var res = {event_id: 1};
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('INSERT INTO events (time, response) VALUES($1, $2) RETURNING event_id', [new Date().getTime(), '-1'], function(err, result) {
          done();
          if (err)
           { console.error(err); response.send("Error " + err); }
          else { 
              console.log(result);
              console.log("Yo ",result.rows[0].event_id);
              res['event_id'] = result.rows[0].event_id;
              response.send(JSON.stringify(res));
           }
        });
    });
});
//Provide a parameter that is the event id
app.get('/api/v1/event', function(request, response) {
    var event_id = request.query.event;
    console.log("Looking for events of id "+event_id);
    console.log('SELECT * FROM events WHERE event_id="'+event_id+'"');
    //Respond if possible, otherwise return -1
    var res = {result: -1, time: 1 };
    //Query database for result and request time
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT * FROM events WHERE event_id='"+event_id+"'", function(err, result) {
          done();
          if (err) {
              console.error(err); 
              res['result'] = -1;
              res['time'] = -1;
              res['event_id'] = -1;
              response.send(JSON.stringify(res)); 
           }
          else { 
              console.log("Found "+result.rows.length);
              var row = result.rows[0];
              if(row !== undefined) {
                  console.log(row);
                  res['result'] = row.response;
                  res['time'] = row.time;
                  if(new Date().getTime() - row.time > 1000*60*2) {
                      //If >2 min you time out
                      res['result'] = 2;
                      client.query("UPDATE events set response = '"+2+"' WHERE event_id=$1", [event_id], function(err, result) {
                          done();
                        });
                  }

                  res['event_id'] = result.rows[0].event_id;
                  response.send(JSON.stringify(res));
              } else {
                  console.log(row);
                  res['result'] = -1;
                  res['time'] = -1;
                  res['event_id'] = -1;
                  response.send(JSON.stringify(res));
              }              
           }
        });
    });
});
//Provide the event id, provide the result
app.get('/api/v1/respond', function(request, response) {
    var event_id = request.query.event;
    var result = request.query.result;
    //Update database
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("UPDATE events set response = '"+result+"' WHERE event_id=$1", [event_id], function(err, result) {
        done();
        var res = {response: 200};
        response.send(JSON.stringify(res)); //OK
    });
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});