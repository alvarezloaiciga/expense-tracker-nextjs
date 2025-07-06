# Authentication Debug Guide

## Issue: 401 Unauthorized Error

You're getting a `AxiosError: Request failed with status code 401` error when trying to access the application.

## Root Cause

The 401 error occurs because:

1. **Missing Backend Server**: The frontend is trying to connect to `http://localhost:3000` but there's no backend server running on that port.

2. **Settings Hook Issue**: The `useSettings` hook was trying to load user settings immediately on mount, before authentication was established.

## Solutions

### 1. Start the Backend Server

You need to start your backend API server on port 3000. The frontend expects the API to be available at `http://localhost:3000`.

If you have a separate backend repository, start it with:
```bash
# In your backend directory
npm run dev  # or whatever command starts your backend server
```

### 2. Authentication Flow

The authentication flow works as follows:

1. User visits the app → redirected to login page
2. User logs in → token stored in localStorage and cookies
3. User redirected to dashboard → API calls include Authorization header
4. If token expires → automatically logged out and redirected to login

### 3. Environment Configuration

Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Fixed Issues

I've fixed the following issues:

- **useSettings Hook**: Now only loads settings when user is authenticated
- **Global Error Handling**: Added response interceptor to handle 401 errors globally
- **Token Management**: Improved token clearing and redirection logic

## Testing the Fix

1. Start your backend server on port 3000
2. Start the frontend: `pnpm dev --port 3001`
3. Visit `http://localhost:3001`
4. You should see the login page
5. After logging in, you should be redirected to the dashboard

## Debug Information

The application now includes better error handling and will:
- Log authentication errors to console
- Automatically redirect to login on 401 errors
- Clear invalid tokens
- Show appropriate loading states

If you're still getting 401 errors, check:
1. Is your backend server running on port 3000?
2. Are the API endpoints working (test with curl or Postman)?
3. Is the authentication token being sent correctly? 