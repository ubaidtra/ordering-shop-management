# Deployment Guide

This guide covers deploying the Furniture Ordering System to production.

## Pre-Deployment Checklist

- [ ] Update all environment variables for production
- [ ] Generate a secure `NEXTAUTH_SECRET`
- [ ] Configure MongoDB connection string
- [ ] Set up database and run migrations
- [ ] Test the production build locally
- [ ] Configure image upload storage (if using cloud storage)

## Environment Variables

Create a `.env.production` file or set these in your hosting platform:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-random-secret-key-here-minimum-32-characters"

# Optional: Port (if not using default)
PORT=5000
```

### Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Database Setup

1. **Push schema to production database:**
   ```bash
   npx prisma db push
   ```

2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Seed initial data (optional):**
   ```bash
   npx prisma db seed
   ```

## Build and Test Locally

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Test production build:**
   ```bash
   npm start
   ```

3. **Verify all routes work correctly**

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - Go to Project Settings → Environment Variables
   - Add all required variables

4. **Configure build settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install && npx prisma generate`

### Option 2: Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package.json package-lock.json* ./
   RUN npm ci

   # Generate Prisma Client
   FROM deps AS prisma
   COPY prisma ./prisma
   RUN npx prisma generate

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
   COPY . .
   RUN npm run build

   # Production image
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 5000
   ENV PORT 5000
   ENV HOSTNAME "0.0.0.0"

   CMD ["node", "server.js"]
   ```

2. **Create .dockerignore:**
   ```
   node_modules
   .next
   .git
   .env
   .env.local
   .env*.local
   ```

3. **Build and run:**
   ```bash
   docker build -t furniture-ordering-system .
   docker run -p 5000:5000 --env-file .env.production furniture-ordering-system
   ```

### Option 3: Traditional Server (Node.js)

1. **Install PM2 for process management:**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem.config.js:**
   ```javascript
   module.exports = {
     apps: [{
       name: 'furniture-ordering-system',
       script: 'node_modules/next/dist/bin/next',
       args: 'start -p 5000',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
       },
     }],
   };
   ```

3. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## Production Considerations

### Security

1. **Change default admin password** after first login
2. **Use strong NEXTAUTH_SECRET** (minimum 32 characters)
3. **Enable HTTPS** in production
4. **Restrict MongoDB access** to your server IPs only
5. **Regular security updates** for dependencies

### Performance

1. **Enable caching** for static assets
2. **Use CDN** for images (consider Cloudinary or AWS S3)
3. **Optimize images** before upload
4. **Monitor database performance**

### Monitoring

1. **Set up error tracking** (Sentry, LogRocket, etc.)
2. **Monitor application logs**
3. **Set up uptime monitoring**
4. **Database performance monitoring**

## Post-Deployment

1. **Verify admin login** works
2. **Test customer signup** flow
3. **Test order creation** end-to-end
4. **Check all API endpoints**
5. **Verify image uploads** work (if applicable)

## Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Verify DATABASE_URL is correct
   - Check MongoDB Atlas IP whitelist
   - Ensure credentials are correct

2. **NextAuth errors:**
   - Verify NEXTAUTH_URL matches your domain
   - Check NEXTAUTH_SECRET is set
   - Ensure cookies can be set (HTTPS in production)

3. **Build errors:**
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Verify all dependencies are installed

4. **Image upload issues:**
   - Check file permissions
   - Verify upload directory exists
   - Consider using cloud storage for production

## Support

For issues or questions, check:
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- NextAuth Documentation: https://next-auth.js.org
