import { View, Image, StyleSheet, FlatList, Dimensions, ScrollView, Platform, StatusBar } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Latest from '../../components/Latest'

const { width } = Dimensions.get('window')

const carouselImages = [
  require('../../../assets/images/Pictures/squid.png'),
  require('../../../assets/images/Pictures/winter.png'),
  require('../../../assets/images/Pictures/snip.png'),
]

const Home = () => {
  const insets = useSafeAreaInsets()
  const topPad = Math.max(insets.top, Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0)
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const indexRef = useRef(0)

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width)
    indexRef.current = index
    setActiveIndex(index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % carouselImages.length
      indexRef.current = nextIndex
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
      setActiveIndex(nextIndex)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <View style={[styles.safe, { paddingTop: topPad }]}>
      
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/Pictures/logo.png')}
          style={styles.logo}
        />
      </View>

      {/* Only this part scrolls */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <FlatList
          ref={flatListRef}
          data={carouselImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={item} style={styles.carouselImage} />
          )}
        />

        <View style={styles.dotsContainer}>
          {carouselImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Latest />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  carouselImage: {
    width: width,
    height: 220,
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
    width: 20,
  },
})

export default Home