import { Container, Typography } from '@mui/material';
import ProjectGrid from '../components/ProjectGrid';

export default function ProjectsPage() {
  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <ProjectGrid />
    </Container>
  );
}
