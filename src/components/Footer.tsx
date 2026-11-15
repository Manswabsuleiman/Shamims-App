import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'

const Footer = () => {
  const [email, setEmail] = useState('')

  return (
    <View style={styles.container}>

      {/* Top image with quote */}
      <ImageBackground
        source={require('../../assets/images/Pictures/kart.png')}
        style={styles.heroImage}
      >
        <View style={styles.heroOverlay} />
        <View style={styles.heroTextWrap}>
          <Text style={styles.quote}>
            "Dress with Grace. <Text style={styles.quoteBlue}>Walk with Confidence."</Text>
          </Text>
          <Text style={styles.location}>SHAMIMS ABAYA · NAIROBI</Text>
        </View>
      </ImageBackground>

      {/* Bottom dark section */}
      <View style={styles.bottomSection}>

        <View style={styles.bottomRow}>

          {/* Brand column */}
          <View style={styles.brandColumn}>
            <Text style={styles.arabicText}>عَبَايِ</Text>
            <Text style={styles.brandName}>SHAMIMS</Text>
            <Text style={styles.brandSubname}>Abaya</Text>
            <View style={styles.divider} />
            <Text style={styles.brandParagraph}>
              Crafted for the woman who carries grace in every step. Heritage, artistry, and quiet confidence in every stitch.
            </Text>
          </View>

          {/* Newsletter column */}
          <View style={styles.newsletterColumn}>
            <Text style={styles.newsletterTitle}>Join the inner circle</Text>
            <Text style={styles.newsletterSubtitle}>
              New arrivals & exclusive offers — straight to your inbox.
            </Text>

            <View style={styles.subscribeRow}>
              <TextInput
                placeholder="Your email address"
                placeholderTextColor="#8a93b8"
                value={email}
                onChangeText={setEmail}
                style={styles.emailInput}
              />
              <TouchableOpacity style={styles.subscribeButton}>
                <Text style={styles.subscribeText}>Subscribe</Text>
              </TouchableOpacity>
            </View>

            <Image
              source={require('../../assets/images/Pictures/logo.png')}
              style={styles.footerLogo}
            />
          </View>

        </View>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: 380,
    justifyContent: 'center',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(90,20,60,0.25)',
  },
  heroTextWrap: {
    paddingHorizontal: 24,
  },
  quote: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 38,
  },
  quoteBlue: {
    color: '#a9c4ff',
  },
  location: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: 3,
    marginTop: 16,
    fontWeight: '600',
  },
  bottomSection: {
    backgroundColor: '#0a1128',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  bottomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  brandColumn: {
    flex: 1,
    minWidth: 220,
    marginBottom: 24,
    paddingRight: 16,
  },
  arabicText: {
    color: '#d4a94a',
    fontSize: 20,
    marginBottom: 6,
  },
  brandName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 2,
  },
  brandSubname: {
    color: '#8ea3ff',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: '#d4a94a',
    marginBottom: 16,
  },
  brandParagraph: {
    color: '#c7cce0',
    fontSize: 15,
    lineHeight: 24,
  },
  newsletterColumn: {
    flex: 1,
    minWidth: 260,
  },
  newsletterTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  newsletterSubtitle: {
    color: '#8ea3ff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  subscribeRow: {
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
  },
  emailInput: {
    flex: 1,
    backgroundColor: '#131b3a',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  subscribeButton: {
    backgroundColor: '#d4a94a',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  subscribeText: {
    color: '#0a1128',
    fontWeight: '700',
    fontSize: 14,
  },
  footerLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 24,
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderColor: '#fff',
  },
})

export default Footer