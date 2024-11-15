export default function getTwitterHandle(domain) {
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
