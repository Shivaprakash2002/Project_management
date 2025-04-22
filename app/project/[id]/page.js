'use client';
import ProjectForm from '../../../components/ProjectForm';

export default function Project({ params }) {
  return <ProjectForm id={params.id} />;
}