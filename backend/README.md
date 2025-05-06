# Project Iteration#1 - Task#7 & #8: CRUD Operations and Integration

## Overview
This project implements full CRUD operations (Create, Read, Update, Delete) with integration between a React frontend and a Hono backend using Prisma for database management. 

## Features
- Create event entries
- Read and display event data
- Update event data
- Delete event from the database
// others features
- Frontend-backend integration via RESTful API
- CORS properly handled in backend

## How to Run the Project

### Backend (Hono + Prisma)
# Go to the backend directory
cd backend

# Install dependencies
npm install

# make change to the database
npx prisma migrate dev

# update Prisma Client
npx prisma generate

# update the Prisma schema
npx prisma db pull

# Run the server
npm run dev