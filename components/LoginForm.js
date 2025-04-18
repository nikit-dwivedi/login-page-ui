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
        backgroundColor: 'rgba(14, 22, 40, 0.75)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease-in-out',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)',
                '& .login-button': {
                  transform: 'translateY(-5px)',
                }
              }
            }}
        >
          <CardContent sx={{ p: 4, pb: 0 }}>
            {/* Logo and header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                  <Box 
                    sx={{ 
                      bgcolor: '#1a75cb',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      mx: 'auto',
                      mb: 2,
                      boxShadow: '0 5px 15px rgba(26, 117, 203, 0.15)',
                      background: 'linear-gradient(135deg, #1a75cb 0%, #4E7CFF 100%)',
                    }}
                >
                  <Typography variant="h5" component="span" sx={{ color: 'white', fontWeight: 'bold' }}>
                    F
                  </Typography>
                </Box>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Typography variant="h5" component="h1" sx={{ 
                  color: '#ffffff', 
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
                  color: '#9dc1e8', 
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
                          <Email sx={{ color: '#9dc1e8' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 52,
                        borderRadius: 28,
                        backgroundColor: 'rgba(30, 39, 67, 0.4)',
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4E7CFF',
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
                          <Lock sx={{ color: '#9dc1e8' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#9dc1e8' }}
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
                        backgroundColor: 'rgba(30, 39, 67, 0.4)',
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4E7CFF',
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
                      color: '#9dc1e8', 
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      '&:hover': {
                        color: '#ffffff',
                      }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </motion.div>

              {/* Login button will be outside CardContent */}
            </form>
          </CardContent>
          
          {/* Login button - Full width at bottom of card */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="login-button"
            style={{ 
              marginTop: 'auto', 
              transition: 'transform 0.3s ease-in-out',
              width: '100%'
            }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              onClick={handleLogin}
              sx={{
                py: 1.6,
                mt: 0,
                backgroundColor: '#4E7CFF',
                color: 'white',
                borderRadius: 0,
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px',
                textTransform: 'none',
                fontWeight: '500',
                fontSize: '1rem',
                boxShadow: 'none',
                margin: 0,
                width: '100%',
                position: 'relative',
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
        </Card>
      </motion.div>
    </Box>
  )
}

export default LoginForm