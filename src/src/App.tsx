// App.tsx
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Button, Box, Link, Menu, MenuItem } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
    },
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
  typography: {
    fontFamily: 'Roboto Mono, monospace',
  },
});

export default function App() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            cmajorb
          </Typography>
          <Button color="inherit" onClick={handleClick} endIcon={<ArrowDropDownIcon />}>
            Projects
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose} component="a" href="https://spiderz.cmajorb.com" target="_blank">
              Spiderz
            </MenuItem>
          </Menu>
          {/* <Button color="inherit">Contact</Button> */}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Hi, I'm Major
        </Typography>
        <Typography variant="h5" gutterBottom>
          Here is what I've been up to
        </Typography>
        <Box mt={4}>
          <Link
            href="https://www.linkedin.com/in/major-brown/"
            target="_blank"
            rel="noopener"
            underline="none"
          >
            <Button
              variant="outlined"
              startIcon={<LinkedInIcon />}
              sx={{ mr: 2 }}
            >
              Connect on LinkedIn
            </Button>
          </Link>
          <Link
            href="https://github.com/cmajorb"
            target="_blank"
            rel="noopener"
            underline="none"
          >
            <Button
              variant="outlined"
              startIcon={<GitHubIcon />}
            >
              View My Code
            </Button>
          </Link>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
