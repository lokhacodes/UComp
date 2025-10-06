import { NextRequest, NextResponse } from 'next/server'
import { getUserByClerkId } from '@/lib/actions/user.actions'

export async function POST(request: NextRequest) {
  try {
    const { clerkId } = await request.json()

    if (!clerkId) {
      return NextResponse.json({ error: 'Clerk ID is required' }, { status: 400 })
    }

    const user = await getUserByClerkId(clerkId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
