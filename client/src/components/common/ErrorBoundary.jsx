import { Component } from 'react'
import { AlertTriangle } from 'react-feather'
import Button from './Button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-4" role="alert">
          <AlertTriangle className="w-16 h-16 text-red-400" aria-hidden="true" />
          <h2 className="text-2xl font-medium text-gray-800">Something went wrong</h2>
          <p className="text-gray-500 max-w-md">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.href = '/'
            }}
          >
            Go to Home
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
