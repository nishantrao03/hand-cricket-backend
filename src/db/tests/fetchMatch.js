const fetchMatch = require('../tools/fetchMatch');

(async () => {
  const res = await fetchMatch({ id: 'match1' });
  console.log('fetchMatch result:', res);
})();
