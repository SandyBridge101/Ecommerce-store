# Overview

TechHub is a modern e-commerce web application built for selling technology products including laptops, smartphones, and accessories. The application features a full-stack architecture with user authentication, product catalog management, shopping cart functionality, order processing, and an admin dashboard. The system is designed as a single-page application (SPA) with React frontend and Express.js backend, using PostgreSQL for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for development and build tooling
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **Routing**: Wouter for client-side routing with pages for home, products, cart, checkout, authentication, and dashboard
- **State Management**: Zustand for global state (authentication, cart) with persistence middleware for data persistence across sessions
- **Data Fetching**: TanStack Query (React Query) for server state management, caching, and API synchronization
- **Forms**: React Hook Form with Zod for form validation and schema validation

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with route handlers organized in separate modules
- **Database Layer**: Drizzle ORM for type-safe database operations with schema-first approach
- **Middleware**: Custom logging middleware for API request tracking and error handling middleware
- **Development**: Vite middleware integration for development mode with HMR support

## Data Storage
- **Primary Database**: PostgreSQL with Drizzle ORM for schema management and migrations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Design**: Relational model with tables for users, products, categories, cart items, favorites, orders, and order items
- **Migrations**: Drizzle Kit for database schema migrations and version control

## Authentication & Authorization
- **Authentication**: Session-based authentication with email/password login
- **User Roles**: Role-based access control (customer/admin) for feature permissions
- **Session Storage**: Client-side state persistence using Zustand with localStorage
- **Route Protection**: Component-level authentication checks for protected routes

## External Dependencies

- **Database**: Neon Database (@neondatabase/serverless) for PostgreSQL hosting
- **UI Components**: Radix UI primitives for accessible component foundation
- **Form Handling**: React Hook Form with Hookform Resolvers for form management
- **Validation**: Zod for runtime type checking and schema validation
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **Development Tools**: ESBuild for production builds, TSX for TypeScript execution
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Date Handling**: date-fns for date manipulation and formatting
- **Carousel**: Embla Carousel for image galleries and product showcases