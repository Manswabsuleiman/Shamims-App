import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Linking,
  Platform,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
} from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router, type Href } from 'expo-router'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useOrders, type Order, type OrderStatus } from '@/context/OrdersContext'
import { useAuth } from '@/context/AuthContext'
import LoginModal from '@/components/LoginModal'
import NotificationsList from '@/components/NotificationsList'


/*      SETTINGS           */

const SHOP_NAME = 'Shamims'
const SUPPORT_WHATSAPP = '' // e.g. '2547XXXXXXXX'

// Quick-pick towns in the address form. Customers can still type any town.
const QUICK_TOWNS = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret']

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
})

type IconName = React.ComponentProps<typeof Ionicons>['name']

/* -------------------------------------------------------------------------- */
/*                              INFO PAGE CONTENT                             */
/* -------------------------------------------------------------------------- */

// Edit the texts below to match how your shop really works.

type InfoSection = { heading: string; body: string }
type InfoPage = { title: string; sections: InfoSection[] }
type InfoKey = 'shipping' | 'terms' | 'about'

const INFO_PAGES: Record<InfoKey, InfoPage> = {
  shipping: {
    title: 'Shipping & Returns',
    sections: [
      {
        heading: 'Delivery',
        body: 'We deliver across Kenya. Orders within Nairobi usually arrive within 1 to 2 working days, and orders to other towns within 2 to 5 working days. You will be contacted to confirm your delivery details before dispatch.',
      },
      {
        heading: 'Delivery fees',
        body: 'Delivery fees depend on your location and are shown when your order is confirmed. Bigger orders may qualify for free delivery.',
      },
      {
        heading: 'Returns',
        body: 'If your item arrives damaged, faulty or different from what you ordered, tell us within 48 hours of receiving it. Items must be unworn, unwashed and in their original condition.',
      },
      {
        heading: 'Exchanges and refunds',
        body: 'Once we receive and check the returned item, we will exchange it or refund you. Refunds are sent to the same method you paid with, and can take a few working days.',
      },
      {
        heading: 'Items we cannot take back',
        body: 'For hygiene reasons, hijabs and innerwear that have been worn or opened cannot be returned unless faulty.',
      },
      {
        heading: 'Need help?',
        body: 'Use the "Chat with us on WhatsApp" option on the profile page and we will help you.',
      },
    ],
  },

  terms: {
    title: 'Terms & Privacy',
    sections: [
      {
        heading: 'Using the app',
        body: `By using the ${SHOP_NAME} app you agree to these terms. Please use the app honestly and only for lawful shopping.`,
      },
      {
        heading: 'Orders and prices',
        body: 'Prices are shown in Kenya shillings (Ksh). We may change prices or availability without notice. An order is only confirmed once we contact you and agree the details.',
      },
      {
        heading: 'Your account',
        body: 'You are responsible for keeping your login details safe and for activity on your account. Tell us at once if you think someone else has used it.',
      },
      {
        heading: 'What we collect',
        body: 'We collect the details you give us, such as your name, email address, phone number and delivery address, and the items you order. Sign-in is handled by our login provider.',
      },
      {
        heading: 'How we use it',
        body: 'We use your details to process orders, arrange delivery, answer your questions and send you notifications you have allowed. We do not sell your personal information.',
      },
      {
        heading: 'Sharing',
        body: 'We only share the details needed to deliver your order (for example with a delivery rider) or where the law requires it.',
      },
      {
        heading: 'Your choices',
        body: 'You can ask us to correct or delete your information at any time, and you can switch notifications off in Preferences.',
      },
      {
        heading: 'Changes',
        body: 'We may update these terms from time to time. Continuing to use the app means you accept the updated terms.',
      },
    ],
  },

  about: {
    title: `About ${SHOP_NAME}`,
    sections: [
      {
        heading: 'Who we are',
        body: `${SHOP_NAME} is a fashion shop selling modest dresses, abayas and hijabs for every day and every occasion.`,
      },
      {
        heading: 'What we offer',
        body: 'Elegant, comfortable styles at fair prices, with regular new arrivals and special offers you can shop straight from your phone.',
      },
      {
        heading: 'Our promise',
        body: 'Quality you can feel, honest prices and friendly service. If something is not right, we will do our best to put it right.',
      },
      {
        heading: 'Get in touch',
        body: 'Message us on WhatsApp from the profile page. We are happy to help with sizes, orders and delivery.',
      },
      {
        heading: 'App version',
        body: 'Version 1.0.0',
      },
    ],
  },
}

/* -------------------------------------------------------------------------- */
/*                                   ORDERS                                   */
/* -------------------------------------------------------------------------- */

const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; bg: string }
> = {
  processing: { label: 'Processing', color: '#b26a00', bg: '#fff1d6' },
  shipped: { label: 'On the way', color: '#1f5fd1', bg: '#e3edff' },
  delivered: { label: 'Delivered', color: '#1e7d3a', bg: '#e1f5e6' },
  cancelled: { label: 'Cancelled', color: '#c0392b', bg: '#fdeceb' },
}

const ORDER_FILTERS = ['All', 'Active', 'Delivered', 'Cancelled'] as const
type OrderFilter = (typeof ORDER_FILTERS)[number]

const matchesFilter = (order: Order, filter: OrderFilter) => {
  if (filter === 'All') return true
  if (filter === 'Active')
    return order.status === 'processing' || order.status === 'shipped'
  if (filter === 'Delivered') return order.status === 'delivered'
  return order.status === 'cancelled'
}

const TRACK_STEPS = ['Placed', 'On the way', 'Delivered']

const trackIndex = (status: OrderStatus) => {
  if (status === 'processing') return 0
  if (status === 'shipped') return 1
  return 2
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const formatDate = (timestamp: number) => {
  const d = new Date(timestamp)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/* -------------------------------------------------------------------------- */
/*                                  ADDRESSES                                 */
/* -------------------------------------------------------------------------- */

type Address = {
  id: string
  label: string
  fullName: string
  phone: string
  county: string
  area: string
  street: string
  notes: string
  isDefault: boolean
}

type AddressForm = Omit<Address, 'id'>

const EMPTY_FORM: AddressForm = {
  label: 'Home',
  fullName: '',
  phone: '',
  county: '',
  area: '',
  street: '',
  notes: '',
  isDefault: false,
}

const LABELS = ['Home', 'Work', 'Other']
const LABEL_ICONS: Record<string, IconName> = {
  Home: 'home-outline',
  Work: 'briefcase-outline',
  Other: 'location-outline',
}

/* -------------------------------------------------------------------------- */
/*                                 SMALL PARTS                                */
/* -------------------------------------------------------------------------- */

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
)

type RowProps = {
  icon: IconName
  label: string
  onPress?: () => void
  value?: string
  danger?: boolean
  right?: React.ReactNode
  last?: boolean
}

const Row = ({ icon, label, onPress, value, danger, right, last }: RowProps) => (
  <TouchableOpacity
    style={[styles.row, !last && styles.rowDivider]}
    onPress={onPress}
    activeOpacity={onPress ? 0.6 : 1}
    disabled={!onPress}
  >
    <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
      <Ionicons name={icon} size={18} color={danger ? '#e8433a' : '#111'} />
    </View>

    <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>
      {label}
    </Text>

    {value ? <Text style={styles.rowValue}>{value}</Text> : null}

    {right ??
      (onPress && !danger ? (
        <Ionicons name="chevron-forward" size={18} color="#b5b0a8" />
      ) : null)}
  </TouchableOpacity>
)

/* -------------------------------------------------------------------------- */
/*                               PROFILE SCREEN                               */
/* -------------------------------------------------------------------------- */

const Profile = () => {
  const insets = useSafeAreaInsets()
  const topPad = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0
  )

  const { totalItems, addToCart } = useCart()
  const { items: wishlist, remove: removeFromWishlist } = useWishlist()
  const { orders, cancelOrder } = useOrders()
  const { user, signOut } = useAuth()

  const [notifications, setNotifications] = useState(true)
  const [infoKey, setInfoKey] = useState<InfoKey | null>(null)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  // Orders
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('All')

  // Addresses (kept in memory only, no storage)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressOpen, setAddressOpen] = useState(false)
  const [addressMode, setAddressMode] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')

  const name = user?.email?.split('@')[0] ?? 'Guest'
  const initial = name.charAt(0).toUpperCase()

  const infoPage = infoKey ? INFO_PAGES[infoKey] : null

  /* ------------------------------ Helpers ------------------------------- */

  const comingSoon = (feature: string) =>
    Alert.alert(feature, 'This section is coming soon.')

  const openWhatsApp = async () => {
    const url = `https://wa.me/${SUPPORT_WHATSAPP}`
    try {
      await Linking.openURL(url)
    } catch {
      Alert.alert('Could not open WhatsApp', 'Please try again later.')
    }
  }

  const goShopping = () => {
    setWishlistOpen(false)
    setOrdersOpen(false)
    router.navigate('/home' as Href)
  }

  /* ------------------------------ Wishlist ------------------------------ */

  const openWishlistDetails = (id: string) => {
    setWishlistOpen(false)
    router.push({ pathname: '/details/[id]', params: { id } })
  }

  const addWishlistItemToCart = (item: (typeof wishlist)[number]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      oldPrice: item.oldPrice,
      image: item.image,
    })
    Alert.alert('Added to cart', `${item.name} is now in your cart.`)
  }

  const clearWishlist = () => {
    Alert.alert('Clear wishlist', 'Remove all items from your wishlist?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear all',
        style: 'destructive',
        onPress: () => wishlist.forEach((i) => removeFromWishlist(i.id)),
      },
    ])
  }

  /* ------------------------------- Orders ------------------------------- */

  const visibleOrders = orders.filter((o) => matchesFilter(o, orderFilter))

  const confirmCancelOrder = (order: Order) => {
    Alert.alert('Cancel order', `Cancel order ${order.number}?`, [
      { text: 'Keep order', style: 'cancel' },
      {
        text: 'Cancel order',
        style: 'destructive',
        onPress: () => cancelOrder(order.id),
      },
    ])
  }

  /* ------------------------------ Addresses ----------------------------- */

  const setField = <K extends keyof AddressForm>(key: K, value: AddressForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const openAddresses = () => {
    setAddressMode('list')
    setAddressOpen(true)
  }

  const closeAddresses = () => {
    setAddressOpen(false)
    setAddressMode('list')
    setEditingId(null)
    setFormError('')
  }

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, isDefault: addresses.length === 0 })
    setFormError('')
    setAddressMode('form')
  }

  const openEdit = (a: Address) => {
    setEditingId(a.id)
    const { id, ...rest } = a
    setForm(rest)
    setFormError('')
    setAddressMode('form')
  }

  const validate = () => {
    const phone = form.phone.replace(/[\s-]/g, '')
    if (!form.fullName.trim())
      return 'Enter the full name of the person receiving the order.'
    if (!/^(\+?254|0)[17]\d{8}$/.test(phone))
      return 'Enter a valid Kenyan phone number, e.g. 0712 345 678.'
    if (!form.county.trim()) return 'Enter the county or town.'
    if (!form.area.trim()) return 'Enter the area or estate.'
    return ''
  }

  const saveAddress = () => {
    const problem = validate()
    if (problem) {
      setFormError(problem)
      return
    }

    const cleaned: AddressForm = {
      ...form,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      county: form.county.trim(),
      area: form.area.trim(),
      street: form.street.trim(),
      notes: form.notes.trim(),
    }

    setAddresses((prev) => {
      let next: Address[]

      if (editingId) {
        next = prev.map((a) => (a.id === editingId ? { ...cleaned, id: editingId } : a))
      } else {
        next = [...prev, { ...cleaned, id: Date.now().toString() }]
      }

      // Only one default. The saved one wins if it is marked default
      if (cleaned.isDefault) {
        const savedId = editingId ?? next[next.length - 1].id
        next = next.map((a) => ({ ...a, isDefault: a.id === savedId }))
      }

      // Always keep one default when there are addresses
      if (next.length > 0 && !next.some((a) => a.isDefault)) {
        next = next.map((a, i) => ({ ...a, isDefault: i === 0 }))
      }

      return next
    })

    setAddressMode('list')
    setEditingId(null)
    setFormError('')
  }

  const setDefault = (id: string) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))

  const deleteAddress = (a: Address) => {
    Alert.alert('Delete address', `Delete your ${a.label} address?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          setAddresses((prev) => {
            let next = prev.filter((i) => i.id !== a.id)
            if (next.length > 0 && !next.some((i) => i.isDefault)) {
              next = next.map((i, idx) => ({ ...i, isDefault: idx === 0 }))
            }
            return next
          }),
      },
    ])
  }

  /* -------------------------------- Screen -------------------------------- */

  const sortedAddresses = [...addresses].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault)
  )

  return (
    <View style={styles.page}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: topPad + 16,
          paddingBottom: 40,
        }}
      >
        {/* Header card */}
        <View style={styles.headerCard}>
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => (user ? comingSoon('Edit profile') : setLoginOpen(true))}
            activeOpacity={0.8}
          >
            <Ionicons
              name={user ? 'create-outline' : 'log-in-outline'}
              size={18}
              color="#111"
            />
          </TouchableOpacity>
        </View>

        {/* Shopping */}
        <SectionTitle title="Shopping" />
        <View style={styles.card}>
          <Row
            icon="bag-handle-outline"
            label="My Cart"
            value={totalItems > 0 ? `${totalItems}` : undefined}
            onPress={() => router.push('/cart')}
          />
          <Row
            icon="receipt-outline"
            label="My Orders"
            value={orders.length > 0 ? `${orders.length}` : undefined}
            onPress={() => setOrdersOpen(true)}
          />
          <Row
            icon="heart-outline"
            label="Wishlist"
            value={wishlist.length > 0 ? `${wishlist.length}` : undefined}
            onPress={() => setWishlistOpen(true)}
          />
          <Row
            icon="location-outline"
            label="Delivery Addresses"
            value={addresses.length > 0 ? `${addresses.length}` : undefined}
            onPress={openAddresses}
            last
          />
        </View>

        {/* Preferences */}

          {user ? <NotificationsList /> : null}

        <SectionTitle title="Preferences" />
        <View style={styles.card}>
          <Row
            icon="notifications-outline"
            label="Notifications"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#d2d0cc', true: '#111' }}
                thumbColor="#fff"
              />
            }
          />
          {user ? (
            <Row
              icon="log-out-outline"
              label="Sign out"
              danger
              onPress={() => signOut()}
              last
            />
          ) : null}
        </View>

        {/* Support */}
        <SectionTitle title="Support" />
        <View style={styles.card}>
          <Row
            icon="logo-whatsapp"
            label="Chat with us on WhatsApp"
            onPress={openWhatsApp}
          />
          <Row
            icon="car-outline"
            label="Shipping & Returns"
            onPress={() => setInfoKey('shipping')}
          />
          <Row
            icon="document-text-outline"
            label="Terms & Privacy"
            onPress={() => setInfoKey('terms')}
          />
          <Row
            icon="information-circle-outline"
            label="About"
            onPress={() => setInfoKey('about')}
            last
          />
        </View>
      </ScrollView>

      {/* Orders sheet */}
      <Modal
        visible={ordersOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setOrdersOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.sheet,
              styles.sheetTall,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle} numberOfLines={1}>
                My Orders{orders.length > 0 ? ` (${orders.length})` : ''}
              </Text>

              <TouchableOpacity
                style={styles.sheetClose}
                onPress={() => setOrdersOpen(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={20} color="#111" />
              </TouchableOpacity>
            </View>

            {orders.length > 0 ? (
              <View style={styles.filterRow}>
                {ORDER_FILTERS.map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.chip, orderFilter === f && styles.chipActive]}
                    onPress={() => setOrderFilter(f)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        orderFilter === f && styles.chipTextActive,
                      ]}
                    >
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}
            >
              {orders.length === 0 ? (
                <View style={styles.emptyBox}>
                  <View style={styles.emptyIcon}>
                    <Ionicons name="receipt-outline" size={34} color="#111" />
                  </View>
                  <Text style={styles.emptyTitle}>No orders yet</Text>
                  <Text style={styles.emptyText}>
                    When you place an order, you will see it here and can follow it
                    from packing to delivery.
                  </Text>
                </View>
              ) : visibleOrders.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>Nothing here</Text>
                  <Text style={styles.emptyText}>
                    You have no {orderFilter.toLowerCase()} orders.
                  </Text>
                </View>
              ) : (
                visibleOrders.map((order) => {
                  const meta = STATUS_META[order.status]
                  const step = trackIndex(order.status)
                  const itemCount = order.items.reduce(
                    (sum, i) => sum + i.quantity,
                    0
                  )

                  return (
                    <View key={order.id} style={styles.orderCard}>
                      <View style={styles.orderTop}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.orderNumber}>Order {order.number}</Text>
                          <Text style={styles.orderDate}>
                            {formatDate(order.createdAt)}
                          </Text>
                        </View>

                        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                          <Text style={[styles.statusText, { color: meta.color }]}>
                            {meta.label}
                          </Text>
                        </View>
                      </View>

                      {/* Progress tracker */}
                      {order.status !== 'cancelled' ? (
                        <View style={styles.trackerRow}>
                          {TRACK_STEPS.map((label, i) => (
                            <View key={label} style={styles.trackerStep}>
                              <View style={styles.trackerLineRow}>
                                <View
                                  style={[
                                    styles.trackerLine,
                                    i === 0 && styles.trackerLineHidden,
                                    i <= step && styles.trackerLineDone,
                                  ]}
                                />
                                <View
                                  style={[
                                    styles.trackerDot,
                                    i <= step && styles.trackerDotDone,
                                  ]}
                                >
                                  {i <= step ? (
                                    <Ionicons name="checkmark" size={11} color="#fff" />
                                  ) : null}
                                </View>
                                <View
                                  style={[
                                    styles.trackerLine,
                                    i === TRACK_STEPS.length - 1 &&
                                      styles.trackerLineHidden,
                                    i < step && styles.trackerLineDone,
                                  ]}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.trackerLabel,
                                  i <= step && styles.trackerLabelDone,
                                ]}
                              >
                                {label}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : null}

                      {/* Items */}
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.orderItemsRow}
                      >
                        {order.items.map((item) => (
                          <View key={item.id} style={styles.orderItem}>
                            <Image source={item.image} style={styles.orderItemImage} />
                            {item.quantity > 1 ? (
                              <View style={styles.qtyBadge}>
                                <Text style={styles.qtyBadgeText}>x{item.quantity}</Text>
                              </View>
                            ) : null}
                          </View>
                        ))}
                      </ScrollView>

                      <Text style={styles.orderNames} numberOfLines={2}>
                        {order.items.map((i) => i.name).join(', ')}
                      </Text>

                      {order.address ? (
                        <View style={styles.orderAddressRow}>
                          <Ionicons name="location-outline" size={14} color="#8a8a85" />
                          <Text style={styles.orderAddress} numberOfLines={2}>
                            {order.address}
                          </Text>
                        </View>
                      ) : null}

                      <View style={styles.orderBottom}>
                        <View>
                          <Text style={styles.orderCount}>
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </Text>
                          <Text style={styles.orderTotal}>Ksh {order.total}</Text>
                        </View>

                        {order.status === 'processing' ? (
                          <TouchableOpacity
                            style={styles.cancelOrderButton}
                            onPress={() => confirmCancelOrder(order)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.cancelOrderText}>Cancel order</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  )
                })
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={orders.length === 0 ? goShopping : () => setOrdersOpen(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetButtonText}>
                {orders.length === 0 ? 'Start shopping' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Wishlist sheet */}
      <Modal
        visible={wishlistOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setWishlistOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.sheet,
              styles.sheetTall,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle} numberOfLines={1}>
                Wishlist{wishlist.length > 0 ? ` (${wishlist.length})` : ''}
              </Text>

              {wishlist.length > 0 ? (
                <TouchableOpacity onPress={clearWishlist} activeOpacity={0.7}>
                  <Text style={styles.wishClearText}>Clear all</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={styles.sheetClose}
                onPress={() => setWishlistOpen(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={20} color="#111" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}
            >
              {wishlist.length === 0 ? (
                <View style={styles.emptyBox}>
                  <View style={styles.emptyIcon}>
                    <Ionicons name="heart-outline" size={34} color="#111" />
                  </View>
                  <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
                  <Text style={styles.emptyText}>
                    Tap the heart on any item you love and it will be saved here for
                    later.
                  </Text>
                </View>
              ) : (
                wishlist.map((item) => (
                  <View key={item.id} style={styles.wishCard}>
                    <View style={styles.wishImageWrap}>
                      <Image source={item.image} style={styles.wishImage} />

                      {/* Trash: removes this item from the wishlist */}
                      <TouchableOpacity
                        style={styles.wishDelete}
                        onPress={() => removeFromWishlist(item.id)}
                        activeOpacity={0.8}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="trash-outline" size={15} color="#e8433a" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.wishInfo}>
                      <Text style={styles.wishName} numberOfLines={2}>
                        {item.name}
                      </Text>

                      <View style={styles.wishPriceRow}>
                        <Text style={styles.wishPrice}>Ksh {item.price}</Text>
                        <Text style={styles.wishOldPrice}>Ksh {item.oldPrice}</Text>
                      </View>

                      <View style={styles.wishButtons}>
                        <TouchableOpacity
                          style={styles.wishDetails}
                          onPress={() => openWishlistDetails(item.id)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.wishDetailsText}>Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.wishCart}
                          onPress={() => addWishlistItemToCart(item)}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.wishCartText}>Add to Cart</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={wishlist.length === 0 ? goShopping : () => setWishlistOpen(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetButtonText}>
                {wishlist.length === 0 ? 'Continue shopping' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Info sheet (Shipping & Returns, Terms & Privacy, About) */}
      <Modal
        visible={infoPage !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setInfoKey(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle} numberOfLines={1}>
                {infoPage?.title}
              </Text>

              <TouchableOpacity
                style={styles.sheetClose}
                onPress={() => setInfoKey(null)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={20} color="#111" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}
            >
              {infoPage?.sections.map((section) => (
                <View key={section.heading} style={styles.infoBlock}>
                  <Text style={styles.infoHeading}>{section.heading}</Text>
                  <Text style={styles.infoBody}>{section.body}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={() => setInfoKey(null)}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delivery addresses sheet (list + form in one place) */}
      <Modal
        visible={addressOpen}
        animationType="slide"
        transparent
        onRequestClose={() =>
          addressMode === 'form' ? setAddressMode('list') : closeAddresses()
        }
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View
            style={[
              styles.sheet,
              styles.sheetTall,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            {addressMode === 'list' ? (
              <>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>Delivery Addresses</Text>
                  <TouchableOpacity
                    style={styles.sheetClose}
                    onPress={closeAddresses}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close" size={20} color="#111" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.sheetContent}
                >
                  {sortedAddresses.length === 0 ? (
                    <View style={styles.emptyBox}>
                      <View style={styles.emptyIcon}>
                        <Ionicons name="location-outline" size={34} color="#111" />
                      </View>
                      <Text style={styles.emptyTitle}>No addresses yet</Text>
                      <Text style={styles.emptyText}>
                        Save a delivery address so checkout is quick and easy next
                        time.
                      </Text>
                    </View>
                  ) : (
                    sortedAddresses.map((a) => (
                      <View key={a.id} style={styles.addressCard}>
                        <View style={styles.addressTop}>
                          <View style={styles.labelRow}>
                            <View style={styles.labelIcon}>
                              <Ionicons
                                name={LABEL_ICONS[a.label] ?? 'location-outline'}
                                size={16}
                                color="#111"
                              />
                            </View>
                            <Text style={styles.addressLabel}>{a.label}</Text>
                            {a.isDefault ? (
                              <View style={styles.defaultBadge}>
                                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                              </View>
                            ) : null}
                          </View>

                          <View style={styles.iconActions}>
                            <TouchableOpacity
                              style={styles.iconButton}
                              onPress={() => openEdit(a)}
                              activeOpacity={0.7}
                            >
                              <Ionicons name="create-outline" size={17} color="#111" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.iconButton}
                              onPress={() => deleteAddress(a)}
                              activeOpacity={0.7}
                            >
                              <Ionicons name="trash-outline" size={17} color="#e8433a" />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <Text style={styles.addressName}>{a.fullName}</Text>
                        <Text style={styles.addressLine}>{a.phone}</Text>
                        <Text style={styles.addressLine}>
                          {[a.street, a.area, a.county].filter(Boolean).join(', ')}
                        </Text>
                        {a.notes ? (
                          <Text style={styles.addressNotes}>Note: {a.notes}</Text>
                        ) : null}

                        {!a.isDefault ? (
                          <TouchableOpacity
                            style={styles.setDefaultButton}
                            onPress={() => setDefault(a.id)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.setDefaultText}>Set as default</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    ))
                  )}
                </ScrollView>

                <TouchableOpacity
                  style={styles.sheetButton}
                  onPress={openAdd}
                  activeOpacity={0.85}
                >
                  <Text style={styles.sheetButtonText}>
                    {addresses.length === 0 ? 'Add address' : 'Add new address'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.sheetHeader}>
                  <TouchableOpacity
                    style={styles.sheetClose}
                    onPress={() => setAddressMode('list')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="arrow-back" size={20} color="#111" />
                  </TouchableOpacity>
                  <Text style={[styles.sheetTitle, styles.sheetTitleCenter]}>
                    {editingId ? 'Edit address' : 'New address'}
                  </Text>
                  <View style={{ width: 36 }} />
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.sheetContent}
                >
                  <Text style={styles.fieldLabel}>Save as</Text>
                  <View style={styles.chipRow}>
                    {LABELS.map((l) => (
                      <TouchableOpacity
                        key={l}
                        style={[styles.chip, form.label === l && styles.chipActive]}
                        onPress={() => setField('label', l)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            form.label === l && styles.chipTextActive,
                          ]}
                        >
                          {l}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.fieldLabel}>Full name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Name of the person receiving the order"
                    placeholderTextColor="#a8a39b"
                    value={form.fullName}
                    onChangeText={(t) => setField('fullName', t)}
                  />

                  <Text style={styles.fieldLabel}>Phone number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0712 345 678"
                    placeholderTextColor="#a8a39b"
                    keyboardType="phone-pad"
                    value={form.phone}
                    onChangeText={(t) => setField('phone', t)}
                  />

                  <Text style={styles.fieldLabel}>County / Town</Text>
                  <View style={styles.chipRow}>
                    {QUICK_TOWNS.map((town) => (
                      <TouchableOpacity
                        key={town}
                        style={[
                          styles.chip,
                          form.county === town && styles.chipActive,
                        ]}
                        onPress={() => setField('county', town)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            form.county === town && styles.chipTextActive,
                          ]}
                        >
                          {town}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Or type your county / town"
                    placeholderTextColor="#a8a39b"
                    value={form.county}
                    onChangeText={(t) => setField('county', t)}
                  />

                  <Text style={styles.fieldLabel}>Area / Estate</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Kileleshwa, Githurai 45, Nyali"
                    placeholderTextColor="#a8a39b"
                    value={form.area}
                    onChangeText={(t) => setField('area', t)}
                  />

                  <Text style={styles.fieldLabel}>Street, building or landmark</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Next to Total petrol station, 2nd floor"
                    placeholderTextColor="#a8a39b"
                    value={form.street}
                    onChangeText={(t) => setField('street', t)}
                  />

                  <Text style={styles.fieldLabel}>Delivery notes (optional)</Text>
                  <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    placeholder="e.g. Call when you reach the gate"
                    placeholderTextColor="#a8a39b"
                    multiline
                    value={form.notes}
                    onChangeText={(t) => setField('notes', t)}
                  />

                  <TouchableOpacity
                    style={styles.defaultRow}
                    onPress={() => setField('isDefault', !form.isDefault)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={form.isDefault ? 'checkbox' : 'square-outline'}
                      size={24}
                      color="#111"
                    />
                    <Text style={styles.defaultRowText}>
                      Use as my default address
                    </Text>
                  </TouchableOpacity>

                  {formError ? (
                    <Text style={styles.formError}>{formError}</Text>
                  ) : null}
                </ScrollView>

                <TouchableOpacity
                  style={styles.sheetButton}
                  onPress={saveAddress}
                  activeOpacity={0.85}
                >
                  <Text style={styles.sheetButtonText}>
                    {editingId ? 'Save changes' : 'Save address'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Login */}
      <LoginModal visible={loginOpen} onClose={() => setLoginOpen(false)} />
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f4efe9',
  },

  /* Header */
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e6e0d8',
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 26,
    fontFamily: serifFont,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 20,
    fontFamily: serifFont,
    fontWeight: '600',
    color: '#111',
  },
  editButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f0ebe4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Sections */
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 2,
    color: '#8a8a85',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 26,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  /* Rows */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2dbd2',
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f0ebe4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rowIconDanger: {
    backgroundColor: '#fdeceb',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
  },
  rowLabelDanger: {
    color: '#e8433a',
  },
  rowValue: {
    fontSize: 14,
    color: '#8a8a85',
    marginRight: 8,
  },

  /* Sheets */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    maxHeight: '85%',
    backgroundColor: '#f4efe9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sheetTall: {
    maxHeight: '92%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 22,
    fontFamily: serifFont,
    fontWeight: '600',
    color: '#111',
    marginRight: 12,
  },
  sheetTitleCenter: {
    textAlign: 'center',
    marginRight: 0,
  },
  sheetClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContent: {
    paddingBottom: 12,
  },
  infoBlock: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  infoHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  infoBody: {
    fontSize: 14,
    lineHeight: 21,
    color: '#555',
  },
  sheetButton: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  sheetButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  /* Empty states */
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 12,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 19,
    fontFamily: serifFont,
    fontWeight: '600',
    color: '#111',
  },
  emptyText: {
    fontSize: 14,
    color: '#8a8a85',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  /* Orders */
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  orderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  orderDate: {
    fontSize: 13,
    color: '#8a8a85',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  trackerRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  trackerStep: {
    flex: 1,
    alignItems: 'center',
  },
  trackerLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  trackerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2dbd2',
  },
  trackerLineDone: {
    backgroundColor: '#111',
  },
  trackerLineHidden: {
    backgroundColor: 'transparent',
  },
  trackerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e2dbd2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackerDotDone: {
    backgroundColor: '#111',
  },
  trackerLabel: {
    fontSize: 11,
    color: '#a8a39b',
    marginTop: 6,
    fontWeight: '600',
  },
  trackerLabelDone: {
    color: '#111',
  },
  orderItemsRow: {
    gap: 8,
    marginTop: 14,
  },
  orderItem: {
    position: 'relative',
  },
  orderItemImage: {
    width: 56,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0ebe4',
  },
  qtyBadge: {
    position: 'absolute',
    right: 3,
    bottom: 3,
    backgroundColor: '#111',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  qtyBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  orderNames: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
    lineHeight: 20,
  },
  orderAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  orderAddress: {
    flex: 1,
    fontSize: 13,
    color: '#8a8a85',
  },
  orderBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2dbd2',
  },
  orderCount: {
    fontSize: 12,
    color: '#8a8a85',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  cancelOrderButton: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fdeceb',
  },
  cancelOrderText: {
    color: '#e8433a',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Wishlist */
  wishCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  wishImageWrap: {
    position: 'relative',
  },
  wishImage: {
    width: 86,
    height: 108,
    borderRadius: 10,
    backgroundColor: '#f0ebe4',
  },
  wishDelete: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  wishClearText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e8433a',
    marginRight: 12,
  },
  wishInfo: {
    flex: 1,
    marginLeft: 12,
  },
  wishName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  wishPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  wishPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  wishOldPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  wishButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 'auto',
    paddingTop: 10,
  },
  wishDetails: {
    flex: 1,
    backgroundColor: '#eee',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  wishDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },
  wishCart: {
    flex: 1.4,
    backgroundColor: '#111',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  wishCartText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  /* Addresses: cards */
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  addressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  labelIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#f0ebe4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  defaultBadge: {
    backgroundColor: '#111',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 10,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  iconActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f0ebe4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  addressLine: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  addressNotes: {
    fontSize: 13,
    color: '#8a8a85',
    marginTop: 6,
    fontStyle: 'italic',
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  setDefaultText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },

  /* Addresses: form */
  fieldLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: '#8a8a85',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111',
    borderWidth: 1,
    borderColor: '#e2dbd2',
  },
  inputMultiline: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2dbd2',
  },
  chipActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },
  chipTextActive: {
    color: '#fff',
  },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  defaultRowText: {
    fontSize: 15,
    color: '#111',
    fontWeight: '500',
  },
  formError: {
    color: '#e8433a',
    fontSize: 14,
    marginTop: 14,
  },
})

export default Profile