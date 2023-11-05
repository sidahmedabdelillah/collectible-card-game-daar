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

    useWalletStore.subscribe((newState , oldState) => {
      if(!oldState.details?.account){
        return
      }
  
      if(newState.details?.account !== oldState.details?.account){
        window.location.reload()
      }
    })

    init()
  }, [])
  


  return (
    <ThemeProvider theme={theme}>
      {
        walletStore.details &&
          walletStore.isAdmin() ? (<AdminLayout />) : (<UserLayout />)

      }
    </ThemeProvider>
  )
}
