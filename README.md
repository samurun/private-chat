# Private Chat

A real-time private chat application built with Next.js, ElysiaJS, and Upstash.

This project is inspired by [joschan21/nextjs16_realtime_chat](https://github.com/joschan21/nextjs16_realtime_chat).

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Backend**: [ElysiaJS](https://elysiajs.com/) (integrated within Next.js)
- **Real-time**: [Upstash Realtime](https://upstash.com/docs/realtime) & [Redis](https://upstash.com/docs/redis)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Base UI](https://base-ui.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: React Hooks & TanStack Query
- **Utilities**: `nanoid`, `date-fns`, `zod`

## 🛠️ How to Use

### 1. Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- An [Upstash](https://upstash.com/) account for Redis and Realtime.

### 2. Installation

Clone the repository and install dependencies:

```bash
bun install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add your Upstash credentials:

```bash
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

### 4. Running the Project

Start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (shadcn/ui).
- `screens/`: Page-specific screen components.
- `lib/`: Utility functions and shared logic.
- `hooks/`: Custom React hooks.
- `proxy.ts`: ElysiaJS backend/proxy logic.

## 🔗 Reference

Original concept and inspiration: [joschan21/nextjs16_realtime_chat](https://github.com/joschan21/nextjs16_realtime_chat)
