import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 45).notNullable()
      table.string('email', 100).notNullable()
      table.string('password').notNullable()
      table.boolean('admin').notNullable().defaultTo(false)
      table.string('remember_me_token')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
