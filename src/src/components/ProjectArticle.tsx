import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Container } from '@mui/material';

const ProjectArticle = ({ slug }: { slug: string }) => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(`/projects/${slug}.md`)
      .then((res) => res.text())
      .then(setMarkdown)
      .catch((err) => console.error('Error loading article:', err));
  }, [slug]);

  return (
    <Container sx={{ mt: 10 }}>
      <ReactMarkdown
        components={{
          img: ({ node, ...props }) => (
            <img
              {...props}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px',
                margin: '1rem 0',
                display: 'block',
              }}
              alt={props.alt || ''}
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </Container>
  );
};

export default ProjectArticle;
