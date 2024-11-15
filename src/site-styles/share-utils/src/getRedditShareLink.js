export default function getRedditShareLink(link) {
  return 'https://www.reddit.com/submit?url=' + encodeURIComponent(link);
}
