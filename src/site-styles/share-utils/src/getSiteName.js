export default function getSiteName(domain) {
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
