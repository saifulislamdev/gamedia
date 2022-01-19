# Gamedia

Social media site for gamers built using React, Node.js, Express.js, and PostgreSQL (PERN stack)

## Setup

1. Install [Node.js](https://nodejs.org/en/) (if you haven't already)
2. Install [Postgres](https://github.com/CUNYTechPrep/ctp2019/blob/master/guides/installing-postgresql.md) (if you haven't already)
3. Clone this app

```bash
git clone https://github.com/saifulislamny/gamedia
```

4. Create a .env file in resulting folder

```bash
cd gamedia/
touch .env
```

5. Provide environment variables in .env (example values are shown below - feel free to have different values)

```
# Port Number for API
PORT=5000

# Database config
DB_USERNAME=ctp_user
DB_PASSWORD=ctp_pass
DB_DATABASE=Gamedia
DB_HOST=127.0.0.1
```

## Running the app

For local development you will need two terminals open, one for the API and another for the client.

1. Backend terminal

```bash
npm install
npm run dev
```

2. Frontend terminal

```bash
cd client/
npm install
npm start
```

3. Go to <http://localhost:PORT> for viewing the backend (e.g. <http://localhost:5000> if you specified the PORT to be 5000 in your .env file)
4. Go to <http://localhost:3000> for viewing the frontend

In production, only a single app is deployed. The react client will build into static files that will be served from the backend.

## Improvements

### Backend

- More readable code in `/api/models/`
- Address TODO comments
