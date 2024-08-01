import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tasks", function (table) {
    table.increments("id");
    table.string("title").notNullable();
    table.text("description").nullable();
    table.enu("priority", ["Low", "Medium", "High"]).nullable().defaultTo("Medium");
    table.integer("estimated_time").nullable();
    table.date("due_date").nullable();
    table.string("category").nullable();
    table.string("location").nullable();
    table.enu("energy_level", ["Low", "Medium", "High"]).nullable().defaultTo("Medium");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tasks");
}