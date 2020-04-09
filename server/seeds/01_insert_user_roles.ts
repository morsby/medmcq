exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user_role')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('user_role').insert([
        { name: 'creator' },
        { name: 'admin' },
        { name: 'editor' },
        { name: 'user' }
      ]);
    });
};
