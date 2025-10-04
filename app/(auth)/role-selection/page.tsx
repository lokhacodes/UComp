'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { updateUser, getUserByClerkId, createUser } from '@/lib/actions/user.actions'

export default function RoleSelectionPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id) {
        const data = await getUserByClerkId(user.id)
        setUserData(data)
        if (data?.role) {
          if (data.role === 'admin') {
            router.replace('/')
          } else {
            router.replace('/blank')
          }
        }
      }
    }
    fetchUser()
  }, [user?.id, router])

  const handleRoleSelect = async (role: 'admin' | 'user') => {
    setError(null)
    if (!user) return

    if (role === 'admin' && !user.emailAddresses[0]?.emailAddress.endsWith('@student.ndub.edu.bd')) {
      setError('You are not authorized to select the Admin role.')
      return
    }

    setLoading(true)
    try {
      // Check if user exists in DB
      let existingUser = await getUserByClerkId(user.id)
      if (!existingUser) {
        // Create user
        const userData = {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          username: user.username || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          photo: user.imageUrl || '',
          role
        }
        try {
          await createUser(userData)
        } catch (error: any) {
          if (error.code === 11000) {
            // Duplicate key error, user already exists, update instead
            await updateUser(user.id, { role })
          } else {
            throw error
          }
        }
      } else {
        await updateUser(user.id, { role })
      }
      if (role === 'admin') {
        router.replace('/')
      } else {
        router.replace('/blank')
      }
    } catch (err) {
      setError('Failed to update role. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Select Your Role
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose the role that best describes you
          </p>
        </div>
        <div className="space-y-4">
          <Button
            onClick={() => handleRoleSelect('admin')}
            disabled={loading}
            className="w-full"
          >
            Admin
          </Button>
          <Button
            onClick={() => handleRoleSelect('user')}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            User
          </Button>
        </div>
        {error && (
          <div className="text-red-600 text-center text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
