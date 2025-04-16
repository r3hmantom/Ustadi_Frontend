# Project Structure Documentation

## Overview
Ustadi Frontend is a Next.js application using React 19, TypeScript, and Tailwind CSS. The application follows the App Router pattern of Next.js and includes authentication features, UI components, and various API endpoints.

## Recent Changes - April 16, 2025
- **Feature**: Added a new landing page with neubrutalism design
- **Enhancement**: Modified shadcn components to support neubrutalism design variants:
  - Added neubrutalism, neuPrimary, and neuSecondary variants to Button component
  - Added neubrutalism variant to Card component
  - Added neuLg size to Button component for larger, more prominent buttons
- **New Component**: Created animated-elements.tsx with Framer Motion animations:
  - FadeIn: Component for fade-in animations with directional support
  - StaggerContainer & StaggerItem: For staggered animations of child elements
  - Marquee: For continuous scrolling text elements
  - ParallaxScroll: For parallax scrolling effects
- **Dependency**: Added framer-motion for advanced animations

## Project Structure

### Root Directory
- `package.json` - Project configuration with dependencies including Next.js 15.2.3, React 19, Tailwind CSS, and authentication libraries
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind
- `eslint.config.mjs` - ESLint configuration
- `components.json` - UI component configurations
- `.env` - Environment variables (not versioned)

### `/app` - Main Application Directory
- `/app/page.tsx` - Homepage component with neubrutalism design and Framer Motion animations
- `/app/layout.tsx` - Root layout component with font settings and metadata
- `/app/globals.css` - Global CSS styles
- `/app/favicon.ico` - Site favicon

#### `/app/api` - API Routes
- `/app/api/auth/login/route.ts` - Login endpoint (currently returns a 501 "not implemented" response)
- `/app/api/auth/register` - User registration endpoints
- `/app/api/quizzes` - Quiz-related API endpoints
- `/app/api/revisions` - Revision tracking API endpoints
- `/app/api/comments` - Comment management API endpoints
- `/app/api/tasks` - Task management API endpoints

#### `/app/auth` - Authentication Pages
- Authentication-related pages and components

#### `/app/dashboard` - Dashboard Pages
- Dashboard UI and features

### `/components` - Reusable UI Components
- `/components/ui/button.tsx` - Button component with neubrutalism variants
- `/components/ui/card.tsx` - Card component with neubrutalism variant
- `/components/ui/checkbox.tsx` - Checkbox component
- `/components/ui/input.tsx` - Input component
- `/components/ui/label.tsx` - Label component
- `/components/ui/tabs.tsx` - Tabs component
- `/components/ui/animated-elements.tsx` - Animation components using Framer Motion

### `/lib` - Utility Functions and Helpers
- `/lib/db.ts` - Database connection configuration using MSSQL
- `/lib/utils.ts` - Common utility functions

### `/public` - Static Assets
- Images, icons, and other static files

## Technology Stack
- **Framework**: Next.js 15.2.3
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **UI Components**: Custom components using Radix UI primitives
- **Animations**: Framer Motion
- **Design System**: Neubrutalism design applied to shadcn components
- **Database**: Microsoft SQL Server (via mssql package)
- **Authentication**: Custom implementation using bcryptjs and jsonwebtoken

## Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint