const fetchUser = require('../tools/fetchUser');

(async () => {
  const res = await fetchUser({ id: 'test-user-1' });
  console.log('fetchUser result:', res);
})();
