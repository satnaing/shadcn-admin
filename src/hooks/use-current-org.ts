// Hook to get the current organization from localStorage
export function useCurrentOrg() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('selectedOrgId')
  }
  return null
}
