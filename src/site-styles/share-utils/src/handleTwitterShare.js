import getCurrentPageDomain from './getCurrentPageDomain';
import getTwitterHandle from './getTwitterHandle';
import getTwitterShareLink from './getTwitterShareLink';

/**
 * This is the temporary code to handle twitter which needs to be implement in prez utils library
 *
 * @param {button click event} event
 * @opens twitter popup
 */

 export default function handleTwitterShare(event) {
  const domain = getCurrentPageDomain();
  const twitterHandle = getTwitterHandle(domain);

  const closestTwitterShare = event.target.closest('.twitter-share-button');
  const el = closestTwitterShare ? closestTwitterShare : event.target;

  const link = el.getAttribute('data-share-link');
  const description = el.getAttribute('data-share-description');

  if (!link) {
    console.error(
      'Twitter share buttons require a `data-share-link` attribute. None was found on the event target:',
      el,
      'As such, no share attempt was made.'
    );
    return;
  }

  const shareLink = getTwitterShareLink(link, description, twitterHandle);
  window.open(shareLink, 'twitterShareDialog', 'width=626,height=436,scrollbars=1');
}
