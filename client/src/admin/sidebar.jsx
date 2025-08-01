import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import {
  List,
  Collapse,
  Divider,
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  List as ListIcon,
  PersonAdd as PersonAddIcon,
  ShoppingBag as ShoppingBagIcon,
  Add as AddIcon,
  ReceiptLong as ReceiptLongIcon,
  ExpandLess,
  ExpandMore,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  children,
}) {
  const { logoutuser } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [usersOpen, setUsersOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const handleLogout = () => {
    logoutuser();
    navigate("/");
  };

  const handleUsersClick = () => {
    setUsersOpen((prev) => !prev);
  };

  const handleProductsClick = () => setProductsOpen((prev) => !prev);

  const drawerHeader = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        minHeight: "64px",
      }}
    >
      <Typography variant="h6">Admin Panel</Typography>
      {(!isDesktop || true) && (
        <IconButton onClick={() => setSidebarOpen(false)}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );

  const drawer = (
    <div>
      {drawerHeader}
      <Divider />
      <List>
        {/* Dashboard */}
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/admin/dashboard"
            sx={{
              "&.active": { backgroundColor: "#e0e0e0" },
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {/* Users */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleUsersClick}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
            {usersOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={usersOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/admin/users"
                sx={{
                  pl: 4,
                  "&.active": { backgroundColor: "#e0e0e0" },
                }}
              >
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary="List Users" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/admin/users/create"
                sx={{
                  pl: 4,
                  "&.active": { backgroundColor: "#e0e0e0" },
                }}
              >
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Create User" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/*  Products(Collapsible) */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleProductsClick}>
            <ListItemIcon>
              <ShoppingBagIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
            {productsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={productsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/admin/products"
                sx={{
                  pl: 4,
                  "&.active": { backgroundColor: "#e0e0e0" },
                }}
              >
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary="List Products" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/admin/products/add"
                sx={{
                  pl: 4,
                  "&.active": { backgroundColor: "#e0e0e0" },
                }}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Add Product" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Orders */}
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/admin/orders"
            sx={{
              "&.active": { backgroundColor: "#e0e0e0" },
            }}
          >
            <ListItemIcon>
              <ReceiptLongIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItemButton>
        </ListItem>

        {/* Logout */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: sidebarOpen ? `${drawerWidth}px` : 0,
          transition: "margin 0.3s",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
