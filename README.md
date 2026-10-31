# ShopEase - Customer E-Commerce Website

A modern, responsive customer e-commerce website built with HTML5, Tailwind CSS v4, and Vanilla JavaScript. Product data is fetched from the Fake Store API. Authentication, cart, and orders are managed entirely in the browser using localStorage.

## Features

- Browse products with search, category filter, and sorting
- Product details with related products
- Customer registration and login (frontend-only)
- Protected pages and actions for authenticated customers
- Shopping cart with per-customer persistence
- Checkout with Cash on Delivery and Manual Mobile Payment (demo)
- Order placement, order history, and order details
- Customer profile management
- Responsive navigation bar and footer
- Toast notifications

## Technology Stack

- HTML5
- Tailwind CSS v4 (CLI)
- Vanilla JavaScript (ES6+)
- ES Modules
- Fetch API
- Fake Store API
- Browser localStorage
- Lucide Icons
- npm

## Project Structure

See the repository root. All JavaScript files live directly in `src/js/`.

## API Information

Base URL: `https://fakestoreapi.com`

Endpoints used: `/products`, `/products/:id`, `/products?limit=n`, `/products?sort=desc`, `/products/categories`, `/products/category/:category`.

## Installation

```bash
npm install
```

## Tailwind CSS Setup

```bash
npm run dev    # watch mode
npm run build  # minified production build
```

## How to Run

1. Install dependencies: `npm install`
2. Build CSS: `npm run build`
3. Serve the project with any static server, e.g. `npx serve .` or `python3 -m http.server 8080`
4. Open `http://localhost:8080/index.html`

## Customer Authentication

Authentication is frontend-only and stored in localStorage. It is for demonstration only and is not secure. Do not use real passwords or sensitive data.

## LocalStorage Data Management

Storage keys:

- `customers` - registered customer accounts
- `current_customer` - logged-in customer
- `customer_carts` - carts grouped by customer ID
- `customer_orders` - orders grouped by customer ID

## Limitations and Security Notes

- No backend or database; all data is stored in the browser.
- Fake Store API write operations are not persisted.
- localStorage authentication is insecure and not production-ready.
- No admin dashboard or admin authentication.
