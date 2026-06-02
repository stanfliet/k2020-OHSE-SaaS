import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

/**
 * Send email using Resend
 */
export async function sendEmail(payload: EmailPayload): Promise<string> {
  try {
    const response = await resend.emails.send({
      from: payload.from || "noreply@k2020ohse.com",
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      replyTo: payload.replyTo,
      tags: payload.tags,
    });

    if (response.error) {
      throw new Error(`Resend error: ${response.error.message}`);
    }

    return response.data?.id || "email-sent";
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

/**
 * Send incident alert email
 */
export async function sendIncidentAlert(
  recipientEmail: string,
  incidentData: {
    type: string;
    severity: string;
    description: string;
    location: string;
    timestamp: string;
  }
): Promise<string> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #dc2626;">🚨 Safety Incident Alert</h2>
      <p><strong>Type:</strong> ${incidentData.type}</p>
      <p><strong>Severity:</strong> <span style="color: ${
        incidentData.severity === "High" ? "#dc2626" : "#f59e0b"
      };">${incidentData.severity}</span></p>
      <p><strong>Description:</strong> ${incidentData.description}</p>
      <p><strong>Location:</strong> ${incidentData.location}</p>
      <p><strong>Time:</strong> ${incidentData.timestamp}</p>
      <p style="margin-top: 20px; color: #666;">
        <a href="${process.env.CORS_ORIGIN}/incidents" style="color: #2563eb; text-decoration: none;">
          View Details →
        </a>
      </p>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    subject: `[ALERT] Safety Incident: ${incidentData.type}`,
    html,
    tags: [{ name: "category", value: "incident-alert" }],
  });
}

/**
 * Send compliance reminder email
 */
export async function sendComplianceReminder(
  recipientEmail: string,
  reminderData: {
    documentType: string;
    dueDate: string;
    status: string;
  }
): Promise<string> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #2563eb;">📋 Compliance Reminder</h2>
      <p>Hello,</p>
      <p>This is a reminder that your <strong>${reminderData.documentType}</strong> document is due on <strong>${reminderData.dueDate}</strong>.</p>
      <p><strong>Status:</strong> ${reminderData.status}</p>
      <p style="margin-top: 20px;">
        <a href="${process.env.CORS_ORIGIN}/documents" style="color: #2563eb; background-color: #dbeafe; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Update Now
        </a>
      </p>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    subject: `Compliance Reminder: ${reminderData.documentType}`,
    html,
    tags: [{ name: "category", value: "compliance" }],
  });
}

/**
 * Send training assignment email
 */
export async function sendTrainingAssignment(
  recipientEmail: string,
  trainingData: {
    trainingTitle: string;
    dueDate: string;
    duration: string;
  }
): Promise<string> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #059669;">📚 New Training Assignment</h2>
      <p>Hello,</p>
      <p>You have been assigned to complete the following training:</p>
      <p style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #059669;">
        <strong>${trainingData.trainingTitle}</strong><br/>
        Duration: ${trainingData.duration}<br/>
        Due: ${trainingData.dueDate}
      </p>
      <p style="margin-top: 20px;">
        <a href="${process.env.CORS_ORIGIN}/training" style="color: white; background-color: #059669; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Start Training
        </a>
      </p>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    subject: `Training Assignment: ${trainingData.trainingTitle}`,
    html,
    tags: [{ name: "category", value: "training" }],
  });
}

/**
 * Send document analysis result email
 */
export async function sendAnalysisResult(
  recipientEmail: string,
  analysisData: {
    documentName: string;
    status: string;
    findings: string;
  }
): Promise<string> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #2563eb;">✅ Document Analysis Complete</h2>
      <p><strong>Document:</strong> ${analysisData.documentName}</p>
      <p><strong>Status:</strong> ${analysisData.status}</p>
      <h3>Key Findings:</h3>
      <p>${analysisData.findings}</p>
      <p style="margin-top: 20px;">
        <a href="${process.env.CORS_ORIGIN}/documents" style="color: #2563eb; text-decoration: none;">
          View Full Report →
        </a>
      </p>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    subject: `Document Analysis: ${analysisData.documentName}`,
    html,
    tags: [{ name: "category", value: "analysis" }],
  });
}
