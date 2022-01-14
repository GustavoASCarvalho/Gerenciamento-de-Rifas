import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Prizes extends BaseSchema {
  protected tableName = 'prizes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('raffle_id').notNullable().references('id').inTable('raffles')
      table.string('description', 45).notNullable()
      table.integer('placing').notNullable()
      table.integer('winning_ticket_id')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
