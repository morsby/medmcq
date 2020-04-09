exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user_role')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('user_role').insert([
        { id: 1, name: 'creator' },
        { id: 2, name: 'admin' },
        { id: 3, name: 'editor' },
        { id: 4, name: 'user' }
      ]);
    });
};
