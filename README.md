# High Plains Digital

Static site for [highplains.digital](https://highplains.digital).

**Pitch:** We help companies bring AI solutions to life. A studio that ships. Forward-deployed. Built in Kansas.

All pages are complete. Open any HTML file in a browser (needs network for Tailwind CDN, Google Fonts, and Lucide icons). There is no build step.

## Pages

| Page | Status |
| --- | --- |
| `index.html` | Homepage |
| `how-we-work.html` | Process |
| `services.html` | What we do |
| `work.html` | Problem shapes |
| `contact.html` | Contact form (Resend via `/api/contact`) |

## Deploy

- **Vercel:** point the project at this folder. No build command. `vercel.json` enables `cleanUrls`.
- **GitHub Pages:** serve the HTML files as-is from the repo root or `/docs`.

Visual system is shared across pages (CDN Tailwind, Inter / Manrope / Newsreader, same nav and footer). Copy is High Plains Digital. No Nexus, no pricing, no invented case studies.


## Contact form (Resend)

`api/contact.js` sends the form to kyle@highplains.digital.

In the Vercel project, add:

- `RESEND_API_KEY` — from Resend
- `RESEND_FROM` — optional, default `High Plains Digital <forms@highplains.digital>`
- `CONTACT_TO` — optional, default `kyle@highplains.digital`

Verify `highplains.digital` in Resend so the from-address is allowed.
