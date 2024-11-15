/*
  Get URL argument values

  Returns an object containing each of the provided URL parameters as keys and each of the 
  associated values as values.
*/

export default function getUrlArgumentValues() {
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
