import React from 'react';
import { Typography, Card, CardContent, CardMedia, Link, Chip, Stack } from '@mui/material';

type Project = {
    slug: string;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    tags: string[];
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <Card sx={{ display: 'flex', mb: 3 }}>
        <CardMedia
            component="img"
            sx={{ width: 160 }}
            image={project.imageUrl}
            alt={project.title}
        />
        <CardContent>
            <Typography variant="h6" gutterBottom>
                <Link href={`/projects/${project.slug}`}>
                    {project.title}
                </Link>
            </Typography>
            <Typography variant="body2" gutterBottom>
                {project.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {new Date(project.date).toLocaleDateString()}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
                {project.tags.map((tag, i) => (
                    <Chip key={i} label={tag} size="small" />
                ))}
            </Stack>
        </CardContent>
    </Card>
);

export default ProjectCard;
