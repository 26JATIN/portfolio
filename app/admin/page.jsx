'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
    // Set default to dark theme for admin login
    const savedTheme = localStorage.getItem('adminTheme') || 'dark'
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('adminTheme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('adminTheme', 'light')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      console.log('Attempting login with:', { email: credentials.email, password: '***' })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()
      console.log('Login response:', { status: response.status, data })

      if (response.ok) {
        // Login successful
        console.log('Login successful, redirecting to dashboard')
        setSuccess('Login successful! Redirecting...')
        // Use window.location to ensure cookie is available for middleware
        setTimeout(() => {
          window.location.href = '/admin/dashboard'
        }, 500)
      } else {
        console.error('Login failed:', data)
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`absolute top-6 right-6 z-20 p-3 rounded-full transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
            : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900'
        } shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span className="text-lg">
          {darkMode ? '☀️' : '🌙'}
        </span>
      </button>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: darkMode ? 0.1 : 0.1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl ${
            darkMode 
              ? 'bg-gradient-to-br from-indigo-600 to-purple-700' 
              : 'bg-gradient-to-br from-blue-400 to-purple-500'
          }`}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: darkMode ? 0.1 : 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className={`absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl ${
            darkMode 
              ? 'bg-gradient-to-br from-purple-600 to-cyan-700' 
              : 'bg-gradient-to-br from-indigo-400 to-cyan-500'
          }`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-lg">A</span>
            </div>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>Welcome Back</h1>
          <p className={`${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Sign in to your admin dashboard</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`backdrop-blur-lg rounded-3xl p-8 shadow-xl border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-900/80 border-gray-700' 
              : 'bg-white/80 border-white/20'
          }`}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                />
              </div>
              
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-4 py-3 rounded-xl text-sm border ${
                  darkMode 
                    ? 'bg-red-900/20 border-red-800 text-red-400' 
                    : 'bg-red-50 border-red-200 text-red-600'
                }`}
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-4 py-3 rounded-xl text-sm border ${
                  darkMode 
                    ? 'bg-green-900/20 border-green-800 text-green-400' 
                    : 'bg-green-50 border-green-200 text-green-600'
                }`}
              >
                {success}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className={`text-center mt-8 text-sm ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          Protected by advanced security measures
        </motion.div>
      </motion.div>
    </div>
  )
}
