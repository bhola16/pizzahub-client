# 🍕 PizzaHub

### Freshly Baked. Always Delicious.

**PizzaHub** is a modern, responsive, full-stack pizza ordering and vendor management platform built with Next.js, React, TypeScript, Tailwind CSS, and Express.js.

The platform connects customers with pizza vendors through an online menu marketplace. Customers can explore menu items, place orders, and track their ordering activities. Vendors can publish and manage menu items, handle customer orders, and upgrade their accounts through Premium subscriptions. Administrators can manage users, moderate menu submissions, and monitor subscription transactions.

PizzaHub aims to provide a convenient food ordering experience while helping vendors manage their businesses through a centralized platform.

---

## 🚀 Live Demo

🔗 **Live Website:** [Visit PizzaHub](https://pizzshub-client.vercel.app)

## 📂 GitHub Repositories

- **Client-side:** [PizzaHub Client](https://github.com/bhola16/pizzahub-client)
- **Server-side:** [PizzaHub Server](https://github.com/bhola16/pizzahub-server)

---

## ✨ Features

### 1. 🏠 Homepage

The homepage introduces PizzaHub and highlights its main services.

- Hero section with calls to action.
- Featured menu items.
- Pizza category sections.
- Platform highlights.
- How PizzaHub works section.
- Responsive navigation and footer.

### 2. 🍕 Explore Menu

Customers can browse available menu items from different vendors.

- View available menu items.
- Search menu items.
- Filter by category and location.
- Explore item images, descriptions, and prices.
- View vendor information.
- Access individual menu item details.

### 3. 📄 Menu Details

Each menu item has an individual details page.

- Menu item name and images.
- Category and description.
- Price information.
- Vendor information.
- Available location.
- Customer ordering options.

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
- Cancel pending orders when applicable.
- Remove rejected orders.

### 6. 🏪 Vendor Dashboard

Vendors can manage their menu items, customer orders, and subscriptions.

- View vendor dashboard statistics.
- Monitor total and active menu items.
- Review incoming orders.
- Track order statuses.
- Manage menu items.
- Access subscription information.

### 7. ➕ Add Menu Items

Vendors can publish new menu items.

Menu item information includes:

- Item name.
- Category.
- Description.
- Price.
- Location.
- Item images.

Additional functionality:

- Image uploads using ImgBB.
- Form validation.
- Backend API integration.
- Toast notifications.
- Configurable menu item limits.

### 8. 📝 Manage Menu Items

Vendors can manage their published menu items.

- View personally created menu items.
- Edit existing menu information.
- Update images and descriptions.
- Change item availability.
- Delete menu items.
- Receive operation feedback.

### 9. 📦 Vendor Order Management

Vendors can manage orders received from customers.

- View incoming orders.
- Review customer information.
- Check delivery addresses and dates.
- Read customer messages.
- Accept orders.
- Reject orders.
- Track order statuses.

### 10. 💎 Free and Premium Subscriptions

PizzaHub provides subscription options for vendors.

- View current subscription plan.
- Review Premium plan information.
- Check subscription status.
- Upgrade to Premium.
- View subscription details.
- Cancel an active subscription.
- Apply configurable menu item limits.

### 11. 💳 Stripe Payment Integration

PizzaHub integrates Stripe Checkout for Premium subscriptions.

- Create Stripe Checkout sessions.
- Redirect users to Stripe-hosted checkout.
- Support recurring subscription payments.
- Handle payment success and cancellation redirects.
- Retrieve subscription information.
- Cancel active subscriptions.
- Process Stripe webhook events on the backend.

The backend verifies Stripe webhook signatures before updating subscription information. Premium access is activated through verified backend payment events rather than relying only on frontend redirects.

The current backend configuration defines the Premium subscription as USD 20 per month.

### 12. 🛡️ Admin Dashboard

Administrators can monitor and manage platform activities.

- View total users.
- View vendor and customer counts.
- Monitor total menu items.
- Track pending menu submissions.
- View subscription transaction statistics.

### 13. 👥 User Management

Administrators can review registered platform users.

- View registered users.
- Search user information.
- Review user details.
- Monitor customer and vendor accounts.

### 14. ✅ Menu Item Moderation

Administrators can manage menu submissions across the platform.

- View all menu items.
- Search menu items.
- Filter by category and status.
- Approve pending menu items.
- Reject menu submissions.
- Activate or deactivate menu items.
- Delete menu items.

### 15. 💰 Transaction Management

Administrators can review subscription transaction records.

- View transaction information.
- Search transactions.
- Filter by subscription plan.
- Filter by payment status.
- Review payment amounts and currencies.
- Monitor subscription revenue.

### 16. 🔐 Authentication and Authorization

PizzaHub uses **Better Auth** for authentication and session management.

Supported authentication methods:

- Email and password.
- Google sign-in.

The application provides role-based access for:

- **Customer:** Browse menu items, place orders, and manage personal orders.
- **Vendor:** Manage menu items, handle orders, and manage subscriptions.
- **Admin:** Manage users, moderate menu items, and monitor transactions.

JWT-based authorization is used for authenticated communication between the client and backend API.

### 17. 👤 User Profile

Authenticated users can access their profile information.

- View personal information.
- Display user name and email.
- Display profile image when available.
- Access account-related information.

### 18. 🌙 Dark and Light Mode

PizzaHub supports light and dark themes using `next-themes`.

- Switch between light and dark appearance.
- Maintain consistent styling across application pages.
- Improve the browsing experience in different lighting conditions.

### 19. 🔔 Toast Notifications

The application uses **Sonner** for user feedback.

- Success notifications.
- Validation messages.
- API error notifications.
- Order operation feedback.
- Menu management notifications.
- Payment-related notifications.

### 20. ⏳ Loading and Error Handling

The application includes user-friendly loading and error interfaces.

- Loading indicators.
- Empty states.
- API error handling.
- Retry functionality where supported.
- Custom not-found pages.
- Menu-specific loading and error interfaces.

### 21. 📱 Responsive Design

Built with Tailwind CSS, PizzaHub adapts to different screen sizes.

- **Mobile:** Responsive navigation, menu browsing, and dashboard layouts.
- **Tablet:** Flexible grids and adaptive spacing.
- **Desktop:** Expanded menu cards, dashboards, and management interfaces.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| --- | --- |
| Next.js 16 | React framework and App Router |
| React 19 | User interface development |
| TypeScript | Type-safe application code |
| Tailwind CSS 4 | Styling and responsive layouts |
| shadcn/ui | Reusable UI components |
| Better Auth | Authentication and session management |
| MongoDB | Database and authentication data storage |
| Express.js 5 | Backend REST API |
| Node.js | Backend runtime |
| Stripe | Subscription payments and checkout |
| ImgBB | Image hosting |
| React Hook Form | Form management |
| Zod | Schema validation |
| Sonner | Toast notifications |
| Lucide React | Icons |
| React Icons | Additional icons |
| Motion | UI animations |
| next-themes | Theme management |
| Vercel | Client-side deployment |

---

## 🔗 Application Architecture

PizzaHub follows a separate client-server architecture.

```text
             ┌─────────────────────────┐
             │     PizzaHub Client     │
             │     Next.js / React     │
             └────────────┬────────────┘
                          │
                    REST API / JWT
                          │
             ┌────────────▼────────────┐
             │     PizzaHub Server     │
             │       Express.js        │
             └────────────┬────────────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
          MongoDB       Stripe       ImgBB
          Database     Payments      Images
```

- **Next.js:** Provides the frontend application and dashboards.
- **Express.js:** Handles backend REST API operations.
- **MongoDB:** Stores application and authentication data.
- **Better Auth:** Manages authentication and sessions.
- **JWT:** Supports authenticated client-server communication.
- **Stripe:** Handles vendor Premium subscriptions.
- **ImgBB:** Provides image hosting for uploaded images.

For backend implementation details, visit the [PizzaHub Server Repository](https://github.com/bhola16/pizzahub-server).

---

## 📂 Project Structure

The main client-side project structure is organized as follows:

```text
pizzahub-client/
│
├── public/
│   └── assets/
│
├── src/
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
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
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
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation and Setup

Follow these steps to run PizzaHub locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- MongoDB database or connection string.
- Google OAuth credentials if Google sign-in is required.
- ImgBB API key for image uploads.
- Stripe account for subscription payment testing.

The PizzaHub backend must also be configured and running.

### 1. Clone the Client Repository

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

Create a `.env.local` file in the project root.

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth application URL
NEXT_PUBLIC_AUTH_URL=http://localhost:3000

# MongoDB connection
MONGODB_URL=your_mongodb_connection_string

# Google OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB API key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Vendor menu item upgrade limit
NEXT_PUBLIC_UPGRADE_LIMIT=3
```

Replace the placeholder values with your actual credentials.

**Important:**

- Never commit environment files or secrets to GitHub.
- Keep database credentials and OAuth secrets private.
- Variables prefixed with `NEXT_PUBLIC_` are accessible in the browser.
- Configure Stripe secret keys and webhook signing secrets only in the backend environment.

### 5. Configure Google Authentication

To enable Google sign-in:

1. Create an OAuth application in Google Cloud Console.
2. Configure the authorized JavaScript origin.
3. Configure the callback URL required by Better Auth.
4. Add the Google client ID and client secret to the environment variables.
5. Configure production OAuth settings when deploying.

### 6. Configure the Backend

Clone the server repository separately:

```bash
git clone https://github.com/bhola16/pizzahub-server.git
cd pizzahub-server
npm install
```

Configure the backend environment variables according to the server repository.

Example configuration:

```env
MONGODB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
PORT=8000

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Configure any additional authentication and database variables required by the server.

Start the backend:

```bash
npm run dev
```

The backend should be available at:

```text
http://localhost:8000
```

See the [PizzaHub Server Repository](https://github.com/bhola16/pizzahub-server) for complete backend instructions.

### 7. Start the Client

Open another terminal in the client project directory:

```bash
npm run dev
```

### 8. Open the Application

Visit:

```text
http://localhost:3000
```

PizzaHub should now be running locally.

---

## 📦 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint checks |

---

## 🔐 Authentication and Authorization

PizzaHub uses Better Auth for authentication and session management.

### Authentication Methods

- Email and password.
- Google OAuth.

### Role-Based Access

| Role | Permissions |
| --- | --- |
| Customer | Browse menu items, place orders, and manage personal orders |
| Vendor | Manage menu items, handle orders, and manage subscriptions |
| Admin | Manage users, moderate menu items, and monitor transactions |

The client obtains authentication session information through Better Auth. Authenticated API requests use JWT-based authorization, while the backend verifies access before processing protected operations.

---

## 💳 Stripe Subscription and Webhook Integration

Stripe Checkout handles Premium subscription payments for vendors.

### Payment Flow

1. Vendor selects the Premium subscription.
2. Client requests a Checkout Session from the backend.
3. Backend creates the Stripe Checkout Session.
4. Vendor completes payment through Stripe.
5. Stripe sends a webhook event to the backend.
6. Backend verifies the webhook signature.
7. Backend updates the subscription information.
8. Client retrieves the latest subscription status.

### Webhook Events

The backend handles relevant Stripe subscription events, including:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Security:** Subscription status must be updated through verified backend webhook events, not simply through a frontend payment success redirect.

For local testing, configure Stripe CLI or a Stripe webhook endpoint to forward events to the backend.

---

## 🔄 Application Flow

```text
                 User visits PizzaHub
                         |
                         v
                   Explore Menu
                         |
                         v
                Search and Filter Items
                         |
                         v
                 View Menu Details
                         |
                         v
                 User Authentication
                         |
              ┌──────────┴──────────┐
              |          |         |
              v          v         v
           Customer    Vendor     Admin
              |          |         |
              v          v         v
          Place       Manage     Manage
          Orders      Menu       Users
              |          |         |
              v          v         v
          Track       Manage     Moderate
          Orders      Orders     Menu Items
                         |
                         v
                   Premium Upgrade
                         |
                         v
                   Stripe Checkout
                         |
                         v
                  Verified Webhook
                         |
                         v
                 Premium Activation
```

---

## 🌙 Theme Management

PizzaHub supports light and dark themes using `next-themes`.

The shared theme provider manages the application appearance, while the theme toggle allows users to switch between themes.

---

## 🚀 Deployment

The client application is deployed on **Vercel**.

**Live Website:** [PizzaHub](https://pizzshub-client.vercel.app)

### Client Deployment

1. Push the client repository to GitHub.
2. Import the repository into Vercel.
3. Select Next.js as the framework.
4. Configure the required environment variables.
5. Set the production backend API URL.
6. Configure MongoDB and Better Auth settings.
7. Configure Google OAuth callback URLs.
8. Deploy the application.
9. Verify authentication, menu browsing, dashboards, and API operations.

### Backend Deployment

1. Deploy the server repository to a Node.js-compatible hosting platform.
2. Configure MongoDB connection settings.
3. Configure the production frontend