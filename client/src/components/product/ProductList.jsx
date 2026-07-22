import { useContext } from 'react'

import Product from "@/components/product/Product"
import { CartContext } from '@/context'

export default function ProductList({ products, onAddToCart }) {
  const { cart } = useContext(CartContext)

  return (
    <div className="flex flex-wrap justify-center">
      {products.map(product => (
        <Product
          key={product._id}
          imgSrc={product.image}
          price={product.price}
          name={product.title}
          link={`/products/${product._id}`}
          onAddToCart={() => onAddToCart(product)}
          isInCart={cart.products.some(p => p.id === product._id)}
        />
      ))}
    </div>
  )
}
