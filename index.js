// Codigo minimo para crear un proyecto expres
import express from 'express' // inportar la dependencia
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express() // crear la aplicacion
app.use(express.json()) // mira si al req, tiene un json y lo tranforma a un body

// const PORT = process.env.PORT ?? 3000 // crear el puerto para levantar els evidor por defectoesta el 3000// esta siendo registrada en config.js para un codigo mas limpio

app.get('/', (request, response) => { // Creacion de rutas para Endpoints
  response.send('Hello World') // Cuando se entre a ala raiz del proyecto '/' responde con un hello world
})
// Creacion de  Endpoints lo llamamos con el metodo post
app.post('/login', async (request, response) => { // Login de usuario
  const { username, password } = request.body
  try {
    const user = await UserRepository.login({ username, password })
    response.send({ user })
  } catch (error) {
    response.status(401).send(error.message)
  }
}) // response.json({ user: 'pato' })
app.post('/register', async (request, response) => { // Registracion de usuario
  const { username, password } = request.body
  console.log({ username, password })

  try {
    const id = await UserRepository.create({ username, password })
    response.send({ id })
  } catch (error) {
    response.status(400).send(error.message)
  }
})
app.post('/logout', (request, response) => { // Cierre  de de sesion  usuario

})
app.post('/protected', (request, response) => { // Ruta protegida

})

app.listen(PORT, () => { // aqui levanta el proyecto
  console.log(`Server running on port ${PORT}`)
})
// <--------------------------------------------------------------------------------------------> //
