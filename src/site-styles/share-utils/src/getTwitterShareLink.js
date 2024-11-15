export default function getTwitterShareLink(link, description, twitterHandle) {
  return `https://twitter.com/share?url=${encodeURIComponent(link)}${
    description ? `&text=${description}` : ''
  }&via=${twitterHandle}`;
}
