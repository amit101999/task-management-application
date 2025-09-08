export const formatproject = (projects: any): ProjectType[] => {
  return projects.map((project: any) => ({
    id: project.id,
    projectName: project.project_name,
    description: project.description,
    completedTask: project?.completed_task ?? 0,
    startDate: project.start_date,
    status: project.status,
    endDate: project.end_date,
    users: project.users ?? [],
    tasks: project.tasks ?? [],
  }));
}
