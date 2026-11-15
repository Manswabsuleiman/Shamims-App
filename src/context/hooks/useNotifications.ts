import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/context/lib/supabase'

export type AppNotification = {
  id: number
  user_id: string
  title: string | null
  message: string
  read: boolean
  created_at: string
}

export function useNotifications(
  userId: string | null,
  onNew?: (n: AppNotification) => void
) {
  const [items, setItems] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  const onNewRef = useRef(onNew)
  onNewRef.current = onNew

  const itemsRef = useRef(items)
  itemsRef.current = items

  useEffect(() => {
    if (!userId) {
      setItems([])
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)

    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!active) return
        if (error) console.warn('Load notifications failed:', error.message)
        setItems((data as AppNotification[]) ?? [])
        setLoading(false)
      })

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const n = payload.new as AppNotification
          setItems((prev) => (prev.some((p) => p.id === n.id) ? prev : [n, ...prev]))
          onNewRef.current?.(n)
        }
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [userId])

  const markRead = useCallback(async (id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
    if (error) {
      console.warn('Mark read failed:', error.message)
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)))
    }
  }, [])

  const markAllRead = useCallback(async () => {
    if (!userId) return
    const snapshot = itemsRef.current
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
    if (error) {
      console.warn('Mark all read failed:', error.message)
      setItems(snapshot)
    }
  }, [userId])

  const unreadCount = items.filter((n) => !n.read).length

  return { items, loading, unreadCount, markRead, markAllRead }
}