export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 1,
      username: 'example',
      email: 'example@example.com',
      password: 'example',
    },
    {
      id: 2,
      username: 'username',
      email: 'username@example.com',
      password: 'username',
    },
    {
      id: 3,
      username: 'test',
      email: 'test@test.com',
      password: 'test',
    },
  ]);
};
