import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('user_settings', (table) => {
    table.dropColumn('primary_color');
    table.dropColumn('secondary_color');
    table.dropColumn('dark_mode');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('user_settings', (table) => {
    table.string('primary_color');
    table.string('secondary_color');
    table.boolean('dark_mode');
  });
}