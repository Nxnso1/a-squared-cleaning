# A Squared Cleaning — Vercel export

Complete plain HTML, CSS and JavaScript website. The original blue theme, images, icons and animations are included. No packages, build commands, API keys, environment variables, backend functions or ChatGPT dependencies are required.

## Activate Formspree first

**The form integration is prepared but is not live yet. Your unique Formspree endpoint is still needed.** The business email is **ASquaredCleaning@outlook.com**. No real test email has been sent, and inbox delivery has not been verified.

1. [Create the prepared A Squared Cleaning form](https://formspree.io/claim?name=A%20Squared%20Cleaning%20enquiries&project=a-squared-cleaning&field.name=text%2Crequired%2Cmaxlength%3A120&field.email=email%2Crequired%2Cmaxlength%3A254&field.phone=text%2Cmaxlength%3A40&field.space=text&field.frequency=text&field.size=text%2Cmaxlength%3A160&field.priorities=text%2Cmaxlength%3A1000&action.email=ASquaredCleaning%40outlook.com). Sign in or register with Formspree. The link supplies the existing fields and requests notifications to ASquaredCleaning@outlook.com. Complete any email verification and check that the form's notification recipient is this business address.
2. Copy the form endpoint from Formspree. It starts with https://formspree.io/f/ and ends with your unique form ID. It is a public URL, not a password or API key.
3. Open `form-config.js`, paste that complete URL between the empty quotes on the last line, and save. Deploy the updated files. Alternatively, send the endpoint back in this chat and I can finish the ZIP for you.

Until an endpoint is added, the submit button is disabled and customers are directed to the business email link. That link opens their own email app; it does not send automatically. The page never pretends an enquiry has been sent.

Formspree controls the recipient in its dashboard. Changing the email displayed on the website alone does not change where Formspree sends notifications.

## Deploy on Vercel

**No special Vercel settings are needed.** `index.html` is at the ZIP root.

For Vercel Drop, sign in at https://vercel.com/drop and upload the ZIP. If you have edited `form-config.js`, upload the complete updated folder, or create a new ZIP of its contents with `index.html` at the top level.

For a Git import, put the files at the repository root. Use Framework Preset **Other**, leave Build Command empty and use the project root (`.`) as Output Directory. No Install Command or environment variables are needed.

Official guides:
- https://vercel.com/docs/drop
- https://vercel.com/docs/builds/configure-a-build

## What happens after activation

Name and email are required. Phone, property size and cleaning priorities are optional. The form sends these details directly to Formspree over HTTPS POST. The customer's `email` field provides the standard Reply-To address.

The submit button prevents duplicate clicks while sending. Success appears only after Formspree confirms acceptance; it does not guarantee inbox delivery or confirm a booking. Errors preserve the entered details. If Formspree requests CAPTCHA verification, the visitor can continue through its hosted form flow. A honeypot field supports spam filtering.

Visitors can copy their receipt after a successful submission. The site does not store entries in localStorage or include them in URL query strings. Formspree stores accepted submissions in its dashboard and sends configured notifications. Its account limits still apply.

The form requires JavaScript. Visitors without JavaScript can use the email link.

## Check real delivery

After adding the endpoint, submit a clearly labelled test enquiry from the Vercel site, using a real reply email. Confirm it appears in the Formspree dashboard and arrives at **ASquaredCleaning@outlook.com**; check Junk too. Reply to confirm the customer's address is used. If you enable Formspree domain restrictions, include your Vercel/custom domain.

Local checks use simulated responses for success, server rejection and connection errors. Real email delivery cannot be verified until the endpoint and recipient are activated.

## Remaining launch details

The form requests a quote. It does not reserve an appointment, calculate a final price, confirm a booking or take payment.

The existing broader “Preparing to launch” wording remains. The `<meta name="robots" content="noindex, nofollow">` tag remains too; remove it when the business is ready to appear in search results. The enquiry section and privacy note have been updated for Formspree.

The previous host's viewer permissions do not transfer. Vercel controls access to the new deployment. Add an absolute `og:image` URL for `assets/a-squared-higgsfield-hero.webp` when your new domain is known if you want a predictable social sharing image.

## Files

- `form-config.js`: paste your Formspree endpoint here.
- `index.html`: page content, contact fields and privacy note.
- `enquiry.js`, `contact-form.css`: form submission and status messages.
- `app.js`: tabs, navigation and privacy dialog.
- Other CSS and JavaScript: existing theme and scrolling effects.
- `assets/`: all photos, icons and favicons.
- `source-artwork/`: original icon artwork retained for editing.

No images have been regenerated. The archive excludes hosting manifests, repository history, preview tools and credentials. This export does not change the existing hosted website.

Updated 22 October 2026.
