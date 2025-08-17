'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth')
    if (!isAuthenticated) {
      router.push('/admin')
    }
    setIsVisible(true)
  }, [router])

  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      icon: '💼',
      change: '+2 this month',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      darkBgGradient: 'from-purple-900/20 to-pink-900/20'
    },
    {
      title: 'Blog Posts',
      value: '8',
      icon: '📝',
      change: '+1 this week',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      darkBgGradient: 'from-green-900/20 to-emerald-900/20'
    },
    {
      title: 'Messages',
      value: '23',
      icon: '✉️',
      change: '+5 new',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      darkBgGradient: 'from-orange-900/20 to-red-900/20'
    },
    {
      title: 'Page Views',
      value: '1.2k',
      icon: '📊',
      change: '+15% this week',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      darkBgGradient: 'from-blue-900/20 to-cyan-900/20'
    },
  ]

  const recentProjects = [
    {
      name: 'ZenPoint Wellness',
      status: 'Live',
      type: 'Web Design',
      date: '2 days ago',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Timber Elegance',
      status: 'In Progress',
      type: 'E-commerce',
      date: '1 week ago',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      name: 'Digital Agency Pro',
      status: 'Review',
      type: 'Agency Site',
      date: '3 days ago',
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  const quickActions = [
    { name: 'Add New Project', icon: '➕', href: '/admin/projects/new', gradient: 'from-indigo-500 to-purple-600' },
    { name: 'Write Blog Post', icon: '✍️', href: '/admin/blog/new', gradient: 'from-green-500 to-emerald-600' },
    { name: 'View Messages', icon: '💬', href: '/admin/messages', gradient: 'from-orange-500 to-red-600' },
    { name: 'Analytics', icon: '📈', href: '/admin/analytics', gradient: 'from-blue-500 to-cyan-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-white">Good morning, John! 👋</h1>
        <p className="text-gray-400">Here's what's happening with your portfolio today.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 * index + 0.2 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-400">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 * index + 0.4 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all duration-300 text-left group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <span className="text-white">{action.icon}</span>
              </div>
              <span className="text-sm font-medium text-white group-hover:text-gray-200 transition-colors">
                {action.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Projects & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.1 * index + 0.6 }}
                className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-gray-800 transition-colors duration-200 group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.gradient} flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white group-hover:text-gray-200 transition-colors truncate">
                    {project.name}
                  </p>
                  <p className="text-sm text-gray-400">{project.type} • {project.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Live' 
                    ? 'bg-green-900/50 text-green-400' 
                    : project.status === 'In Progress'
                    ? 'bg-yellow-900/50 text-yellow-400'
                    : 'bg-blue-900/50 text-blue-400'
                }`}>
                  {project.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <div>
                <p className="text-sm text-white">ZenPoint Wellness project deployed</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-xs">📝</span>
              </div>
              <div>
                <p className="text-sm text-white">New blog post published</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 text-xs">💬</span>
              </div>
              <div>
                <p className="text-sm text-white">5 new messages received</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-gray-900 border border-gray-800 rounded-3xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">98.5%</div>
            <div className="text-sm text-gray-400">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">1.2s</div>
            <div className="text-sm text-gray-400">Avg Load Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">4.9/5</div>
            <div className="text-sm text-gray-400">Client Rating</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
