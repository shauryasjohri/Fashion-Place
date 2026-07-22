const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
}

export default config
