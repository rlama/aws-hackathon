import { getCurrentPageUrl } from '@metro-prez/common-utils';
import getTwitterHandle from './getTwitterHandle';
import getCurrentPageDomain from './getCurrentPageDomain';

/*
  Sharing metadata - Set up those parts of the site's sharing metadata that aren't affected
  by the user's results.

  This function is a little shitty and is likely to be safely superceded by things like React/Svelte
  Helmet you'll find in libraries you're already using, but it's included for continuity's sake
  - and on the off-chance that you need it.
*/

/*
export type SharingMetadata = {
  title: string,
  description: string,
  url?: string,
  keyWords?: Array<string>,
  author?: Array<string>
};
*/

export default function setupSharingMetadata({ title, description, url, keyWords, author }) {
  if (!title || !description) {
    console.error(
      '[ERR] Setup sharing metadata: Required values missing. Sharing metadata ' +
        'requires title, description and url properties, at minimum.'
    );
  }

  const domain = getCurrentPageDomain();

  // *-> Facebook
  document.head.querySelector("[property='fb:app_id']").content = getFacebookAppId(domain);
  document.head.querySelector("[property='og:title']").content = title;
  document.head.querySelector("[property='og:url']").content = url || getCurrentPageUrl();
  document.head.querySelector("[property='og:description']").content = description;
  document.head.querySelector("[property='og:site_name']").content = u.getSiteName(domain);

  // *-> Twitter
  document.head.querySelector("[name='twitter:site']").content = getTwitterHandle(domain);
  document.head.querySelector("[name='twitter:title']").content = title;
  document.head.querySelector("[name='twitter:description']").content = description;
  document.head.querySelector("[name='twitter:creator']").content = getTwitterHandle(domain);
  document.head.querySelector("[name='twitter:url']").content = url || getCurrentPageUrl();

  // *-> Schema
  document.head.querySelector("[name='description']").content = description;
  document.head.querySelector("[name='news_keywords']").content = keyWords;
  document.head.querySelector("[itemprop='name']").content = description;
  document.head.querySelector("[itemprop='description']").content = description;
  document.head.querySelector("[itemprop='author']").content = author ? author.join(', ') : '';

  // *-> Other
  document.head.querySelector("[rel='canonical']").href = url || getCurrentPageUrl();
  document.head.querySelector("[rel='standout']").href = url || getCurrentPageUrl();
}
