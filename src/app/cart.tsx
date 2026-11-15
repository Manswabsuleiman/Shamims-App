import {
  View,
  Text,
  Image,
  ImageBackground,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCart, CartItem } from '@/context/CartContext'

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
})

const Cart = () => {
  const insets = useSafeAreaInsets()
  const topPad = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0
  )

  const { items, increase, decrease, remove, totalItems, totalPrice } =
    useCart()

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/home')
    }
  }

  const goShopping = () => router.replace('/sell')

  const Banner = (
    <ImageBackground
      source={require('../../assets/images/Pictures/kert.png')}
      style={[styles.banner, { paddingTop: topPad }]}
      resizeMode="cover"
    >
      
                                <View style={[StyleSheet.absoluteFill, styles.bannerOverlay]} />

                <TouchableOpacity
        style={[styles.backButton, { top: topPad + 10 }]}
        onPress={handleBack}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={22} color="#111" />
      </TouchableOpacity>

      <Text style={styles.bannerTitle}>Your Cart</Text>
    </ImageBackground>
  )

  if (items.length === 0) {
    return (
      <View style={styles.page}>
        {Banner}

        <View style={styles.empty}>
          <Ionicons name="bag-handle-outline" size={72} color="#d2d0cc" />
          <Text style={styles.emptyText}>
            Your selection is currently empty
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={goShopping}
            activeOpacity={0.85}
          >
            <Text style={styles.shopButtonText}>Go Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemCard}>
      <Image source={item.image} style={styles.itemImage} resizeMode="cover" />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>Ksh {item.price}</Text>
          <Text style={styles.itemOldPrice}>Ksh {item.oldPrice}</Text>
        </View>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => decrease(item.id)}
          >
            <Ionicons name="remove" size={16} color="#111" />
          </TouchableOpacity>

          <Text style={styles.qtyText}>{item.qty}</Text>

          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => increase(item.id)}
          >
            <Ionicons name="add" size={16} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => remove(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#e8433a" />
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.page}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={Banner}
        contentContainerStyle={{ paddingBottom: 140 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom summary bar */}
      <View
        style={[
          styles.summaryBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View>
          <Text style={styles.summaryLabel}>
            Total ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </Text>
          <Text style={styles.summaryTotal}>Ksh {totalPrice}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            // TODO: plug in your checkout / payment (e.g. M-Pesa) here
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* Banner */
  banner: {
    width: '100%',
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  bannerOverlay: {
    backgroundColor: 'rgba(214, 90, 120, 0.55)',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 30,
    fontFamily: serifFont,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  /* Empty state */
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: serifFont,
    color: '#777',
    marginTop: 18,
    textAlign: 'center',
  },
  shopButton: {
    marginTop: 24,
    backgroundColor: '#111',
    paddingHorizontal: 34,
    paddingVertical: 14,
    borderRadius: 30,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Items */
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  itemImage: {
    width: 84,
    height: 105,
    borderRadius: 8,
    backgroundColor: '#f0ebe4',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e8433a',
  },
  itemOldPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 14,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '600',
    minWidth: 16,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },

  /* Summary bar */
  summaryBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8a8a85',
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  checkoutButton: {
    backgroundColor: '#111',
    paddingHorizontal: 34,
    paddingVertical: 14,
    borderRadius: 10,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
})

export default Cart