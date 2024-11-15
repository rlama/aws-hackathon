import getCurrentPageUrl from './getCurrentPageUrl';

/*
  Get current masthead abbrev

  Returns a string abbreviation indicating the current masthead.
*/

export default function getCurrentMastheadAbbrev() {
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
