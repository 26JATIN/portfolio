'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Lenis from '@studio-freight/lenis'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode
  const [user, setUser] = useState(null)
  const mainContentRef = useRef(null)
  const lenisRef = useRef(null)
  
  useEffect(() => {
    setIsVisible(true)
    // Default to dark theme
    const savedTheme = localStorage.getItem('adminTheme') || 'dark'
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    }

    // Check authentication status
    if (pathname !== '/admin') {
      checkAuth()
    }
  }, [pathname])

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...')
      const response = await fetch('/api/auth/verify')
      console.log('Auth check response:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Auth check successful:', data.user)
        setUser(data.user)
      } else {
        console.log('Auth check failed, redirecting to login')
        // Not authenticated, redirect to login
        window.location.href = '/admin'
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      window.location.href = '/admin'
    }
  }

  // Initialize Lenis for admin content
  useEffect(() => {
    if (mainContentRef.current && pathname !== '/admin') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        lenisRef.current = new Lenis({
          wrapper: mainContentRef.current,
          content: mainContentRef.current.firstChild,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        })

        function raf(time) {
          lenisRef.current?.raf(time)
          if (lenisRef.current) {
            requestAnimationFrame(raf)
          }
        }
        requestAnimationFrame(raf)
      }, 100)
    }

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
    }
  }, [pathname, mainContentRef.current])

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
  
  // Don't show sidebar on login page - use default smooth scroll provider
  if (pathname === '/admin') {
    return <>{children}</>
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Projects', href: '/admin/projects', icon: '💼', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Blog Posts', href: '/admin/blog', icon: '📝', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Messages', href: '/admin/messages', icon: '✉️', gradient: 'from-orange-500 to-red-500' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📈', gradient: 'from-indigo-500 to-purple-500' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️', gradient: 'from-gray-500 to-slate-500' },
  ]

  return (
    <div className={`flex h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-black text-white' 
        : 'bg-gray-50 text-gray-900'
    } overflow-hidden`}>
      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`${sidebarOpen ? 'w-72' : 'w-20'} ${
            darkMode 
              ? 'bg-black border-gray-800' 
              : 'bg-white border-gray-100'
          } border-r transition-all duration-300 flex flex-col relative z-10`}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-black via-gray-900/20 to-black' 
              : 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50'
          }`}></div>
          
          {/* Header */}
          <div className={`relative p-6 border-b ${
            darkMode ? 'border-gray-800' : 'border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div>
                    <h1 className={`text-xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>Admin Panel</h1>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>Portfolio Management</p>
                  </div>
                </motion.div>
              )}
              <div className="flex items-center space-x-2">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-xl transition-colors duration-200 ${
                    darkMode 
                      ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  <span className="text-sm">
                    {darkMode ? '☀️' : '🌙'}
                  </span>
                </button>
                
                {/* Sidebar Toggle */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`p-2 rounded-xl transition-colors duration-200 ${
                    darkMode 
                      ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <span>
                    {sidebarOpen ? '←' : '→'}
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 relative overflow-y-auto">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                        : darkMode
                        ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {/* Background Animation */}
                    {!isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                    )}
                    
                    <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center ${
                      isActive 
                        ? 'bg-white/20' 
                        : `bg-gradient-to-br ${item.gradient} opacity-80 group-hover:opacity-100`
                    } transition-all duration-300`}>
                      <span className="text-sm text-white">
                        {item.icon}
                      </span>
                    </div>
                    
                    {sidebarOpen && (
                      <div className="relative">
                        <span className="font-medium transition-colors duration-200">
                          {item.name}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -left-7 top-1/2 w-1 h-6 bg-white rounded-full"
                            style={{ transform: 'translateY(-50%)' }}
                          />
                        )}
                      </div>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>
          
          {/* User Profile & Logout */}
          <div className={`relative p-4 border-t ${
            darkMode ? 'border-gray-800' : 'border-gray-100'
          }`}>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.8 }}
                className={`rounded-2xl p-4 mb-4 ${
                  darkMode 
                    ? 'bg-gray-900 border border-gray-800' 
                    : 'bg-gradient-to-r from-gray-50 to-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{user?.name || 'Admin User'}</p>
                    <p className={`text-xs truncate ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>{user?.email || 'admin@test.com'}</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <button
              onClick={async () => {
                try {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  window.location.href = '/admin'
                } catch (error) {
                  console.error('Logout error:', error)
                  window.location.href = '/admin'
                }
              }}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3 px-4' : 'justify-center'} py-3 text-red-500 rounded-2xl transition-all duration-300 group ${
                darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                darkMode 
                  ? 'bg-red-900/30 group-hover:bg-red-900/50' 
                  : 'bg-red-100 group-hover:bg-red-200'
              }`}>
                <span className="text-red-500 text-sm">🚪</span>
              </div>
              {sidebarOpen && (
                <span className="font-medium">Logout</span>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`backdrop-blur-lg border-b px-6 py-4 flex items-center justify-between ${
            darkMode 
              ? 'bg-black/80 border-gray-800' 
              : 'bg-white/80 border-gray-100'
          }`}
        >
          <div>
            <h2 className={`text-2xl font-bold capitalize ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h2>
            <p className={`text-sm ${
              darkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>Welcome back, manage your portfolio</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <span className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>🔔</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </motion.header>
        
        {/* Page Content with Lenis Scrolling */}
        <main 
          ref={mainContentRef}
          className={`flex-1 overflow-auto transition-colors duration-300 admin-scrollbar ${
            darkMode 
              ? 'bg-black' 
              : 'bg-gradient-to-br from-gray-50 via-white to-blue-50/30'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
