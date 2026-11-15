import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ImageSourcePropType } from 'react-native'

export type WishlistItem = {
  id: string
  name: string
  price: number
  oldPrice: number
  image: ImageSourcePropType
}

type WishlistContextType = {
  items: WishlistItem[]
  isLiked: (id: string) => boolean
  toggle: (item: WishlistItem) => void
  remove: (id: string) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([])

  const isLiked = useCallback((id: string) => items.some((i) => i.id === id), [items])

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [item, ...prev]
    )
  }, [])

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const value = useMemo(
    () => ({ items, isLiked, toggle, remove }),
    [items, isLiked, toggle, remove]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}