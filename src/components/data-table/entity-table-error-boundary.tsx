import { Component, type ReactNode } from 'react'

interface DataTableErrorBoundaryProps {
  children: ReactNode
  fallbackMessage: string
}

interface DataTableErrorBoundaryState {
  hasError: boolean
}

/**
 * Isolates table subtree failures so a bad cell renderer cannot crash the page shell.
 */
export class DataTableErrorBoundary extends Component<
  DataTableErrorBoundaryProps,
  DataTableErrorBoundaryState
> {
  state: DataTableErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): DataTableErrorBoundaryState {
    return { hasError: true }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role='alert'
          className='rounded-md border border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-destructive'
        >
          {this.props.fallbackMessage}
        </div>
      )
    }

    return this.props.children
  }
}
