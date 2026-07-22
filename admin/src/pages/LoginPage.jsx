import { SignIn } from '@clerk/clerk-react'

export default function LoginPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ maxWidth: 440, width: '100%' }}>
        <div className="card-body p-4">
          <h4 className="text-center mb-4">Admin Login</h4>
          <SignIn
            routing="hash"
            afterSignInUrl="/admin"
            appearance={{
              elements: {
                card: 'border-0 shadow-none',
                headerTitle: 'd-none',
                headerSubtitle: 'd-none',
                socialButtonsBlockButton: 'btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 w-100 mb-2',
                dividerLine: 'bg-secondary',
                formFieldInput: 'form-control',
                formButtonPrimary: 'btn btn-dark w-100',
                footerAction: 'text-center mt-3',
                footerActionLink: 'text-decoration-none',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
