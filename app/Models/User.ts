import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  hasManyThrough,
  HasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import Ticket from './Ticket'
import Raffle from './Raffle'
import Prize from './Prize'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public admin: boolean

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Raffle)
  public raffles: HasMany<typeof Raffle>

  @hasMany(() => Ticket)
  public tickets: HasMany<typeof Ticket>

  @hasManyThrough([() => Prize, () => Raffle])
  public prizesThroughRaffle: HasManyThrough<typeof Prize>

  @hasManyThrough([() => Ticket, () => Raffle])
  public ticketsThroughRaffle: HasManyThrough<typeof Ticket>
}
