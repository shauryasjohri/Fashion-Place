require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fashionplace.com' },
    create: {
      fullname: 'Admin User',
      email: 'admin@fashionplace.com',
      password: '',
      isAdmin: true,
    },
    update: {},
  })
  console.log('  ✓ Admin user created')

  // Create regular users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    create: {
      fullname: 'John Doe',
      email: 'john@example.com',
      password: '',
    },
    update: {},
  })
  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    create: {
      fullname: 'Jane Smith',
      email: 'jane@example.com',
      password: '',
    },
    update: {},
  })
  console.log('  ✓ Regular users created')

  // Create categories
  const categoryNames = ['men', 'women', 'accessories', 'footwear', 'sale']
  const categories = {}
  for (const name of categoryNames) {
    categories[name] = await prisma.category.upsert({
      where: { name },
      create: { name },
      update: {},
    })
  }
  console.log('  ✓ Categories created')

  // Create products
  const productsData = [
    {
      title: 'Classic Cotton T-Shirt',
      description: 'A comfortable classic cotton t-shirt perfect for everyday wear. Made from 100% organic cotton with a relaxed fit.',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      price: 29.99,
      categories: ['men', 'women'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Black', 'Navy'],
    },
    {
      title: 'Slim Fit Denim Jeans',
      description: 'Modern slim fit denim jeans with a comfortable stretch. Features classic five-pocket design.',
      image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500',
      price: 79.99,
      categories: ['men'],
      sizes: ['30', '32', '34', '36'],
      colors: ['Blue', 'Black'],
    },
    {
      title: 'Floral Summer Dress',
      description: 'Beautiful floral print dress perfect for summer days. Lightweight and breathable fabric.',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500',
      price: 59.99,
      categories: ['women'],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Blue', 'Pink', 'Yellow'],
    },
    {
      title: 'Leather Crossbody Bag',
      description: 'Elegant genuine leather crossbody bag with adjustable strap and multiple compartments.',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
      price: 129.99,
      categories: ['women', 'accessories'],
      sizes: ['One Size'],
      colors: ['Brown', 'Black', 'Tan'],
    },
    {
      title: 'Running Sneakers',
      description: 'Lightweight running sneakers with responsive cushioning and breathable mesh upper.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      price: 99.99,
      categories: ['men', 'women', 'footwear'],
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['White', 'Black', 'Red'],
    },
    {
      title: 'Wool Blend Blazer',
      description: 'Sophisticated wool blend blazer for a sharp professional look. Fully lined with two-button closure.',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500',
      price: 199.99,
      categories: ['men'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Charcoal', 'Navy', 'Black'],
    },
    {
      title: 'Cashmere Sweater',
      description: 'Luxuriously soft cashmere sweater with ribbed cuffs and hem. A timeless wardrobe essential.',
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500',
      price: 149.99,
      categories: ['women'],
      sizes: ['S', 'M', 'L'],
      colors: ['Cream', 'Grey', 'Burgundy'],
    },
    {
      title: 'Aviator Sunglasses',
      description: 'Classic aviator sunglasses with UV400 protection and gold-tone metal frame.',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
      price: 49.99,
      categories: ['accessories'],
      sizes: ['One Size'],
      colors: ['Gold/Green', 'Silver/Blue', 'Black/Grey'],
    },
    {
      title: 'Canvas Backpack',
      description: 'Durable canvas backpack with padded laptop compartment and multiple organizer pockets.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      price: 69.99,
      categories: ['men', 'women', 'accessories'],
      sizes: ['One Size'],
      colors: ['Olive', 'Black', 'Navy'],
    },
    {
      title: 'Leather Ankle Boots',
      description: 'Handcrafted leather ankle boots with a stacked heel and side zipper for easy wear.',
      image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500',
      price: 179.99,
      categories: ['women', 'footwear'],
      sizes: ['6', '7', '8', '9'],
      colors: ['Brown', 'Black', 'Tan'],
    },
  ]

  for (const productData of productsData) {
    const { categories: productCategories, sizes, colors, ...data } = productData

    const existing = await prisma.product.findUnique({ where: { title: data.title } })
    if (!existing) {
      const product = await prisma.product.create({
        data: {
          ...data,
          sizes,
          colors,
          categories: {
            create: productCategories.map(name => ({
              category: { connect: { id: categories[name].id } },
            })),
          },
        },
      })
    }
  }

  // Also create product images
  const allProducts = await prisma.product.findMany()
  for (const product of allProducts) {
    await prisma.productImage.upsert({
      where: { id: `img-${product.id}` },
      create: {
        id: `img-${product.id}`,
        productId: product.id,
        url: product.image,
      },
      update: {},
    })
  }

  console.log(`  ✓ ${allProducts.length} products created`)

  // Create a sample cart for user1
  const cart = await prisma.cart.upsert({
    where: { userId: user1.id },
    create: { userId: user1.id },
    update: {},
  })

  if (allProducts.length >= 2) {
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: allProducts[0].id } },
      create: { cartId: cart.id, productId: allProducts[0].id, quantity: 2 },
      update: {},
    })
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: allProducts[1].id } },
      create: { cartId: cart.id, productId: allProducts[1].id, quantity: 1 },
      update: {},
    })
  }
  console.log('  ✓ Sample cart created')

  // Create a sample order for user1
  if (allProducts.length >= 3) {
    const order = await prisma.order.create({
      data: {
        userId: user1.id,
        amount: 169.97,
        address: { street: '123 Main St', city: 'Mumbai', state: 'Maharashtra', zip: '400001', country: 'India' },
        status: 'delivered',
        items: {
          create: [
            { productId: allProducts[0].id, quantity: 2 },
            { productId: allProducts[2].id, quantity: 1 },
          ],
        },
      },
    })
    console.log('  ✓ Sample order created')
  }

  console.log('\nSeed completed successfully!')
  console.log('\nTest accounts:')
  console.log('  Admin: admin@fashionplace.com / admin123')
  console.log('  User:  john@example.com / user123')
  console.log('  User:  jane@example.com / user123')
}

main()
  .catch(e => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
