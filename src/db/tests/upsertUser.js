const upsertUser = require('../tools/upsertUser');

(async () => {
  const res = await upsertUser({ id: 'test-user-4' });
  console.log('upsertUser result:', res);
})();