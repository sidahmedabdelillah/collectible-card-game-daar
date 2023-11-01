import { Toolbar, Typography, AppBar as MuiAppBar } from '@mui/material'

export const AppBar = () => {
  return (
    <MuiAppBar
      position="fixed"
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        backgroundColor: '#462f63',
      }}
    >
      <Toolbar>
        <img
          src="../public/title-image.png"
          alt="Pokémon Card"
          style={{ width: '100px', height: '50px', marginRight: '10px' }}
        />
        <Typography variant="h6" noWrap component="div">
          Pokémon Card
        </Typography>
      </Toolbar>
    </MuiAppBar>
  )
}
