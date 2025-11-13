# Login Cron Job

This script makes a login request to the server every 5 minutes to keep the session alive or for monitoring purposes.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (optional):
   - `SERVER_URL` - Your server URL (default: http://localhost:6500)
   - `CRON_LOGIN_EMAIL` - Email for login (default: sakshi@gmail.com)
   - `CRON_LOGIN_PASSWORD` - Password for login (default: sakshi)

   Add these to your `.env` file:
```env
SERVER_URL=http://localhost:6500
CRON_LOGIN_EMAIL=sakshi@gmail.com
CRON_LOGIN_PASSWORD=sakshi
```

## Usage

Run the cron job:
```bash
npm run cron:login
```

Or directly:
```bash
node cron/loginCron.js
```

## How It Works

- Runs immediately when started
- Then runs every 5 minutes automatically
- Makes a POST request to `/api/user/login` endpoint
- Logs success/failure messages to console

## Stop the Cron Job

Press `Ctrl+C` to stop the cron job.

