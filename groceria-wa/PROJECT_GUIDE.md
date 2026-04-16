# Groceria Project Guide

## 1) Project Purpose

`groceria-wa` is a React + Vite ecommerce storefront with:

- Product listing and category browsing
- Cart and wishlist
- Checkout modal with COD and UPI flow
- WhatsApp order message generation
- Admin dashboard for order tracking and status updates
- Local storage based persistence (orders, cart, notify requests)

## 2) How To Run Project Locally

### Prerequisites

- Node.js `18+` (recommended latest LTS)
- npm (comes with Node.js)

### Install

```bash
npm install
```

### Start Development Server (Live Local)

```bash
npm run dev
```

After this, open the local URL shown in terminal (usually `http://localhost:5173`).

### Build For Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Lint

```bash
npm run lint
```

## 3) How To Make Project Live

Use one of these options:

### Option A: Vercel / Netlify (quick)

1. Push code to GitHub.
2. Import repository in Vercel or Netlify.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy.

### Option B: Docker Deployment

- This repo already contains `Dockerfile`, `docker-compose.yml`, and `DOCKER.md`.
- Follow the exact steps in `DOCKER.md` for container-based live deployment.

## 4) Important Local Data Keys

The app currently stores data in browser storage:

- `groceria_cart` - cart lines
- `groceria_orders_by_day` - order map for admin
- `groceria_checkout_form` - saved checkout form draft
- `groceria_notify_requests` - notify me requests
- cookie `groceria_user_email` - remembered email

## 5) Key Screens

- Home storefront
- Search and category pages
- Cart drawer and checkout modal
- Admin login
- Admin dashboard (orders + notify table)

## 6) Point-To-Point (Step Pin To Pin)

1. Open storefront.
2. Add products to cart.
3. Open checkout and fill user details.
4. Select payment method (COD or UPI).
5. Submit order -> WhatsApp opens with prepared message.
6. Open admin dashboard.
7. Select date and review orders.
8. Click `View` for complete customer and order details.
9. Update order status.
10. Review notify request table for upcoming products.

## 7) Troubleshooting

- If app does not start, remove `node_modules` and reinstall with `npm install`.
- If port busy, run `npm run dev -- --port 5174`.
- If no orders visible in admin, check same browser where orders were placed (storage is local).
