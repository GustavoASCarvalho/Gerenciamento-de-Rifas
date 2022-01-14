import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Raffle from 'App/Models/Raffle'
import Ticket from 'App/Models/Ticket'
import User from 'App/Models/User'

export default class TicketsController {
  public async show({ view, params, request, response }: HttpContextContract) {
    const raffle = await Raffle.query().where('id', params.id).firstOrFail()

    if (
      new Date(raffle.endSaleDate).getTime() <= Date.now() ||
      new Date(raffle.initialSaleDate).getTime() >= Date.now()
    ) {
      response.redirect().back()
    }

    const users = await User.query()
    let pag = request.input('pag', 1)
    const limit = 100

    const tam = (await raffle.related('tickets').query()).length / limit

    const tickets = await raffle.related('tickets').query().paginate(pag, limit)
    pag = parseInt(pag)
    return view.render('tickets/show', { tickets, pag, tam, users })
  }

  public async buy({ params, response, auth }: HttpContextContract) {
    const raffle = await Raffle.query().where('id', params.id).firstOrFail()
    if (
      new Date(raffle.endSaleDate).getTime() <= Date.now() ||
      new Date(raffle.initialSaleDate).getTime() >= Date.now()
    ) {
      response.redirect().back()
    }
    await Ticket.query().where('id', params.ticketId).update({ user_id: auth.user?.id })
    return response.redirect().toRoute('tickets.show', { id: params.id, qs: { pag: 1 } })
  }
}
