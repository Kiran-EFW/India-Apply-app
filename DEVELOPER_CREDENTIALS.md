# Developer Credentials

## 🔑 Developer Admin Login

### Credentials:
- **Email:** `developer@applyai.com`
- **Password:** `dev123456`
- **Role:** `admin`
- **Status:** `active`

### Features:
- ✅ Full admin privileges
- ✅ Verified email and phone
- ✅ JWT token authentication
- ✅ Access to all API endpoints

### Usage:
1. **Web App Login:** Use the credentials above in the login form
2. **API Access:** Use JWT token from login response
3. **Testing:** Perfect for development and testing scenarios

### API Endpoints:
- **Login:** `POST /api/auth/login`
- **Profile:** `GET /api/auth/profile` (requires JWT)
- **All Users:** `GET /api/auth/users`

### Example Login Request:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"developer@applyai.com","password":"dev123456"}'
```

### Notes:
- This user is automatically created on first call to `/api/auth/create-developer`
- If user already exists, the endpoint will return existing credentials
- Perfect for development and testing - **DO NOT USE IN PRODUCTION**

---
**Created:** $(Get-Date)
**Environment:** Development
**Security:** Development Use Only
