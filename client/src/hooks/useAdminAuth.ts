import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export function useAdminAuth() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [checkingAdmin, setCheckingAdmin] = useState(false)

  const checkAdminAccess = async (onRequireLogin?: () => void) => {
    try {
      setCheckingAdmin(true)
      // Primary attempt: fetch current user
      const res = await api.get('/auth/me')
      // Only treat a 200 OK with a body as an authenticated response.
      // Some intermediary/proxy responses (304 Not Modified) may be returned
      // and have no body; treat those as no-data and fall back to the check-admin endpoint.
      if (res.status === 200 && res.data) {
        const user = res.data
        // server returns `userType` for role (admin | student)
        const isAdmin = user?.userType === 'admin' || user?.role === 'admin' || user?.isAdmin === true
        if (isAdmin) {
          navigate('/admin')
        } else {
          onRequireLogin?.()
        }
      } else {
        // Fallback to the explicit admin-check endpoint
        const res2 = await api.get('/auth/check-admin')
        if (res2.status === 200 && res2.data?.isAdmin) navigate('/admin')
        else onRequireLogin?.()
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        onRequireLogin?.()
        return
      }
      
      try {
        const res2 = await api.get('/auth/check-admin')
        if (res2.data?.isAdmin) navigate('/admin')
        else onRequireLogin?.()
      } catch (err2: any) {
        if (err2.response?.status !== 404) {
          console.error('Admin check failed:', err2)
        }
        toast({
          title: 'Authentication required',
          description: 'Please sign in as an admin to continue.',
          variant: 'destructive'
        })
        onRequireLogin?.()
      }
    } finally {
      setCheckingAdmin(false)
    }
  }

  return {
    checkingAdmin,
    checkAdminAccess
  }
}

