/// <reference types="vite/client" />
interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
}
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'google';
  size?: 'lg';
  children: React.ReactNode;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  icon?: React.ReactNode;
}

// model User{
//   id String  @id @default(uuid())
//   name String
//   avatar String?
//   email String @unique
//   password String? 
//   role UserRole? @default(MEMBER)
//   projects Project[]
//   tasks Task[]
//   phone Int?
//   LastLogin DateTime?
//   Department String? @default("DEVELOPER")
//   createdAt DateTime? @default(now())
// }

// used intreface

interface UserTask {
  id: string,
  title: string,
  description: string,
  priority: string,
  task_status: string,
  dueDate: string,
  startdate: string,
}
interface UserType {
  id: string,
  name: string,
  avatar: string?,
  role: string,
  email: string
  password?: string,
  tasks: Task[],
  projects: ProjectType[]
  phone?: number
  lastLogin?: Date
  department?: string
  createdAt?: Date
}

interface ProjectType {
  id: string;
  projectName: string;
  description: string;
  completedTask: number;
  startDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING'
  endDate: string;
  users: UserType[];
  tasks: Task[];
}

interface Task {
  id?: string
  title: string;
  description: string;
  assignedTo: UserType | null;
  project: ProjectType | null;
  taskStatus: "OPEN" | "INPROGRESS" | "CLOSED";
  priority: "High" | "Medium" | "Low";
  startDate?: string
  dueDate?: string
}


interface Project {
  id: string;
  title: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  dueDate: string;
  assignedMembers: number;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}



// member interface
interface NavItem {
  id: string;
  label: string;
  icon: string;
  redirect: string;
}

interface OverviewCardProps {
  title: string;
  value: number;
  description: string;
  icon: string;
  iconBg: string;
  progress?: number;
}

interface TaskItemProps {
  task: MemberTask;
}

interface ProgressBarProps {
  percentage: number;
  delay?: number;
}

interface PlaceholderSectionProps {
  title: string;
}

interface TaskStats {
  total: number;
  inProgress: number;
  completed: number;
}

interface MemberTask {
  id: number;
  title: string;
  project: string;
  due: string;
  status: 'progress' | 'completed' | 'pending';
}

type SectionType = 'dashboard' | 'tasks' | 'projects' | 'profile';