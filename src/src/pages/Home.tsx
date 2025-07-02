// Home.tsx
import { useEffect, useState } from 'react';
import { Typography, Container, Button, Box, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import BookList from '../components/BookList';

type Book = {
  title: string;
  link: string;
  author: string;
  thumbnail: string;
  rating: number;
  readAt: string;
  review: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAll, setShowAll] = useState(false);

  const currentYear = new Date().getFullYear();

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
        console.log('Books fetched:', books);
      }
    };
    fetchBooks();
  }, []);

  return (
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
        <BookList
          books={books}
          showAll={showAll}
          setShowAll={setShowAll}
          currentYear={currentYear}
        />
      </Container>
  );
}
