import React, { Component, ReactNode } from 'react';

/**
 * Props for the ErrorBoundary component
 */
interface Props {
  /** Child components to be wrapped by the error boundary */
  readonly children: ReactNode;
  /** Optional custom fallback UI to display instead of default error UI */
  readonly fallback?: ReactNode;
}

/**
 * State for the ErrorBoundary component
 */
interface State {
  /** Whether an error has been caught */
  readonly hasError: boolean;
  /** The caught error object, null if no error */
  readonly error: Error | null;
}

/**
 * ErrorBoundary component to catch and display errors gracefully.
 * Prevents black screen errors and provides user-friendly error UI with Korean/English bilingual support.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  /**
   * Reset error state and attempt recovery without full page reload.
   * Full reload is used as a last resort to ensure clean state.
   */
  private handleReset = () => {
    // Try to recover by resetting error state
    this.setState({ hasError: false, error: null });
    
    // Give React a chance to re-render, then reload if still in error state
    setTimeout(() => {
      if (this.state.hasError) {
        window.location.reload();
      }
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="error-boundary"
          role="alert"
          aria-live="assertive"
          data-testid="error-boundary"
        >
          <div className="error-boundary__container">
            <h1 className="error-boundary__title">
              오류 발생 | Error Occurred
            </h1>
            
            <p className="error-boundary__message">
              {this.state.error?.message || 'Unknown error occurred'}
            </p>

            <div className="error-boundary__actions">
              <button
                type="button"
                onClick={this.handleReset}
                className="error-boundary__button error-boundary__button--primary"
                data-testid="error-boundary-restart-button"
              >
                다시 시작 | Restart
              </button>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="error-boundary__button error-boundary__button--secondary"
                data-testid="error-boundary-back-button"
              >
                뒤로 | Back
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary__details">
                <summary>
                  기술 정보 | Technical Details
                </summary>
                <pre>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
