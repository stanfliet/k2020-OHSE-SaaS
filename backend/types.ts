export interface User {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    company_id?: string;
  };
}

export interface Company {
  id: string;
  user_id: string;
  name: string;
  registration_number: string;
  vat_number?: string;
  cidb_grading?: string;
  nhbrc_registration?: string;
  coida_number?: string;
  tax_number?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  logo_url?: string;
  letterhead_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  company_id: string;
  name: string;
  client?: string;
  contractor?: string;
  contract_value?: number;
  start_date?: string;
  end_date?: string;
  site_address?: string;
  gps_coordinates?: string;
  scope?: string;
  risks?: string[];
  status: "planning" | "active" | "on_hold" | "completed";
  created_at: string;
  updated_at: string;
}

export interface SafetyFile {
  id: string;
  project_id: string;
  document_type:
    | "safety_plan"
    | "risk_assessment"
    | "method_statement"
    | "legal_appointment"
    | "register";
  title: string;
  content: string;
  approval_status: "draft" | "submitted_for_review" | "approved" | "archived";
  created_at: string;
  updated_at: string;
}

export interface IncidentReport {
  id: string;
  project_id: string;
  reported_by: string;
  incident_date: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  injuries?: string;
  root_cause?: string;
  corrective_actions?: string;
  status: "open" | "investigating" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
}

export interface TrainingRecord {
  id: string;
  employee_id: string;
  course_name: string;
  provider?: string;
  completion_date: string;
  expiry_date?: string;
  certificate_url?: string;
  status: "completed" | "in_progress" | "pending" | "expired";
  created_at: string;
  updated_at: string;
}

export interface ComplianceItem {
  id: string;
  project_id: string;
  requirement: string;
  status: "not_started" | "in_progress" | "completed";
  due_date: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EnvironmentalPlan {
  id: string;
  project_id: string;
  plan_type:
    | "waste_management"
    | "spill_response"
    | "dust_control"
    | "noise_control"
    | "general";
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface QualityPlan {
  id: string;
  project_id: string;
  title: string;
  content: string;
  approval_status: "draft" | "review" | "approved";
  created_at: string;
  updated_at: string;
}

export interface NonConformance {
  id: string;
  project_id: string;
  issue_description: string;
  severity: "minor" | "major";
  raised_date: string;
  assigned_to?: string;
  corrective_action?: string;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
}
