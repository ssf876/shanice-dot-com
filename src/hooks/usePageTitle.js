import { useEffect } from 'react'

// Side-effect hook: mirrors the routed page into document.title and restores
// the previous title on unmount, so route swaps and StrictMode's dev
// double-mount stay deterministic.
export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
