'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var d3Format = require('d3-format');

const numberFormatter = d3Format.format(',.1f');

/*
  Format number

  Returns the number rendered as a string according to Fairfax style, or close to it.

  @param { Number } number - Number to be formatted
*/

function formatNumber(number) {
  if (+number >= 10000) {
    return numberFormatter(number).replace(/\..*0$/, '');
  } else {
    return number.toFixed(2).replace(/\..*0$/, '');
  }
}

/*
  Get current page URL

  Returns the URL of the page in which the interactive is embedded or, failing that, the URL for
  the interactive itself.
*/

function getCurrentPageUrl() {
  const isInIframe = window.location !== window.parent.location;
  if (isInIframe) {
    return document.referrer;
  } else {
    return document.location.href;
  }
}

/*
  Get current masthead abbrev

  Returns a string abbreviation indicating the current masthead.
*/

function getCurrentMastheadAbbrev() {
  const url = getCurrentPageUrl();
  const urlParts = url.split('.');

  switch (urlParts[1]) {
    case 'smh':
      return 'smh';
    case 'theage':
      return 'theage';
    case 'watoday':
      return 'watoday';
    case 'canberratimes':
      return 'canberratimes';
    case 'brisbanetimes':
      return 'brisbanetimes';
    default:
      return 'smh';
  }
}

/*
  Get parent's URL argument values

  Returns an object containing each of the provided URL parameters as keys and each of the 
  associated values as values.
*/

function getParentsUrlArgumentValues() {
  var splitUrl = getCurrentPageUrl().split('?');
  var argumentSet;
  var urlArgumentsAndValues = {};

  if (splitUrl.length > 1) {
    var urlArguments = splitUrl[1].split('&');

    if (urlArguments.length > 0) {
      for (var i = 0; i < urlArguments.length; i++) {
        argumentSet = urlArguments[i].split('=');

        if (argumentSet.length >= 2) {
          urlArgumentsAndValues[argumentSet[0]] = decodeURIComponent(argumentSet[1]);
        }
      }
    }
  }

  return urlArgumentsAndValues;
}

/*
  Get screen size

  Returns the current screen size, according to standard Fairfax Blue/Nine Publishing breakpoints.
*/

function getScreenSize() {
  const medium = 768;
  const large = 1024;
  const extraLarge = 1440;
  const w = document.body.clientWidth;
  return w < medium ? 'small' : w < large ? 'medium' : w < extraLarge ? 'large' : 'extra-large';
}

/*
  Get screen size comparison value

  Returns an integer indicating the comparison value of a screen size - i.e. one that can be used
  to compare it with another screen size string's comparison value, indicating which is larger.
*/

function getScreenSizeComparisonValue(screenSize) {
  return ['small', 'medium', 'large', 'extra-large'].indexOf(screenSize);
}

/*
  Get URL argument values

  Returns an object containing each of the provided URL parameters as keys and each of the 
  associated values as values.
*/

function getUrlArgumentValues() {
  var urlArguments = window.location.search.substring(1).split('&');
  var argumentSet;
  var urlArgumentsAndValues = {};

  if (urlArguments.length > 0) {
    for (var i = 0; i < urlArguments.length; i++) {
      argumentSet = urlArguments[i].split('=');

      if (argumentSet.length >= 2) {
        urlArgumentsAndValues[argumentSet[0]] = decodeURIComponent(argumentSet[1]);
      }
    }
  }

  return urlArgumentsAndValues;
}

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

function makeReadableEventTime(utcTimestamp) {
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

/*
  Make short name

  Returns shortened version of a given name, with all but the person's last name initialised.

  @param { String } name - Name of a person to be shortened
*/

function makeShortName(name) {
  var shortName = '';
  var names = name.split(' ');

  // Make this transformation:
  //  Jason Akermanis  -> J. Akermanis
  //  Chris L. Johnson -> C. L. Johnson
  for (var i = 0; i < names.length; i++) {
    if (i === names.length - 1) {
      shortName += ' ' + names[i];
    } else {
      shortName += names[i][0] + '.';
    }
  }

  return shortName;
}

/*
  Screen size is larger than

  Returns a boolean indicating whether the current screen size is larger than that given.
*/

function screenSizeIsLargerThan(thisScreenSize, currentScreenSize) {
  if (!currentScreenSize) {
    currentScreenSize = getScreenSize();
  }

  return (
    getScreenSizeComparisonValue(thisScreenSize) < getScreenSizeComparisonValue(currentScreenSize)
  );
}

/*
  Screen size is smaller than

  Returns a boolean indicating whether the current screen size is larger than that given.
*/

function screenSizeIsSmallerThan(thisScreenSize, currentScreenSize) {
  if (!currentScreenSize) {
    currentScreenSize = getScreenSize();
  }

  return (
    getScreenSizeComparisonValue(thisScreenSize) > getScreenSizeComparisonValue(currentScreenSize)
  );
}

var commonUtils = {
  formatNumber,
  getCurrentMastheadAbbrev,
  getCurrentPageUrl,
  getParentsUrlArgumentValues,
  getScreenSize,
  getScreenSizeComparisonValue,
  getUrlArgumentValues,
  makeReadableEventTime,
  makeShortName,
  screenSizeIsLargerThan,
  screenSizeIsSmallerThan
};

exports.default = commonUtils;
exports.formatNumber = formatNumber;
exports.getCurrentMastheadAbbrev = getCurrentMastheadAbbrev;
exports.getCurrentPageUrl = getCurrentPageUrl;
exports.getParentsUrlArgumentValues = getParentsUrlArgumentValues;
exports.getScreenSize = getScreenSize;
exports.getScreenSizeComparisonValue = getScreenSizeComparisonValue;
exports.getUrlArgumentValues = getUrlArgumentValues;
exports.makeReadableEventTime = makeReadableEventTime;
exports.makeShortName = makeShortName;
exports.screenSizeIsLargerThan = screenSizeIsLargerThan;
exports.screenSizeIsSmallerThan = screenSizeIsSmallerThan;
