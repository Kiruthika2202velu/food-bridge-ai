# Backend

This folder is the organized, multi-file version of what used to be one
960-line `server.ts` at the project root. Same endpoints, same in-memory
data, same matching algorithm, same Gemini integration — just split up:

```
backend/
├── data/
│   └── store.ts          in-memory arrays: users, restaurants, ngos, donations, notifications
├── services/
│   ├── geo.ts             Haversine distance calculation
│   ├── matching.ts         weighted AI matching engine (40/30/20/10)
│   └── gemini.ts          lazy Gemini API client
├── routes/
│   ├── health.ts
│   ├── metrics.ts
│   ├── auth.ts
│   ├── restaurants.ts
│   ├── ngos.ts
│   ├── donations.ts
│   ├── ai.ts               matching + food-quality analysis endpoints
│   ├── notifications.ts
│   └── seed.ts
└── index.ts                createApiRouter() — combines all routes, mounted at /api by server.ts
```

## What changed vs. the original single-file server.ts
Nothing in behavior. `server.ts` at the project root now does:
```ts
import { createApiRouter } from './backend';
app.use('/api', createApiRouter());
```
instead of defining ~30 routes and all the seed data inline. The Vite
middleware / production static-serving / `app.listen()` logic in
`server.ts` is untouched, and **nothing under `src/` (the frontend) was
modified.**

## One thing worth knowing about `routes/metrics.ts`
The original `/api/metrics` endpoint pads real counts with fixed
baseline numbers (`+38` restaurants, `+13` NGOs, `+2820` kg, etc.) to
make the demo look like an established platform. This is carried over
unchanged from the original code, and is flagged with a comment in
`routes/metrics.ts`. If you want honest, unpadded numbers instead,
delete those `+ N` offsets — it's a one-line change per field.

## Data persistence
This is still an in-memory store (`data/store.ts`) — no database.
Everything resets when the server restarts. That was true of the
original file too; nothing was changed or downgraded here.
