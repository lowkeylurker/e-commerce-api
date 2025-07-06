'use strict'

import { StatusCodes } from 'http-status-codes'

export class AuthController {
  register = async (req, res, next) => {
    try {
      let createdUser = {}
      if (req.body.access_token) {
        createdUser = await authService.registerWithGoogle(req.body)
      } else {
        createdUser = await authService.register(req.body)
      }
      return res.status(StatusCodes.CREATED).json(createdUser)
    } catch (error) {
      next(error)
    }
  }
}
