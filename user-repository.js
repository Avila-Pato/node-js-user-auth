import crypto from 'crypto'

import DBLocal from 'db-local' // Corrige el path de importación

import bcrypt from 'bcrypt'

import { SALT_ROUNDS } from './config.js'

const dbLocalInstance = new DBLocal({ path: './db' }) // Corrige la instancia de DBLocal

const Schema = dbLocalInstance.Schema// Obtén el método Schema desde la instancia

const User = Schema('User', { // Define el esquema del usuario correctamente
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})
// Validaciones
export class UserRepository {
  static async create ({ username, password }) {
    // Validaciones de username y password
    Validation.usernmae(username)
    Validation.password(password)
    // Verificar si el usuario ya existe
    const existingUser = User.findOne({ username })
    if (existingUser) {
      throw new Error('Username already exists')
    }

    // Generar un nuevo ID único para el usuario
    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS) // Si se usa e hasSync Bloquea el thread principal

    // Crear y guardar el nuevo usuario
    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    // Implementa la lógica de autenticación aquí
    Validation.usernmae(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('username does not exist')

    // mirar sie s valido
    const isValid = await bcrypt.compareSync(password, user.password) // Inscripta el password para hashear el siguiente para compararlo
    if (!isValid) throw new Error('password is invaid')
    return user
  }
}
class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('username msut be a string')
    if (username.length < 3) throw new Error('Username must be a string of at least 3 characters')

    if (typeof username !== 'string') throw new Error('username msut be a string')
    if (username.length < 6) throw new Error('Username must be a string of at least 6 characters')
  }
}
