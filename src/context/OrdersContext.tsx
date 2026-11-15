import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ImageSourcePropType } from 'react-native'

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'

export type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: ImageSourcePropType
}

export type Order = {
  id: string
  number: string
  createdAt: number
  status: OrderStatus
  items: OrderItem[]
  total: number
  address?: string
}

type PlaceOrderInput = {
  items: OrderItem[]
  total: number
  address?: string
}

type OrdersContextType = {
  orders: Order[]
  placeOrder: (input: PlaceOrderInput) => Order
  cancelOrder: (id: string) => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([])
  const counter = useRef(1000)

  const placeOrder = useCallback((input: PlaceOrderInput) => {
    counter.current += 1
    const order: Order = {
      id: `${Date.now()}-${counter.current}`,
      number: `SH-${counter.current}`,
      createdAt: Date.now(),
      status: 'processing',
      items: input.items,
      total: input.total,
      address: input.address,
    }
    setOrders((prev) => [order, ...prev])
    return order
  }, [])

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && o.status === 'processing'
          ? { ...o, status: 'cancelled' as OrderStatus }
          : o
      )
    )
  }, [])

  const value = useMemo(
    () => ({ orders, placeOrder, cancelOrder }),
    [orders, placeOrder, cancelOrder]
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider')
  return ctx
}