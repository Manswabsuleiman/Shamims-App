import { View, Image, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import LoginModal from '../components/LoginModal'

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/Pictures/cr.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.bottomSection}>
        <Button title="Login" onPress={() => setShowLogin(true)} />
      </View>

      <LoginModal visible={showLogin} onClose={() => setShowLogin(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  bottomSection: {
    width: '80%',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 20,
    backgroundColor: '#fff',
  },
})

export default Landing