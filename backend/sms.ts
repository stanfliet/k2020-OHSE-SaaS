import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export interface SMSPayload {
  to: string | string[];
  body: string;
}

/**
 * Send SMS using Twilio
 */
export async function sendSMS(payload: SMSPayload): Promise<string> {
  try {
    const phoneNumbers = Array.isArray(payload.to) ? payload.to : [payload.to];
    const responses = await Promise.all(
      phoneNumbers.map((phone) =>
        twilioClient.messages.create({
          body: payload.body,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        })
      )
    );

    return responses[0].sid;
  } catch (error) {
    console.error("SMS sending error:", error);
    throw error;
  }
}

/**
 * Send incident alert SMS
 */
export async function sendIncidentAlertSMS(
  phoneNumbers: string[],
  incidentType: string,
  severity: string
): Promise<string> {
  const body = `🚨 INCIDENT ALERT: ${incidentType} (${severity}). Check K2020 OHSE for details.`;

  return sendSMS({
    to: phoneNumbers,
    body,
  });
}

/**
 * Send safety check reminder SMS
 */
export async function sendSafetyCheckReminder(
  phoneNumber: string,
  checkType: string
): Promise<string> {
  const body = `⚠️ Reminder: Complete your ${checkType} safety check. Reply DONE when complete.`;

  return sendSMS({
    to: phoneNumber,
    body,
  });
}

/**
 * Send training assignment SMS
 */
export async function sendTrainingReminderSMS(
  phoneNumber: string,
  trainingTitle: string,
  dueDate: string
): Promise<string> {
  const body = `📚 New Training: ${trainingTitle}. Due: ${dueDate}. Complete at ${process.env.CORS_ORIGIN}`;

  return sendSMS({
    to: phoneNumber,
    body,
  });
}

/**
 * Send compliance deadline SMS
 */
export async function sendComplianceDeadlineSMS(
  phoneNumber: string,
  documentType: string,
  daysRemaining: number
): Promise<string> {
  const body = `📋 ${documentType} compliance deadline in ${daysRemaining} days. Act now!`;

  return sendSMS({
    to: phoneNumber,
    body,
  });
}

/**
 * Send emergency broadcast SMS
 */
export async function sendEmergencyBroadcast(
  phoneNumbers: string[],
  message: string
): Promise<string> {
  const body = `🚨 EMERGENCY: ${message}. Evacuate if instructed.`;

  return sendSMS({
    to: phoneNumbers,
    body,
  });
}

/**
 * Send verification code SMS
 */
export async function sendVerificationSMS(
  phoneNumber: string,
  code: string
): Promise<string> {
  const body = `Your K2020 OHSE verification code is: ${code}. Valid for 10 minutes.`;

  return sendSMS({
    to: phoneNumber,
    body,
  });
}
