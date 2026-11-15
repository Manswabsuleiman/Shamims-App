import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Footer from './Footer'

const Latest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        FEATURED <Text style={styles.highlight}>LATEST</Text>
      </Text>
      <Text style={styles.text}>PRODUCTS</Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <Image
            source={require('../../assets/images/Pictures/abayawall.png')}
            style={styles.image}
          />
        </View>

        <View style={styles.card}>
          <Image
            source={require('../../assets/images/Pictures/hijabwall.png')}
            style={styles.image}
          />
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>FASHION</Text>
        <Text style={styles.label}>HIJABS</Text>
      </View>

      <Text style={{
        color: '#bab0b0',
        fontSize: 24,
        fontWeight: '500',
        marginTop: 24,
        alignSelf: 'flex-start',
      }}>New Arrivals</Text>

      <View style={{ alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 24, fontWeight: '400' }}>
          Our <Text style={{ color: 'blue' }}>Latest</Text> Collection
        </Text>
      </View>

      {/* Product grid 1 */}
      <View style={styles.gridContainer}>

        <View style={styles.gridCard}>
          <View style={{ position: 'relative' }}>
            <Image
              source={require('../../assets/images/Pictures/dresswall.png')}
              style={styles.gridImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>DRESS</Text>
            </View>
          </View>

          <View style={styles.gridCardFooter}>
            <Text style={styles.gridCardTitle}>Fashion</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.shopText}>SHOP</Text>
              <Text style={styles.shopText}> →</Text>
            </View>
          </View>
        </View>

        <View style={styles.gridCard}>
          <View style={{ position: 'relative' }}>
            <Image
              source={require('../../assets/images/Pictures/hijabwall2.png')}
              style={styles.gridImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>HIJAB</Text>
            </View>
          </View>

          <View style={styles.gridCardFooter}>
            <Text style={styles.gridCardTitle}>Hijab Collection</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.shopText}>SHOP</Text>
              <Text style={styles.shopText}> →</Text>
            </View>
          </View>
        </View>

        <View style={styles.gridCard}>
          <View style={{ position: 'relative' }}>
            <Image
              source={require('../../assets/images/Pictures/dresswall2.png')}
              style={styles.gridImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>DRESS</Text>
            </View>
          </View>

          <View style={styles.gridCardFooter}>
            <Text style={styles.gridCardTitle}>Fashion</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.shopText}>SHOP</Text>
              <Text style={styles.shopText}> →</Text>
            </View>
          </View>
        </View>

        <View style={styles.gridCard}>
          <View style={{ position: 'relative' }}>
            <Image
              source={require('../../assets/images/Pictures/hijabwall3.png')}
              style={styles.gridImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>HIJAB</Text>
            </View>
          </View>

          <View style={styles.gridCardFooter}>
            <Text style={styles.gridCardTitle}>Hijab Collection</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.shopText}>SHOP</Text>
              <Text style={styles.shopText}> →</Text>
            </View>
          </View>
        </View>

      </View>

      {/* Product grid 2 */}
      <View style={styles.gridContainer}>

        <View style={styles.gridCard}>
          <View style={{ position: 'relative' }}>
            <Image
              source={require('../../assets/images/Pictures/dresswall3.png')}
              style={styles.gridImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>DRESSES</Text>
            </View>
          </View>

          <View style={styles.gridCardFooter}>
            <Text style={styles.gridCardTitle}>Trendy Fashion</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.shopText}>SHOP</Text>
              <Text style={styles.shopText}> →</Text>
            </View>
          </View>
        </View>

        <View style={styles.gridCard}>
          <View style={{ position: 'relative' }}>
            <Image
              source={require('../../assets/images/Pictures/hijab1.png')}
              style={styles.gridImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>HIJAB</Text>
            </View>
          </View>

          <View style={styles.gridCardFooter}>
            <Text style={styles.gridCardTitle}>Hijab Collection</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.shopText}>SHOP</Text>
              <Text style={styles.shopText}> →</Text>
            </View>
          </View>
        </View>

        <View style={styles.gridCard}>
          <View style={{ position: 'relative' }}>
            <Image
              source={require('../../assets/images/Pictures/dresswall4.png')}
              style={styles.gridImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>MODEST</Text>
            </View>
          </View>

          <View style={styles.gridCardFooter}>
            <Text style={styles.gridCardTitle}>Modest Wear</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.shopText}>SHOP</Text>
              <Text style={styles.shopText}> →</Text>
            </View>
          </View>
        </View>

        <View style={styles.gridCard}>
          <View style={{ position: 'relative' }}>
            <Image
              source={require('../../assets/images/Pictures/hijabwall2.png')}
              style={styles.gridImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>HIJAB</Text>
            </View>
            <View style={styles.lengthBadge}>
              <Text style={styles.lengthBadgeText}>2m</Text>
            </View>
          </View>

          <View style={styles.gridCardFooter}>
            <Text style={styles.gridCardTitle}>Hijab Fabric</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.shopText}>SHOP</Text>
              <Text style={styles.shopText}> →</Text>
            </View>
          </View>
        </View>

      </View>

      {/* Collection banner */}
      <ImageBackground
        source={require('../../assets/images/Pictures/beautiful.png')}
        style={styles.banner}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={[StyleSheet.absoluteFill, styles.bannerOverlay]} />

        <View style={styles.bannerLeft}>
          <Text style={styles.bannerLabel}>COLLECTION</Text>
          <Text style={styles.bannerTitle}>
          Be <Text style={{ fontStyle: 'italic' }}>Beautiful</Text>

          </Text>
        </View>
      </ImageBackground>

      {/* Shipping & Delivery */}
      <View style={styles.shippingSection}>
        <Text style={styles.shippingLabel}>SHIPPING  &  DELIVERY</Text>

        <Text style={styles.shippingHeading}>
          Orders made and <Text style={{ color: '#4a5fe8', fontStyle: 'italic' }}>delivered</Text> on time  ✦
        </Text>

        <Text style={styles.shippingParagraph}>
          Fast. Secure. Global. Experience worry-free shopping with real-time tracking and
          world-class delivery. Your style, delivered on your schedule.
        </Text>

        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <Ionicons name="arrow-forward" size={14} color="#4a5fe8" />
            <Text style={styles.pillText}>Real-time Tracking</Text>
          </View>

          <View style={styles.pill}>
            <Ionicons name="arrow-forward" size={14} color="#4a5fe8" />
            <Text style={styles.pillText}>Worldwide Shipping</Text>
          </View>

          <View style={styles.pill}>
            <Ionicons name="arrow-forward" size={14} color="#4a5fe8" />
            <Text style={styles.pillText}>Secure Packaging</Text>
          </View>
        </View>
      </View>
            <View style={{marginTop: 60}}>
              <Footer/>
            </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '400',
  },
  highlight: {
    color: 'blue',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  gridCard: {
    width: '48%',
    marginBottom: 24,
  },
  gridImage: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(240,240,240,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  lengthBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lengthBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  gridCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  gridCardTitle: {
    fontSize: 20,
    fontStyle: 'italic',
  },
  shopText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a4fd6',
  },
  banner: {
    width: '100%',
    height: 260,
    marginTop: 32,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 24,
  },
  bannerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bannerLeft: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bannerLabel: {
    color: '#eee',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 6,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '600',
  },
  bannerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bannerBigTitle: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '300',
    textAlign: 'right',
  },
  bannerSubtitle: {
    color: '#ddd',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'right',
  },
  shopNowButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  shippingSection: {
    width: '100%',
    marginTop: 40,
    alignItems: 'flex-start',
  },
  shippingLabel: {
    fontSize: 13,
    letterSpacing: 3,
    color: '#999',
    fontWeight: '600',
  },
  shippingHeading: {
    fontSize: 28,
    marginTop: 12,
    fontWeight: '400',
    lineHeight: 36,
  },
  shippingParagraph: {
    fontSize: 15,
    color: '#555',
    marginTop: 16,
    lineHeight: 24,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c8d0f5',
    backgroundColor: '#f3f5ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  pillText: {
    color: '#4a5fe8',
    fontWeight: '600',
    fontSize: 13,
  },
})

export default Latest