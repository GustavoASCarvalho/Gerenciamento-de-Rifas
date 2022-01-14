import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Raffles extends BaseSchema {
  protected tableName = 'raffles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable().references('id').inTable('users')
      table.integer('type_id').notNullable().references('id').inTable('raffles')
      table.string('title', 45).notNullable()
      table.string('description')
      table.dateTime('probable_raffle_date').notNullable()
      table.dateTime('initial_sale_date').notNullable()
      table.dateTime('end_sale_date').notNullable()
      table.dateTime('raffle_date')
      table.float('ticket_prize').notNullable()
      table.boolean('drawn').notNullable().defaultTo(false)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
