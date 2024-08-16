import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("tasks", function (table) {
    table.boolean("completed").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("tasks", function (table) {
    table.dropColumn("completed");
  });
}
