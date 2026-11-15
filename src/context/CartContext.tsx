import React, { createContext, useContext, useState, ReactNode } from 'react'
import { ImageSourcePropType } from 'react-native'

export type CartItem = {
  id: string
  name: string
  price: number
  oldPrice: number
  image: ImageSourcePropType
  qty: number
}

type NewItem = Omit<CartItem, 'qty'>

type CartContextType = {
  items: CartItem[]
  addToCart: (item: NewItem) => void
  increase: (id: string) => void
  decrease: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // Adds a new item, or increases the quantity if it is already in the cart
  const addToCart = (item: NewItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const increase = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    )

  // Quantity never goes below 1 (use remove to delete the item)
  const decrease = (id: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i
      )
    )

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id))

  const clear = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increase,
        decrease,
        remove,
        clear,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return ctx
}