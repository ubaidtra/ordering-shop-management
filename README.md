# Furniture Ordering System

A complete furniture and material ordering system built with Next.js 14+, Prisma, MongoDB, and NextAuth.js.

## Features

- **Role-based Access Control**: Admin, Operator, and Customer roles
- **Product Management**: Full CRUD operations for products with image uploads
- **Shopping Cart**: Persistent cart stored in database
- **Order Management**: Complete order lifecycle with automatic operator assignment
- **Order Tracking**: Operators can update tracking codes and order status
- **Payment Tracking**: Manual payment status management

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: MongoDB via Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory with:
```
DATABASE_URL="mongodb+srv://traubaid:ubaid@281986@cluster0.cevggcp.mongodb.net/?appName=Cluster0"
NEXTAUTH_URL="http://localhost:5000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

**Note**: 
- Replace `sample_mflix` with your desired database name (e.g., `furniture_ordering`)
- If authentication is required, add credentials: `mongodb://username:password@host/database?ssl=true&authSource=admin`
- Ensure your IP address is whitelisted in MongoDB Atlas Network Access settings

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Seed the database with sample data:
```bash
npx prisma db seed
```

### Default Login Credentials

After seeding, you can login with:

- **Admin**: abdoulkarim@furniture.com / trawally281986
- **Operator**: operator@example.com / operator123
- **Customer**: customer@furniture.com / customerbuy

### Running the Application

```bash
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Vercel (Recommended):**
```bash
npm i -g vercel
vercel
```

**Docker:**
```bash
docker build -t furniture-ordering-system .
docker run -p 5000:5000 --env-file .env.production furniture-ordering-system
```

**PM2 (Traditional Server):**
```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── operator/          # Operator dashboard pages
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout page
│   ├── orders/            # Order history
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── prisma/                # Prisma schema and migrations
└── public/                # Static assets
```

## Database Schema

- **User**: Admin, Operator, and Customer accounts
- **Product**: Product catalog with images
- **Cart**: Shopping cart per user
- **CartItem**: Items in shopping cart
- **Order**: Customer orders
- **OrderItem**: Items in each order

## Features by Role

### Admin
- View dashboard with statistics
- Manage products (CRUD)
- Manage operators (create, activate/deactivate)
- View and manage all orders
- Update order status and payment status

### Operator
- View assigned orders
- Update order status
- Add tracking codes
- View order details

### Customer
- Browse products
- Add products to cart
- Checkout and place orders
- View order history

## Environment Variables

Create a `.env` file in the root directory:

```
DATABASE_URL="your-mongodb-connection-string"
NEXTAUTH_URL="http://localhost:5000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

## License

MIT