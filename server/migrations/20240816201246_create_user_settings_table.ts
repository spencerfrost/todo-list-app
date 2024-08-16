import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_settings", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("primary_color").notNullable().defaultTo("#3b82f6");
    table.string("secondary_color").notNullable().defaultTo("#10b981");
    table.boolean("dark_mode").notNullable().defaultTo(false);
    table.string("default_sorting").notNullable().defaultTo("dueDate");
    table.string("sorting_direction").notNullable().defaultTo("asc");
    table.integer("tasks_per_page").notNullable().defaultTo(10);
    table.boolean("show_completed").notNullable().defaultTo(false);
    table.boolean("email_notifications").notNullable().defaultTo(true);
    table.boolean("push_notifications").notNullable().defaultTo(false);
    table.string("notification_frequency").notNullable().defaultTo("daily");
    table.string("time_zone").notNullable().defaultTo("UTC");
    table.string("language").notNullable().defaultTo("en");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user_settings");
}