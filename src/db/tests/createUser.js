const createUser = require('../tools/createUser');

(async () => {
  const res = await createUser({ id: 'test-user-3' });
  console.log('createUser result:', res);
})();
