import clsx from "clsx"

import CheckoutForm from "./CheckoutForm"
import PageHeader from '@/components/common/PageHeader';

export default function CheckoutModal({ onCancel, onSuccess, addToast }) {
  return (
    <div className={clsx(
      "fixed inset-0 z-40 overflow-auto",
      "flex justify-center items-center",
      "w-screen h-screen bg-black/40 dark:bg-black/60",
    )} role="dialog" aria-modal="true" aria-label="Checkout">
      <div className={clsx(
        "relative w-full max-w-md",
        "p-4 m-auto rounded-lg shadow-lg",
        "bg-gray-200 dark:bg-gray-800 text-gray-800/80 dark:text-gray-200/80",
      )}>
        <PageHeader h3>Checkout</PageHeader>
        <hr className="w-full border-1 rounded-full border-gray-500/10 dark:border-gray-600/30 my-3" />
        <section className="flex flex-col">
          <CheckoutForm onCancel={onCancel} onSuccess={onSuccess} addToast={addToast} />
        </section>
      </div>
    </div>
  )
}
