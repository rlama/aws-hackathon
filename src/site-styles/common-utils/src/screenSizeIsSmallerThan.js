import getScreenSize from './getScreenSize';
import getScreenSizeComparisonValue from './getScreenSizeComparisonValue';

/*
  Screen size is smaller than

  Returns a boolean indicating whether the current screen size is larger than that given.
*/

export default function screenSizeIsSmallerThan(thisScreenSize, currentScreenSize) {
  if (!currentScreenSize) {
    currentScreenSize = getScreenSize();
  }

  return (
    getScreenSizeComparisonValue(thisScreenSize) > getScreenSizeComparisonValue(currentScreenSize)
  );
}
