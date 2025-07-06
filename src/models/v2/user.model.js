'use strict'

import { model, Schema } from 'mongoose'
import { ACCOUNT_ROLE, ACCOUNT_STATUS, GENDER } from '~/utils/constants'

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'users'

var userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      maxLength: 150,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    dateOfBirth: {
      type: Schema.Types.Date
    },
    gender: {
      type: String,
      enum: Object.keys(GENDER),
      default: GENDER.MALE
    },
    avatar: { type: String },
    role: {
      type: String,
      enum: Object.keys(ACCOUNT_ROLE),
      default: ACCOUNT_ROLE.BUYER
    },
    status: {
      type: String,
      enum: Object.keys(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.INACTIVE
    },

    isVerified: {
      type: Schema.Types.Boolean,
      default: false
    },
    verifyToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
)
export const userModel = model(DOCUMENT_NAME, userSchema, COLLECTION_NAME)
