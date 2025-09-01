# 🌤️ Weather Dashboard

A responsive weather dashboard application built with Next.js and Auth0 authentication.

## Features

- **Secure Authentication**: Auth0 integration with domain-restricted access
- **Weather Data**: Real-time weather information for multiple cities
- **Responsive Design**: Mobile-first design that works on all devices
- **Interactive UI**: Click on weather cards for detailed information

## Tech Stack

- **Framework**: Next.js 15.5.2
- **Authentication**: Auth0 SDK
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Package Manager**: pnpm

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with your Auth0 configuration:
   ```env
   AUTH0_SECRET=your-auth0-secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Authentication

- Unauthorized users will see an error message
- Authentication is handled through Auth0 Universal Login

## Project Structure

```
weather-app/
├── app/
│   ├── api/
│   │   ├── auth/[auth0]/     # Auth0 routes
│   │   └── weather/          # Weather API endpoint
│   ├── components/           # React components
│   └── page.tsx             # Main dashboard
├── data/
│   └── cities.json          # City data
└── public/                  # Static assets
```
