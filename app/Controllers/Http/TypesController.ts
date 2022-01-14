import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Type from 'App/Models/Type'

export default class TypesController {

  public async create({ view, auth, response }: HttpContextContract) {
    if (!auth.user?.admin) {
      response.redirect().toRoute('home.index')
    }
    return view.render('type/create')
  }

  public async store({ request, session, response }: HttpContextContract) {
    const data = await request.only(['description', 'initialNumber', 'step', 'numberOfTickets'])

    if (!this.validate(data, session)) {
      return response.redirect().back()
    }

    try {
      await Type.create(data)
    } catch (error) {
      return response.redirect().toRoute('types.create')
    }
    response.redirect().toRoute('home.index')
  }

  private validate(data, session): Boolean {
    const errors = {}

    if (!data.description) {
      this.registerError(errors, 'description', 'Campo obrigatório')
    }

    if (!data.initialNumber) {
      this.registerError(errors, 'initialNumber', 'Campo obrigatório')
    } else {
      if (isNaN(data.initialNumber) || data.initialNumber < 0) {
        this.registerError(errors, 'initialNumber', 'Valor inválido')
      }
    }

    if (!data.step) {
      this.registerError(errors, 'step', 'Campo obrigatório')
    } else {
      if (isNaN(data.step) || data.step <= 0) {
        this.registerError(errors, 'step', 'Valor inválido')
      }
    }

    if (!data.numberOfTickets) {
      this.registerError(errors, 'numberOfTickets', 'Campo obrigatório')
    } else {
      if (isNaN(data.numberOfTickets) || data.numberOfTickets <= 0) {
        this.registerError(errors, 'numberOfTickets', 'Valor inválido')
      }
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
