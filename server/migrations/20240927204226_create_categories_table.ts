import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create categories table
  await knex.schema.createTable("categories", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id").onDelete("CASCADE");
    table.string("name").notNullable();
    table.string("color").nullable();
    table.timestamps(true, true);
  });

  // Remove category column and add category_id to tasks table
  await knex.schema.alterTable("tasks", (table) => {
    table.dropColumn("category");
    table.integer("category_id").unsigned().nullable();
    table.foreign("category_id").references("categories.id").onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  // Add category and remove category_id from tasks table
  await knex.schema.alterTable("tasks", (table) => {
    table.string("category").nullable();
    table.dropForeign(["category_id"]);
    table.dropColumn("category_id");
  });

  // Drop categories table
  await knex.schema.dropTable("categories");
}