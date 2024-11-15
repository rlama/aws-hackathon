import { getCurrentPageUrl } from '@metro-prez/common-utils';

export default function getCurrentPageDomain() {
  const url = getCurrentPageUrl();
  console.log(url)
  console.log(url.includes('https://www.smh.com.au'))
  const testingDefault = 'smh.com.au';
  if (url.includes('https://www.smh.com.au')) return 'smh.com.au';
  if (url.includes('https://www.theage.com.au')) return 'theage.com.au';
  if (url.includes('https://www.watoday.com.au')) return 'watoday.com.au';
  if (url.includes('https://www.brisbanetimes.com.au')) return testingDefault;

  return testingDefault;
}
