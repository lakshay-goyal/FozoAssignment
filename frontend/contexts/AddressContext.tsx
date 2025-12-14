import React, { createContext, useContext, useState, ReactNode } from 'react'
import type { Address } from '../services'

interface AddressContextType {
  selectedAddress: Address | null
  setSelectedAddress: (address: Address | null) => void
}

const AddressContext = createContext<AddressContextType | undefined>(undefined)

export const AddressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

  return (
    <AddressContext.Provider value={{ selectedAddress, setSelectedAddress }}>
      {children}
    </AddressContext.Provider>
  )
}

export const useAddress = () => {
  const context = useContext(AddressContext)
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider')
  }
  return context
}