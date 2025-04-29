# Study Management System

This is a Study Management System built with Next.js, Prisma, and SQL Server.

## Setup

### Prerequisites

- Node.js (v16+)
- SQL Server (local or remote)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Configure your SQL Server connection in `.env` file:

```
DATABASE_URL="sqlserver://localhost:1433;database=StudyManagementDB;user=sa;password=YourPassword;trustServerCertificate=true;"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

4. Run database migrations:

```bash
npm run prisma:migrate:dev
```

5. Generate Prisma client:

```bash
npm run prisma:generate
```

6. Start the development server:

```bash
npm run dev
```

## SQL Server Setup

Before running the application, you need to set up SQL Server:

### Option 1: Local SQL Server

1. Install SQL Server (Express edition is free)
2. Create a database named `StudyManagementDB`
3. Update the `.env` file with your local connection string
4. Run the migrations: `npm run prisma:migrate:dev`

### Option 2: Azure SQL Database

1. Create an Azure SQL Database
2. Update the `.env` file with your Azure connection string:
   ```
   DATABASE_URL="sqlserver://yourserver.database.windows.net:1433;database=StudyManagementDB;user=yourusername;password=yourpassword;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;"
   ```
3. Run the migrations: `npm run prisma:migrate:deploy`

### Option 3: Docker SQL Server

1. Run SQL Server in Docker:
   ```bash
   docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrongPassword" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2019-latest
   ```
2. Connect to the container and create the database:
   ```bash
   docker exec -it <container_id> /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrongPassword -Q "CREATE DATABASE StudyManagementDB"
   ```
3. Update the `.env` file with the Docker container connection string
4. Run the migrations: `npm run prisma:migrate:dev`

## Next Steps

After setting up the database:

1. Install the required dependencies:

   ```bash
   npm install bcryptjs jsonwebtoken
   ```

2. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Test the API endpoints as described in the API Endpoints section

## Database Schema

The system uses the following tables:

- Students - User accounts
- Tasks - Study tasks and assignments
- TaskTags - Tags for categorizing tasks
- TaskTagMapping - Junction table for task/tag relationships
- Attachments - Files attached to tasks
- StudySessions - Time tracking for studying
- Comments - Comments on tasks
- Flashcards - Spaced repetition learning cards
- Quizzes - Self-testing materials
- Questions - Questions in quizzes
- Groups - Study groups
- GroupMembers - Users in study groups
- Leaderboard - Gamification for study progress
- ActivityLog - User activity tracking

## API Endpoints

### Authentication

#### Register a new user

```
POST /api/auth/register
Body: { "email": "user@example.com", "password": "securepassword", "fullName": "User Name" }
```

#### Login

```
POST /api/auth/login
Body: { "email": "user@example.com", "password": "securepassword" }
```

### Tasks

#### Get all tasks

```
GET /api/tasks
Headers: { "Authorization": "Bearer <token>" }
```

#### Create a new task

```
POST /api/tasks
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "title": "Task title",
  "description": "Task description",
  "dueDate": "2023-05-01T15:00:00Z",
  "priority": 1,
  "tags": ["important", "exam"]
}
```

#### Get a specific task

```
GET /api/tasks/{id}
Headers: { "Authorization": "Bearer <token>" }
```

#### Update a task

```
PUT /api/tasks/{id}
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "title": "Updated title",
  "description": "Updated description",
  "completedAt": "2023-05-01T16:00:00Z"
}
```

#### Delete a task

```
DELETE /api/tasks/{id}
Headers: { "Authorization": "Bearer <token>" }
```

## Development

### Prisma Studio

To view and edit the database with a GUI:

```bash
npm run prisma:studio
```

### Database Migrations

After changing the schema.prisma file, create a new migration:

```bash
npm run prisma:migrate:dev --name descriptive_name
```

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
