-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (Managed by Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  contractor_name TEXT,
  contractor_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Uploaded Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INT,
  storage_path TEXT,
  extracted_text TEXT,
  extracted_data JSONB,
  status TEXT DEFAULT 'uploaded',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Analysis Results
CREATE TABLE IF NOT EXISTS ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scope_of_works TEXT,
  project_description TEXT,
  risk_information TEXT,
  tasks_activities JSONB,
  compliance_requirements JSONB,
  safety_requirements JSONB,
  contractor_info JSONB,
  timeline JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Documents
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES ai_analyses(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  file_path TEXT,
  status TEXT DEFAULT 'generated',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  action TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for projects
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for documents
DROP POLICY IF EXISTS "Users can view own documents" ON documents;
DROP POLICY IF EXISTS "Users can upload documents" ON documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON documents;
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for ai_analyses
DROP POLICY IF EXISTS "Users can view own analyses" ON ai_analyses;
DROP POLICY IF EXISTS "Users can create analyses" ON ai_analyses;
CREATE POLICY "Users can view own analyses"
  ON ai_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create analyses"
  ON ai_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for generated_documents
DROP POLICY IF EXISTS "Users can view own generated docs" ON generated_documents;
DROP POLICY IF EXISTS "Users can create generated docs" ON generated_documents;
CREATE POLICY "Users can view own generated docs"
  ON generated_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create generated docs"
  ON generated_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for activity_logs
DROP POLICY IF EXISTS "Users can view own logs" ON activity_logs;
CREATE POLICY "Users can view own logs"
  ON activity_logs FOR SELECT
  USING (auth.uid() = user_id);

-- ========================================
-- EXTENDED SCHEMA FOR K2020 MODULES
-- Added for Company Profiles, Compliance, Training, Environmental, Quality
-- ========================================

-- Company Profiles (stores company info: CIDB, COIDA, directors, etc.)
CREATE TABLE IF NOT EXISTS company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  registration_number TEXT,
  vat_number TEXT,
  cidb_grading TEXT,
  nhbrc_registration TEXT,
  coida_number TEXT,
  tax_number TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  logo_url TEXT,
  letterhead_url TEXT,
  email_signature_url TEXT,
  default_signatory_name TEXT,
  default_signatory_title TEXT,
  default_signatory_email TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Directors/Officers
CREATE TABLE IF NOT EXISTS company_directors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  id_number TEXT,
  appointment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Settings
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL UNIQUE REFERENCES company_profiles(id) ON DELETE CASCADE,
  default_hs_officer TEXT,
  default_construction_manager TEXT,
  default_safety_officer_email TEXT,
  document_approval_required BOOLEAN DEFAULT true,
  require_mfa BOOLEAN DEFAULT false,
  timezone TEXT DEFAULT 'Africa/Johannesburg',
  currency TEXT DEFAULT 'ZAR',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extend generated_documents for approval workflow & signatures
ALTER TABLE generated_documents ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'draft';
ALTER TABLE generated_documents ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE generated_documents ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE generated_documents ADD COLUMN IF NOT EXISTS approval_comments TEXT;
ALTER TABLE generated_documents ADD COLUMN IF NOT EXISTS document_version INTEGER DEFAULT 1;
ALTER TABLE generated_documents ADD COLUMN IF NOT EXISTS signatures JSONB;
ALTER TABLE generated_documents ADD COLUMN IF NOT EXISTS qr_code TEXT;

-- Approval History Log
CREATE TABLE IF NOT EXISTS document_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES generated_documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  comments TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Records & Certifications
CREATE TABLE IF NOT EXISTS training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  training_type TEXT NOT NULL,
  description TEXT,
  completion_date DATE,
  expiry_date DATE,
  certificate_number TEXT,
  trainer_name TEXT,
  training_provider TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incident Reports
CREATE TABLE IF NOT EXISTS incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date_of_incident DATE NOT NULL,
  time_of_incident TIME,
  incident_type TEXT,
  description TEXT,
  location TEXT,
  injured_persons INTEGER,
  equipment_damage BOOLEAN,
  damage_description TEXT,
  status TEXT DEFAULT 'open',
  investigation_status TEXT DEFAULT 'pending',
  root_cause TEXT,
  corrective_actions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance Items Tracking
CREATE TABLE IF NOT EXISTS compliance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  requirement TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completion_date DATE,
  status TEXT DEFAULT 'pending',
  assigned_to UUID REFERENCES auth.users(id),
  evidence_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance Categories (e.g., OHSA, Environmental, Quality, etc.)
CREATE TABLE IF NOT EXISTS compliance_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  legislation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Environmental Management Plans
CREATE TABLE IF NOT EXISTS environmental_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plan_type TEXT,
  content TEXT,
  waste_management_plan TEXT,
  spill_response_plan TEXT,
  dust_control_measures TEXT,
  noise_control_measures TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quality Management Plans
CREATE TABLE IF NOT EXISTS quality_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT,
  inspection_test_plan TEXT,
  material_specifications TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Non-Conformance Reports (NCR)
CREATE TABLE IF NOT EXISTS non_conformances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  date_raised DATE NOT NULL,
  description TEXT NOT NULL,
  severity TEXT,
  status TEXT DEFAULT 'open',
  corrective_action TEXT,
  verification_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PPE Register
CREATE TABLE IF NOT EXISTS ppe_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  item_type TEXT,
  quantity INTEGER,
  issue_date DATE,
  expiry_date DATE,
  issued_to UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visitor Register
CREATE TABLE IF NOT EXISTS visitor_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  company TEXT,
  date_visited DATE NOT NULL,
  time_in TIME,
  time_out TIME,
  purpose TEXT,
  inducted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Toolbox Talks Register
CREATE TABLE IF NOT EXISTS toolbox_talks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  topic TEXT NOT NULL,
  presenter TEXT,
  attendees_count INTEGER,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BOQ Records (Bill of Quantities)
CREATE TABLE IF NOT EXISTS boq_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  items_count INTEGER,
  total_value DECIMAL(15,2),
  assumptions JSONB,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_directors ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE non_conformances ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolbox_talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Company Profiles
DROP POLICY IF EXISTS "Users can view own company" ON company_profiles;
DROP POLICY IF EXISTS "Users can create company" ON company_profiles;
DROP POLICY IF EXISTS "Users can update own company" ON company_profiles;
CREATE POLICY "Users can view own company"
  ON company_profiles FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create company"
  ON company_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own company"
  ON company_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for Directors (company members can view)
DROP POLICY IF EXISTS "Users can view company directors" ON company_directors;
CREATE POLICY "Users can view company directors"
  ON company_directors FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM company_profiles 
    WHERE id = company_id AND user_id = auth.uid()
  ));

-- RLS Policies for Training Records
DROP POLICY IF EXISTS "Users can view own training" ON training_records;
DROP POLICY IF EXISTS "Users can create training" ON training_records;
CREATE POLICY "Users can view own training"
  ON training_records FOR SELECT
  USING (auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can create training"
  ON training_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Incident Reports
DROP POLICY IF EXISTS "Users can view project incidents" ON incident_reports;
DROP POLICY IF EXISTS "Users can create incidents" ON incident_reports;
CREATE POLICY "Users can view project incidents"
  ON incident_reports FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can create incidents"
  ON incident_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Compliance Items
DROP POLICY IF EXISTS "Users can view compliance items" ON compliance_items;
DROP POLICY IF EXISTS "Users can create compliance items" ON compliance_items;
CREATE POLICY "Users can view compliance items"
  ON compliance_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can create compliance items"
  ON compliance_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));

-- RLS Policies for Environmental Plans
DROP POLICY IF EXISTS "Users can view env plans" ON environmental_plans;
DROP POLICY IF EXISTS "Users can create env plans" ON environmental_plans;
CREATE POLICY "Users can view env plans"
  ON environmental_plans FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can create env plans"
  ON environmental_plans FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));

-- RLS Policies for Quality Plans
DROP POLICY IF EXISTS "Users can view quality plans" ON quality_plans;
DROP POLICY IF EXISTS "Users can create quality plans" ON quality_plans;
CREATE POLICY "Users can view quality plans"
  ON quality_plans FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can create quality plans"
  ON quality_plans FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));

-- RLS Policies for other registers
DROP POLICY IF EXISTS "Users can view non-conformances" ON non_conformances;
CREATE POLICY "Users can view non-conformances"
  ON non_conformances FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view ppe register" ON ppe_register;
CREATE POLICY "Users can view ppe register"
  ON ppe_register FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view visitors" ON visitor_register;
CREATE POLICY "Users can view visitors"
  ON visitor_register FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view toolbox talks" ON toolbox_talks;
CREATE POLICY "Users can view toolbox talks"
  ON toolbox_talks FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));

-- RLS Policies for BOQ Records
DROP POLICY IF EXISTS "Users can view boq records" ON boq_records;
DROP POLICY IF EXISTS "Users can create boq records" ON boq_records;
CREATE POLICY "Users can view boq records"
  ON boq_records FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()));
CREATE POLICY "Users can create boq records"
  ON boq_records FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_project_id ON ai_analyses(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_user_id ON ai_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_project_id ON generated_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_approval_status ON generated_documents(approval_status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_company_profiles_user_id ON company_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_training_records_user_id ON training_records(user_id);
CREATE INDEX IF NOT EXISTS idx_training_records_expiry ON training_records(expiry_date);
CREATE INDEX IF NOT EXISTS idx_incident_reports_project_id ON incident_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON incident_reports(status);
CREATE INDEX IF NOT EXISTS idx_compliance_items_project_id ON compliance_items(project_id);
CREATE INDEX IF NOT EXISTS idx_compliance_items_status ON compliance_items(status);
CREATE INDEX IF NOT EXISTS idx_environmental_plans_project_id ON environmental_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_quality_plans_project_id ON quality_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_non_conformances_project_id ON non_conformances(project_id);
CREATE INDEX IF NOT EXISTS idx_visitor_register_project_id ON visitor_register(project_id);
CREATE INDEX IF NOT EXISTS idx_toolbox_talks_project_id ON toolbox_talks(project_id);
CREATE INDEX IF NOT EXISTS idx_boq_records_project_id ON boq_records(project_id);
CREATE INDEX IF NOT EXISTS idx_boq_records_created_by ON boq_records(created_by);