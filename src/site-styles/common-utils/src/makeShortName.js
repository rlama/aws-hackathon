/*
  Make short name

  Returns shortened version of a given name, with all but the person's last name initialised.

  @param { String } name - Name of a person to be shortened
*/

export default function makeShortName(name) {
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
