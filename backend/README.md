# CRUD Features
- Get Events endpoint work correctly with postman 
- Create login and Register
# Available Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET    | /     | Get welcome message. |
| GET    | /events/getOne/:id | Read and display specific information of event data |
| GET    | /events/getAll | Read and display all the event datas |
| POST   | /events/create | Create event entries |
| PATCH  | /events/update/:id | Update event data by event id |
| DELETE | /events/del/:id | Delete event from the database |
| POST   | /auth/login | Create Login entries |
| POST   | /auth/register | Create register entries |


# How to Run the Project

## frontend (vite)
npm create vite@latest
Select React 
Select Javascript 
cd frontend
npm i
npm run dev
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

