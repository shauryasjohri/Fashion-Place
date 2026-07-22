import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, ChevronRight, CreditCard, X } from 'react-feather'

import api from '@/services/api'
import config from '@/config'
import Button from '@/components/common/Button'
import Loader from "@/components/common/Loader"
import { UserContext } from '@/context'

function loadRazorpayScript() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const emptyAddress = { street: '', city: '', state: '', zip: '' }

export default function CheckoutForm({ onCancel, onSuccess, addToast }) {
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [orderDetails, setOrderDetails] = useState({})
  const [razorpayOrderId, setRazorpayOrderId] = useState(null)
  const [orderAmount, setOrderAmount] = useState(null)
  const [address, setAddress] = useState(emptyAddress)
  const { user } = useContext(UserContext)

  useEffect(() => {
    ;(async () => {
      try {
        const resp = await api.createRazorpayOrder()
        if (resp.status === "ok") {
          setRazorpayOrderId(resp.order_id)
          setOrderAmount(resp.amount)
          setOrderDetails(resp.finalOrder)
        } else {
          setError(resp.message || "Failed to create order")
        }
      } catch (e) {
        setError('Failed to connect to payment service')
      }
    })()
  }, [])

  const setAddressField = (field) => (e) => {
    setAddress(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handlePayment = async () => {
    if (!address.street || !address.city || !address.state || !address.zip) {
      setError('Please fill in your shipping address')
      return
    }

    const loaded = await loadRazorpayScript()
    if (!loaded) {
      setError("Failed to load Razorpay SDK. Check your internet connection.")
      return
    }

    setProcessing(true)

    const options = {
      key: config.razorpayKeyId,
      amount: orderAmount,
      currency: "INR",
      name: "Fashion Place",
      description: "Order Payment",
      order_id: razorpayOrderId,
      prefill: {
        name: user?.fullname || "",
        email: user?.email || "",
      },
      theme: { color: "#1f2937" },
      handler: async function (response) {
        try {
          const resp = await api.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            address
          )
          if (resp.status === "ok") {
            setProcessing(false)
            setSucceeded(true)
            addToast('Payment successful! Order placed.')
            onSuccess()
          } else {
            setError(resp.message || "Payment verification failed")
            setProcessing(false)
            addToast('Payment verification failed', 'danger')
          }
        } catch (e) {
          setError('Payment verification failed')
          setProcessing(false)
          addToast('Payment verification failed', 'danger')
        }
      },
      modal: {
        ondismiss: () => {
          setProcessing(false)
          setError("Payment cancelled")
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on("payment.failed", function (response) {
      setError(response.error?.description || "Payment failed")
      setProcessing(false)
      addToast('Payment failed', 'danger')
    })
    rzp.open()
  }

  if (succeeded) {
    return (
      <div className='flex flex-col items-center'>
        <CheckCircle className='w-20 h-20 text-green-400' />
        <p className='text-lg font-light my-4'>Order Placed Successfully</p>
        <Link to="/orders">
          <Button link>
            <span>Go to Orders</span>
            <ChevronRight className='ml-2' />
          </Button>
        </Link>
        <Button secondary onClick={onCancel}>Close</Button>
      </div>
    )
  }

  return (
    <div>
      <section className='mb-6'>
        {orderDetails?.amount &&
          <div className='flex justify-between text-lg mt-2'>
            <h4 className='text-lg mb-2'>Final Order</h4>
            <span className='font-bold text-xl'>₹{orderDetails.amount}</span>
          </div>
        }
        {orderDetails?.products?.length ?
          <ul>
            {orderDetails.products.map(product => (
              <CheckoutItem
                key={product.productID._id}
                title={product.productID.title}
                price={product.productID.price}
                quantity={product.quantity}
              />
            ))}
          </ul>
          : <Loader color="bg-gray-600" />
        }
      </section>

      <section className='mb-6 border border-gray-200 dark:border-gray-600 rounded-lg p-4'>
        <h4 className='text-md mb-3 font-medium'>Shipping Address</h4>
        <input
          type="text"
          placeholder="Street address"
          value={address.street}
          onChange={setAddressField('street')}
          className='w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2 mb-2 focus:outline-none focus:ring focus:ring-gray-300 dark:focus:ring-gray-500'
        />
        <div className='flex gap-2'>
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={setAddressField('city')}
            className='flex-1 min-w-0 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:outline-none focus:ring focus:ring-gray-300 dark:focus:ring-gray-500'
          />
          <input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={setAddressField('state')}
            className='flex-1 min-w-0 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:outline-none focus:ring focus:ring-gray-300 dark:focus:ring-gray-500'
          />
          <input
            type="text"
            placeholder="ZIP"
            value={address.zip}
            onChange={setAddressField('zip')}
            className='w-24 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:outline-none focus:ring focus:ring-gray-300 dark:focus:ring-gray-500'
          />
        </div>
      </section>

      {error && (
        <div className="text-red-400 mb-2" role="alert">
          {error}
        </div>
      )}

      <Button className="w-full" onClick={handlePayment} disabled={processing || succeeded}>
        {processing
          ? <Loader />
          : <>
              <CreditCard className='mr-2 opacity-70' />
              <span>Pay with Razorpay</span>
            </>
        }
      </Button>
      <Button className="w-full" secondary onClick={onCancel}>Cancel</Button>
    </div>
  )
}

function CheckoutItem({ title, price, quantity }) {
  return (
    <li className='flex justify-between'>
      <p>{title}</p>
      <div className='flex justify-between items-center'>
        {quantity > 1 &&
          <span className='inline-flex items-center text-gray-400 mr-5'>
            <X className='' />
            {quantity}
          </span>
        }
        <span className='text-lg font-light'>₹{quantity * price}</span>
      </div>
    </li>
  )
}
