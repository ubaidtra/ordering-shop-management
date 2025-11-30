# Production Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

- [ ] **Environment Variables**
  - [ ] Set `DATABASE_URL` to production MongoDB
  - [ ] Set `NEXTAUTH_URL` to production domain (e.g., https://yourdomain.com)
  - [ ] Generate secure `NEXTAUTH_SECRET` (run `npm run generate-secret`)
  - [ ] Verify all environment variables are set

- [ ] **Database**
  - [ ] Create production database
  - [ ] Run `npx prisma db push` on production database
  - [ ] Run `npx prisma generate` to generate client
  - [ ] Seed initial admin user (or create manually)
  - [ ] Verify database connection works

- [ ] **Security**
  - [ ] Change default admin password
  - [ ] Review and update operator passwords
  - [ ] Enable HTTPS/SSL
  - [ ] Restrict MongoDB IP whitelist to production server
  - [ ] Review API route security

- [ ] **Build & Test**
  - [ ] Run `npm run build` successfully
  - [ ] Test `npm start` locally with production build
  - [ ] Verify all pages load correctly
  - [ ] Test authentication flow
  - [ ] Test order creation flow

## Deployment

- [ ] **Choose deployment platform**
  - [ ] Vercel (recommended for Next.js)
  - [ ] Docker container
  - [ ] Traditional server (PM2)
  - [ ] Other platform

- [ ] **Deploy application**
  - [ ] Follow platform-specific deployment steps
  - [ ] Set environment variables in hosting platform
  - [ ] Verify deployment successful

## Post-Deployment

- [ ] **Verify Functionality**
  - [ ] Homepage loads correctly
  - [ ] Admin login works
  - [ ] Customer signup works
  - [ ] Product browsing works
  - [ ] Cart functionality works
  - [ ] Order creation works
  - [ ] Operator dashboard works

- [ ] **Monitoring**
  - [ ] Set up error tracking
  - [ ] Monitor application logs
  - [ ] Set up uptime monitoring
  - [ ] Monitor database performance

- [ ] **Documentation**
  - [ ] Update production URLs in documentation
  - [ ] Document any custom configurations
  - [ ] Share credentials securely with team

## Quick Commands

```bash
# Generate secure secret
npm run generate-secret

# Build for production
npm run build

# Test production build
npm start

# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```


