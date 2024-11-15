export default function handleFacebookShare(event) {
  const options = 'toolbar=0,status=0,resizable=1,width=626,height=436';
  const closestFacebookShare = event.target.closest('.facebook-share-button');
  const el = closestFacebookShare ? closestFacebookShare : event.target;

  const link = el.getAttribute('data-share-link');
  const description = el.getAttribute('data-share-description');
  const hashtag = el.getAttribute('data-share-hashtag');

  if (!link) {
    console.error(
      'Facebook share buttons require a `data-share-link` attribute. None was found on the event target:',
      el,
      'As such, no share attempt was made.'
    );
    return;
  }

  const encodedLink = encodeURIComponent(link);
  let shareable = `https://www.facebook.com/sharer/sharer.php?display=popup&u=${encodedLink}`;

  if (description) {
    shareable += `&quote=${encodeURIComponent(description)}`;
  }
  if (hashtag) {
    shareable += `&hashtag=${encodeURIComponent(`#${hashtag}`)}`;
  }

  window.open(shareable, 'sharer', options);
}