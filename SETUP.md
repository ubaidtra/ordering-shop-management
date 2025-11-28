# MongoDB Setup Instructions

## Database Migration from SQLite to MongoDB

The application has been updated to use MongoDB instead of SQLite.

### Step 1: Update Environment Variables

Create or update your `.env` file with the MongoDB connection string:

```env
DATABASE_URL="mongodb+srv://traubaid:ubaid@281986@cluster0.cevggcp.mongodb.net/furniture_ordering?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:5000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

**Important**: Make sure to add the database name to the connection string if you want to use a specific database. The connection string should look like:

```env
DATABASE_URL="mongodb+srv://traubaid:ubaid@281986@cluster0.cevggcp.mongodb.net/furniture_ordering?retryWrites=true&w=majority"
```

### Step 2: Push Schema to MongoDB

Since we're using MongoDB, use `prisma db push` instead of migrations:

```bash
npx prisma db push
```

This will create the collections in your MongoDB database.

### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

### Step 4: Seed the Database

```bash
npx prisma db seed
```

### Step 5: Start the Application

```bash
npm run dev
```

## Changes from SQLite to MongoDB

1. **IDs**: Changed from `cuid()` to MongoDB `ObjectId` (`@default(auto())`)
2. **Enums**: Now using proper Prisma enums (Role, OrderStatus, PaymentStatus) instead of strings
3. **Relations**: MongoDB uses `@db.ObjectId` for foreign key references
4. **Migrations**: Use `prisma db push` for MongoDB instead of `prisma migrate`

## Troubleshooting

If you encounter connection issues:

1. Check your MongoDB connection string is correct
2. Ensure your IP is whitelisted in MongoDB Atlas (if using Atlas)
3. Verify network connectivity to MongoDB
4. Check MongoDB Atlas connection limits

## Database Structure

The following collections will be created:
- `User` - User accounts
- `Product` - Product catalog
- `Cart` - Shopping carts
- `CartItem` - Cart items
- `Order` - Orders
- `OrderItem` - Order items
