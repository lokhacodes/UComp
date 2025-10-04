'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../mongodb/database'
import User from '../mongodb/database/models/user.model'
import Order from '../mongodb/database/models/order.model'
import Event from '../mongodb/database/models/event.model'
import { handleError } from '@/lib/utils'

import { CreateUserParams, UpdateUserParams } from '@/types'

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()

    // Check if user exists by clerkId
    const existingUser = await User.findOne({ clerkId: user.clerkId })
    if (existingUser) {
      // Update the existing user
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: user.clerkId },
        user,
        { new: true }
      )
      return JSON.parse(JSON.stringify(updatedUser))
    } else {
      // Create new user
      try {
        const newUser = await User.create(user)
        return JSON.parse(JSON.stringify(newUser))
      } catch (error: any) {
        if (error.code === 11000) {
          // Duplicate key error, user already exists with same email, update instead
          const updatedUser = await User.findOneAndUpdate(
            { email: user.email },
            user,
            { new: true }
          )
          return JSON.parse(JSON.stringify(updatedUser))
        } else {
          throw error
        }
      }
    }
  } catch (error) {
    handleError(error)
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ clerkId })

    if (!user) return null
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) {
      throw new Error('User not found')
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ])

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}