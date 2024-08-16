import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("tasks", function (table) {
      table.integer("user_id").unsigned().nullable();
      table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    })
    .then(async () => {
      await knex("tasks").update({ user_id: 1 });
    })
    .then(async () => {
      await knex.schema.alterTable("tasks", function (table) {
        table.integer("user_id").unsigned().notNullable().alter();
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("tasks", function (table) {
    table.dropForeign("user_id");
    table.dropColumn("user_id");
  });
}