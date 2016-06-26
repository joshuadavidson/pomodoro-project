function startTimer() {

}

function stopTimer() {

}

function resetTimer() {

}

//function that takes time (session/break) and operation (add/subtract) and adjusts the time accordingly
function modifyTimeLimit(time, operation) {
  var timeTag = $('#' + time + '-time'); //select the appropriate time
  var interval = operation === 'add' ? 1 : -1; //determine the direction to adjust the time
  var currTime = parseInt(timeTag.html()); //get the current time

  if ((currTime > 0 && interval === -1) | (currTime < 600 && interval === 1) ) { //limit times to the range 0-600
    timeTag.html(currTime + interval);
  }
}

$(document).ready(() => {

  //handle the clicks to adjust time limits (pluses and minuses)
  $('i').click(function(e) {
    var time = $(this).attr('id').match(/^[a-z]*?(?=-)/)[0]; //grab the time from the ID
    var operation = $(this).attr('id').match(/[a-z]*?$/)[0]; //grab the direction from the ID
    console.log(time, operation);
    modifyTimeLimit(time, operation);
  });

  $('#start-stop').click(e => {
    var button = $('#start-stop');
    if (button.html() === 'Start') {
      button.removeClass('start-btn');
      button.addClass('stop-btn');
      button.html('Stop');
      startTimer();
    } else {
      button.removeClass('stop-btn');
      button.addClass('start-btn');
      button.html('Start');
      stopTimer();
    }
  });

  $('#reset').click(e => {
    resetTimer();
  });
});
