var CronJob = require('cron').CronJob;
//var request = require('request');
//var mongo = require('./mongoUtils');
//var collectionName = 'suggestions';

console.log( "ah hoy" );

var job = new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
});

job.start();
