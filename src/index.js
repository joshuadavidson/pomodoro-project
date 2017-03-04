/* establish global variables for ESLint */
/* global document */

// import dependencies
import $ from 'jquery';
import { Howl } from 'howler';

// import custom styles for project
import './index.scss';

// import audio files
import './audio/beep.mp3';

// start with a null intervalID for timer
let countdown = null;

// start clock state with a session
let inSession = true;

// setup beep Sound using Howlwer.js
const beep = new Howl({
  src: ['./audio/beep.mp3'],
});

// Start the countdown
function startCountdown() {
  // function that executes every cycle of clock
  function oneCycle() {
    // get minutes from the page
    const minutes = parseInt($('#countdown-minutes').html(), 10);

    // get seconds from the page
    const seconds = parseInt($('#countdown-seconds').html(), 10);

    // add up the total seconds to countdown
    let totalSeconds = (minutes * 60) + seconds;

    // decrement the time by one second on each call
    totalSeconds -= 1;

    // update seconds, account for 1 digit values
    $('#countdown-seconds').html(totalSeconds % 60 <= 9 ? `0${totalSeconds % 60}` : totalSeconds % 60);

    // update minutes
    $('#countdown-minutes').html(Math.floor(totalSeconds / 60));

    // toggle between breaks and sessions
    // if done with session start break
    if (inSession && totalSeconds === -1) {
      // play sound signifying end of session
      beep.play();

      // set the clock state
      inSession = false;

      // set state to Break on page
      $('#state').html('Break');

      // set the minutes to user selected break time
      $('#countdown-minutes').html($('#break-time').html());

      $('#countdown-seconds').html('00'); // reset the seconds
    }

    // if done with break start session
    else if (!inSession && totalSeconds === -1) {
      // play sound signifying end of session
      beep.play();

      // set the clock state
      inSession = true;

      // Set state to Session on page
      $('#state').html('Session');

      // set the minutes to user selected session time
      $('#countdown-minutes').html($('#session-time').html());

      // reset the seconds
      $('#countdown-seconds').html('00');
    }
  }

  // start timer by setting coutdown to run oneCycle every 1000ms
  countdown = setInterval(oneCycle, 1000);
}

// Stop the coutdown
function stopCountdown() {
  // stop the coutdown interval
  clearInterval(countdown);

  // clear the countdown (for use in modifyTimeLimit function)
  countdown = null;
}

// Reset the coutdown timer to a new session
function resetCountdown() {
  // set the clock state back to session
  inSession = true;

  // set the state to Session on the page
  $('#state').html('Session');

  // set the minutes to user selected session time
  $('#countdown-minutes').html($('#session-time').html());

  // reset the seconds
  $('#countdown-seconds').html('00');
}

// function that takes time (session/break) and operation (add/subtract)
// adjusts the time in the DOM accordingly
function modifyTimeLimit(time, operation) {
  // select the appropriate time (session/break)
  const timeTag = $(`#${time}-time`);

  // determine the direction to adjust the time (add/subtract)
  const interval = operation === 'add' ? 1 : -1;

  // get the current user set duration
  const currDuration = parseInt(timeTag.html(), 10);

  // get the current coundown minutes from page
  const countdownMinutes = parseInt($('#countdown-minutes').html(), 10);

  // Get the current clock state from page
  const currentState = $('#state').html().toLowerCase();

  // limit times to the range 0-600
  if ((currDuration > 0 && interval === -1) || (currDuration < 600 && interval === 1)) {
    // adjust the session/break time
    timeTag.html(currDuration + interval);

    // Adjust timer if stopped and reset
    if (!countdown && currentState === time && countdownMinutes === currDuration) {
      // adjust coutdown minutes on page
      $('#countdown-minutes').html(countdownMinutes + interval);
    }
  }
}

$(document).ready(() => {
  // Handle the clicks to adjust time limits (pluses and minuses)
  $('i.adjust-button').click(function onClickAdjust() {
    // grab the time from the ID
    const time = $(this).attr('id').match(/^[a-z]*?(?=-)/)[0];

    // grab the direction from the ID
    const operation = $(this).attr('id').match(/[a-z]*?$/)[0];

    // pass time and operation to modifyTimeLimits
    modifyTimeLimit(time, operation);
  });

  // Handle the clicks to mute and unmute
  $('i.mute-button').click(() => {
    // select the mute button from page
    const button = $('i.mute-button');

    // if currently unmuted, mute
    if (button.hasClass('fa-bell-o')) {
      button.removeClass('fa-bell-o');
      button.addClass('fa-bell-slash-o');
      beep.mute(true);
    }

    // if currently muted, unmute
    else {
      button.removeClass('fa-bell-slash-o');
      button.addClass('fa-bell-o');
      beep.mute(false);
    }
  });

  // Handle start-stop button clicks
  $('#start-stop').click(() => {
    // select button from page
    const button = $('#start-stop');

    // Start
    if (button.html() === 'Start') {
      // change to stop
      button.removeClass('start-btn');
      button.addClass('stop-btn');

      // adjust button text
      button.html('Stop');

      // start the coutdown
      startCountdown();
    }

    // Stop
    else {
      // change to start
      button.removeClass('stop-btn');
      button.addClass('start-btn');

      // adjust button text
      button.html('Start');

      // stop the coutdown
      stopCountdown();
    }
  });

  // Handle reset button clicks
  $('#reset').click(() => {
    // reset the coutdown
    resetCountdown();
  });
});
