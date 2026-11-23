# 🍕 PizzaHub-Client

### Freshly Baked. Always Delicious.

**PizzaHub** is a modern, responsive, full-stack pizza ordering and vendor management platform. It connects customers with pizza vendors through an online marketplace where customers can explore menu items, place orders, and manage their ordering activities.

Vendors can publish and manage menu items, handle customer orders, monitor their business activities, and upgrade their accounts through Premium subscriptions. Administrators can manage users, review menu submissions, and monitor platform transactions.

The client application is built with **Next.js, React, TypeScript, and Tailwind CSS**, and communicates with a separate backend API.

---

## 🚀 Live Demo

**Live Website:** [https://pizzshub-client.vercel.app/](https://pizzshub-client.vercel.app/)

## 📂 GitHub Repositories

- **Client-side Repository:** [PizzaHub Client](https://github.com/bhola16/pizzahub-client)
- **Server-side Repository:** [PizzaHub Server](https://github.com/bhola16/pizzahub-server)

---

## ✨ Features

### 1. 🏠 Homepage

The homepage introduces PizzaHub and highlights its main services.

- Attractive hero section with calls to action.
- Featured menu items.
- Pizza category sections.
- Platform highlights.
- How PizzaHub works section.
- Responsive navigation and footer.

### 2. 🍕 Explore Menu

Customers can browse available menu items from different vendors.

- View available menu items.
- Search menu items by name.
- Filter menu items by category and location.
- Explore item images, descriptions, and prices.
- View vendor information.
- Access individual menu item details.

### 3. 📄 Menu Details

Each menu item has an individual details page.

- View menu item name and images.
- Explore category and description.
- Check price information.
- View vendor information.
- Check available location.
- Access customer ordering options.

Dynamic routing allows individual menu items to be accessed using their unique IDs.

### 4. 🛒 Customer Ordering

Authenticated customers can place orders through the platform.

- Select menu items.
- Provide delivery information.
- Enter delivery address.
- Select delivery date.
- Add optional messages for vendors.
- Check for existing orders for the same item and delivery date.
- Receive success and error notifications.

### 5. 👤 Customer Dashboard

Customers can manage their ordering activities.

- View dashboard statistics.
- View total orders.
- Review pending, accepted, and rejected orders.
- Access order information.
- Cancel eligible pending orders.
- Remove rejected orders.
- Manage personal profile information.

### 6. 🏪 Vendor Dashboard

Vendors can manage their menu items and customer orders.

- View vendor dashboard statistics.
- Add new menu items.
- Upload menu images using ImgBB.
- Edit existing menu items.
- Delete menu items.
- Manage menu item availability.
- Monitor menu item approval status.
- View customer orders.
- Accept or reject pending orders.
- Manage Premium subscriptions.

### 7. 🛡️ Admin Dashboard

Administrators can manage and monitor the platform.

- View overall platform statistics.
- Monitor registered users, customers, and vendors.
- Manage user accounts.
- Search and filter users.
- Filter users by role.
- Block and unblock user accounts.
- Review submitted menu items.
- Approve or reject menu submissions.
- Update menu item availability.
- Delete menu items.
- View and filter payment transactions.
- Monitor subscription and payment information.

### 8. 💎 Premium Subscription

PizzaHub provides Free and Premium subscription options for vendors.

| Feature                 | Free Plan    | Premium Plan |
| ----------------------- | ------------ | ------------ |
| Active Menu Items       | Maximum 3    | Unlimited    |
| Vendor Dashboard        | Included     | Included     |
| Order Management        | Included     | Included     |
| Premium Vendor Badge    | Not included | Included     |
| Featured Menu Placement | Not included | Included     |
| Price                   | Free         | $20          |

Premium subscription payments are handled through Stripe Checkout.

### 9. 🔐 Authentication and Authorization

- Email and password authentication.
- Google authentication.
- Session management using Better Auth.
- JWT authentication support.
- Role-based account types: Customer, Vendor, and Admin.
- Protected routes for authenticated users.
- Role-specific dashboard access.
- Authentication-based redirection.

### 10. 🎨 User Interface

- Fully responsive design.
- Light and dark theme support.
- Interactive animations using Motion.
- Reusable UI components.
- Loading indicators and loading states.
- Toast notifications for success and error messages.
- Custom error and not-found pages.

---

## 🛠️ Technology Stack

### Frontend

- **Next.js 16** – React framework and application routing.
- **React 19** – User interface development.
- **TypeScript** – Static typing and maintainable code.
- **Tailwind CSS 4** – Styling and responsive layouts.
- **Motion / Framer Motion** – Animations and transitions.

### Authentication and Form Handling

- **Better Auth** – Authentication and session management.
- **React Hook Form** – Form handling.
- **Zod** – Schema validation.
- **@hookform/resolvers** – Form validation integration.

### API and Payment Integration

- **Axios** – HTTP client.
- **Fetch API** – Backend API communication.
- **Stripe** – Premium subscription payments.
- **ImgBB API** – Menu image uploads.
- **MongoDB** – Database integration for authentication.

### UI Libraries and Utilities

- **shadcn/ui** – Reusable UI components.
- **Lucide React** – Icons.
- **React Icons** – Additional icon library.
- **Sonner** – Toast notifications.
- **next-themes** – Theme management.

---

## 📁 Project Structure

```text
pizzahub-client/
│
├── public/
│   └── assets/
│
├── src/
│   │
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   ├── vendor/
│   │   │   └── payment/
│   │   ├── menu/
│   │   ├── profile/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   ├── menu/
│   │   ├── providers/
│   │   ├── shared/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── api/
│   │   ├── core/
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   ├── stripe.ts
│   │   └── utils.ts
│   │
│   └── proxy.ts
│
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation and Setup

Follow these steps to run the PizzaHub client application locally.

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended).
- npm.
- Git.

You will also need access to the PizzaHub backend API and the required credentials for the external services.

### 1. Clone the Repository

```bash
git clone https://github.com/bhola16/pizzahub-client.git
```

### 2. Navigate to the Project Directory

```bash
cd pizzahub-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory of the project.

Configure the required environment variables:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXT_PUBLIC_AUTH_URL=http://localhost:3000
MONGODB_URL=your_mongodb_connection_string

# Google Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Image Upload
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Vendor Subscription
NEXT_PUBLIC_UPGRADE_LIMIT=3

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Environment Variable Description

| Variable                    | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL`       | Base URL of the PizzaHub backend API.                  |
| `NEXT_PUBLIC_AUTH_URL`      | Base URL used by the Better Auth client.               |
| `MONGODB_URL`               | MongoDB connection string used by Better Auth.         |
| `GOOGLE_CLIENT_ID`          | Google OAuth client ID.                                |
| `GOOGLE_CLIENT_SECRET`      | Google OAuth client secret.                            |
| `NEXT_PUBLIC_IMGBB_API_KEY` | API key used for uploading menu images to ImgBB.       |
| `NEXT_PUBLIC_UPGRADE_LIMIT` | Free-plan active menu item limit.                      |
| `STRIPE_SECRET_KEY`         | Stripe secret key for server-side payment integration. |

**Important:**

- Replace all placeholder values with your actual credentials.
- Set the backend API URL according to your local or deployed server.
- Configure authentication URLs and Google OAuth callback settings for your environment.
- The backend must be configured with its own required environment variables.
- Never commit `.env.local` or expose private credentials.
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never store private secrets in these variables.

### 5. Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

The following scripts are available in `package.json`:

| Command         | Description                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Starts the Next.js development server. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server.          |
| `npm run lint`  | Runs ESLint to check code quality.     |

---

## 🧭 Application Routes

### Public Routes

| Route        | Description                  |
| ------------ | ---------------------------- |
| `/`          | Homepage                     |
| `/menu`      | Browse and filter menu items |
| `/menu/[id]` | Individual menu item details |
| `/sign-in`   | User sign-in                 |
| `/sign-up`   | User registration            |

### Customer Routes

| Route                        | Description            |
| ---------------------------- | ---------------------- |
| `/profile`                   | Manage user profile    |
| `/dashboard/customer`        | Customer dashboard     |
| `/dashboard/customer/orders` | View and manage orders |

### Vendor Routes

| Route                             | Description                 |
| --------------------------------- | --------------------------- |
| `/dashboard/vendor`               | Vendor dashboard            |
| `/dashboard/vendor/add-menu-item` | Add a new menu item         |
| `/dashboard/vendor/my-menu-items` | Manage submitted menu items |
| `/dashboard/vendor/orders`        | Manage customer orders      |
| `/dashboard/vendor/subscription`  | Manage vendor subscription  |

### Admin Routes

| Route                               | Description                  |
| ----------------------------------- | ---------------------------- |
| `/dashboard/admin`                  | Admin dashboard              |
| `/dashboard/admin/manage-menuItems` | Review and manage menu items |
| `/dashboard/admin/users`            | Manage users                 |
| `/dashboard/admin/transactions`     | Monitor transactions         |

### Payment Routes

| Route                        | Description                                   |
| ---------------------------- | --------------------------------------------- |
| `/dashboard/payment`         | Premium subscription checkout                 |
| `/dashboard/payment/success` | Payment success and subscription verification |
| `/dashboard/payment/cancel`  | Checkout cancellation page                    |

---

## 🔑 Authentication and Data Flow

PizzaHub uses Better Auth for user authentication and session management.

The authentication system supports:

- Email and password sign-in.
- Google OAuth sign-in.
- Session-based authentication.
- JWT token generation and retrieval.
- Additional user information, including account role and subscription plan.

The application uses role-based access to provide different dashboard experiences for customers, vendors, and administrators.

The client communicates with the separate PizzaHub backend API for:

- Menu item management.
- Customer orders.
- Vendor operations.
- Admin operations.
- Subscription and payment-related data.

Profile information is also accessed through the client's Next.js API route at `/api/profile`.

---

## 💳 Payment Integration

PizzaHub uses Stripe Checkout for vendor Premium subscriptions.

The payment flow works as follows:

1. A vendor opens the subscription page.
2. The vendor selects the Premium plan.
3. The client requests a Stripe Checkout session from the backend.
4. The vendor is redirected to the Stripe Checkout page.
5. After checkout, the vendor returns to the success or cancellation page.
6. The success page checks the subscription status through the backend before displaying the verification result.

---

## 🖼️ Image Upload

PizzaHub uses the ImgBB API to upload menu item images.

When a vendor adds or edits a menu item, the application uploads the selected image and uses the returned image URL in the menu item data.

To enable image uploads, configure:

```env
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

---

## 🌙 Theme Support

PizzaHub supports both light and dark themes through `next-themes`.

The theme provider is configured in:

```text
src/components/providers/ThemeProvider.tsx
```

The global application layout wraps the application with the theme provider, allowing shared components and pages to use the selected theme.

---

## 🚀 Deployment

The client application is deployed using **Vercel**.

**Live URL:** [https://pizzshub-client.vercel.app/](https://pizzshub-client.vercel.app/)

To deploy your own instance:

1. Push the client project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables in Vercel Project Settings.
4. Set `NEXT_PUBLIC_API_URL` to your deployed PizzaHub backend URL.
5. Configure authentication and Google OAuth URLs for the deployed domain.
6. Ensure the backend allows requests from the deployed frontend origin.
7. Configure Stripe and ImgBB credentials.
8. Deploy the application.

Make sure the backend, authentication callback URLs, and payment configuration are correctly configured for the production domain.

---

## 🐛 Troubleshooting

### Backend API Connection Error

- Check whether the backend server is running.
- Verify `NEXT_PUBLIC_API_URL`.
- Ensure the backend accepts requests from the client domain.

### Authentication Problems

- Verify `NEXT_PUBLIC_AUTH_URL`.
- Check the MongoDB connection string.
- Confirm Google OAuth credentials and callback configuration.
- Ensure the client and server authentication configurations are compatible.

### Image Upload Error

- Verify `NEXT_PUBLIC_IMGBB_API_KEY`.
- Check the ImgBB API service and upload response.

### Stripe Payment Error

- Verify the backend Stripe configuration.
- Check the Stripe credentials.
- Confirm the Stripe success and cancellation URLs are configured correctly on the backend.

### Menu Items or Orders Not Loading

- Verify that the backend API is available.
- Check authentication and JWT token availability.
- Inspect the browser console and network requests for API errors.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you want to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the application.
5. Commit and push your changes.
6. Open a Pull Request.

---

## 👨‍💻 Author

**Bholanath Bala**

Electronics & Communication Engineering Graduate
Khulna University, Bangladesh

**GitHub:** [@bhola16](https://github.com/bhola16)

---

## 📄 License

No license file was identified in the supplied project source. Please add a `LICENSE` file if you intend to distribute the project under a specific open-source license.

---

\<p align="center">
&#x20; \<strong>🍕 PizzaHub — Freshly Baked. Always Delicious.\</strong>
\</p>
