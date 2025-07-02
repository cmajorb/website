// components/Navbar.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            cmajorb
          </Link>
        </Typography>

        <Button color="inherit" component={Link} to="/projects">
          Projects
        </Button>

        <Button
          color="inherit"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleOpen}
        >
          Live Apps
        </Button>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem
            onClick={handleClose}
            component="a"
            href="https://spiderz.cmajorb.com"
            target="_blank"
            rel="noopener"
          >
            Spiderz
          </MenuItem>
          <MenuItem
            onClick={handleClose}
            component="a"
            href="https://www.quick-tee.com"
            target="_blank"
            rel="noopener"
          >
            Quick Tee
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
