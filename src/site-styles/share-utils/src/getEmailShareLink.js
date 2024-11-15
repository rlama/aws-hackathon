export default function getEmailShareLink(link, title, description) {
  const body = encodeURIComponent(description) + '%20' + encodeURIComponent(link);
  return 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + body;
}
