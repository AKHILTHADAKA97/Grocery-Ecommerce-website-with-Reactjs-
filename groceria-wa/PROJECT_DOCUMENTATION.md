# Groceria Project Documentation

## Overview

Groceria is a frontend ecommerce application built with React and Vite. It provides a WhatsApp-first ordering flow and local admin management without backend dependency.

## Tech Stack

- React 19
- Vite 8
- React Router
- Framer Motion
- date-fns
- Tailwind CSS

## Architecture Summary

- UI pages in `src/pages`
- Reusable components in `src/components`
- Shared state using React Context in `src/context`
- Utility helpers in `src/utils` and `src/lib`
- Product catalog in `src/data/products.js`

## Main Functional Modules

### Storefront

- Displays products and categories
- Supports search
- Supports wishlist and cart actions

### Checkout

- Captures customer details and address
- Validates Indian 10-digit mobile numbers
- Supports COD and UPI payment modes
- Saves checkout draft in local storage
- Stores email in cookie
- Generates WhatsApp order message

### Orders

- Order is created through `OrdersContext`
- Orders are stored by day in local storage
- Admin can view and update status

### Admin Dashboard

- Calendar day-based order listing
- Export selected day order JSON
- Row-level `View` action for complete order/customer modal
- Status update dropdown (`pending`, `completed`, `uncompleted`)
- Notify request table (product + email + time)

### Notify Requests

- Upcoming product cards have `Notify` button
- If email cookie exists, request is saved instantly
- Else popup asks for email and then saves request

## Data Persistence Model

Browser-only persistence:

- Local storage for cart, orders, notify requests, checkout draft
- Cookie for remembered user email

This is suitable for prototype/local workflow. For production-grade scale, replace with backend APIs and database.

## Important Files

- `src/pages/Home.jsx` - storefront + notify flow
- `src/components/CheckoutModal.jsx` - user form and payment flow
- `src/pages/AdminDashboard.jsx` - admin order and notify management
- `src/context/CartContext.jsx` - cart state and total/cod math
- `src/context/OrdersContext.jsx` - order creation and status updates
- `src/utils/orderStorage.js` - order persistence helpers
- `src/utils/notifyStorage.js` - notify persistence helpers

## Scripts

- `npm run dev` - run live local dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - lint project

## Security and Limitations

- No backend authentication for data storage
- Local storage is browser/device specific
- WhatsApp integration is link-based (cannot auto-attach image)

## Recommended Future Improvements

- Move order and notify data to backend DB
- Add role-based admin auth
- Add payment gateway API integration
- Replace static product source with admin-manageable API
