import getWhatsAppShareLink from './getWhatsAppShareLink';

export default function handleWhatsAppShare(event) {
  const closestWhatsAppShare = event.target.closest('.whatsapp-share-button');
  const el = closestWhatsAppShare ? closestWhatsAppShare : event.target;

  const link = el.getAttribute('data-share-link');
  const title = el.getAttribute('data-share-title');
  const description = el.getAttribute('data-share-description');

  if (!link || !title || !description) {
    console.error(
      'WhatsApp share buttons require link, title and description data-* attributes. One of these is missing on the event target:',
      el,
      'As such, no share attempt was made.'
    );
    return;
  }

  const shareLink = getWhatsAppShareLink(link, title, description);
  window.open(shareLink, 'whatsAppShareDialog', 'width=626,height=436,scrollbars=1');
}
