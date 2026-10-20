# Reusable Dental Clinic Website

Plain HTML, CSS and JavaScript. No paid tools. Hosts free on GitHub Pages.

## Customise for a new clinic (everything is in `clinic-config.js`)
1. Name, tagline, colours, phone (`phoneDisplay`, `phoneTel`, `whatsapp` as 91XXXXXXXXXX), email, address, city, `mapsUrl`.
2. `hours` (shown) and `schemaHours` (for Google, e.g. `Mo-Sa 09:00-19:00`).
3. `dentist`: name, verified qualifications, registration number, bio, photo. Never invent credentials.
4. `treatments`: set `"enabled": false` for anything the clinic does not offer. You can edit the wording.
5. Put photos in `assets/` and write their paths, e.g. `"assets/clinic.jpg"`. Use only photos the clinic owns or has licensed.
6. `seo.siteUrl` must be the real published address (no trailing slash).
7. Keep the file valid JSON-style (quoted keys, no trailing commas).
8. If you change treatments, city or site URL, run `python3 tools/build.py` to regenerate treatment pages, sitemap and robots.txt. Text and contact details otherwise update without it.

## Appointment form
Default is demo mode: opens WhatsApp with a prefilled message, stores nothing. To send to the clinic, put a form-service URL (e.g. Formspree free plan, an account you create) in `formEndpoint`. No secret keys go in this repo.

## Publish on GitHub Pages
1. Create a new **public** repository on github.com. Upload all files so `index.html` is at the top level.
2. Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)` → Save.
3. After a minute the address appears at the top of that page: `https://USERNAME.github.io/REPO/`. Put it in `seo.siteUrl`, run the build, upload again.
4. To update later: edit a file on GitHub (pencil icon) → Commit.
5. Custom domain (paid, about ₹800–1,000/yr): Pages → Custom domain, then add the DNS records GitHub shows.
6. Public repo means everyone can see it: never upload patient data, passwords, or private keys.

## Before publishing a client site
Replace every `[bracketed]` text; verify phone, WhatsApp, address, hours; test call and WhatsApp links on a real phone; confirm photo permissions; have the privacy page and terms reviewed; check qualifications with the dentist.

## Not done yet / future ideas
Testimonials (only genuine, with permission), separate team page, Telugu language version, image compression, Google Business Profile, backend form with email alerts.
