'use server'

import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/mongodb/database'
import Registration from '@/lib/mongodb/database/models/registration.model'
import { handleError } from '@/lib/utils'
import { CreateRegistrationParams } from '@/types'

import Event from '@/lib/mongodb/database/models/event.model'

export async function createRegistration({ userId, eventId, subeventId, teamName, teamMembers, additionalInfo }: CreateRegistrationParams) {
  try {
    await connectToDatabase()

    // Fetch event details to save snapshot in registration
    const event = await Event.findById(eventId)

    if (!event) {
      throw new Error('Event not found for registration')
    }

    const newRegistration = await Registration.create({
      user: new mongoose.Types.ObjectId(userId),
      event: new mongoose.Types.ObjectId(eventId),
      eventTitle: event.title,
      eventImageUrl: event.imageUrl,
      eventDescription: event.description,
      eventLocation: event.location,
      eventStartDateTime: event.startDateTime,
      eventEndDateTime: event.endDateTime,
      eventPrice: event.price,
      eventIsFree: event.isFree,
      subeventId,
      teamName,
      teamMembers,
      additionalInfo,
    })

    return JSON.parse(JSON.stringify(newRegistration))
  } catch (error) {
    handleError(error)
  }
}

export async function getRegistrationsByEvent(eventId: string) {
  try {
    await connectToDatabase()

    const registrations = await Registration.find({ event: eventId })
      .populate('user', '_id firstName lastName email')
      .populate('event', '_id title imageUrl subevents')

    return JSON.parse(JSON.stringify(registrations))
  } catch (error) {
    handleError(error)
  }
}

export async function getAllRegistrations(page = 1, limit = 10) {
  try {
    await connectToDatabase()

    const skip = (page - 1) * limit

    const registrations = await Registration.find()
      .populate('user', '_id firstName lastName email')
      .populate('event', '_id title imageUrl subevents')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Registration.countDocuments()

    return JSON.parse(JSON.stringify({
      registrations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }))
  } catch (error) {
    handleError(error)
  }
}

export async function getRegistrationsByUser(userId: string) {
  try {
    await connectToDatabase()

    const registrations = await Registration.find({ user: userId })
      .populate('user', '_id firstName lastName email')
      .populate('event', '_id title description location startDateTime endDateTime price isFree imageUrl')

    return JSON.parse(JSON.stringify(registrations))
  } catch (error) {
    handleError(error)
  }
}
