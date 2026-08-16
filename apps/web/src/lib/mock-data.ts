export type Org = {
  id: string
  name: string
  slug: string
  plan: "starter" | "professional" | "enterprise"
}

export type User = {
  id: string
  name: string
  email: string
  role: string
  avatarUrl?: string
}

export type Site = {
  id: string
  name: string
  location: string
  type: string
  inspectionsCount: number
  openIssues: number
  status: "active" | "inactive"
}

export type Inspection = {
  id: string
  title: string
  templateName: string
  siteName: string
  assignee: string
  status: "scheduled" | "in_progress" | "submitted" | "approved" | "rejected"
  dueDate: string
  score?: number
}

export type Activity = {
  id: string
  action: string
  entity: string
  user: string
  timestamp: string
}

export const currentUser: User = {
  id: "user_1",
  name: "Himanshu Singla",
  email: "himanshu@qualti.io",
  role: "Quality Manager",
}

export const organizations: Org[] = [
  { id: "org_1", name: "Apex Manufacturing", slug: "apex-mfg", plan: "professional" },
  { id: "org_2", name: "BuildRight Construction", slug: "buildright", plan: "enterprise" },
  { id: "org_3", name: "FreshMart Retail", slug: "freshmart", plan: "starter" },
]

export const currentOrg: Org = {
  id: "org_1",
  name: "Apex Manufacturing",
  slug: "apex-mfg",
  plan: "professional",
}

export const dashboardStats = {
  totalInspections: 248,
  inspectionsChange: "+12%",
  completionRate: 87,
  completionChange: "+3%",
  openIssues: 14,
  issuesChange: "-5%",
  overdueActions: 6,
  actionsChange: "-2%",
}

export const sites: Site[] = [
  {
    id: "site_1",
    name: "Gurgaon Plant A",
    location: "Gurgaon, Haryana",
    type: "Manufacturing",
    inspectionsCount: 84,
    openIssues: 3,
    status: "active",
  },
  {
    id: "site_2",
    name: "Mumbai Warehouse",
    location: "Mumbai, Maharashtra",
    type: "Warehouse",
    inspectionsCount: 52,
    openIssues: 5,
    status: "active",
  },
  {
    id: "site_3",
    name: "Pune Assembly Line",
    location: "Pune, Maharashtra",
    type: "Manufacturing",
    inspectionsCount: 67,
    openIssues: 2,
    status: "active",
  },
  {
    id: "site_4",
    name: "Chennai Distribution Hub",
    location: "Chennai, Tamil Nadu",
    type: "Distribution",
    inspectionsCount: 31,
    openIssues: 4,
    status: "active",
  },
  {
    id: "site_5",
    name: "Delhi Office",
    location: "New Delhi",
    type: "Office",
    inspectionsCount: 14,
    openIssues: 0,
    status: "inactive",
  },
]

export const inspections: Inspection[] = [
  {
    id: "insp_1",
    title: "Weekly Safety Walkthrough",
    templateName: "Warehouse Safety Audit",
    siteName: "Mumbai Warehouse",
    assignee: "Priya Sharma",
    status: "in_progress",
    dueDate: "2026-06-11",
    score: 72,
  },
  {
    id: "insp_2",
    title: "Batch #4821 Incoming QC",
    templateName: "Incoming Material QC",
    siteName: "Gurgaon Plant A",
    assignee: "Himanshu Singla",
    status: "scheduled",
    dueDate: "2026-06-12",
  },
  {
    id: "insp_3",
    title: "Line 3 Production Check",
    templateName: "Production Line Inspection",
    siteName: "Pune Assembly Line",
    assignee: "Rahul Verma",
    status: "submitted",
    dueDate: "2026-06-10",
    score: 91,
  },
  {
    id: "insp_4",
    title: "Forklift Maintenance Review",
    templateName: "Equipment Maintenance Check",
    siteName: "Chennai Distribution Hub",
    assignee: "Anita Desai",
    status: "approved",
    dueDate: "2026-06-09",
    score: 95,
  },
  {
    id: "insp_5",
    title: "Supplier Lot #772 QC",
    templateName: "Supplier Self-Inspection",
    siteName: "Gurgaon Plant A",
    assignee: "Vikram Patel",
    status: "rejected",
    dueDate: "2026-06-08",
    score: 58,
  },
  {
    id: "insp_6",
    title: "Monthly Fire Safety Audit",
    templateName: "Warehouse Safety Audit",
    siteName: "Mumbai Warehouse",
    assignee: "Priya Sharma",
    status: "scheduled",
    dueDate: "2026-06-15",
  },
]

export const recentActivity: Activity[] = [
  {
    id: "act_1",
    action: "submitted inspection",
    entity: "Line 3 Production Check",
    user: "Rahul Verma",
    timestamp: "2 hours ago",
  },
  {
    id: "act_2",
    action: "published template",
    entity: "Incoming Material QC v3",
    user: "Himanshu Singla",
    timestamp: "5 hours ago",
  },
  {
    id: "act_3",
    action: "created corrective action",
    entity: "Forklift brake defect",
    user: "Anita Desai",
    timestamp: "Yesterday",
  },
  {
    id: "act_4",
    action: "approved inspection",
    entity: "Forklift Maintenance Review",
    user: "Himanshu Singla",
    timestamp: "Yesterday",
  },
  {
    id: "act_5",
    action: "added new site",
    entity: "Chennai Distribution Hub",
    user: "Himanshu Singla",
    timestamp: "2 days ago",
  },
]

export const teamMembers = [
  { id: "tm_1", name: "Himanshu Singla", email: "himanshu@qualti.io", role: "Admin" },
  { id: "tm_2", name: "Priya Sharma", email: "priya@apex-mfg.com", role: "Inspector" },
  { id: "tm_3", name: "Rahul Verma", email: "rahul@apex-mfg.com", role: "Inspector" },
  { id: "tm_4", name: "Anita Desai", email: "anita@apex-mfg.com", role: "Reviewer" },
]
