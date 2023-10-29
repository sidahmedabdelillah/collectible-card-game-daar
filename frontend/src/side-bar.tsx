import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField'; // Import TextField for input
import MainBar from './main-bar';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import CardCompenet from './card-compenet';

const drawerWidth = 240;

interface SidebarItem {
  text: string | React.ReactNode; // Change the text property to accept a ReactNode
  icon: React.ReactElement;
  children?: SidebarItem[];
}

const sidebarData: SidebarItem[] = [
  {
    text: 'Collections',
    icon: <ViewSidebarIcon />,
    children: [
      { text: 'My Magic Collections', icon: <ViewSidebarIcon /> },
      { text: <TextField label="Add Collection" />, icon: <ViewSidebarIcon /> }, // Use TextField for input
    ],
  },
];

const renderSidebarItems = (items: SidebarItem[]) => (
  <List>
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
        {item.children && item.children.length > 0 && (
          <div style={{ marginLeft: '24px' }}>
            {renderSidebarItems(item.children)}
          </div>
        )}
      </React.Fragment>
    ))}
  </List>
);

export default function SideBar() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
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
      </AppBar>
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
          {renderSidebarItems(sidebarData)}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <MainBar />
        <Box sx={{ marginTop: '1%' }}>
          <CardCompenet />
        </Box>
      </Box>
    </Box>
  );
}
