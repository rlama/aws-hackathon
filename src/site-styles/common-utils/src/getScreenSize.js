/*
  Get screen size

  Returns the current screen size, according to standard Fairfax Blue/Nine Publishing breakpoints.
*/

export default function getScreenSize() {
  const medium = 768;
  const large = 1024;
  const extraLarge = 1440;
  const w = document.body.clientWidth;
  return w < medium ? 'small' : w < large ? 'medium' : w < extraLarge ? 'large' : 'extra-large';
}
