import { SignUp } from '@clerk/clerk-react'
import useDocumentTitle from '@/hooks/useDocumentTitle'

const BG_IMAGE = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920"

export default function RegisterPage() {
  useDocumentTitle('Register')

  return (
    <main
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-md px-4">
        <SignUp
          routing="hash"
          signInUrl="/login"
          afterSignUpUrl="/account"
          appearance={{
            layout: {
              socialButtonsPlacement: "bottom",
            },
            elements: {
              card: "bg-white/95 backdrop-blur shadow-2xl rounded-xl p-8",
              headerTitle: "text-2xl font-bold text-gray-800",
              headerSubtitle: "text-gray-500",
              formButtonPrimary:
                "bg-gray-800 hover:bg-gray-700 text-white rounded-full py-2.5 text-sm font-medium transition-colors",
              formFieldInput:
                "rounded-lg border-gray-300 focus:border-gray-500 focus:ring-gray-500 text-sm",
              formFieldLabel: "text-sm font-medium text-gray-700",
              footerActionLink: "text-gray-800 hover:text-gray-600 font-medium",
              footerActionText: "text-gray-500",
              socialButtonsBlockButton:
                "rounded-full border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors",
              socialButtonsBlockButtonText: "text-sm font-medium",
              dividerLine: "bg-gray-200",
              dividerText: "text-xs text-gray-400 uppercase tracking-wider",
              formFieldErrorText: "text-red-600 text-xs",
              headerBackLink: "text-gray-800 hover:text-gray-600 text-sm",
              headerBackIcon: "text-gray-800",
            },
            variables: {
              colorPrimary: "#1f2937",
              colorText: "#1f2937",
              colorTextSecondary: "#6b7280",
              borderRadius: "0.5rem",
              fontFamily: "inherit",
            },
          }}
        />
      </div>
    </main>
  )
}
