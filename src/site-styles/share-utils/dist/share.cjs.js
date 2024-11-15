'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commonUtils = require('@metro-prez/common-utils');

function getCurrentPageDomain() {
  const url = commonUtils.getCurrentPageUrl();
  console.log(url);
  console.log(url.includes('https://www.smh.com.au'));
  const testingDefault = 'smh.com.au';
  if (url.includes('https://www.smh.com.au')) return 'smh.com.au';
  if (url.includes('https://www.theage.com.au')) return 'theage.com.au';
  if (url.includes('https://www.watoday.com.au')) return 'watoday.com.au';
  if (url.includes('https://www.brisbanetimes.com.au')) return testingDefault;

  return testingDefault;
}

function getEmailShareLink(link, title, description) {
  const body = encodeURIComponent(description) + '%20' + encodeURIComponent(link);
  return 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + body;
}

function getFacebookAppId$1(domain) {
  const testingDefault = '107082829404370';
  const facebookAppId = {
    'smh.com.au': '193677504039845',
    'canberratimes.com.au': '106020559517129',
    'brisbanetimes.com.au': testingDefault,
    'theage.com.au': '230318243699378',
    'watoday.com.au': '254346064617808'
  };

  for (let d in facebookAppId) {
    if (domain && domain.indexOf(d) >= 0) {
      return facebookAppId[d];
    }
  }

  return testingDefault;
}

function getRedditShareLink(link) {
  return 'https://www.reddit.com/submit?url=' + encodeURIComponent(link);
}

function getSiteName(domain) {
  const testingDefault = 'The Brisbane Times';
  const siteNames = {
    theage: 'The Age',
    smh: 'The Sydney Morning Herald',
    brisbanetimes: testingDefault,
    watoday: 'WA Today',
    canberratimes: 'The Canberra Times'
  };

  for (let name in siteNames) {
    if (domain && domain.indexOf(name) >= 0) {
      return siteNames[name];
    }
  }

  return testingDefault;
}

function getTwitterHandle(domain) {
  const testingDefault = 'smh';
  const twitterHandles = {
    'smh.com.au': 'smh',
    'theage.com.au': 'theage',
    'watoday.com.au': 'watoday',
    'brisbanetimes.com.au': testingDefault,
    'canberratimes.com.au': 'canberratimes',
    'goodfood.com.au': 'goodfood',
    'dailylife.com.au': 'dailylife',
    'domain.com.au': 'domain'
  };

  for (let d in twitterHandles) {
    if (domain && domain.indexOf(d) >= 0) {
      return twitterHandles[d];
    }
  }

  return testingDefault;
}

function getTwitterShareLink(link, description, twitterHandle) {
  return `https://twitter.com/share?url=${encodeURIComponent(link)}${
    description ? `&text=${description}` : ''
  }&via=${twitterHandle}`;
}

function getWhatsAppShareLink(link, title, description) {
  const shareMessage = encodeURIComponent(title + ' | ' + description + ' - ' + link);
  const shareMessageHref = 'https://wa.me/?text=' + shareMessage;
  return shareMessageHref;
}

function handleEmailShare(event) {
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

function handleFacebookShare(event) {
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

function handleClickRedditShareButton(event) {
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

/**
 * This is the temporary code to handle twitter which needs to be implement in prez utils library
 *
 * @param {button click event} event
 * @opens twitter popup
 */

 function handleTwitterShare(event) {
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

function handleWhatsAppShare(event) {
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

function setupFacebookSharingLibrary() {
  window.fbAsyncInit = function() {
    const domain = getCurrentPageDomain();

    FB.init({
      appId: getFacebookAppId$1(domain),
      xfbml: true,
      version: 'v2.3'
    });
  };

  (function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
}

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

function setupSharingMetadata({ title, description, url, keyWords, author }) {
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
  document.head.querySelector("[property='og:url']").content = url || commonUtils.getCurrentPageUrl();
  document.head.querySelector("[property='og:description']").content = description;
  document.head.querySelector("[property='og:site_name']").content = u.getSiteName(domain);

  // *-> Twitter
  document.head.querySelector("[name='twitter:site']").content = getTwitterHandle(domain);
  document.head.querySelector("[name='twitter:title']").content = title;
  document.head.querySelector("[name='twitter:description']").content = description;
  document.head.querySelector("[name='twitter:creator']").content = getTwitterHandle(domain);
  document.head.querySelector("[name='twitter:url']").content = url || commonUtils.getCurrentPageUrl();

  // *-> Schema
  document.head.querySelector("[name='description']").content = description;
  document.head.querySelector("[name='news_keywords']").content = keyWords;
  document.head.querySelector("[itemprop='name']").content = description;
  document.head.querySelector("[itemprop='description']").content = description;
  document.head.querySelector("[itemprop='author']").content = author ? author.join(', ') : '';

  // *-> Other
  document.head.querySelector("[rel='canonical']").href = url || commonUtils.getCurrentPageUrl();
  document.head.querySelector("[rel='standout']").href = url || commonUtils.getCurrentPageUrl();
}

//      

var share = {
  getCurrentPageDomain,
  getEmailShareLink,
  getFacebookAppId: getFacebookAppId$1,
  getRedditShareLink,
  getSiteName,
  getTwitterHandle,
  getTwitterShareLink,
  getWhatsAppShareLink,
  handleEmailShare,
  handleFacebookShare,
  handleRedditShare: handleClickRedditShareButton,
  handleTwitterShare,
  handleWhatsAppShare,
  setupFacebookSharingLibrary,
  setupSharingMetadata
};

exports.default = share;
exports.getCurrentPageDomain = getCurrentPageDomain;
exports.getEmailShareLink = getEmailShareLink;
exports.getFacebookAppId = getFacebookAppId$1;
exports.getRedditShareLink = getRedditShareLink;
exports.getSiteName = getSiteName;
exports.getTwitterHandle = getTwitterHandle;
exports.getTwitterShareLink = getTwitterShareLink;
exports.getWhatsAppShareLink = getWhatsAppShareLink;
exports.handleEmailShare = handleEmailShare;
exports.handleFacebookShare = handleFacebookShare;
exports.handleRedditShare = handleClickRedditShareButton;
exports.handleTwitterShare = handleTwitterShare;
exports.handleWhatsAppShare = handleWhatsAppShare;
exports.setupFacebookSharingLibrary = setupFacebookSharingLibrary;
exports.setupSharingMetadata = setupSharingMetadata;
