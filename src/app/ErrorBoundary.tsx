import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportError } from '@/shared/lib/reportError'
import { ErrorScreen } from './ErrorScreen'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, { source: 'ErrorBoundary', componentStack: info.componentStack })
  }

  render() {
    return this.state.hasError ? <ErrorScreen /> : this.props.children
  }
}
