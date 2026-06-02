# UComp - Competition Platform

UComp is a comprehensive platform for organizing and managing competitions. It allows users to create events, register for competitions, handle payments, and manage user profiles. The platform supports both individual and team-based competitions with features like event categorization, file uploads, and secure payment processing via bKash.

## Features

### Core Functionality
- **Event Management**: Create, update, and manage competition events with detailed information including sub-events, categories, and pricing
- **User Registration**: Secure user authentication and registration system using Clerk
- **Competition Registration**: Register for events with support for individual and team competitions
- **Payment Processing**: Integrated bKash payment gateway for secure transactions
- **File Uploads**: UploadThing integration for handling event images and documents
- **Order Management**: Track and manage event orders and transactions

### User Features
- **Profile Management**: User profiles with personal information and registration history
- **Event Discovery**: Browse and search events by category, location, and date
- **Registration Tracking**: View and manage personal registrations and team memberships
- **Payment History**: Access order history and transaction details

### Organizer Features
- **Event Creation**: Comprehensive event creation with sub-event support
- **Category Management**: Organize events into categories for better discoverability
- **Registration Oversight**: Monitor and manage event registrations
- **Payment Integration**: Handle payments and refunds through bKash

## Tech Stack

### Frontend
- **Next.js 15.4.2**: React framework for server-side rendering and static site generation
- **React 19.1.0**: UI library for building interactive components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TypeScript**: Type-safe JavaScript for better development experience

### Backend & Database
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM for MongoDB with schema validation
- **Next.js API Routes**: Serverless API endpoints

### Authentication & Payments
- **Clerk**: User authentication and management
- **bKash**: Bangladeshi payment gateway integration
- **UploadThing**: File upload and management service

### UI & Utilities
- **Radix UI**: Accessible UI components
- **Lucide React**: Icon library
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Axios**: HTTP client for API calls

## Project Structure

```
talenthunt/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (root)/            # Main application routes
│   ├── api/               # API routes
│   ├── blank/             # Additional pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── shared/            # Shared components
│   └── ui/                # UI library components
├── lib/                   # Utility libraries
│   ├── actions/           # Server actions
│   ├── mongodb/           # Database configuration
│   └── utils.ts           # Utility functions
├── public/                # Static assets
├── types/                 # TypeScript type definitions
└── constants/             # Application constants
```

## Outputs
![alt text](image.png)




## Database Models

### Event Model
- Title, description, location, dates, pricing
- Sub-events with competition types (individual/team)
- Category and organizer references
- Image URL and additional metadata

### Registration Model
- Event and user references
- Team information for team competitions
- Additional participant details
- Registration timestamps

### Order Model
- Payment tracking with bKash integration
- Event and buyer references
- Transaction amounts and status

### User Model
- User profile information
- Authentication via Clerk
- Role-based access control

## API Routes

### Payment Integration
- `/api/make-payment`: Initiate bKash payment
- `/api/callback`: Handle payment callbacks
- `/api/webhook/clerk`: Clerk webhook handling

### Data Management
- `/api/user`: User data retrieval
- `/api/uploadthing`: File upload handling

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB database
- bKash merchant account
- Clerk application
- UploadThing account

### Environment Variables
Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# bKash Payment Gateway
BKASH_BASE_URL=your_bkash_base_url
BKASH_USERNAME=your_bkash_username
BKASH_PASSWORD=your_bkash_password
BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret

# UploadThing
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
