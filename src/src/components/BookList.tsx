// BookList.tsx
import { Box, Typography, Button, Link } from '@mui/material';

type Book = {
    title: string;
    link: string;
    author: string;
    thumbnail: string;
    rating: number;
    readAt: string;
    review: string;
};

type Props = {
    books: Book[];
    showAll: boolean;
    setShowAll: (value: boolean) => void;
    currentYear: number;
};

export default function BookList({ books, showAll, setShowAll, currentYear }: Props) {
    const displayedBooks = showAll ? books : books.slice(0, 3);

    return (
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
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show Less' : 'Show All'}
                </Button>
            )}
        </Box>
    );
}
