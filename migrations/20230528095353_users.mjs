/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.createTable('users', function (table) {
    table.increments('id');
    table.string('username', 32).notNullable().unique();
    table.string('email', 32).notNullable();
    table.string('password', 32).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.dropTable('users');
};
