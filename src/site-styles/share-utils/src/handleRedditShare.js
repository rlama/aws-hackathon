import getRedditShareLink from './getRedditShareLink';

export default function handleClickRedditShareButton(event) {
  const closestRedditShare = event.target.closest('.reddit-share-button');
  const el = closestRedditShare ? closestRedditShare : event.target;

  const link = el.getAttribute('data-share-link');

  if (!link) {
    console.error(
      'Reddit share buttons require a `data-share-link` attribute. None was found on the event target:',
      el,
      'As such, no share attempt was made.'
    );
    return;
  }

  const shareLink = getRedditShareLink(link);
  window.open(shareLink, 'redditShareDialog', 'width=626,height=436,scrollbars=1');
}
