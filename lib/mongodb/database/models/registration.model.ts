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
  subeventId?: string
  teamName?: string
  teamMembers?: {
    name: string
    phone: string
    email: string
  }[]
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
  eventTitle: {
    type: String,
    required: true,
  },
  eventImageUrl: {
    type: String,
  },
  eventDescription: {
    type: String,
  },
  eventLocation: {
    type: String,
  },
  eventStartDateTime: {
    type: Date,
  },
  eventEndDateTime: {
    type: Date,
  },
  eventPrice: {
    type: String,
  },
  eventIsFree: {
    type: Boolean,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  subeventId: {
    type: String,
  },
  teamName: {
    type: String,
  },
  teamMembers: [{
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  }],
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
