'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth-store'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
      },
    },
  }))

  const { setUser, setProfile, setLoading } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    // Set a maximum loading time of 5 seconds for faster feedback
    const maxLoadingTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth loading timeout reached')
        setLoading(false)
      }
    }, 5000)

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (session?.user) {
          setUser(session.user)
          setLoading(false) // Set loading false immediately
          // Load profile in background
          loadUserProfile(session.user.id) // Don't await this
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        if (mounted) setLoading(false)
      }
    }

    // Load user profile with better error handling
    const loadUserProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (!mounted) return
        
        if (error) {
          // Profile might not exist yet for new users
          if (error.code === 'PGRST116') {
            console.log('Profile not found, will be created by trigger')
            setProfile(null)
          } else {
            console.error('Error loading profile:', error)
          }
        } else {
          setProfile(profile)
        }
      } catch (error) {
        console.error('Error in loadUserProfile:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          setLoading(false) // Set loading false immediately when user is detected
          
          // Load profile in background, don't block UI
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            loadUserProfile(session.user.id) // Don't await this
          }
        } else {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(maxLoadingTimeout)
      subscription.unsubscribe()
    }
  }, [setUser, setProfile, setLoading, supabase])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}