import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('user_settings', (table) => {
    // Remove old columns
    table.dropColumn('default_sorting');
    table.dropColumn('sorting_direction');
    table.dropColumn('tasks_per_page');

    // Add new columns
    table.string('sort_by').defaultTo('due_date');
    table.string('sort_order').defaultTo('asc');
    table.boolean('sort_completed_to_bottom').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('user_settings', (table) => {
    // Recreate old columns
    table.string('default_sorting');
    table.string('sorting_direction');
    table.integer('tasks_per_page');

    // Remove new columns
    table.dropColumn('sort_by');
    table.dropColumn('sort_order');
    table.dropColumn('sort_completed_to_bottom');
  });
}