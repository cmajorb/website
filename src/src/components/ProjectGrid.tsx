import React, { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';
import * as projectFiles from '../projects';

const ProjectGrid: React.FC = () => {
    const allProjects = useMemo(() => {
        return Object.values(projectFiles)
            .flat()
            .filter((p: any) => p?.title && p?.description)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, []);

    const [search, setSearch] = useState('');
    console.log(allProjects);

    const filtered = allProjects.filter((p: any) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <>
            <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
            />
            {filtered.map((project: any, i) => (
                <ProjectCard key={i} project={project} />
            ))}
        </>
    );
};

export default ProjectGrid;
