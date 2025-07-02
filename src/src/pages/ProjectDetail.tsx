import { useParams } from 'react-router-dom';
import ProjectArticle from '../components/ProjectArticle';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  return slug ? <ProjectArticle slug={slug} /> : null;
}
