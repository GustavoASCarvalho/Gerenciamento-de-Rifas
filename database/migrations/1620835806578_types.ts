import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Types extends BaseSchema {
  protected tableName = 'types'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('description', 45).notNullable()
      table.integer('initial_number').notNullable()
      table.integer('step').notNullable()
      table.integer('number_of_tickets').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
