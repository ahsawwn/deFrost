# Admin User Seeding Guide

This guide explains how to create an admin user for the DeFrost application.

## Method 1: Using the API Route (Recommended)

You can create an admin user by making a POST request to the seed API endpoint.

### Using cURL:

```bash
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@defrost.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

### Using fetch (Browser Console):

```javascript
fetch('/api/admin/seed', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@defrost.com',
    password: 'admin123',
    name: 'Admin User'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Method 2: Using the Seed Script

### Prerequisites

Install `tsx` if you haven't already:

```bash
npm install -D tsx
```

### Run the Script

**Default credentials:**
```bash
npm run seed:admin
```

This will create an admin user with:
- Email: `admin@defrost.com`
- Password: `admin123`
- Name: `Admin User`

**Custom credentials:**
```bash
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword ADMIN_NAME="Your Name" npm run seed:admin
```

Or using environment variables in a `.env.local` file:

```env
ADMIN_EMAIL=admin@defrost.com
ADMIN_PASSWORD=securepassword123
ADMIN_NAME=Admin User
```

Then run:
```bash
npm run seed:admin
```

## Default Admin Credentials

After seeding, you can login with:

- **Email:** `admin@defrost.com`
- **Password:** `admin123`
- **Login URL:** `/admin/login` or `/login`

⚠️ **Important:** Change the default password after first login!

## Security Notes

1. The admin user is automatically email-verified (no verification code needed)
2. Passwords are hashed using bcrypt with 10 rounds
3. The script checks if a user with the email already exists
4. Admin users have the `admin` role which grants access to all admin features

## Troubleshooting

### User Already Exists

If you get an error that the user already exists:
- Delete the existing user from the database, or
- Use a different email address

### Database Connection Error

Make sure your `DATABASE_URL` is set correctly in `.env.local`:
```env
DATABASE_URL=your_database_connection_string
```

### Script Not Found

If `tsx` is not installed:
```bash
npm install -D tsx
```

## Next Steps

After creating the admin user:

1. Login at `/admin/login`
2. Access the admin dashboard at `/admin/dashboard`
3. Change your password in settings
4. Start managing products, orders, and inventory!

