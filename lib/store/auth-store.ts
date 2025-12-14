import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/types/database'

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => {
    const currentUser = get().user
    if (currentUser?.id !== user?.id) {
      set({ user })
    }
  },
  setProfile: (profile) => {
    const currentProfile = get().profile
    if (currentProfile?.id !== profile?.id) {
      set({ profile })
    }
  },
  setLoading: (isLoading) => {
    const currentLoading = get().isLoading
    if (currentLoading !== isLoading) {
      set({ isLoading })
    }
  },
  logout: () => set({ user: null, profile: null, isLoading: false }),
}))