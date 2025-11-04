'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Eye, EyeOff, ExternalLink, Github, Plus, Clock, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalExperiences: 0,
    publishedExperiences: 0,
    totalSkills: 0,
    publishedSkills: 0
  })
  const [recentProjects, setRecentProjects] = useState([])
  const [recentExperiences, setRecentExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
    setIsVisible(true)
    
    // Check theme
    const savedTheme = localStorage.getItem('adminTheme') || 'dark'
    setDarkMode(savedTheme === 'dark')
  }, [router])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push('/admin')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/admin')
    }
  }

  const fetchDashboardData = async () => {
    try {
      // Fetch projects
      const projectsResponse = await fetch('/api/projects')
      const projectsData = await projectsResponse.json()
      
      // Fetch experiences
      const experiencesResponse = await fetch('/api/experiences')
      const experiencesData = await experiencesResponse.json()

      // Fetch skills
      const skillsResponse = await fetch('/api/skills')
      const skillsData = await skillsResponse.json()

      if (projectsData.success && experiencesData.success) {
        const projects = projectsData.projects || []
        const experiences = experiencesData.experiences || []
        const skills = skillsData.success ? skillsData.skills || [] : []

        // Calculate stats
        setStats({
          totalProjects: projects.length,
          publishedProjects: projects.filter(p => p.isPublished).length,
          totalExperiences: experiences.length,
          publishedExperiences: experiences.filter(e => e.isPublished).length,
          totalSkills: skills.length,
          publishedSkills: skills.filter(s => s.published).length
        })

        // Get recent items (last 5)
        setRecentProjects(projects.slice(0, 5))
        setRecentExperiences(experiences.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const quickActions = [
    { 
      name: 'Add Project', 
      icon: Plus, 
      href: '/admin/projects', 
      gradient: 'from-blue-600 to-cyan-600',
      description: 'Create a new project' 
    },
    { 
      name: 'Add Experience', 
      icon: Plus, 
      href: '/admin/experience', 
      gradient: 'from-emerald-600 to-teal-600',
      description: 'Add work experience' 
    },
    { 
      name: 'Manage Skills', 
      icon: Plus, 
      href: '/admin/skills', 
      gradient: 'from-purple-600 to-pink-600',
      description: 'Update skills & certificates' 
    },
    { 
      name: 'View Settings', 
      icon: Eye, 
      href: '/admin/settings', 
      gradient: 'from-violet-600 to-purple-600',
      description: 'Manage settings' 
    },
    { 
      name: 'Go to Site', 
      icon: ExternalLink, 
      href: '/', 
      gradient: 'from-amber-600 to-orange-600',
      description: 'View live portfolio' 
    },
  ]  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className={`h-8 ${darkMode ? 'bg-zinc-800' : 'bg-gray-200'} rounded w-1/3 mb-4`}></div>
          <div className={`h-4 ${darkMode ? 'bg-zinc-800' : 'bg-gray-200'} rounded w-1/2 mb-8`}></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border rounded-3xl p-6`}>
                <div className={`h-12 ${darkMode ? 'bg-zinc-800' : 'bg-gray-200'} rounded-2xl mb-4`}></div>
                <div className={`h-4 ${darkMode ? 'bg-zinc-800' : 'bg-gray-200'} rounded mb-2`}></div>
                <div className={`h-6 ${darkMode ? 'bg-zinc-800' : 'bg-gray-200'} rounded`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="space-y-3"
      >
        <div className="flex items-center space-x-3">
          <h1 className={`text-2xl md:text-3xl font-bold ${
            darkMode 
              ? 'bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent' 
              : 'text-gray-900'
          }`}>
            Welcome back, {user?.name || 'Admin'}! 
          </h1>
          <span className="text-2xl animate-bounce">👋</span>
        </div>
        <p className={`font-medium ${
          darkMode ? 'text-zinc-400' : 'text-gray-600'
        }`}>Here's what's happening with your portfolio today.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`group relative overflow-hidden ${
            darkMode 
              ? 'bg-zinc-950/50 border-zinc-800/50 hover:border-zinc-700/50' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          } backdrop-blur-xl rounded-3xl p-6 border transition-all duration-300 shadow-sm ${
            darkMode ? '' : 'shadow-lg hover:shadow-xl'
          }`}
        >
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-600/5 to-purple-600/5' 
              : 'bg-gradient-to-br from-blue-50 to-purple-50'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-xl">💼</span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                darkMode 
                  ? 'text-zinc-500 bg-zinc-900/50' 
                  : 'text-gray-600 bg-gray-100'
              }`}>
                {stats.publishedProjects} live
              </span>
            </div>
            <div className="space-y-2">
              <h3 className={`text-sm font-semibold ${
                darkMode ? 'text-zinc-400' : 'text-gray-600'
              }`}>Total Projects</h3>
              <p className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{stats.totalProjects}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`group relative overflow-hidden ${
            darkMode 
              ? 'bg-zinc-950/50 border-zinc-800/50 hover:border-zinc-700/50' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          } backdrop-blur-xl rounded-3xl p-6 border transition-all duration-300 shadow-sm ${
            darkMode ? '' : 'shadow-lg hover:shadow-xl'
          }`}
        >
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-emerald-600/5 to-teal-600/5' 
              : 'bg-gradient-to-br from-emerald-50 to-teal-50'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                <span className="text-xl">🏢</span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                darkMode 
                  ? 'text-zinc-500 bg-zinc-900/50' 
                  : 'text-gray-600 bg-gray-100'
              }`}>
                {stats.publishedExperiences} live
              </span>
            </div>
            <div className="space-y-2">
              <h3 className={`text-sm font-semibold ${
                darkMode ? 'text-zinc-400' : 'text-gray-600'
              }`}>Experiences</h3>
              <p className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{stats.totalExperiences}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`group relative overflow-hidden ${
            darkMode 
              ? 'bg-zinc-950/50 border-zinc-800/50 hover:border-zinc-700/50' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          } backdrop-blur-xl rounded-3xl p-6 border transition-all duration-300 shadow-sm ${
            darkMode ? '' : 'shadow-lg hover:shadow-xl'
          }`}
        >
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-violet-600/5 to-cyan-600/5' 
              : 'bg-gradient-to-br from-violet-50 to-cyan-50'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                darkMode 
                  ? 'text-zinc-500 bg-zinc-900/50' 
                  : 'text-gray-600 bg-gray-100'
              }`}>
                Live content
              </span>
            </div>
            <div className="space-y-2">
              <h3 className={`text-sm font-semibold ${
                darkMode ? 'text-zinc-400' : 'text-gray-600'
              }`}>Published Items</h3>
              <p className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{stats.publishedProjects + stats.publishedExperiences}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`group relative overflow-hidden ${
            darkMode 
              ? 'bg-zinc-950/50 border-zinc-800/50 hover:border-zinc-700/50' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          } backdrop-blur-xl rounded-3xl p-6 border transition-all duration-300 shadow-sm ${
            darkMode ? '' : 'shadow-lg hover:shadow-xl'
          }`}
        >
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-amber-600/5 to-orange-600/5' 
              : 'bg-gradient-to-br from-amber-50 to-orange-50'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg">
                <span className="text-xl">📈</span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                darkMode 
                  ? 'text-zinc-500 bg-zinc-900/50' 
                  : 'text-gray-600 bg-gray-100'
              }`}>
                Completion
              </span>
            </div>
            <div className="space-y-2">
              <h3 className={`text-sm font-semibold ${
                darkMode ? 'text-zinc-400' : 'text-gray-600'
              }`}>Portfolio Score</h3>
              <p className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.round(((stats.publishedProjects + stats.publishedExperiences) / Math.max(1, stats.totalProjects + stats.totalExperiences)) * 100)}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`group relative overflow-hidden ${
            darkMode 
              ? 'bg-zinc-950/50 border-zinc-800/50 hover:border-zinc-700/50' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          } backdrop-blur-xl rounded-3xl p-6 border transition-all duration-300 shadow-sm ${
            darkMode ? '' : 'shadow-lg hover:shadow-xl'
          }`}
        >
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-purple-600/5 to-pink-600/5' 
              : 'bg-gradient-to-br from-purple-50 to-pink-50'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <span className="text-xl">⚡</span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                darkMode 
                  ? 'text-zinc-500 bg-zinc-900/50' 
                  : 'text-gray-600 bg-gray-100'
              }`}>
                {stats.publishedSkills} live
              </span>
            </div>
            <div className="space-y-2">
              <h3 className={`text-sm font-semibold ${
                darkMode ? 'text-zinc-400' : 'text-gray-600'
              }`}>Skills</h3>
              <p className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{stats.totalSkills}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="space-y-4"
      >
        <h2 className={`text-xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 * index + 0.7 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(action.href)}
              className={`group relative overflow-hidden ${
                darkMode 
                  ? 'bg-zinc-950/50 border-zinc-800/50 hover:border-zinc-700/50' 
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
              } backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 text-left`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} ${
                darkMode ? 'opacity-0 group-hover:opacity-5' : 'opacity-0 group-hover:opacity-10'
              } transition-opacity duration-300`} />
              <div className="relative z-10 space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <span className={`text-sm font-bold transition-colors block ${
                    darkMode 
                      ? 'text-white group-hover:text-zinc-100' 
                      : 'text-gray-900 group-hover:text-gray-800'
                  }`}>
                    {action.name}
                  </span>
                  <span className={`text-xs font-medium ${
                    darkMode ? 'text-zinc-400' : 'text-gray-500'
                  }`}>
                    {action.description}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`${
            darkMode 
              ? 'bg-zinc-950/50 border-zinc-800/50' 
              : 'bg-white border-gray-200 shadow-lg'
          } backdrop-blur-xl rounded-3xl p-6 border`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Recent Projects</h2>
            <button 
              onClick={() => router.push('/admin/projects')}
              className={`text-sm transition-colors font-medium ${
                darkMode 
                  ? 'text-zinc-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <div className={`text-center py-12 ${
                darkMode ? 'text-zinc-400' : 'text-gray-500'
              }`}>
                <div className={`w-16 h-16 ${
                  darkMode ? 'bg-zinc-800/50' : 'bg-gray-100'
                } rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">💼</span>
                </div>
                <p className="text-sm font-medium mb-2">No projects yet</p>
                <button 
                  onClick={() => router.push('/admin/projects')}
                  className="text-xs text-blue-500 hover:text-blue-600 transition-colors font-medium"
                >
                  Create your first project
                </button>
              </div>
            ) : (
              recentProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.1 * index + 0.9 }}
                  className={`flex items-center space-x-4 p-4 rounded-2xl transition-colors duration-200 group cursor-pointer ${
                    darkMode 
                      ? 'hover:bg-zinc-800/30' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => window.open(project.liveUrl, '_blank')}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0 flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">
                      {project.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold transition-colors truncate ${
                      darkMode 
                        ? 'text-white group-hover:text-zinc-100' 
                        : 'text-gray-900 group-hover:text-gray-700'
                    }`}>
                      {project.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {project.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className={`text-xs px-2 py-1 rounded font-medium ${
                          darkMode 
                            ? 'text-zinc-400 bg-zinc-800/50' 
                            : 'text-gray-600 bg-gray-100'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {project.githubUrl && (
                      <Github className={`w-4 h-4 ${
                        darkMode ? 'text-zinc-400' : 'text-gray-500'
                      }`} />
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.isPublished 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                    }`}>
                      {project.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Experiences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className={`${
            darkMode 
              ? 'bg-zinc-950/50 border-zinc-800/50' 
              : 'bg-white border-gray-200 shadow-lg'
          } backdrop-blur-xl rounded-3xl p-6 border`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Recent Experiences</h2>
            <button 
              onClick={() => router.push('/admin/experience')}
              className={`text-sm transition-colors font-medium ${
                darkMode 
                  ? 'text-zinc-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentExperiences.length === 0 ? (
              <div className={`text-center py-12 ${
                darkMode ? 'text-zinc-400' : 'text-gray-500'
              }`}>
                <div className={`w-16 h-16 ${
                  darkMode ? 'bg-zinc-800/50' : 'bg-gray-100'
                } rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">🏢</span>
                </div>
                <p className="text-sm font-medium mb-2">No experiences yet</p>
                <button 
                  onClick={() => router.push('/admin/experience')}
                  className="text-xs text-blue-500 hover:text-blue-600 transition-colors font-medium"
                >
                  Add your first experience
                </button>
              </div>
            ) : (
              recentExperiences.map((experience, index) => (
                <motion.div
                  key={experience._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.1 * index + 1.0 }}
                  className={`flex items-start space-x-4 p-4 rounded-2xl transition-colors duration-200 group ${
                    darkMode 
                      ? 'hover:bg-zinc-800/30' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex-shrink-0 flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">
                      {experience.company?.charAt(0).toUpperCase() || experience.title?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold transition-colors truncate ${
                      darkMode 
                        ? 'text-white group-hover:text-zinc-100' 
                        : 'text-gray-900 group-hover:text-gray-700'
                    }`}>
                      {experience.title}
                    </p>
                    <p className={`text-sm truncate font-medium ${
                      darkMode ? 'text-zinc-400' : 'text-gray-600'
                    }`}>
                      {experience.company} {experience.startDate && `• ${new Date(experience.startDate).getFullYear()}`}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    experience.isPublished 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                  }`}>
                    {experience.isPublished ? 'Published' : 'Draft'}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}