export default function getWhatsAppShareLink(link, title, description) {
  const shareMessage = encodeURIComponent(title + ' | ' + description + ' - ' + link);
  const shareMessageHref = 'https://wa.me/?text=' + shareMessage;
  return shareMessageHref;
}
