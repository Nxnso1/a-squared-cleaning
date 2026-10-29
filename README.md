# A Squared Cleaning

Plain HTML, CSS and JavaScript for the existing Vercel site. No build step, packages, environment variables or ChatGPT Sites dependencies are required.

## Live release — 29 October 2026

Production: `https://www.asquaredcleaning.co.uk/`

Vercel deployment: `dpl_Eqatw5jH2y2BMwkQLND2BGVijkfj`, READY, with both the www and apex domains assigned. This initial release was uploaded directly through the Vercel API. The same runtime files are maintained in the main branch of `Nxnso1/a-squared-cleaning` for subsequent deployments.

## Quote enquiries

The official BookingKoala lead form collects contact details, property type, cleaning frequency, postcode, cleaning priorities and preferred timing. It requests a quote; it does not create an appointment or take payment.

- Form: `A Squared Cleaning - Quote enquiries`
- Form ID: `8a30eb91-5b26-4ddf-ac12-29ff53bba421`
- Business inbox, notification sender and Reply-To: `enquiries@asquaredcleaning.co.uk`
- Sender name: `A Squared Cleaning`
- The admin `Lead form submitted` notification is enabled. Customer email acknowledgements are not enabled; customers see an on-screen confirmation.
- The site includes a direct form link and an email fallback.
- Existing branding, images, animations and navigation are retained.
- Formspree scripts are removed to avoid duplicate submissions. Keep the Formspree account and prior Vercel deployment available for rollback.

## Verification — 29 October 2026

Labelled tests submitted through the Vercel preview and the live `www.asquaredcleaning.co.uk` embedded form displayed the quote-only thank-you message. BookingKoala Email Logs reported both notifications as **Delivered** to `enquiries@asquaredcleaning.co.uk`, at 07:36 and 07:56 on 29 October 2026 respectively. This confirms the provider delivery status; it is not a claim that the email was opened. No booking, invoice or payment was created.

Microsoft shows the custom domain as Healthy and the new mailbox as the user's primary address. The website and form confirmation now use that address. Microsoft DKIM CNAME records are saved at Wix. Microsoft confirmed **Enabled** and **Signing DKIM signatures for this domain** at 07:54 on 29 October 2026.

The desktop preview loaded all seven image elements without horizontal overflow. The official iframe resizer expanded the form from its 1500px fallback to 2059px. The form accepts submissions, but its thank-you state can retain the previous height and leave extra whitespace. Narrow/mobile visual testing remains outstanding.

## Ongoing setup

- The owner selected the **Growing** plan and is still on trial. BookingKoala documentation confirms Starter/Growing include one custom lead form and collection/viewing of its leads. The separate Leads trial exposes additional Premium features; do not rely on Premium-only funnels, multiple forms or logs without checking entitlement. Keep the live quote form as the retained form after the trial. No plan change or purchase was made by this integration. Sources: https://help.bookingkoala.com/help/leads-module-overview and https://www.bookingkoala.com/pricing/.
- The production custom-domain embed and submission were verified. No domain whitelist is configured; the form works on both the Vercel preview and the custom domain.
- The GitHub repository is `Nxnso1/a-squared-cleaning`, branch `main`. GitHub access was connected on 29 October 2026 to synchronize the live integration. Use this branch for future Vercel deployments.
- The broader pre-launch website wording is preserved. Prices, cleaner availability and payment policies still need business decisions before instant booking can be enabled.

## Deployment

Use the existing Vercel project `a-squared-cleaning` in team `as-quared-cleaning`. Keep its static-site configuration: entry point `index.html` at the repository root, no build command, no install command and no environment variables.

The public domain remains `https://www.asquaredcleaning.co.uk/`; Wix manages DNS. Mailbox DNS changes must preserve the website A and CNAME records. Do not point the website domain to BookingKoala.

Baseline production before this release: `dpl_D2d8Qq39bwL76tNeD6ohhtArQuzS`, commit `5d749a635265c3d1c0f5c32ec4db4b5434e773f8`, using Formspree.
