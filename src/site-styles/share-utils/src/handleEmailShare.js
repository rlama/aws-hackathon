import getEmailShareLink from './getEmailShareLink';

export default function handleEmailShare(event) {
  const closestEmailShare = event.target.closest('.email-share-button');
  const el = closestEmailShare ? closestEmailShare : event.target;

  const link = el.getAttribute('data-share-link');
  const title = el.getAttribute('data-share-title');
  const description = el.getAttribute('data-share-description');

  if (!link || !title || !description) {
    console.error(
      'Email share buttons require link, title and description data-* attributes. One of these is missing on the event target:',
      el,
      'As such, no share attempt was made.'
    );
  }

  const shareLink = getEmailShareLink(link, title, description);
  window.open(shareLink, '_top');
}
