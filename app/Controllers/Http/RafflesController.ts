import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Prize from 'App/Models/Prize'
import Raffle from 'App/Models/Raffle'
import Ticket from 'App/Models/Ticket'
import Type from 'App/Models/Type'
import User from 'App/Models/User'

export default class RafflesController {
  public async index({}: HttpContextContract) {}

  public async create({ view }: HttpContextContract) {
    const types = await Type.query()
    return view.render('raffles/create', { types })
  }

  public async store({ response, request, session, auth }: HttpContextContract) {
    const data = await request.all()

    let tam = 0
    // eslint-disable-next-line no-array-constructor
    const premios = new Array()

    const rifa = {
      title: data['title'],
      ticketPrize: data['ticketPrize'],
      typeId: data['typeId'],
      description: data['description'],
      probableRaffleDate: data['probableRaffleDate'],
      initialSaleDate: data['initialSaleDate'],
      endSaleDate: data['endSaleDate'],
    }

    for (const key in data) {
      key.length
      tam++
    }

    for (let i = 7; i < tam; i++) {
      const premio = { description: data[`prize${i - 6}`], placing: i - 6 }

      if (premio.description && premio.placing) {
        premios.push(premio)
      }
    }

    if (!this.validate(data, session)) {
      return response.redirect().back()
    }

    try {
      const user = auth.user
      const raffle = await user?.related('raffles').create(rifa)
      const type = await Type.query().where('id', data.typeId).firstOrFail()
      await raffle?.related('prizes').createMany(premios)
      // eslint-disable-next-line no-array-constructor
      const tickets = Array()

      for (let i = 0, j = type.initialNumber; i < type.numberOfTickets; i++, j += type.step) {
        tickets.push({ number: j })
      }

      await raffle?.related('tickets').createMany(tickets)
    } catch (error) {
      return response.redirect().toRoute('raffles.create')
    }
    response.redirect().toRoute('/')
  }

  public async show({ view, params }: HttpContextContract) {
    const raffle = await Raffle.query().where('id', params.id).firstOrFail()
    const prizes = await raffle.related('prizes').query()
    const user = await User.query().where('id', raffle.userId).firstOrFail()

    let winners: Array<Object> = []

    for (const prize of prizes) {
      if (prize.winningTicketId) {
        const ticket = await Ticket.query().where('id', prize.winningTicketId).firstOrFail()
        const user = await User.query().where('id', ticket.userId).firstOrFail()
        const obj = {
          prizeId: prize.id,
          name: user.name,
        }
        winners.push(obj)
      }
    }

    return view.render('raffles/show', { raffle, prizes, user, winners })
  }

  public async edit({ view, params, response }: HttpContextContract) {
    const raffle = await Raffle.query().where('id', params.id).firstOrFail()
    if (raffle.raffleDate) {
      response.redirect().back()
    }
    const tickets = await raffle.related('tickets').query()
    return view.render('raffles/edit', { raffle, tickets })
  }

  public async update({ response, request, session, params, auth }: HttpContextContract) {
    const data = await request.all()
    const raffle = await Raffle.query().where('id', params.id).firstOrFail()

    if (raffle.userId !== auth.user?.id) {
      return response.redirect().back()
    }

    if (!this.validateEdit(data, raffle, session)) {
      return response.redirect().back()
    }

    await Raffle.query().where('id', params.id).update({ raffle_date: data.raffleDate })
    response.redirect().toRoute('/')
  }

  public async destroy({}: HttpContextContract) {}

  public async draw({ response, params, auth }: HttpContextContract) {
    const raffle = await Raffle.query()
      .where('id', params.id)
      .preload('tickets', (ticketQuery) => {
        ticketQuery.whereNotNull('user_id')
      })
      .firstOrFail()

    if (
      auth.user?.id === raffle.userId &&
      new Date(raffle.raffleDate).getDate() <= Date.now() &&
      !raffle.drawn
    ) {
      await raffle.load('prizes')

      for (let i = 0; i < raffle.prizes.length; i++) {
        if (raffle.tickets.length > 0) {
          //pegar um numero que não seja repetidx
          const numeroSorteio = Math.floor(Math.random() * raffle.tickets.length)
          const ticketId = raffle.tickets[numeroSorteio].id

          raffle.prizes[i].winningTicketId = ticketId
          await Prize.query()
            .where('id', raffle.prizes[i].id)
            .update({ winning_ticket_id: ticketId })
          raffle.tickets.splice(numeroSorteio, 1)
        }
        await Raffle.query().where('id', raffle.id).update({ drawn: true })
      }

      return response.redirect().toRoute('raffles.show', { id: raffle.id })
    } else {
      return response.redirect().back()
    }
  }

  private validate(data, session): Boolean {
    const errors = {}

    if (!data.typeId) {
      this.registerError(errors, 'typeId', 'Campo obrigatório')
    } else {
      if (isNaN(data.typeId)) {
        this.registerError(errors, 'typeId', 'Valor inválido')
      }
    }

    if (data.description) {
      if (data.description.length > 100) {
        this.registerError(
          errors,
          'description',
          'A descrição precisa ter no máximo 100 caracteres'
        )
      }
    }

    if (!data.title) {
      this.registerError(errors, 'title', 'Campo obrigatório')
    } else {
      if (data.title.length < 3) {
        this.registerError(errors, 'title', 'Titulo precisa ter pelo menos 3 caracteres')
      }

      if (data.title.length > 20) {
        this.registerError(errors, 'title', 'Titulo precisa ter no máximo 20 caracteres')
      }
    }

    if (!data.ticketPrize) {
      this.registerError(errors, 'ticketPrize', 'Campo obrigatório')
    } else if (isNaN(data.ticketPrize)) {
      this.registerError(errors, 'ticketPrize', 'Preço precisa ser um número')
    }

    if (!data.probableRaffleDate) {
      this.registerError(errors, 'probableRaffleDate', 'Campo obrigatório')
    } else if (new Date(data.probableRaffleDate).getTime() < Date.now()) {
      this.registerError(errors, 'probableRaffleDate', 'A data inserida já passou')
    } else if (data.probableSaleDate < data.endSaleDate) {
      this.registerError(
        errors,
        'probableRaffleDate',
        'Provável data de sorteio deve ser depois da data final de vendas'
      )
    }

    if (!data.initialSaleDate) {
      this.registerError(errors, 'initialSaleDate', 'Campo obrigatório')
    } else if (data.initialSaleDate > data.probableRaffleDate) {
      this.registerError(
        errors,
        'initialSaleDate',
        'Data inicial deve ser antes da data provável de sorteio'
      )
    } else if (data.initialSaleDate > data.endSaleDate) {
      this.registerError(
        errors,
        'initialSaleDate',
        'Data inicial deve ser antes da data final de vendas'
      )
    }

    if (!data.endSaleDate) {
      this.registerError(errors, 'endSaleDate', 'Campo obrigatório')
    } else if (new Date(data.endSaleDate).getTime() < Date.now()) {
      this.registerError(errors, 'endSaleDate', 'A data de vendas já passou')
    } else if (data.endSaleDate > data.probableRaffleDate) {
      this.registerError(
        errors,
        'endSaleDate',
        'Data final das vendas deve ser antes da data provável de sorteio'
      )
    } else if (data.endSaleDate < data.initialSaleDate) {
      this.registerError(
        errors,
        'endSaleDate',
        'Data final de vendas deve ser depois da data inicial de vendas'
      )
    }

    if (!data.prize1) {
      this.registerError(errors, 'prize', 'Campo obrigatório')
    }

    if (Object.entries(errors).length > 0) {
      session.flash('errors', errors)
      session.flashAll()
      return false
    }
    return true
  }

  private validateEdit(data, raffle, session): Boolean {
    const errors = {}

    if (!data.raffleDate) {
      this.registerError(errors, 'raffleDate', 'Campo obrigatório')
    } else if (new Date(data.raffleDate).getTime() < new Date(raffle.endSaleDate).getTime()) {
      this.registerError(
        errors,
        'raffleDate',
        `data do sorteio tem que ser depois de: ${raffle.endSaleDate.toLocaleString()}`
      )
    } else if (new Date(data.raffleDate).getTime() < Date.now()) {
      this.registerError(errors, 'raffleDate', `data do sorteio ja passou`)
    }

    if (Object.entries(errors).length > 0) {
      session.flash('errors', errors)
      session.flashAll()

      return false
    }
    return true
  }

  private registerError(errors, atribute, error) {
    if (!errors[atribute]) {
      errors[atribute] = []
    }
    errors[atribute].push(error)
  }
}
