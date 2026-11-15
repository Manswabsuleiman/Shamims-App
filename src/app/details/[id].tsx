import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  Easing,
  useWindowDimensions,
  ImageSourcePropType,
} from 'react-native'
import React, { useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useCart } from '@/context/CartContext'

/* -------------------------------------------------------------------------- */
/*                                    DATA                                    */
/* -------------------------------------------------------------------------- */

type Product = {
  id: string
  image: ImageSourcePropType
  name: string
  price: number
  oldPrice: number
  description: string
  fit?: 'cover' | 'contain'
}

// IMPORTANT: every id must be UNIQUE, and must match the ids used on the
// Home, Hijabs and Dresses pages. If two products share an id, the first
// one always wins and the other never opens.
const products: Product[] = [
  /* ------------------------------- Dresses ------------------------------- */
  {
    id: '1',
    image: require('../../../assets/images/Pictures/dresswall2.png'),
    name: 'Sun dresses',
    price: 1200,
    oldPrice: 1400,
    description:
      'Light, breezy and comfortable sun dresses, perfect for warm days and weekend outings. Soft fabric that keeps its shape wash after wash.',
  },
  {
    id: '2',
    image: require('../../../assets/images/Pictures/dresswall3.png'),
    name: 'Dress2',
    price: 1900,
    oldPrice: 2000,
    description:
      'An elegant everyday dress with a flattering fit. Easy to style for work, church or a casual day out.',
  },
  {
    id: '3',
    image: require('../../../assets/images/Pictures/dresswall4.png'),
    name: 'Dress3',
    price: 1050,
    oldPrice: 1200,
    fit: 'contain',
    description:
      'A simple, modest dress made from breathable fabric. Comfortable all day and easy to dress up or down.',
  },
  {
    id: '4',
    image: require('../../../assets/images/Pictures/dresswall.png'),
    name: 'Mixed Pack',
    price: 1500,
    oldPrice: 1700,
    description:
      'A value pack of assorted styles at a special price. Great for gifting or refreshing your wardrobe in one go.',
  },

  /* ------------------------------- Hijabs -------------------------------- */
  {
    id: 'h1',
    image: require('../../../assets/images/Pictures/chiffon.png'),
    name: 'Chiffon Hijab',
    price: 350,
    oldPrice: 450,
    description:
      'Lightweight chiffon hijab that drapes beautifully and stays comfortable through the day.',
  },
  {
    id: 'h2',
    image: require('../../../assets/images/Pictures/chiffon2.png'),
    name: 'Chiffon 2',
    price: 400,
    oldPrice: 500,
    description:
      'Soft, flowing chiffon in a fresh colour. Airy to wear and easy to style in any look.',
  },
  {
    id: 'h3',
    image: require('../../../assets/images/Pictures/jersey.png'),
    name: 'Jersey Hijabs',
    price: 450,
    oldPrice: 550,
    description:
      'Stretchy, soft jersey hijab that stays in place with no pins needed. Easy to wear and easy to care for.',
  },
  {
    id: 'h4',
    image: require('../../../assets/images/Pictures/plisket.png'),
    name: 'Plisket Hijabs',
    price: 450,
    oldPrice: 500,
    description:
      'Neatly pleated plisket hijab with a stylish textured finish. Light, comfortable and holds its shape.',
  },
  {
    id: 'h5',
    image: require('../../../assets/images/Pictures/pashmina.png'),
    name: 'Pashmina',
    price: 400,
    oldPrice: 500,
    description:
      'Warm, soft pashmina scarf with a generous size. Perfect for cooler days and easy to drape in many ways.',
  },
  {
    id: 'h6',
    image: require('../../../assets/images/Pictures/pashmina2.png'),
    name: 'Pashmina 2',
    price: 450,
    oldPrice: 500,
    description:
      'A rich, cosy pashmina in a new shade. Soft to the touch and ideal for everyday modest styling.',
  },
  {
    id: 'h7',
    image: require('../../../assets/images/Pictures/crinkle.png'),
    name: 'Crinkle',
    price: 800,
    oldPrice: 1000,
    description:
      'Textured crinkle hijab that needs no ironing. Lightweight, breathable and effortlessly stylish.',
  },
  {
    id: 'h8',
    image: require('../../../assets/images/Pictures/hijab1.png'),
    name: 'Colored Hijabs',
    price: 450,
    oldPrice: 550,
    description:
      'A range of bright and classic colours. Mix and match to suit any outfit.',
  },

  /* ---------------------------- Dresses page ----------------------------- */
  {
    id: 'd4',
    image: require('../../../assets/images/Pictures/nguo4.png'),
    name: 'Long Sleeve Gown',
    price: 1000,
    oldPrice: 1400,
    description:
      'An elegant long sleeve gown with a graceful fit. Perfect for special occasions and modest styling.',
  },
  {
    id: 'd5',
    image: require('../../../assets/images/Pictures/nguo5.png'),
    name: 'Chiffon Layered Dress',
    price: 1050,
    oldPrice: 1200,
    description:
      'A light, layered chiffon dress that flows beautifully. Comfortable and easy to dress up.',
  },
  {
    id: 'd6',
    image: require('../../../assets/images/Pictures/nguo6.png'),
    name: 'Kaftan Dress',
    price: 800,
    oldPrice: 1100,
    description:
      'A relaxed, roomy kaftan in breathable fabric. Great for everyday wear and warm days.',
  },
  {
    id: 'd7',
    image: require('../../../assets/images/Pictures/nguo7.png'),
    name: 'Wrap Midi Dress',
    price: 1300,
    oldPrice: 1500,
    description:
      'A flattering wrap-style midi dress that adjusts to your fit. Smart enough for work and church.',
  },
  {
    id: 'd8',
    image: require('../../../assets/images/Pictures/nguo8.png'),
    name: 'Party Dress',
    price: 1500,
    oldPrice: 1800,
    description:
      'A stylish dress made for parties and celebrations. Comfortable to wear all evening.',
  },
  {
    id: 'd9',
    image: require('../../../assets/images/Pictures/nguo11.png'),
    name: 'Dress 9',
    price: 1500,
    oldPrice: 1800,
    description: 'Write your description for this dress here.',
  },
  {
    id: 'd10',
    image: require('../../../assets/images/Pictures/nguo10.png'),
    name: 'Dress 10',
    price: 900,
    oldPrice: 1000,
    description: 'Write your description for this dress here.',
  },
  {
    id: 'd11',
    image: require('../../../assets/images/Pictures/nguo11.png'),
    name: 'Dress 11',
    price: 1100,
    oldPrice: 1200,
    description: 'Write your description for this dress here.',
  },
  {
    id: 'd12',
    image: require('../../../assets/images/Pictures/nguo12.png'),
    name: 'Dress 12',
    price: 700,
    oldPrice: 850,
    description: 'Write your description for this dress here.',
  },
  {
    id: 'd13',
    image: require('../../../assets/images/Pictures/nguo13.png'),
    name: 'Dress 13',
    price: 800,
    oldPrice: 950,
    description: 'Write your description for this dress here.',
  },
]

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
})

const IMAGE_RATIO = 4 / 5

/* -------------------------------------------------------------------------- */
/*                               DETAILS SCREEN                               */
/* -------------------------------------------------------------------------- */

const ProductDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const { addToCart } = useCart()
  const { width, height } = useWindowDimensions()

  const drop = useRef(new Animated.Value(0)).current
  const [dropping, setDropping] = useState(false)

  const topPad = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0
  )

  const product = products.find((p) => p.id === id)

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/home')
    }
  }

  const FLY_W = 150
  const FLY_H = 190
  const flyLeft = (width - FLY_W) / 2
  const flyTop = topPad + 70

  const targetX = width - 100 - (flyLeft + FLY_W / 2)
  const targetY = height - Math.max(insets.bottom, 12) - 40 - (flyTop + FLY_H / 2)

  const handleAddToCart = () => {
    if (!product || dropping) return

    setDropping(true)
    drop.setValue(0)

    Animated.timing(drop, {
      toValue: 1,
      duration: 650,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
      })
      setDropping(false)
      router.push('/cart')
    })
  }

  // Product not found
  if (!product) {
    return (
      <View style={[styles.page, styles.center, { paddingTop: topPad }]}>
        <Text style={styles.notFoundText}>Product not found</Text>
        <TouchableOpacity style={styles.notFoundButton} onPress={handleBack}>
          <Text style={styles.cartText}>Go back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  )

  return (
    <View style={styles.page}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: topPad, paddingBottom: 120 }}
      >
        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={product.image}
            resizeMode={product.fit ?? 'cover'}
            style={styles.image}
          />

          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>-{discount}%</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>Ksh {product.price}</Text>
            <Text style={styles.oldPrice}>Ksh {product.oldPrice}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Picture that drops into the cart when "Add to Cart" is pressed */}
      {dropping && (
        <Animated.Image
          source={product.image}
          resizeMode="cover"
          pointerEvents="none"
          style={{
            position: 'absolute',
            zIndex: 50,
            left: flyLeft,
            top: flyTop,
            width: FLY_W,
            height: FLY_H,
            borderRadius: 12,
            transform: [
              {
                translateX: drop.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, targetX],
                }),
              },
              {
                translateY: drop.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, targetY],
                }),
              },
              {
                scale: drop.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.12],
                }),
              },
            ],
            opacity: drop.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [1, 1, 0.5],
            }),
          }}
        />
      )}

      {/* Back button (floats over the image) */}
      <TouchableOpacity
        style={[styles.backButton, { top: topPad + 10 }]}
        onPress={handleBack}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={22} color="#111" />
      </TouchableOpacity>

      {/* Bottom Add to Cart bar */}
      <View
        style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        <View>
          <Text style={styles.bottomLabel}>Price</Text>
          <Text style={styles.bottomPrice}>Ksh {product.price}</Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Image */
  imageWrapper: {
    width: '100%',
    aspectRatio: IMAGE_RATIO,
    backgroundColor: '#f0ebe4',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  saleBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#e8433a',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  saleBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Back button */
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

  /* Info */
  info: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  name: {
    fontSize: 28,
    fontFamily: serifFont,
    fontWeight: '600',
    color: '#111',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e8433a',
  },
  oldPrice: {
    fontSize: 17,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2dbd2',
    marginVertical: 20,
  },
  sectionLabel: {
    fontSize: 13,
    letterSpacing: 2,
    color: '#8a8a85',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },

  /* Bottom bar */
  bottomBar: {
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
  bottomLabel: {
    fontSize: 12,
    color: '#8a8a85',
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  cartText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  /* Not found */
  notFoundText: {
    fontSize: 18,
    fontFamily: serifFont,
    marginBottom: 16,
  },
  notFoundButton: {
    backgroundColor: '#111',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
})

export default ProductDetails