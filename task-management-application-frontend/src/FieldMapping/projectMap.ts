export const formatproject = (projects: any): ProjectType[] => {

  return projects.map((project: any) => ({
    id: project.id,
    name: project.project_name,
    description: project.description,
    progress: project.tasks.length > 0 ? (project.completed_task / project.tasks.length) * 100 : 0,
    status: project.status,
    startDate: project.start_date,
    dueDate: project.end_date,
    teamMembers: project.users,
    tasks: project.tasks || [],
    totalTasks: project.tasks.length,
    completedTasks: project.completed_task
  }));
}
