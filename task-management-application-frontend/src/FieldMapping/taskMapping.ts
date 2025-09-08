export const taskMapping = (tasks: any): Task[] => {
  return tasks.map((item: any) => ({
    id: item?.id,
    title: item?.title,
    assignedTo: item?.assignedTo ?? null,
    project: item?.project ?? null,
    taskStatus: (item?.task_status === 'OPEN' || item?.task_status === 'INPROGRESS' || item?.task_status === 'CLOSED') ? item.task_status : 'OPEN',
    priority: (item?.priority === 'High' || item?.priority === 'Medium' || item?.priority === 'Low') ? item.priority : 'Low',
    description: item?.description,
    dueDate: item?.dueDate,
    startDate: item?.startdate
  }))
}
