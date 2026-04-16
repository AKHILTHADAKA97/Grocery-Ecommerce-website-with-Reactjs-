# Project Development Steps

## Step-by-Step Development Flow

## Step 1: Project Setup

1. Initialize React project with Vite.
2. Install dependencies (`react-router-dom`, `framer-motion`, `date-fns`, etc.).
3. Configure Tailwind and base app structure.

## Step 2: Base UI and Routing

1. Create main pages (`Home`, `CategoryPage`, `SearchPage`, admin pages).
2. Add common components (`Navbar`, `Footer`, product cards, drawers).
3. Configure route navigation.

## Step 3: Product and Cart

1. Add product data file.
2. Create cart context to manage add/remove/update quantity.
3. Add cart drawer and order summary.

## Step 4: Checkout and WhatsApp Order

1. Build checkout modal.
2. Add customer details and address fields.
3. Add payment method handling (COD/UPI).
4. Build WhatsApp order message format.

## Step 5: Admin and Order Tracking

1. Save placed orders by date in local storage.
2. Build admin dashboard with calendar and order table.
3. Add order status update feature.
4. Add row-level order view modal for complete details.

## Step 6: Notify Feature

1. Add notify buttons to upcoming products.
2. Store notify requests with product name + email.
3. Add notify requests table in admin dashboard.

## Step 7: Validation and UX

1. Enforce 10-digit Indian phone validation.
2. Keep checkout draft in local storage.
3. Save email in cookie for reuse.
4. Add success popups and clear user messaging.

## Step 8: Build, Lint, and Deploy

1. Run `npm run lint`.
2. Run `npm run build`.
3. Deploy to Vercel/Netlify or Docker.

---

## How Hooks Are Used In This Project

### `useState`

Used for local component state:

- modal open/close control
- form values
- selected date/order
- toast messages

### `useEffect`

Used for side effects:

- restoring form draft from local storage
- saving draft/cookie when values change
- timers or one-time setup

### `useMemo`

Used to optimize derived values:

- totals and summaries
- filtered order/day data
- computed UI lists

### `useCallback`

Used in context providers to keep stable function references:

- `addLine`, `setQty`, `removeLine`, `clear`
- `placeOrder`, `setStatus`

### `useContext`

Used for shared app state without prop drilling:

- cart state via `CartContext`
- order state via `OrdersContext`
- auth/wishlist contexts in related components

---

## Development Best Practices Followed

- Keep UI components reusable.
- Keep shared logic in contexts and utilities.
- Keep persistence logic centralized in helper files.
- Validate user inputs before submit.
- Show clear feedback for user actions.
