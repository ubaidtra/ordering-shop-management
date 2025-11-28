# Setting Up Environment Variables

## Create .env File

Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL="mongodb+srv://traubaid:ubaid@281986@cluster0.cevggcp.mongodb.net/furniture_ordering?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:5000"
NEXTAUTH_SECRET="furniture-ordering-secret-key-change-in-production"
```

## Important Notes:

1. **Password Encoding**: If your MongoDB password contains special characters like `@`, you may need to URL encode them:
   - `@` becomes `%40`
   - Example: If password is `ubaid@281986`, use `ubaid%40281986` in the connection string

2. **Verify Your MongoDB Credentials**:
   - Username: `traubaid`
   - Password: `ubaid@281986` (or whatever your actual password is)
   - Make sure these are correct in your MongoDB Atlas account

3. **Connection String Format**:
   ```
   mongodb+srv://USERNAME:PASSWORD@HOST/DATABASE?options
   ```

4. **If Authentication Fails**:
   - Double-check your MongoDB Atlas username and password
   - Ensure your IP is whitelisted in MongoDB Atlas Network Access
   - Verify the database name exists or will be created
   - Try the connection string from MongoDB Atlas directly (copy from Atlas dashboard)

## After Creating .env:

1. Push schema to MongoDB:
   ```bash
   npx prisma db push
   ```

2. Create admin user:
   ```bash
   node scripts/create-admin.js
   ```

3. Start the application:
   ```bash
   npm run dev
   ```
