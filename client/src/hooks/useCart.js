import { useContext, useCallback } from 'react'
import { CartContext } from '../context/CartContext'
import { UserContext } from '../context/UserContext'
import { addProductsToCart } from '../services/api'

export function useCart() {
  const { user } = useContext(UserContext)
  const { cart, cartDispatch } = useContext(CartContext)

  const addToCart = useCallback((product, quantity = 1) => {
    cartDispatch({ type: 'ADD_PRODUCTS', payload: [{ ...product, quantity }] })
    if (user) {
      addProductsToCart([{ productID: product._id || product.id, quantity }])
        .catch(e => console.error('addToCart sync failed:', e))
    }
  }, [user, cartDispatch])

  return { cart, addToCart, cartDispatch }
}
