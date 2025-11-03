// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string
  role?: 'admin' | 'user' | null
}

export type UpdateUserParams = {
  firstName?: string
  lastName?: string
  username?: string
  photo?: string
  role?: 'admin' | 'user' | null
}

// ====== EVENT PARAMS
export type CreateEventParams = {
  userId: string
  event: {
    title: string
    description: string
    location: string
    imageUrl: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    price: string
    isFree: boolean
    url: string
    subevents?: Subevent[]
  }
  path: string
}

export type UpdateEventParams = {
  userId: string
  event: {
    _id: string
    title: string
    imageUrl: string
    description: string
    location: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    price: string
    isFree: boolean
    url: string
    subevents?: Subevent[]
  }
  path: string
}

export type DeleteEventParams = {
  eventId: string
  path: string
}

export type GetAllEventsParams = {
  query: string
  category: string
  limit: number
  page: number
}

export type GetEventsByUserParams = {
  userId: string
  limit?: number
  page: number
}

export type GetRelatedEventsByCategoryParams = {
  categoryId: string
  eventId: string
  limit?: number
  page: number | string
}

export type Subevent = {
  name: string
  description: string
  competitionType: 'individual' | 'team'
  teamSize?: number
}

export type Event = {
  _id: string
  title: string
  description: string
  price: string
  isFree: boolean
  imageUrl: string
  location: string
  startDateTime: Date
  endDateTime: Date
  url: string
  subevents?: Subevent[]
  organizer: {
    _id: string
    firstName: string
    lastName: string
  }
  category: {
    _id: string
    name: string
  }
}

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string
}

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string
  eventId: string
  price: string
  isFree: boolean
  buyerId: string
}

export type CreateOrderParams = {
  stripeId: string
  eventId: string
  buyerId: string
  totalAmount: string
  createdAt: Date
}

export type GetOrdersByEventParams = {
  eventId: string
  searchString: string
}

export type GetOrdersByUserParams = {
  userId: string | null
  limit?: number
  page: string | number | null
}

// ====== REGISTRATION PARAMS
export type CreateRegistrationParams = {
  userId: string
  eventId: string
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

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export type SearchParamProps = {
 

  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>

}