import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Raffle from './Raffle'
import Ticket from './Ticket'

export default class Prize extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public raffleId: number

  @column()
  public description: string

  @column()
  public placing: number

  @column()
  public winningTicketId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Raffle)
  public raffleBelongsTo: BelongsTo<typeof Raffle>

  @belongsTo(() => Ticket)
  public ticketBelongsTo: BelongsTo<typeof Ticket>

  @hasOne(() => Raffle)
  public raffleHasOne: HasOne<typeof Raffle>

  @hasOne(() => Ticket)
  public ticketHasOne: HasOne<typeof Ticket>
}
