import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import AppsIcon from '@mui/icons-material/Apps'
import {
  Button,
  Chip,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { useState } from 'react'

const drawerWidth = 240

export type NavItemType = {
  title: string
  count?: number
}



const NavMenuItem = ({
  item,
  level,
  isActive,
  onClick,
}: {
  item: NavItemType
  level: number
  onClick: () => void
  isActive: boolean
}) => {
  return (
    <ListItemButton
      sx={{
        mb: 0.5,
        alignItems: 'flex-start',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`,
      }}
      onClick={onClick}
    >
      <Chip
        color="default"
        variant="filled"
        size="small"
        label={item.count}
        sx={{
          px: '6px',
          backgroundColor: isActive ? '#C475FF' : '#521182',
          marginTop: '4px',
        }}
      />

      <ListItemText
        primary={
          <Typography
            variant={'body1'}
            color="inherit"
            margin={0}
            marginTop={0}
            sx={{
              color: 'white',
              height: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              paddingLeft: '10px',
              alignItems: 'center',
              margin: 0,
              opacity: isActive ? 1 : 0.8,
            }}
          >
            {item.title}
          </Typography>
        }
      />
    </ListItemButton>
  )
}

export default function UserSideBar({ cardCount }: { cardCount: number }) {

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#281a3b',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', backgroundColor: '#281a3b' }}>
        <List
          sx={{ paddingLeft: '10px' }}
          subheader={
            <Box
              display="flex"
              sx={{
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AppsIcon fontSize="large" sx={{ color: 'white' }} />
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: 'white',
                  padding: '6px',
                  textTransform: 'capitalize',
                  marginTop: '10px',
                }}
              >
                Collections
              </Typography>
            </Box>
          }
        >
          <NavMenuItem
            item={{
              title: "My collection",
              count: cardCount,
            }}
            level={0.5}
            onClick={() => {
              // TODO do this
              console.log("clicked")
            }}
            // TODO do this        
            isActive={false}
          />

        </List>

        {/* group divider */}
        <Divider sx={{ mt: 0.25, mb: 1.25 }} />
      </Box>
    </Drawer>
  )
}
