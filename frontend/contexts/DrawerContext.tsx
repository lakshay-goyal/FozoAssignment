import React, { createContext, useContext, useState, ReactNode } from 'react'

interface DrawerContextType {
  openDrawer: () => void
  closeDrawer: () => void
  isOpen: boolean
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => setIsOpen(true)
  const closeDrawer = () => setIsOpen(false)

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, isOpen }}>
      {children}
    </DrawerContext.Provider>
  )
}

export const useDrawer = () => {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error('useDrawer must be used within DrawerProvider')
  }
  return context
}

