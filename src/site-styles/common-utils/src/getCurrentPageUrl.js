/*
  Get current page URL

  Returns the URL of the page in which the interactive is embedded or, failing that, the URL for
  the interactive itself.
*/

export default function getCurrentPageUrl() {
  const isInIframe = window.location !== window.parent.location;
  if (isInIframe) {
    return document.referrer;
  } else {
    return document.location.href;
  }
}
