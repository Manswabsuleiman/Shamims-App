import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/hooks/useNotifications'


export default function NotificationsList() {
  const { userId } = useAuth()
  const { items, loading, unreadCount, markRead } = useNotifications(userId)
  console.log('NOTIF', { userId, loading, count: items.length })

  if (loading) return <ActivityIndicator style={{ margin: 16 }} />

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Notifications ({unreadCount} unread)</Text>

      {items.length === 0 ? (
        <Text style={styles.empty}>No notifications yet.</Text>
      ) : (
        items.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={[styles.card, !n.read && styles.unread]}
            onPress={() => markRead(n.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.title}>{n.title ?? 'Notification'}</Text>
            <Text style={styles.message}>{n.message}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginTop: 16 },
  heading: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 10 },
  empty: { color: '#8a8a85', fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10 },
  unread: { borderLeftWidth: 3, borderLeftColor: '#111' },
  title: { fontSize: 15, fontWeight: '600', color: '#111' },
  message: { fontSize: 14, color: '#555', marginTop: 4 },
})