import { Schema, model, models, Document } from 'mongoose'

export interface IRegistration extends Document {
  createdAt: Date
  event: {
    _id: string
    title: string
  }
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  additionalInfo?: {
    id?: string
    university?: string
    department?: string
    year?: string
  }
}

const RegistrationSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  additionalInfo: {
    id: {
      type: String,
    },
    university: {
      type: String,
    },
    department: {
      type: String,
    },
    year: {
      type: String,
    },
  },
})

const Registration = models.Registration || model('Registration', RegistrationSchema)

export default Registration
