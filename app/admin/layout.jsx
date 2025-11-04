'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Lenis from '@studio-freight/lenis'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false) // Start closed on mobile
  const [isVisible, setIsVisible] = useState(false)
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode
  const [user, setUser] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const mainContentRef = useRef(null)
  const lenisRef = useRef(null)
  
  useEffect(() => {
    setIsVisible(true)
    
    // Check if mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
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
    
    return () => window.removeEventListener('resize', checkMobile)
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
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Projects', path: '/admin/projects', icon: '💼', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Experience', path: '/admin/experience', icon: '�', gradient: 'from-orange-500 to-red-500' },
    { name: 'Skills', path: '/admin/skills', icon: '⚡', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️', gradient: 'from-gray-500 to-slate-500' },
  ];

  return (
    <div className={`flex h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-black text-white' 
        : 'bg-gray-50 text-gray-900'
    } overflow-hidden relative`}>
      
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}
      
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              width: sidebarOpen ? (isMobile ? 280 : 288) : 80
            }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.4, 0.0, 0.2, 1],
              width: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
            }}
            className={`${
              isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative'
            } ${sidebarOpen ? 'w-72' : 'w-20'} ${
              darkMode 
                ? 'bg-zinc-950/98 border-zinc-800/30 backdrop-blur-xl' 
                : 'bg-white/95 border-gray-200/50 backdrop-blur-xl'
            } border-r transition-all duration-300 flex flex-col shadow-xl`}
          >
            {/* Professional Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className={`absolute inset-0 ${
                darkMode 
                  ? 'bg-gradient-to-br from-zinc-900/20 via-black/10 to-zinc-900/20' 
                  : 'bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30'
              }`} />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/5" />
            </div>
          
          {/* Header */}
          <div className={`relative p-6 border-b ${
            darkMode ? 'border-zinc-800/30' : 'border-gray-200/50'
          }`}>
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/10">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <div>
                    <h1 className={`text-xl font-bold tracking-tight ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>Portfolio</h1>
                    <p className={`text-xs font-medium ${
                      darkMode ? 'text-zinc-400' : 'text-slate-500'
                    }`}>Admin Dashboard</p>
                  </div>
                </motion.div>
              )}
              <div className="flex items-center space-x-2">
                {/* Mobile Menu Button */}
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      darkMode 
                        ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                    } md:hidden`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                {/* Dark Mode Toggle */}
                {!isMobile && (
                  <button
                    onClick={toggleDarkMode}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      darkMode 
                        ? 'hover:bg-slate-800 text-slate-400 hover:text-white bg-slate-800/50' 
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900 bg-gray-100/50'
                    }`}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    <span className="text-sm">
                      {darkMode ? '☀️' : '🌙'}
                    </span>
                  </button>
                )}
                
                {/* Desktop Sidebar Toggle */}
                {!isMobile && (
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      darkMode 
                        ? 'hover:bg-zinc-900 text-zinc-400 hover:text-white' 
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} 
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 relative overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                >
                  <Link
                    href={item.path}
                    className={`flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                        : darkMode
                        ? 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white hover:scale-105'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:scale-105'
                    }`}
                  >
                    {/* Background Animation */}
                    {!isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                    )}
                    
                    <div className={`relative ${sidebarOpen ? 'w-9 h-9' : 'w-8 h-8'} rounded-xl flex items-center justify-center ${
                      isActive 
                        ? 'bg-white/20 backdrop-blur-sm' 
                        : `bg-gradient-to-br ${item.gradient} opacity-80 group-hover:opacity-100 shadow-sm`
                    } transition-all duration-300`}>
                      <span className={`${sidebarOpen ? 'text-base' : 'text-sm'} ${isActive ? 'text-white' : 'text-white'}`}>
                        {item.icon}
                      </span>
                    </div>
                    
                    {sidebarOpen && (
                      <div className="relative flex-1">
                        <span className="font-semibold text-sm transition-colors duration-200">
                          {item.name}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -left-7 top-1/2 w-1 h-8 bg-white rounded-full shadow-sm"
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
            darkMode ? 'border-zinc-800/30' : 'border-gray-200/50'
          }`}>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.8 }}
                className={`rounded-2xl p-4 mb-4 backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-zinc-900/30 border border-zinc-800/30' 
                    : 'bg-white/50 border border-gray-200/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-slate-500 to-slate-700 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>{user?.name || 'Admin User'}</p>
                    <p className={`text-xs truncate font-medium ${
                      darkMode ? 'text-zinc-400' : 'text-slate-500'
                    }`}>{user?.email || 'admin@portfolio.com'}</p>
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
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3 px-4' : 'justify-center'} py-3.5 text-red-500 rounded-2xl transition-all duration-300 group hover:scale-105 ${
                darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
              }`}
            >
              <div className={`${sidebarOpen ? 'w-9 h-9' : 'w-8 h-8'} rounded-xl flex items-center justify-center transition-all duration-200 ${
                darkMode 
                  ? 'bg-red-900/30 group-hover:bg-red-900/50' 
                  : 'bg-red-100 group-hover:bg-red-200'
              }`}>
                <span className="text-red-500 text-sm">🚪</span>
              </div>
              {sidebarOpen && (
                <span className="font-semibold text-sm">Logout</span>
              )}
            </button>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`backdrop-blur-xl border-b px-4 md:px-6 py-4 flex items-center justify-between relative z-30 ${
            darkMode 
              ? 'bg-black/80 border-zinc-800/30' 
              : 'bg-white/80 border-gray-200/50'
          } shadow-sm`}
        >
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'hover:bg-zinc-900 text-zinc-400 hover:text-white bg-zinc-900/50' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900 bg-gray-100/50'
                } md:hidden`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <div>
              <h2 className={`text-xl md:text-2xl font-bold capitalize tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </h2>
              <p className={`text-xs md:text-sm font-medium ${
                darkMode ? 'text-zinc-400' : 'text-slate-500'
              }`}>Manage your portfolio content</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Mobile Dark Mode Toggle */}
            {isMobile && (
              <button
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-white bg-slate-800/50' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900 bg-gray-100/50'
                }`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <span className="text-sm">
                  {darkMode ? '☀️' : '🌙'}
                </span>
              </button>
            )}
            
            {/* Notifications */}
            <div className="relative">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                darkMode ? 'bg-zinc-900/50 hover:bg-zinc-800' : 'bg-gray-100/50 hover:bg-gray-200'
              }`}>
                <span className={`text-sm ${
                  darkMode ? 'text-zinc-400' : 'text-slate-500'
                }`}>🔔</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full ring-2 ring-black animate-pulse"></div>
            </div>
            
            {/* User Avatar */}
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center shadow-sm hidden sm:flex`}>
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </motion.header>
        
        {/* Page Content with Lenis Scrolling */}
        <main 
          ref={mainContentRef}
          className={`flex-1 overflow-auto transition-all duration-300 ${
            darkMode 
              ? 'bg-black' 
              : 'bg-gradient-to-br from-gray-50 via-white to-blue-50/20'
          } scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
