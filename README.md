# Streaky

A one-page streak counter for two people. Each visits the page and taps their
button; once both have tapped for the day, the streak goes up by one. Miss a
day (only one of you clicks, or neither) and it resets to 0.

## Before deploying

Open [app/page.tsx](app/page.tsx) and change the `NAMES` object at the top to
your names.

The starting streak (186) lives in [lib/streak.ts](lib/streak.ts) as
`STARTING_STREAK`, and only applies the very first time the app runs (before
any data exists in the database).

## Deploy to Vercel

1. Push this repo to GitHub and import it into Vercel.
2. In the Vercel project, go to **Storage** → **Create Database** → **KV**
   (Upstash Redis), and connect it to this project. Vercel will automatically
   add the required `KV_*` environment variables.
3. Deploy. Open the URL on both of your phones.

## Local development

```
npm install
vercel env pull .env.local   # pulls the KV_* env vars from your Vercel project
npm run dev
```
