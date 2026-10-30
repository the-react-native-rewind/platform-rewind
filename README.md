# Platform Rewind

The publication site for [platformrewind.com](https://platformrewind.com). It sits over Franz Ríos's newsletters. Today those are [The Agentic Rewind](https://theagenticrewind.com) and [The React Native Rewind](https://thereactnativerewind.com).

The page is a small Next.js app: a subscribe form, a short introduction, a card for each newsletter, and a sponsors section. Newsletter cards and the signup checkboxes both read from `src/lib/newsletters.ts`. Add an entry there, then add a matching adapter in `src/lib/subscribe/providers.ts`.

Logos live in `public/logos/`. The React Native Rewind file is that site's own wordmark. `public/logos/the-agentic-rewind.png` is the approved master (3616×1448, transparent) and is served unchanged. The card scales it with `next/image` width and height plus a max height, so the aspect ratio stays 3616:1448. Do not redraw, recolor, or edit that file.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without provider credentials, development logs the signup and still plays the confirmation animation. The terminal in that animation is labeled as a preview and says nothing was sent.

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploying on Vercel

Import this repository as a Next.js project. Production needs the env vars below or the form will refuse the signup instead of claiming it worked. Point the domain `platformrewind.com` at the project once the name is registered.

Sponsorship mail in the sponsors section goes to `sponsors@platformrewind.com`. Change `src/lib/sponsors.ts` if that address should be something else.

## How the existing sites subscribe people

The sibling repositories are private and were not readable from this environment. This is what the live sites show.

**The Agentic Rewind** (`https://www.theagenticrewind.com`, Next.js) posts `{ email, signup_location, issue, attribution, ph_distinct_id }` to its own `/api/subscribe`. A missing or invalid email returns `400` with `"Enter a valid email address."` A success body includes `delivery`, and the page treats `"sent"` as a real confirmation email and anything else as a demo. DNS agrees with Resend: `links.theagenticrewind.com` is a CNAME to `links2.resend-dns.com`, and `send.theagenticrewind.com` SPF-includes Amazon SES, which is how Resend sends. The adapter creates a Resend contact (`POST https://api.resend.com/contacts`) and puts it in `RESEND_AGENTIC_SEGMENT_ID`. If you still have a legacy audience id, set `RESEND_AGENTIC_AUDIENCE_ID` instead and the adapter calls `POST /audiences/:id/contacts`.

**The React Native Rewind** (`https://thereactnativerewind.com`, Next.js) posts the same shape of JSON to its own `/api/subscribe`. An empty body returns `400` `"Email is required"`. The content API is Strapi Cloud at `https://studio.thereactnativerewind.com` (media host `methodical-heart-16fce671bc.media.strapiapp.com`). Public collections include `issues` and `events`. Subscriber-shaped routes (`/api/subscribers` and the other names tried) are `404`, so the list is not a public Strapi collection. The sending domain is MailerLite: SPF includes `_spf.mlsend.com`, and the domain carries a `mailerlite-domain-verification` TXT record. `links.thereactnativerewind.com` also points at Resend, which fits the confirmation mail the site asks people to find in Gmail, separate from the list itself. The adapter adds the address with MailerLite's `POST https://connect.mailerlite.com/api/subscribers`. A Strapi write is available only as a fallback when MailerLite is unset and `STRAPI_URL` plus `STRAPI_API_TOKEN` are set.

## Environment variables

| Name | Required for a live list | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes, for The Agentic Rewind | Resend API key |
| `RESEND_AGENTIC_SEGMENT_ID` | One of segment or audience | Segment to add the contact to |
| `RESEND_AGENTIC_AUDIENCE_ID` | One of segment or audience | Legacy audience id, used only when the segment id is empty |
| `MAILERLITE_API_KEY` | Yes, for The React Native Rewind | MailerLite API token |
| `MAILERLITE_GROUP_ID` | No | MailerLite group id |
| `MAILERLITE_STATUS` | No | `active`, `unconfirmed`, `unsubscribed`, `bounced`, or `junk` |
| `STRAPI_URL` | Only if MailerLite is unset | Strapi origin, no trailing path |
| `STRAPI_API_TOKEN` | Only if MailerLite is unset | Strapi API token |
| `STRAPI_SUBSCRIBERS_PATH` | No | Defaults to `/api/subscribers` |
| `STRAPI_EMAIL_FIELD` | No | Defaults to `email` |

`VERCEL_ENV=production` without the credentials for a chosen newsletter returns an error for that newsletter. If every chosen newsletter is unconfigured, the response is `503` and the page does not play the success animation. In any other environment, a missing provider is logged as `[platform-rewind] mock subscribe` and the animation runs in preview mode.

One address can succeed while another fails. The response is `207` and the animation names both outcomes. The form also ignores a filled honeypot field named `hp_field`.
