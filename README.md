# Redux Shopping Cart

A full-stack shopping cart application using React, Redux Toolkit, Material UI, Express, and MongoDB.

## Tech Stack

- Frontend: React 18, Vite, Material UI, Redux Toolkit
- Backend: Node.js, Express, Mongoose
- State: Redux Toolkit with localStorage persistence
- Database: MongoDB

## Project Structure

- `client/`: React frontend
- `server/`: Express API and MongoDB models

## Required Setup

### Backend `.env`

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/redux-shopping-cart
CLIENT_URL=http://localhost:5173
```

If you use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### Frontend `.env`

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Install

```bash
npm run install:all
```

## Seed Products

```bash
npm run seed
```

## Run

Open two terminals:

```bash
npm run dev:server
```

```bash
npm run dev:client
```

## Features

- Redux Toolkit store configuration
- Cart slice with add/remove/update/clear reducers
- localStorage cart persistence
- Product catalog fetched from backend
- Server-side cart sync by session id
- Professional cart summary and checkout-ready API structure

