import getScreenSize from './getScreenSize';
import getScreenSizeComparisonValue from './getScreenSizeComparisonValue';

/*
  Screen size is larger than

  Returns a boolean indicating whether the current screen size is larger than that given.
*/

export default function screenSizeIsLargerThan(thisScreenSize, currentScreenSize) {
  if (!currentScreenSize) {
    currentScreenSize = getScreenSize();
  }

  return (
    getScreenSizeComparisonValue(thisScreenSize) < getScreenSizeComparisonValue(currentScreenSize)
  );
}
