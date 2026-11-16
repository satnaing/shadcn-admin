import { useState } from 'react'
import type { PosCustomer, PosGuestInfo, PosOrderSource } from '../data/pos.type'

export const emptyGuest: PosGuestInfo = { name: '', phone: '', email: '', address: '' }

/** Who the order is for: a registered customer with a saved address, or typed shipping info for everybody else. */
export function usePosCustomer() {
  const [source, setSource] = useState<PosOrderSource>('walkin')
  const [customer, setCustomer] = useState<PosCustomer | null>(null)
  const [addressId, setAddressId] = useState<number | null>(null)
  const [guest, setGuest] = useState<PosGuestInfo>(emptyGuest)

  return {
    source,
    customer,
    addressId,
    guest,
    setSource: (s: PosOrderSource) => {
      setSource(s)
      if (s !== 'registered') {
        setCustomer(null)
        setAddressId(null)
      }
    },
    setCustomer: (c: PosCustomer | null) => {
      setCustomer(c)
      setAddressId(null)
    },
    setAddressId,
    setGuest,
    reset: () => {
      setSource('walkin')
      setCustomer(null)
      setAddressId(null)
      setGuest(emptyGuest)
    },
  }
}
export type PosCustomerState = ReturnType<typeof usePosCustomer>
