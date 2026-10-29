# Putting the website on Cloudflare

The website is a Cloudflare Worker with a D1 database for form submissions.
Once the steps below are done, every merge to `main` deploys automatically
(GitHub → Actions → **Deploy to Cloudflare**). Until then the deploy job
simply skips itself.

## 1. Domain

1. Add the MBM domain to Cloudflare (Cloudflare dashboard → **Add a domain**)
   and change the domain's name servers at your registrar to the two Cloudflare
   gives you.

## 2. Database

1. Cloudflare dashboard → **Storage & Databases → D1 → Create database**.
2. Name it `mbm-technologies`, location **Western Europe**.
3. Copy the **Database ID** shown on the next page.

## 3. API token for GitHub

1. Cloudflare dashboard → **My Profile → API Tokens → Create Token**.
2. Use the template **Edit Cloudflare Workers**, and also add the permission
   **Account → D1 → Edit**.
3. Copy the token (it is shown once). Also copy your **Account ID**
   (dashboard right-hand side on any domain overview page).

## 4. Tell GitHub

In the GitHub repository → **Settings → Secrets and variables → Actions**:

**Secrets** (hidden):

| Name | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | the token from step 3 |
| `CLOUDFLARE_ACCOUNT_ID` | your Account ID |

**Variables** (visible, not secret):

| Name | Value |
| --- | --- |
| `CF_D1_DATABASE_ID` | the Database ID from step 2 |
| `VITE_SITE_URL` | e.g. `https://mbm-technologies.com` |
| `VITE_COMPANY_LEGAL_NAME`, `VITE_COMPANY_REGISTRATION_NUMBER`, `VITE_COMPANY_ADDRESS` | company details |
| `VITE_CONTACT_EMAIL`, `VITE_PRIVACY_EMAIL` | public email addresses |
| `VITE_CALIBRE_WEBSITE_URL` | CALIBRE website address, once it is live |
| `VITE_TURNSTILE_SITE_KEY` | from step 6 (optional) |

Then GitHub → **Actions → Deploy to Cloudflare → Run workflow**.

## 5. Website secrets (in Cloudflare, not GitHub)

Cloudflare dashboard → **Workers & Pages → mbm-technologies-website →
Settings → Variables and Secrets → Add** (type **Secret**):

| Name | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | password for `/admin` (12+ characters) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | submission alerts (optional) |
| `TURNSTILE_SECRET_KEY` | spam check (optional, pair with the site key) |
| `RATE_LIMIT_SALT` | any long random text |

## 6. Spam check (optional, recommended)

Cloudflare dashboard → **Turnstile → Add widget**, add your domain, mode
**Managed**. Put the **site key** in the GitHub variable
`VITE_TURNSTILE_SITE_KEY` and the **secret key** in the Cloudflare secret
`TURNSTILE_SECRET_KEY`, then run the deploy again.

## 7. Connect the domain and protect the inbox

1. **Workers & Pages → mbm-technologies-website → Settings → Domains & Routes
   → Add → Custom domain**: your domain, and `www.` if wanted.
2. Extra lock on the inbox: **Zero Trust → Access → Applications → Add →
   Self-hosted**, domain `your-domain/admin*`, allow only your own email.
   You then sign in with an email code before the password prompt appears.

## 8. Privacy-friendly visitor counts (optional)

**Analytics & Logs → Web Analytics → Add a site** (no cookies). The website's
security policy already allows Cloudflare Web Analytics.
