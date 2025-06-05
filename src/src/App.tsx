// App.tsx
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Button, Box, Link, Menu, MenuItem } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Parser from 'rss-parser';

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

type Book = {
  title: string;
  link: string;
  author: string;
  thumbnail: string;
  rating: number;
  readAt: string;
  review: string;
};

export default function App() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [showAll, setShowAll] = useState(false);

  const displayedBooks = showAll ? books : books.slice(0, 3);
  const currentYear = new Date().getFullYear();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`https://0uhzrk53e2.execute-api.us-east-1.amazonaws.com/prod/rss`);
        const data = await res.json();
        console.log('Fetched data:', data);

        const books = data.books.map((item: any) => {        
          return {
            title: item.title,
            link: item.link,
            author: item.author,
            thumbnail: item.image,
            rating: item.rating,
            readAt: item.readAt,
            review: item.review,
          };
        })
        .filter((book: Book) => {
          if (!book.readAt) return false;
          const readDate = new Date(book.readAt.replace(/\//g, '-')); // Convert 'YYYY/MM/DD' to 'YYYY-MM-DD' for parsing
          return readDate.getFullYear() === currentYear;
        })
        .sort((a: Book, b: Book) => {
          const dateA = new Date(a.readAt).getTime();
          const dateB = new Date(b.readAt).getTime();
          return dateB - dateA; // reverse chronological
        });
  
        setBooks(books);
      } catch (err) {
        console.error('Error fetching Goodreads feed:', err);
      } finally {
        setLoading(false);
        console.log('Books fetched:', books);
      }
    };
    fetchBooks();
  }, []);

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
            <MenuItem onClick={handleClose} component="a" href="https://www.quick-tee.com" target="_blank">
              Quick Tee
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
        {loading ? (
  <Typography variant="body1" mt={6}>
    Loading books...
  </Typography>
) : (
  <Box mt={6} textAlign="left">
    <Typography variant="h5" gutterBottom>
      Books I've Read in {currentYear}
    </Typography>
    {displayedBooks.map((book, index) => (
  <Box
    key={index}
    sx={{
      mt: 4,
      p: 2,
      border: '1px solid #333',
      borderRadius: 2,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 2,
    }}
  >
    {book.thumbnail && (
      <Box
        component="img"
        src={book.thumbnail}
        alt={book.title}
        sx={{ width: 75, height: 'auto', borderRadius: 1 }}
      />
    )}
    <Box>
      <Typography variant="h6">
        <Link href={book.link} target="_blank" rel="noopener" color="primary">
          {book.title}
        </Link>{' '}
        by {book.author}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          {book.readAt}
        </Typography>
        {book.rating !== null && (
          <Box sx={{ display: 'flex' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ color: i < book.rating ? '#fbc02d' : '#555' }}>★</span>
            ))}
          </Box>
        )}
      </Box>
      {book.review && (
        <Typography variant="body1" sx={{ mt: 1 }}>
          {book.review}
        </Typography>
      )}
    </Box>
  </Box>
))}

{books.length > 3 && (
  <Button
    variant="outlined"
    sx={{ mt: 2 }}
    onClick={() => setShowAll(!showAll)}
  >
    {showAll ? 'Show Less' : 'Show All'}
  </Button>
)}
  </Box>
)}
      </Container>
    </ThemeProvider>
  );
}
