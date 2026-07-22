import { createContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import cartReducer, { initialCartState } from '../reducers/cartReducer'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, cartDispatch] = useLocalStorage(cartReducer, initialCartState, 'cart')
  return (
    <CartContext.Provider value={{ cart, cartDispatch }}>
      {children}
    </CartContext.Provider>
  )
}
