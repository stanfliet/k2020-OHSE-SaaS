import dotenv from "dotenv";
dotenv.config(); // Load env vars (defensive - should already be loaded by index.ts)

import { Router, Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { authenticateUser } from "./rbac";
import OpenAI from "openai";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ==================== COMPANY ROUTES ====================
export const companyRouter = Router();

companyRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

companyRouter.get("/", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("company_profiles")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

companyRouter.post("/", async (req: Request & { user?: any }, res: Response) => {
  try {
    const {
      name,
      registration_number,
      vat_number,
      cidb_grading,
      nhbrc_registration,
      coida_number,
      tax_number,
      phone,
      email,
      address,
      city,
      province,
      postal_code,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Company name is required" });
    }

    const { data, error } = await supabase
      .from("company_profiles")
      .insert({
        user_id: req.user.id,
        name,
        registration_number,
        vat_number,
        cidb_grading,
        nhbrc_registration,
        coida_number,
        tax_number,
        phone,
        email,
        address,
        city,
        province,
        postal_code,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

companyRouter.get("/:id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("company_profiles")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

companyRouter.put("/:id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;

    const { data: existing } = await supabase
      .from("company_profiles")
      .select("id")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (!existing) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { data, error } = await supabase
      .from("company_profiles")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

companyRouter.delete("/:id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;

    const { data: existing } = await supabase
      .from("company_profiles")
      .select("id")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (!existing) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { error } = await supabase
      .from("company_profiles")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.json({ success: true, message: "Company deleted" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==================== PROJECT ROUTES ====================
export const projectRouter = Router();

projectRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

projectRouter.get("/", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { company_id } = req.query;

    let query = supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (company_id) {
      query = query.eq("company_id", company_id);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

projectRouter.post("/", async (req: Request & { user?: any }, res: Response) => {
  try {
    const {
      company_id,
      name,
      client,
      contractor,
      contract_value,
      start_date,
      end_date,
      site_address,
      gps_coordinates,
      scope,
      risks,
      status = "planning",
    } = req.body;

    if (!company_id || !name) {
      return res
        .status(400)
        .json({ error: "company_id and name are required" });
    }

    const { data: company } = await supabase
      .from("company_profiles")
      .select("id")
      .eq("id", company_id)
      .eq("user_id", req.user.id)
      .single();

    if (!company) {
      return res.status(403).json({ error: "Not authorized to access this company" });
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        company_id,
        name,
        client,
        contractor,
        contract_value,
        start_date,
        end_date,
        site_address,
        gps_coordinates,
        scope,
        risks,
        status,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

projectRouter.get("/:id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

projectRouter.put("/:id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("projects")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

projectRouter.delete("/:id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==================== SAFETY ROUTES ====================
export const safetyRouter = Router();

safetyRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

safetyRouter.post(
  "/generate",
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const { project_id, document_type, include_sections = [] } = req.body;

      const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", project_id)
        .single();

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const prompt = `Generate a professional ${document_type} for a construction project with these details:
Project: ${project.name}
Client: ${project.client || "N/A"}
Site: ${project.site_address || "N/A"}
Scope: ${project.scope || "N/A"}
Risks: ${project.risks?.join(", ") || "N/A"}

The document should comply with South African construction regulations (OHS Act 85 of 1993, Construction Regulations 2014).`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an expert construction safety and compliance officer specializing in South African regulations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const content = completion.choices[0].message.content || "";

      const { data: document, error: docError } = await supabase
        .from("generated_documents")
        .insert({
          project_id,
          user_id: req.user.id,
          document_type,
          title: `${document_type} - ${project.name}`,
          content,
          approval_status: "draft",
        })
        .select()
        .single();

      if (docError) throw docError;

      res.status(201).json({
        success: true,
        document,
        preview: content.substring(0, 500),
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

safetyRouter.get("/project/:project_id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id } = req.params;

    const { data, error } = await supabase
      .from("generated_documents")
      .select("*")
      .eq("project_id", project_id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==================== DOCUMENT ROUTES ====================
export const documentRouter = Router();

documentRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

documentRouter.get("/", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("generated_documents")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

documentRouter.get("/:id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("generated_documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

documentRouter.put("/:id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const { data, error } = await supabase
      .from("generated_documents")
      .update({ content })
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

documentRouter.post("/:id/approve", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("generated_documents")
      .update({ approval_status: "approved" })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==================== TRAINING ROUTES ====================
export const trainingRouter = Router();

trainingRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

trainingRouter.get("/project/:project_id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id } = req.params;

    const { data, error } = await supabase
      .from("training_records")
      .select("*")
      .eq("project_id", project_id)
      .order("completion_date", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

trainingRouter.post("/", async (req: Request & { user?: any }, res: Response) => {
  try {
    const {
      project_id,
      employee_id,
      course_name,
      provider,
      completion_date,
      expiry_date,
    } = req.body;

    const { data, error } = await supabase
      .from("training_records")
      .insert({
        project_id,
        employee_id,
        course_name,
        provider,
        completion_date,
        expiry_date,
        status: "completed",
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==================== INCIDENT ROUTES ====================
export const incidentRouter = Router();

incidentRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

incidentRouter.get("/project/:project_id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id } = req.params;

    const { data, error } = await supabase
      .from("incident_reports")
      .select("*")
      .eq("project_id", project_id)
      .order("incident_date", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

incidentRouter.post("/", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id, incident_date, description, severity, injuries } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in root cause analysis. Analyze the incident and identify root causes and corrective actions.",
        },
        {
          role: "user",
          content: `Incident: ${description}\nSeverity: ${severity}\nInjuries: ${injuries || "None"}\n\nProvide JSON with: root_causes (array), corrective_actions (array)`,
        },
      ],
    });

    let analysisData = { root_causes: [], corrective_actions: [] };
    try {
      const content = completion.choices[0].message.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.error("Failed to parse AI response:", err);
    }

    const { data, error } = await supabase
      .from("incident_reports")
      .insert({
        project_id,
        reported_by: req.user.id,
        incident_date,
        description,
        severity,
        injuries,
        root_cause: analysisData.root_causes.join("; "),
        corrective_actions: analysisData.corrective_actions.join("; "),
        status: "open",
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      analysis: analysisData,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==================== COMPLIANCE ROUTES ====================
export const complianceRouter = Router();

complianceRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

complianceRouter.get("/project/:project_id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id } = req.params;

    const { data, error } = await supabase
      .from("compliance_items")
      .select("*")
      .eq("project_id", project_id)
      .order("due_date", { ascending: true });

    if (error) throw error;

    const completed = data?.filter((item) => item.status === "completed").length || 0;
    const total = data?.length || 0;
    const score = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      success: true,
      data,
      complianceScore: score,
      completedCount: completed,
      totalCount: total,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

complianceRouter.post("/", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id, requirement, due_date, assigned_to } = req.body;

    const { data, error } = await supabase
      .from("compliance_items")
      .insert({
        project_id,
        requirement,
        due_date,
        assigned_to,
        status: "not_started",
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==================== ENVIRONMENTAL ROUTES ====================
export const environmentalRouter = Router();

environmentalRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

environmentalRouter.get("/project/:project_id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id } = req.params;

    const { data, error } = await supabase
      .from("environmental_plans")
      .select("*")
      .eq("project_id", project_id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

environmentalRouter.post("/", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id, plan_type, title, content } = req.body;

    const { data, error } = await supabase
      .from("environmental_plans")
      .insert({
        project_id,
        plan_type,
        title,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==================== QUALITY ROUTES ====================
export const qualityRouter = Router();

qualityRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

qualityRouter.get("/project/:project_id", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id } = req.params;

    const { data, error } = await supabase
      .from("quality_plans")
      .select("*")
      .eq("project_id", project_id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

qualityRouter.post("/", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id, title, content } = req.body;

    const { data, error } = await supabase
      .from("quality_plans")
      .insert({
        project_id,
        title,
        content,
        approval_status: "draft",
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

qualityRouter.get("/:project_id/non-conformances", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id } = req.params;

    const { data, error } = await supabase
      .from("non_conformances")
      .select("*")
      .eq("project_id", project_id)
      .order("raised_date", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

qualityRouter.post("/:project_id/non-conformances", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id } = req.params;
    const { issue_description, severity } = req.body;

    const { data, error } = await supabase
      .from("non_conformances")
      .insert({
        project_id,
        issue_description,
        severity,
        raised_date: new Date().toISOString(),
        status: "open",
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==================== DOCUMENT EXPORT ROUTES ====================
export const documentExportRouter = Router();

documentExportRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

documentExportRouter.post("/export/pdf", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { content, title, author } = req.body;

    if (!content || !title) {
      return res.status(400).json({ error: "content and title required" });
    }

    const { DocumentExporter } = await import("./documentExporter");
    const exporter = new DocumentExporter();
    const pdfBuffer = await exporter.toPDF(content, title, { author });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${title}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

documentExportRouter.post("/export/docx", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { content, title, author } = req.body;

    if (!content || !title) {
      return res.status(400).json({ error: "content and title required" });
    }

    const { DocumentExporter } = await import("./documentExporter");
    const exporter = new DocumentExporter();
    const docxBuffer = await exporter.toDocx(content, title, { author });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${title}.docx"`);
    res.send(docxBuffer);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==================== QUANTITY SURVEYOR ROUTES ====================
export const qsRouter = Router();

qsRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

qsRouter.post("/parse-boq", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { fileData, fileType = "csv" } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: "fileData required" });
    }

    const { QSEngine } = await import("./qsEngine");
    const engine = new QSEngine();
    const items = await engine.parseBOQ(fileData, fileType);
    const validation = engine.validateBOQ(items);

    res.json({
      success: true,
      items,
      validation,
      message: "BOQ parsed successfully",
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

qsRouter.post("/build-rates", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { items, assumptions } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "items array required" });
    }

    const { QSEngine } = await import("./qsEngine");
    const engine = new QSEngine();
    const ratedItems = await engine.buildRates(items, assumptions);
    const metrics = engine.calculateMetrics(ratedItems);

    res.json({
      success: true,
      items: ratedItems,
      metrics,
      disclaimer: "AI-assisted estimates require professional review and approval before submission",
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

qsRouter.post("/save-boq", async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id, items, total_value, assumptions } = req.body;

    const { data, error } = await supabase
      .from("boq_records")
      .insert({
        project_id,
        items_count: items?.length || 0,
        total_value,
        assumptions: JSON.stringify(assumptions),
        created_by: req.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
