import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, GitHub, Globe } from "react-feather"

export default function Footer() {
  return (
    <footer className="grid grid-cols-1 md:(grid-cols-3) border-t border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 px-4" role="contentinfo">
      <div className="m-4 sm:m-6 flex-1">
        <h2 className="text-4xl text-center md:text-left mb-4">BRAND</h2>
        <p className="text-justify text-gray-700 dark:text-gray-300">Eiusmod duis reprehenderit quis cillum nisi anim consectetur occaecat cupidatat anim incididunt aliqua eiusmod ad consectetur in ut cupidatat proident dolore aute irure enim in in ut adipisicing in do est.</p>
        <ul className="flex mt-6 justify-center md:justify-start space-x-4" aria-label="Social media links">
          <li><Link to="#" aria-label="Facebook" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"><Facebook /></Link></li>
          <li><Link to="#" aria-label="Instagram" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"><Instagram /></Link></li>
          <li><Link to="#" aria-label="Twitter" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"><Twitter /></Link></li>
          <li><a href="https://github.com/nimone/Fashion-Store" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"><GitHub /></a></li>
          <li><a href="https://nimo.pages.dev" target="_blank" rel="noopener noreferrer" aria-label="Portfolio" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"><Globe /></a></li>
        </ul>
      </div>
      <div className="m-4 sm:m-6">
        <h2 className="text-xl text-center md:text-left font-medium mb-4">Useful Links</h2>
        <ul className="flex flex-col flex-wrap h-36 space-y-1 text-gray-600 dark:text-gray-400" aria-label="Useful links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/products?category=men">Men Fashion</Link></li>
          <li><Link to="/products?category=women">Women Fashion</Link></li>
          <li><Link to="/orders">Track Order</Link></li>
          <li><Link to="/account">My Account</Link></li>
          <li><Link to="/wishlist">Wishlist</Link></li>
          <li><Link to="/terms">Terms</Link></li>
        </ul>
      </div>
      <div className="m-4 sm:m-6">
        <h2 className="text-xl text-center md:text-left font-medium mb-4">Contact</h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300" aria-label="Contact information">
          <li className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" aria-hidden="true" />
            <span>221b Baker St, London NW1 6XE, UK</span>
          </li>
          <li className="flex items-center">
            <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
            <span>+1234-567-890</span>
          </li>
          <li className="flex items-center">
            <Mail className="w-5 h-5 mr-2" aria-hidden="true" />
            <a href="mailto:nimogha@gmail.com" target="_blank" rel="noopener noreferrer">nimogha@gmail.com</a>
          </li>
          <li className="flex items-center">
            <GitHub className="w-5 h-5 mr-2" aria-hidden="true" />
            <a href="https://github.com/nimone/Fashion-Store" target="_blank" rel="noopener noreferrer">/Fashion-Store</a>
            <span className='mx-1'>built by</span>
            <a href="https://nimo.pages.dev" target="_blank" rel="noopener noreferrer" className='border-b-2 border-green-500 dark:border-green-400'>nimo</a>
          </li>
        </ul>
        <div className="mt-6">
          <img className="mx-auto md:mx-0" src="https://i.ibb.co/Qfvn4z6/payment.png" alt="Accepted payment providers" loading="lazy" />
        </div>
      </div>
    </footer>
  )
}
