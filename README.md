# Nathan's Clothes — Premium Dark Streetwear E-Commerce

Full-stack, responsive e-commerce web application for **Nathan's Clothes** built with React, TanStack Start, Tailwind CSS, and Supabase.

## Features
- **Monochrome & Streetwear Aesthetic**: Clean typography, high-impact product presentation, smooth interactions, and responsive layouts.
- **Direct Bank Transfer Payment**: 1-click bank details copy, dynamic unique order reference (`CK-XXXXXXXX`), and receipt proof upload.
- **Guest & Customer Order Tracking**: Instant tracking using order reference + phone number with receipt re-upload.
- **Store Administration Dashboard**:
  - Review orders, inspect payment receipts with signed URLs, approve or decline orders with admin notes.
  - Manage product catalogue with direct image uploads.
  - Update store settings (bank accounts, instructions, WhatsApp number, contact details).
  - Appoint new admins by email.

## Development

```sh
npm install
npm run dev
```

## Deployment to Vercel

```sh
npm run build
```
Deploy via Vercel CLI or connect the repository to Vercel (preset mapped via `vercel.json` and Nitro).
