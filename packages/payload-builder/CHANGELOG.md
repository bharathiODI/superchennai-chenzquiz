# Changelog — @opendesigns/payload-builder

## 0.2.0 — November 2026

Hardened on the ERDC production site (Payload 3.87, Next 16, Azure Container Apps + Blob storage).

### Forms
- **Uploaded files are attached to the admin email.** Up to ~2.8 MB per email in one Microsoft Graph `sendMail`; larger files go through a Graph upload session when the sending mailbox grants **Mail.ReadWrite**, otherwise the email names the file and links to the submission in the dashboard. Nothing fails if the permission is missing (the refusal is remembered for 30 min).
- **No submission delay.** Emails are sent after the response (`next/server` `after()`); if storing the submission failed, the email is sent first because it is the only copy.
- **Dashboard downloads.** Form Submissions gets a *Files* list column (Download) and a *Files* panel on each submission (Download / Open). Files stay staff-only.
- **Word CVs.** Private uploads accept `.doc` and `.docx`. A legacy `.doc` is detected as `application/x-cfb`, which is now allowed too.
- Mail tags: `fileDisplay` lets file fields render as "name (size) — attached / link" instead of an internal URL; the visitor's acknowledgement shows the file name only.
- Uploaded files are only attached when the record exists in the uploads collection and is less than 6 hours old (a client cannot attach someone else's older upload by guessing its name).

### Email
- `graphEmailAdapter` supports nodemailer-style `attachments` and large attachments (draft + upload session + send), throwing `AttachmentsTooLargeError` (`code: 'ATTACHMENTS_TOO_LARGE'`) when it cannot send them.

### Fixes
- Uploads-collection lookup typed for any slug (build error in apps with generated slug unions).

## 0.1.0 — August–October 2026

First release: builder canvas, element registry and standard pack (20 elements), style engine, Layouts, scaffolded content model, Site Settings / SEO / UI Strings / Menus, seven roles, i18n switch, CMS-driven forms (submit, upload, options endpoints, reCAPTCHA, rate limit, JSONL failsafe), Microsoft Graph email adapter, startup migrations, static → CMS content import, search reindex, API key gate, Lexical seed helpers, section copy/paste across pages.
