import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar,
  ScrollView,
  useWindowDimensions,
  ImageSourcePropType,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

/* -------------------------------------------------------------------------- */
/*                                    DATA                                    */
/* -------------------------------------------------------------------------- */

type Slide = {
  id: string
  image: ImageSourcePropType
  tag: string
  title: string
  highlight: string
  subtitle: string
}

// Carousel: the first 3 images. Change the texts as you like
const slides: Slide[] = [
  {
    id: '1',
    image: require('../../../assets/images/Pictures/nguo1.png'),
    tag: 'New Collection',
    title: 'Dresses For Every Occasion',
    highlight: 'Up to 30% OFF!',
    subtitle: 'Elegant, modest and made to fit you',
  },
  {
    id: '2',
    image: require('../../../assets/images/Pictures/nguo2.png'),
    tag: 'Evening Wear',
    title: 'Shine At Every Event',
    highlight: 'From Ksh 1,300',
    subtitle: 'Gowns and satin dresses you will love',
  },
  {
    id: '3',
    image: require('../../../assets/images/Pictures/nguo3.png'),
    tag: 'Weekend Deal',
    title: 'Buy More, Save More!',
    highlight: '2 Dresses 15% OFF',
    subtitle: 'Free delivery on bigger orders',
  },
]

type Product = {
  id: string
  image: ImageSourcePropType
  name: string
  price: number
  oldPrice: number
  fit?: 'cover' | 'contain'
}

const dresses: Product[] = [
  {
    id: 'd4',
    image: require('../../../assets/images/Pictures/nguo4.png'),
    name: 'Long Sleeve Gown',
    price: 1000,
    oldPrice: 1400,
  },
  {
    id: 'd5',
    image: require('../../../assets/images/Pictures/nguo5.png'),
    name: 'Chiffon Layered Dress',
    price: 1050,
    oldPrice: 1200,
  },
  {
    id: 'd6',
    image: require('../../../assets/images/Pictures/nguo6.png'),
    name: 'Kaftan Dress',
    price: 800,
    oldPrice: 1100,
  },
  {
    id: 'd7',
    image: require('../../../assets/images/Pictures/nguo7.png'),
    name: 'Wrap Midi Dress',
    price: 1300,
    oldPrice: 1500,
  },
  {
    id: 'd8',
    image: require('../../../assets/images/Pictures/nguo8.png'),
    name: 'Party Dress',
    price: 1500,
    oldPrice: 1800,
  },
  {
    id: 'd9',
    image: require('../../../assets/images/Pictures/nguo11.png'),
    name: 'Dress 9',
    price: 1500,
    oldPrice: 1800,
  },
  {
    id: 'd10',
    image: require('../../../assets/images/Pictures/nguo10.png'),
    name: 'Dress 10',
    price: 900,
    oldPrice: 1000,
  },
  {
    id: 'd11',
    image: require('../../../assets/images/Pictures/nguo11.png'),
    name: 'Dress 11',
    price: 1100,
    oldPrice: 1200,
  },
  {
    id: 'd12',
    image: require('../../../assets/images/Pictures/nguo12.png'),
    name: 'Dress 12',
    price: 700,
    oldPrice: 850,
  },
  {
    id: 'd13',
    image: require('../../../assets/images/Pictures/nguo13.png'),
    name: 'Dress 13',
    price: 800,
    oldPrice: 950,
  },
]

const AUTO_PLAY_MS = 4000
const SIDE_PADDING = 16
const GRID_GAP = 12
const PRODUCT_IMAGE_RATIO = 4 / 5
// Shape of the carousel image (width / height). Make it smaller for a taller image
const SLIDE_IMAGE_RATIO = 4 / 3

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
})


const DressCarousel = () => {
  const { width } = useWindowDimensions()
  const listRef = useRef<FlatList<Slide>>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = (index + 1) % slides.length
      listRef.current?.scrollToIndex({ index: next, animated: true })
      setIndex(next)
    }, AUTO_PLAY_MS)

    return () => clearTimeout(timer)
  }, [index])

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
  }

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.slideImageFrame}>
        <Image
          source={item.image}
          resizeMode="cover"
          style={styles.slideImage}
        />
      </View>

      <View style={styles.slideTextBlock}>
        <Text style={styles.slideTag}>{item.tag.toUpperCase()}</Text>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideHighlight}>{item.highlight}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.carousel}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
      />

      <View style={styles.dotsRow}>
        {slides.map((slide, i) => (
          <View
            key={slide.id}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/*                                LIKE BUTTON                                 */
/* -------------------------------------------------------------------------- */

const LikeButton = ({ product }: { product: Product }) => {
  const { isLiked, toggle } = useWishlist()
  const liked = isLiked(product.id)
  const scale = useRef(new Animated.Value(1)).current

  const handlePress = () => {
    toggle({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
    })
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.4,
        useNativeDriver: true,
        speed: 20,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start()
  }

  return (
    <TouchableOpacity style={styles.heartButton} onPress={handlePress}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={18}
          color={liked ? '#ff3040' : '#333'}
        />
      </Animated.View>
    </TouchableOpacity>
  )
}

/* -------------------------------------------------------------------------- */
/*                               PRODUCT GRID                                 */
/* -------------------------------------------------------------------------- */

const ProductGrid = ({ items }: { items: Product[] }) => {
  const { width } = useWindowDimensions()
  const { addToCart } = useCart()

  const cardWidth = (width - SIDE_PADDING * 2 - GRID_GAP) / 2

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
    })
    router.push('/cart')
  }

  return (
    <View style={styles.grid}>
      {items.map((product) => (
        <View key={product.id} style={[styles.card, { width: cardWidth }]}>
          <View style={styles.imageWrapper}>
            <Image
              source={product.image}
              resizeMode={product.fit ?? 'cover'}
              style={styles.productImage}
            />

            <View style={styles.saleBadge}>
              <Text style={styles.saleBadgeText}>SALE</Text>
            </View>

            <LikeButton product={product} />
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>Ksh {product.price}</Text>
              <Text style={styles.oldPrice}>Ksh {product.oldPrice}</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() =>
                  router.push({
                    pathname: '/details/[id]',
                    params: { id: product.id },
                  })
                }
              >
                <Text style={styles.detailsText}>Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => handleAddToCart(product)}
              >
                <Text style={styles.cartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/*                              DRESSES SECTION                               */
/* -------------------------------------------------------------------------- */

const DressesSection = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.boltCircle}>
            <Ionicons name="woman" size={16} color="#fff" />
          </View>
          <Text style={styles.sectionTitle}>Dresses</Text>
        </View>

        <Text style={styles.countText}>{dresses.length} styles</Text>
      </View>

      {/* Product grid */}
      <ProductGrid items={dresses} />
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 MAIN PAGE                                  */
/* -------------------------------------------------------------------------- */

const Page1 = () => {
  const insets = useSafeAreaInsets()
  // Status bar height: the larger of the safe-area inset and Android's status bar height
  const topPad = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0
  )

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: topPad }}
        showsVerticalScrollIndicator={false}
      >
        <DressCarousel />
        <DressesSection />
      </ScrollView>

      {/* Solid strip behind the clock so scrolled content never shows through it */}
      <View pointerEvents="none" style={[styles.statusBarMask, { height: topPad }]} />
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
  scroll: {
    flex: 1,
  },
  statusBarMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#f4efe9',
  },

  /* Carousel */
  carousel: {
    backgroundColor: '#f4efe9',
    paddingTop: 16,
    paddingBottom: 20,
  },
  slide: {
    paddingHorizontal: SIDE_PADDING,
  },
  slideImageFrame: {
    width: '100%',
    aspectRatio: SLIDE_IMAGE_RATIO,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e6e0d8',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideTextBlock: {
    alignItems: 'center',
    marginTop: 22,
    paddingHorizontal: 8,
  },
  slideTag: {
    fontSize: 13,
    letterSpacing: 2,
    color: '#8a8a85',
    fontWeight: '600',
    marginBottom: 10,
  },
  slideTitle: {
    fontSize: 30,
    fontFamily: serifFont,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
  },
  slideHighlight: {
    fontSize: 30,
    fontFamily: serifFont,
    fontWeight: '600',
    color: '#2f66e8',
    textAlign: 'center',
  },
  slideSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 22,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d2d0cc',
  },
  dotActive: {
    width: 32,
    backgroundColor: '#111',
  },

  /* Section */
  container: {
    paddingHorizontal: SIDE_PADDING,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#f4efe9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boltCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: serifFont,
    fontWeight: '600',
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2f66e8',
  },

  /* Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: PRODUCT_IMAGE_RATIO,
    backgroundColor: '#f0ebe4',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#e8433a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  saleBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  oldPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#eee',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cartButton: {
    flex: 1.4,
    backgroundColor: '#111',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  cartText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
})

export default Page1