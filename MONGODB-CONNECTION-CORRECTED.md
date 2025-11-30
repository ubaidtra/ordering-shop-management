# MongoDB Connection String - Corrected

## Your Original String
```
mongodb+srv://ubaidttech_db_user:tra@tech.281986@cluster0.lxszwnk.mongodb.net/?appName=Cluster0
```

## Issues Found
1. ❌ Password contains `@` symbol → needs URL encoding
2. ❌ Missing database name
3. ❌ Missing required Prisma options (`retryWrites=true&w=majority`)

## Corrected Connection String

### With database name "order_db":
```
mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/order_db?retryWrites=true&w=majority&appName=Cluster0
```

### Breakdown:
- **Username**: `ubaidttech_db_user`
- **Password**: `tra@tech.281986` → Encoded as `tra%40tech.281986`
- **Host**: `cluster0.lxszwnk.mongodb.net`
- **Database**: `order_db`
- **Options**: 
  - `retryWrites=true` (required by Prisma)
  - `w=majority` (required by Prisma)
  - `appName=Cluster0` (optional, from MongoDB Atlas)

## Password URL Encoding

When your password contains special characters, they must be URL encoded:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `,` → `%2C`
- `/` → `%2F`
- `:` → `%3A`
- `;` → `%3B`
- `=` → `%3D`
- `?` → `%3F`
- ` ` (space) → `%20`

Your password `tra@tech.281986` becomes `tra%40tech.281986`

## Usage

### For Local Development (.env)
```env
DATABASE_URL="mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/order_db?retryWrites=true&w=majority&appName=Cluster0"
```

### For Vercel (Environment Variables)
Set `DATABASE_URL` to:
```
mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/order_db?retryWrites=true&w=majority&appName=Cluster0
```

## Testing the Connection

```bash
# Test locally
npx prisma db push

# If successful, you'll see:
# ✓ Prisma schema loaded from prisma\schema.prisma
# ✓ Connected to MongoDB
```

## Alternative Database Names

If you want to use a different database name, replace `order_db` with your choice:
- Production: `furniture_production`
- Staging: `furniture_staging`
- Development: `furniture_dev`

Example with different name:
```
mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/furniture_production?retryWrites=true&w=majority&appName=Cluster0
```

