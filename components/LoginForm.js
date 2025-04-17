"use client"

import { useState } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton, 
  Link,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material'
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: ''
  })
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // Simulated authentication
  const handleLogin = (e) => {
    e.preventDefault()
    
    // Simple validation
    let hasErrors = false
    const errors = {
      email: '',
      password: ''
    }
    
    if (!email) {
      errors.email = 'Email is required'
      hasErrors = true
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email'
      hasErrors = true
    }
    
    if (!password) {
      errors.password = 'Password is required'
      hasErrors = true
    }
    
    if (hasErrors) {
      setValidationErrors(errors)
      return
    }
    
    // Reset errors
    setValidationErrors({ email: '', password: '' })
    
    // Simulate login API call
    setLoading(true)
    setTimeout(() => {
      setLoginSuccess(true)
      setLoading(false)
    }, 1500)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      {/* Main login card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 400, zIndex: 10, position: 'relative' }}
      >
        <Card
          elevation={6}
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: 4,
            backgroundColor: '#fff',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Logo and header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box 
                  sx={{ 
                    bgcolor: '#1a75cb',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Typography variant="h4" component="span" sx={{ color: 'white', fontWeight: 'bold' }}>
                    F
                  </Typography>
                </Box>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Typography variant="h4" component="h1" sx={{ 
                  color: '#1e293b', 
                  fontWeight: 'bold',
                  mb: 0.5
                }}>
                  FINEXE <span style={{ color: '#d4a650' }}>2.0</span>
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Typography variant="subtitle2" sx={{ 
                  color: '#64748b', 
                  letterSpacing: 1.5,
                  mb: 3
                }}>
                  ALL-IN-ONE SAAS SOFTWARE
                </Typography>
              </motion.div>
            </Box>

            <form onSubmit={handleLogin}>
              {/* Email field */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Box sx={{ mb: 2.5 }}>
                  <TextField
                    fullWidth
                    placeholder="Email Address"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 52,
                        borderRadius: 28,
                        backgroundColor: '#f8fafc',
                        color: '#334155',
                        '& fieldset': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#cbd5e1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#cbd5e1',
                          borderWidth: 1,
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#f44336',
                      },
                    }}
                  />
                </Box>
              </motion.div>

              {/* Password field */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Box sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#94a3b8' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 52,
                        borderRadius: 28,
                        backgroundColor: '#f8fafc',
                        color: '#334155',
                        '& fieldset': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#cbd5e1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#cbd5e1',
                          borderWidth: 1,
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#f44336',
                      },
                    }}
                  />
                </Box>
              </motion.div>

              {/* Forgot password link */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Box sx={{ mb: 3.5, textAlign: 'right' }}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    sx={{ 
                      color: '#94a3b8', 
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      '&:hover': {
                        color: '#64748b',
                      }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </motion.div>

              {/* Login button */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    backgroundColor: '#627fff',
                    color: 'white',
                    borderRadius: 28,
                    textTransform: 'none',
                    fontWeight: '600',
                    fontSize: '1rem',
                    boxShadow: '0 4px 10px rgba(98, 127, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: '#4c6af5',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#9dc1e8',
                      color: 'rgba(255,255,255,0.8)',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Log In'
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}

export default LoginForm