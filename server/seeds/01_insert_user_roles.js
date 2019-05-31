exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user_role')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('user_role').insert([
        { name: 'creator', level: 999 },
        { name: 'admin', level: 100 },
        { name: 'editor', level: 10 },
        { name: 'user', level: 1 }
      ]);
    });
};
