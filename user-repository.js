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
  static create ({ username, password }) {
    // Validaciones de username y password
    if (typeof username !== 'string' || username.length < 3) {
      throw new Error('Username must be a string of at least 3 characters')
    }
    if (typeof password !== 'string' || password.length < 6) {
      throw new Error('Password must be a string of at least 6 characters')
    }

    // Verificar si el usuario ya existe
    const existingUser = User.findOne({ username })
    if (existingUser) {
      throw new Error('Username already exists')
    }

    // Generar un nuevo ID único para el usuario
    const id = crypto.randomUUID()
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS)

    // Crear y guardar el nuevo usuario
    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static login ({ username, password }) {
    // Implementa la lógica de autenticación aquí
    const user = User.findOne({ username })
    if (!user) {
      throw new Error('User not found')
    }

    if (user.password !== password) {
      throw new Error('Incorrect password')
    }

    return 'Login successful' // Ejemplo simple de éxito
  }
}
