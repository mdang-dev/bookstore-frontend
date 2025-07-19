# Bookstore Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- Book browsing and search
- Shopping cart
- User authentication (Google OAuth)
- Responsive UI with Tailwind CSS

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/components/` – UI components
- `src/pages/` – Next.js pages and API routes
- `src/utils/` – Utility functions ([src/utils/http-client.ts](src/utils/http-client.ts))
- `src/stores/` – State management
- `src/apis/` – API clients

## Authentication

Google OAuth is configured in [`src/pages/api/auth/[...nextauth].ts`](src/pages/api/auth/[...nextauth].ts).

## API Client

HTTP requests are handled by [`httpClient`](src/utils/http-client.ts).

## License
