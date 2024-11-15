/*
  Make readable event time

  Returns a rendering of the input timestamp that 'makes sense', given the current time. (For 
  example, if the timestamp denotes some time earlier in the same day, the timestamp might be
  rendered as just '6pm'; a timestamp denoting the same time a few days before might just read
  'November 6'.)

  @param { String } utcTimestamp - A timestamp denoting the time to be made readable
*/

function getMonthName(monthNumber) {
  var monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  return monthNames[monthNumber];
}

function getTime(hour, minutes) {
  if (hour < 13) {
    return hour + ':' + (minutes > 9 ? minutes : '0' + minutes) + (hour === 12 ? 'pm' : 'am');
  } else {
    return (hour % 12) + ':' + (minutes > 9 ? minutes : '0' + minutes) + 'pm';
  }
}

export default function makeReadableEventTime(utcTimestamp) {
  var date = new Date(utcTimestamp);
  var now = new Date();

  // If same year
  if (now.getFullYear() === date.getFullYear()) {
    // ... and month ...
    if (now.getMonth() === date.getMonth()) {
      // ... and same date, do time(e.g. '6pm')
      if (now.getDate() === date.getDate()) {
        return getTime(date.getHours(), date.getMinutes());
      }
      // ... and yesterday, do time and note (e.g. '6pm yesterday')
      else if (now.getDate() - 1 === date.getDate()) {
        return getTime(date.getHours(), date.getMinutes()) + ' yesterday';
      }
      // Otherwise, do date (e.g. 'November 4')
      else {
        return getMonthName(date.getMonth()) + ' ' + date.getDate();
      }
    }
    // Otherwise, do date (e.g. 'November 6')
    else {
      return getMonthName(date.getMonth()) + ' ' + date.getDate();
    }
  }
  // Otherwise, do date and year (e.g. 'November 6, 2017')
  else {
    return getMonthName(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear();
  }
}
