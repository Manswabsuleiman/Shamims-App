import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useSignIn } from '@clerk/clerk-expo'

type Props = {
  visible: boolean
  onClose: () => void
}

const LoginModal = ({ visible, onClose }: Props) => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [needsCode, setNeedsCode] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const reset = () => {
    setEmail('')
    setPassword('')
    setCode('')
    setNeedsCode(false)
    setError('')
  }

  const handleLogin = async () => {
    if (busy || !isLoaded) return
    setError('')
    setBusy(true)

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        reset()
        onClose()
      } else if (result.status === 'needs_first_factor') {
        // Clerk wants an email code before finishing
        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId: result.supportedFirstFactors?.find(
            (f) => f.strategy === 'email_code'
          )?.emailAddressId as string,
        })
        setNeedsCode(true)
      } else {
        setError('Sign-in needs another step. Check your Clerk settings.')
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? 'Could not sign in. Check your details.')
    } finally {
      setBusy(false)
    }
  }

  const handleVerify = async () => {
    if (busy || !isLoaded) return
    setError('')
    setBusy(true)

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: code.trim(),
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        reset()
        onClose()
      } else {
        setError('That code did not work. Try again.')
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? 'Invalid code.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Login</Text>

          {!needsCode ? (
            <>
              <TextInput
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
            </>
          ) : (
            <TextInput
              placeholder="Code sent to your email"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              style={styles.input}
            />
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={needsCode ? handleVerify : handleLogin}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>{needsCode ? 'Verify' : 'Login'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  closeButton: { alignSelf: 'flex-end', marginBottom: 8 },
  closeText: { fontSize: 18, color: '#666' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  loginButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginText: { color: '#fff', fontWeight: '600', fontSize: 15 },
})

export default LoginModal