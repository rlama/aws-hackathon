export default function getFacebookAppId(domain) {
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
