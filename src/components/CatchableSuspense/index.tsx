import React, {
  Suspense, SuspenseProps,
} from "react"
import { ErrorBoundary, ErrorBoundaryPropsWithFallback } from "react-error-boundary"

interface CacheableSuspenseProps {
  children: SuspenseProps["children"];
  /**
   * loading fallback
   */
  fallback?: SuspenseProps["fallback"];
  errorFallback?: ErrorBoundaryPropsWithFallback["fallback"];
  onError?: ErrorBoundaryPropsWithFallback["onError"];
}

const defaultLoadingFallback = <></>
const defaultErrorFallback = <></>

const defaultOnError: ErrorBoundaryPropsWithFallback["onError"] = (error, info) => {
  console.error("\n\n[[ Suspense Error ]]:\n", error, info)
}

export function CatchableSuspense({
  children,
  fallback: loadingFallback,
  errorFallback,
  onError,
}: CacheableSuspenseProps) {
  return <ErrorBoundary
    fallback={errorFallback ?? defaultErrorFallback}
    onError={onError ?? defaultOnError}
  >
    <Suspense fallback={loadingFallback ?? defaultLoadingFallback}>
      {children}
    </Suspense>
  </ErrorBoundary>
}
