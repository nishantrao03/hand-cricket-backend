const updateUser = require('../tools/updateUser');

(async () => {
  const res = await updateUser({ id: 'test-user-1', username: 'updatedName', bio: 'hello' });
  console.log('updateUser result:', res);
})();
