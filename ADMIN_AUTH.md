# Admin Authentication System

This portfolio includes a secure admin authentication system using MongoDB, JWT tokens, and HTTP-only cookies.

## Features

- ✅ Secure password hashing with bcrypt
- ✅ JWT-based authentication with HTTP-only cookies
- ✅ Route protection middleware
- ✅ MongoDB integration
- ✅ Session verification
- ✅ Proper logout functionality

## API Endpoints

### Authentication Routes

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify authentication status
- `POST /api/auth/setup` - Setup admin user (development only)

### Protected Routes Example

- `GET /api/admin/protected` - Example protected route

## Environment Variables

Make sure to set these in your `.env.local`:

```bash
# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=portfolio

# Admin credentials
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=admin123

# JWT Secret (use a secure random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Usage

### 1. Setup Admin User

In development, run the setup endpoint to create the admin user:

```bash
curl -X POST http://localhost:3000/api/auth/setup
```

### 2. Login

Use the admin panel at `/admin` or make a direct API call:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

### 3. Creating Protected Routes

Use the `withAuth` middleware for protecting API routes:

```javascript
import { withAuth } from '@/lib/auth'

async function handler(request) {
  // request.user contains authenticated user info
  return NextResponse.json({ message: 'Protected content' })
}

export const GET = withAuth(handler)
```

### 4. Frontend Authentication

The admin layout automatically handles:
- Authentication verification
- Redirecting to login if not authenticated
- Proper logout functionality
- User profile display

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens are stored in HTTP-only cookies for XSS protection
- Middleware protects admin routes automatically
- Database queries use parameterized queries to prevent injection
- Tokens expire after 24 hours

## Database Schema

### Admins Collection

```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // Hashed with bcrypt
  name: String,
  role: String, // 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

## Development vs Production

- Setup endpoint only works in development mode
- Use secure, random JWT secrets in production
- Use HTTPS in production for secure cookie transmission
- Consider implementing additional security measures like rate limiting

## Demo Credentials

- Email: `admin@test.com`
- Password: `admin123`

Change these credentials in production!
