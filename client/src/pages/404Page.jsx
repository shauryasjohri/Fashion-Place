import { Link } from "react-router-dom"
import { ArrowLeft } from "react-feather"

import Button from "@/components/common/Button"
import useDocumentTitle from '@/hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page Not Found')

  return (
    <main className="flex flex-col h-screen justify-center text-center space-y-5 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 p-4" role="alert">
      <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 dark:text-gray-100">Page Not Found</h1>
      <p className="text-xl sm:text-2xl tracking-wide">The product / page you are looking for is currently not available.</p>
      <Link to="/">
        <Button link className="text-base sm:text-xl">
          <ArrowLeft className="mr-2" /> Back to Home
        </Button>
      </Link>
    </main>
  )
}
