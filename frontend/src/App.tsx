import { ThemeProvider, createTheme } from '@mui/material'
import { AdminLayout } from './layouts/Layout'

export const App = () => {
  const theme = createTheme()
  return (
    <ThemeProvider theme={theme}>
      <AdminLayout />
    </ThemeProvider>
  )
}
