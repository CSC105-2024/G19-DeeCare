# CRUD Features
- Get Events endpoint work correctly with postman 
- Create login and Register
# Available Endpoints

| Method |        Route       |    Description   |
| :...: | :...: |  :...: |
| Get    | /  | Get welcome message. |
| Get    | /events/getOne/:id  | Read and display specific information of event data |
| Get    | /events/getAll  |  Read and display all the event datas |
| Post   | /events/create  | Create event entries |
| Patch  | /events/update/:id | Update event data by event id |
| Delete | /events/del/:id | Delete event from the database | 
| Post   | /auth/login  | Create Login entries |
| Post   | /auth/register  | Create register entries |

# How to Run the Project

## Backend (Hono + Prisma)
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