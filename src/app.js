/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { corsOptions } from './configs/cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import instanceMongodb from './database/init.mongodb'

const app = express()

// Init Middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.use(cookieParser())

app.use(express.json())

app.use(cors(corsOptions))

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: corsOptions
})

app.use((req, res, next) => {
  req.io = io
  next()
})

// Init DB
instanceMongodb
// checkOverload()

// Init Routes
app.use('/v1/api', APIs_V1)

// Middleware error handling
app.use(errorHandlingMiddleware)

let typingReviewUsers = {}
io.on('connection', (socket) => {
  console.log('User connected: ', socket.id)

  socket.on('FE_JOIN_PRODUCT', (productId) => {
    // console.log('FE_JOIN_PRODUCT', socket.id)
    socket.join(productId)
    socket.emit('BE_UPDATE_TYPING', {
      productId,
      users: [...(typingReviewUsers[productId] || [])]
    })
  })

  socket.on('FE_LEAVE_PRODUCT', (productId) => {
    // console.log('FE_LEAVE_PRODUCT', socket.id)
    socket.leave(productId)
  })

  socket.on('FE_START_TYPING', ({ productId, userId }) => {
    // console.log('FE_START_TYPING', socket.id)
    if (!typingReviewUsers[productId]) typingReviewUsers[productId] = new Set()
    typingReviewUsers[productId].add(userId)

    socket
      .to(productId)
      .emit('BE_UPDATE_TYPING', {
        productId,
        users: [...typingReviewUsers[productId]]
      })
  })

  socket.on('FE_STOP_TYPING', ({ productId, userId }) => {
    // console.log('FE_STOP_TYPING', socket.id)
    if (typingReviewUsers[productId]) {
      typingReviewUsers[productId].delete(userId)
      if (typingReviewUsers[productId].size === 0)
        delete typingReviewUsers[productId]
    }

    socket
      .to(productId)
      .emit('BE_UPDATE_TYPING', {
        productId,
        users: [...(typingReviewUsers[productId] || [])]
      })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

export default httpServer
