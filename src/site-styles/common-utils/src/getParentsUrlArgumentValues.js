import getCurrentPageUrl from './getCurrentPageUrl';

/*
  Get parent's URL argument values

  Returns an object containing each of the provided URL parameters as keys and each of the 
  associated values as values.
*/

export default function getParentsUrlArgumentValues() {
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
