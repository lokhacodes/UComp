'use server'

import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/mongodb/database'
import Registration from '@/lib/mongodb/database/models/registration.model'
import { handleError } from '@/lib/utils'
import { CreateRegistrationParams } from '@/types'

export async function createRegistration({ userId, eventId, subeventId, teamName, teamMembers, additionalInfo }: CreateRegistrationParams) {
  try {
    await connectToDatabase()

    const newRegistration = await Registration.create({
      user: new mongoose.Types.ObjectId(userId),
      event: new mongoose.Types.ObjectId(eventId),
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
