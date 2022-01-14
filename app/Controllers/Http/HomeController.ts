import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Prize from 'App/Models/Prize'
import Raffle from 'App/Models/Raffle'
import Ticket from 'App/Models/Ticket'
import User from 'App/Models/User'

export default class HomeController {
  public async index({ view, auth }: HttpContextContract) {
    const prizes = await Prize.query()
    const raffles = await Raffle.query().preload('tickets')
    const users = await User.query()
    const user = auth.user

    let rafflesTickets: Array<Raffle> = []
    let userJoinRaffles: Array<Raffle> = []
    let ticketsAndUsersJoinRaffles: Array<Object> = []
    let userAbout: Array<Object> = []
    let timeToRaffleDate: Array<Object> = []
    let lastWin
    let raffleAbout = {
      haveRaffles: false,
      userHaveRaffles: false,
      userJoinRaffles: false,
      win: false,
    }

    // tickets em que o usuário participa

    if (user?.id) {
      rafflesTickets = await Raffle.query().preload('tickets', (ticketQuery) => {
        ticketQuery.where('userId', user.id)
      })

      let numberOfTickets = 0

      for (const raffle of rafflesTickets) {
        numberOfTickets = 0
        for (const ticket of raffle.tickets) {
          ticket.$options
          numberOfTickets++
        }
        if (numberOfTickets > 0) {
          userJoinRaffles.push(raffle)
          raffleAbout.userJoinRaffles = true
          let obj = {
            raffleId: raffle.id,
            qtd: numberOfTickets,
            amountSpent: numberOfTickets * raffle.ticketPrize,
          }
          userAbout.push(obj)
        }
      }
    }

    //rifas

    for (const raffle of raffles) {
      if (user?.id === raffle.userId) raffleAbout.userHaveRaffles = true

      if (raffle.raffleDate) {
        let numberOfTickets = 0
        let usersId: Array<number> = []
        for (const tickets of raffle.tickets) {
          if (tickets.userId) {
            if (!usersId.some((x) => x === tickets.userId)) {
              usersId.push(tickets.userId)
            }
            numberOfTickets++
          }
        }

        let o = {
          raffleId: raffle.id,
          ticketsJoin: numberOfTickets,
          usersJoin: usersId.length,
        }

        ticketsAndUsersJoinRaffles.push(o)

        if (
          new Date(raffle.endSaleDate).getTime() >= Date.now() &&
          Date.now() >= new Date(raffle.initialSaleDate).getTime()
        ) {
          raffleAbout.haveRaffles = true
        }

        const secondsDiffRD = (raffle.raffleDate.getTime() - Date.now()) / 1000 //Raffle data
        const secondsDiffESD = (raffle.endSaleDate.getTime() - Date.now()) / 1000 // End Sale Date
        let obj = {
          raffleId: raffle.id,
          timeEndSaleDate: {
            days: (secondsDiffESD / 86400).toFixed(0),
            hours: (secondsDiffESD / 3600).toFixed(0),
            minutes: (secondsDiffESD / 60).toFixed(0),
            seconds: secondsDiffESD.toFixed(0),
          },
          timeRaffleDate: {
            days: (secondsDiffRD / 86400).toFixed(0),
            hours: (secondsDiffRD / 3600).toFixed(0),
            minutes: (secondsDiffRD / 60).toFixed(0),
            seconds: secondsDiffRD.toFixed(0),
          },
        }
        timeToRaffleDate.push(obj)
      } else {
        const secondsDiffESD = (raffle.endSaleDate.getTime() - Date.now()) / 1000 // End Sale Date
        let obj = {
          raffleId: raffle.id,
          timeEndSaleDate: {
            days: (secondsDiffESD / 86400).toFixed(0),
            hours: (secondsDiffESD / 3600).toFixed(0),
            minutes: (secondsDiffESD / 60).toFixed(0),
            seconds: secondsDiffESD.toFixed(0),
          },
        }
        timeToRaffleDate.push(obj)
      }
    }

    if (raffleAbout.userJoinRaffles) {
      for (const userJoinRaffle of userJoinRaffles) {
        if (userJoinRaffle.drawn) {
          await userJoinRaffle.load('prizes')
          for (const prize of userJoinRaffle.prizes) {
            const ticket = await Ticket.query().where('id', prize.winningTicketId).firstOrFail()
            if (ticket.userId === user?.id) {
              lastWin = {
                raffleId: userJoinRaffle.id,
                placing: prize.placing,
                prize: prize.description,
              }
              raffleAbout.win = true
            }
          }
        }
      }
    }

    return view.render('home/index', {
      raffles,
      users,
      prizes,
      userJoinRaffles,
      userAbout,
      timeToRaffleDate,
      raffleAbout,
      ticketsAndUsersJoinRaffles,
      lastWin,
    })
  }
  public async about({ view }: HttpContextContract) {
    return view.render('home/about')
  }
}
