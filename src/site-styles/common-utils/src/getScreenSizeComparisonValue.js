/*
  Get screen size comparison value

  Returns an integer indicating the comparison value of a screen size - i.e. one that can be used
  to compare it with another screen size string's comparison value, indicating which is larger.
*/

export default function getScreenSizeComparisonValue(screenSize) {
  return ['small', 'medium', 'large', 'extra-large'].indexOf(screenSize);
}
