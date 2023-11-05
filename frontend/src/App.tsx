import { ThemeProvider, createTheme } from '@mui/material'
import { AdminLayout } from './layouts/Layout'
import { UserLayout } from './layouts/UserLayout'
import { useWalletStore } from './store/walletStore'
import { useEffect } from 'react'


export const App = () => {
  const theme = createTheme()
  const walletStore = useWalletStore()


  useEffect(() => {
    const init = async () => {
      await walletStore.updateWallet()
    }
    init()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      {
        walletStore.isAdmin() ? (
          <AdminLayout />
        ) : (
          <UserLayout />
        )
      }
    </ThemeProvider>
  )
}
