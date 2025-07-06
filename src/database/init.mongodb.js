/* eslint-disable no-console */
'use strict'

import mongoose from 'mongoose'
import { env } from '~/configs/environment'
import { countConnect } from '~/helpers/check.connect'

const connectionString = env.MONGODB_URI

class Database {
  constructor() {
    this.connect()
  }

  connect(type = 'mongodb') {
    if (process.env.NODE_ENV === 'dev') {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }
    mongoose
      .connect(connectionString, { maxPoolSize: 50 })
      .then(() => {
        console.log('Connected Mongodb Success')
        countConnect()
      })
      .catch(() => console.log('Error Connect!'))
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database()
    }
    return this.instance
  }
}

const instanceMongodb = Database.getInstance()

export default instanceMongodb
