/* eslint-disable no-console */
'use strict'

import mongoose from 'mongoose'
import os from 'os'

const _SECONDS = 5000

// Count number of connections
export const countConnect = () => {
  const numberConnection = mongoose.connections.length
  console.log(`Number of connections: ${numberConnection}`)
}

// Check overload
export const checkOverload = () => {
  setInterval(() => {
    const numberConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // Provided that maximum number of connections of each core is 5
    const maxConnections = numCores * 5

    console.log(`Active connections: ${numberConnection}`)
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)
    if (numberConnection > maxConnections) {
      console.log('Connection overload detected!')
    }
  }, _SECONDS) // Monitor every 5 seconds
}
