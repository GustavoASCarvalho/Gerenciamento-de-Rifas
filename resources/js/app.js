import '../css/app.scss'
import 'bootstrap'

try {
  const divPremios = document.querySelector('.premios')
  const badicionar = document.querySelector('.adicionar')
  const bremover = document.querySelector('.remover')

  const status = {
    qtdAdicionada: 0,
  }

  badicionar.addEventListener('click', () => {
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')
    const div3 = document.createElement('div')
    const span = document.createElement('span')
    const input = document.createElement('input')

    divPremios.firstChild

    div1.classList.add('row')
    div1.classList.add('my-4')

    div2.classList.add('col-3')
    span.classList.add('text-color-1')

    span.appendChild(document.createTextNode(`${status.qtdAdicionada + 2}º lugar`))

    div3.classList.add('col-9')

    input.classList.add('form-control')
    input.id = `prize${status.qtdAdicionada + 2}`
    input.name = `prize${status.qtdAdicionada + 2}`
    input.type = `text`

    div2.appendChild(span)
    div3.appendChild(input)
    div1.appendChild(div2)
    div1.appendChild(div3)

    divPremios.appendChild(div1)
    status.qtdAdicionada++
  })

  bremover.addEventListener('click', () => {
    if (status.qtdAdicionada > 0) {
      divPremios.lastElementChild.remove()
      status.qtdAdicionada--
    }
  })
} catch (error) {}
