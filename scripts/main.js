var countdown = null; //start with a null coutdown (for use in modifyTimeLimit function)
var inSession = true; //start clock state with a session

//Start the countdown
function startCountdown() {
  countdown = setInterval(() => {//set coutdown to an interval of 1000ms
    var minutes = parseInt($('#countdown-minutes').html());//get minutes from the page
    var seconds = parseInt($('#countdown-seconds').html());//get seconds from the page
    var totalSeconds = minutes * 60 + seconds; //add up the total seconds to countdown

    --totalSeconds; //decrement the time by one second on each call
    $('#countdown-seconds').html(totalSeconds % 60 <= 9 ? '0' + totalSeconds % 60 : totalSeconds % 60); //update seconds, account for 1 digit values
    $('#countdown-minutes').html(Math.floor(totalSeconds / 60)); //update minutes

    //toggle between breaks and sessions
    if (inSession && totalSeconds === -1) {//if done with session start break
      inSession = false; //set the clock state
      $('#state').html('Break'); //set state to Break on page
      $('#countdown-minutes').html($('#break-time').html()); //set the minutes to user selected break time
      $('#countdown-seconds').html('00'); //reset the seconds
    } else if (!inSession && totalSeconds === -1) {//if done with break start session
      inSession = true; //set the clock state
      $('#state').html('Session'); //Set state to Session on page
      $('#countdown-minutes').html($('#session-time').html()); //set the minutes to user selected session time
      $('#countdown-seconds').html('00'); //reset the seconds
    }
  }, 1000);
}

//Stop the coutdown
function stopCountdown() {
  clearInterval(countdown); //stop the coutdown interval
  countdown = null;//clear the countdown (for use in modifyTimeLimit function)
}

//Reset the coutdown to a new session
function resetCountdown() {
  inSession = true; //set the clock state back to session
  $('#state').html('Session'); //set the state to Session on the page
  $('#countdown-minutes').html($('#session-time').html()); //set the minutes to user selected session time
  $('#countdown-seconds').html('00'); //reset the seconds
}

//function that takes time (session/break) and operation (add/subtract) and adjusts the time accordingly
function modifyTimeLimit(time, operation) {
  var timeTag = $('#' + time + '-time'); //select the appropriate time (session/break)
  var interval = operation === 'add' ? 1 : -1; //determine the direction to adjust the time (add/subtract)
  var currDuration = parseInt(timeTag.html()); //get the current user set duration
  var countdownMinutes = parseInt($('#countdown-minutes').html()); //get the current coundown minutes from page
  var currentState = $('#state').html().toLowerCase(); //Get the current clock state from page

  if ((currDuration > 0 && interval === -1) | (currDuration < 600 && interval === 1)) { //limit times to the range 0-600
    timeTag.html(currDuration + interval);//adjust the session/break time

    //Adjust timer if stopped and reset
    if (!countdown && currentState === time && countdownMinutes === currDuration) {
      $('#countdown-minutes').html(countdownMinutes + interval);//adjust coutdown minutes on page
    }
  }
}

$(document).ready(() => {

  //Handle the clicks to adjust time limits (pluses and minuses)
  $('i').click(function(e) {
    var time = $(this).attr('id').match(/^[a-z]*?(?=-)/)[0]; //grab the time from the ID
    var operation = $(this).attr('id').match(/[a-z]*?$/)[0]; //grab the direction from the ID
    modifyTimeLimit(time, operation); //pass time and operation to modifyTimeLimits
  });

  //Handle start-stop button clicks
  $('#start-stop').click(e => {
    var button = $('#start-stop'); //select button from page
    if (button.html() === 'Start') { //if currently start
      button.removeClass('start-btn');
      button.addClass('stop-btn'); //change to stop
      button.html('Stop'); //adjust button text
      startCountdown(); //start the coutdown
    } else { //if currently stop
      button.removeClass('stop-btn');
      button.addClass('start-btn'); //change to start
      button.html('Start'); //adjust button text
      stopCountdown(); //stop the coutdown
    }
  });

  //Handle reset button clicks
  $('#reset').click(e => {
    resetCountdown(); //reset the coutdown
  });
});
