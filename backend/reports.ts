import ExcelJS from "exceljs";
import path from "path";

/**
 * Generate compliance report as Excel file
 */
export async function generateComplianceReport(
  reportData: {
    companyName: string;
    reportDate: string;
    findings: Array<{
      category: string;
      description: string;
      severity: "High" | "Medium" | "Low";
      status: string;
    }>;
    summary: {
      totalFindings: number;
      highSeverity: number;
      mediumSeverity: number;
      lowSeverity: number;
      complianceScore: number;
    };
  },
  outputPath: string = "./compliance-report.xlsx"
): Promise<string> {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Compliance Report");

    // Add header
    worksheet.columns = [
      { header: "Category", key: "category", width: 20 },
      { header: "Description", key: "description", width: 40 },
      { header: "Severity", key: "severity", width: 12 },
      { header: "Status", key: "status", width: 15 },
    ];

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1e40af" },
    };

    // Add findings
    reportData.findings.forEach((finding) => {
      const row = worksheet.addRow(finding);

      // Color code severity
      const severityCell = row.getCell("severity");
      if (finding.severity === "High") {
        severityCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFDC2626" },
        };
      } else if (finding.severity === "Medium") {
        severityCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF59e0b" },
        };
      } else {
        severityCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF10b981" },
        };
      }
    });

    // Add summary section
    const summaryStartRow = reportData.findings.length + 4;
    worksheet.getCell(`A${summaryStartRow}`).value = "COMPLIANCE SUMMARY";
    worksheet.getCell(`A${summaryStartRow}`).font = { bold: true, size: 12 };

    worksheet.getCell(`A${summaryStartRow + 1}`).value = "Company";
    worksheet.getCell(`B${summaryStartRow + 1}`).value = reportData.companyName;

    worksheet.getCell(`A${summaryStartRow + 2}`).value = "Report Date";
    worksheet.getCell(`B${summaryStartRow + 2}`).value = reportData.reportDate;

    worksheet.getCell(`A${summaryStartRow + 3}`).value = "Total Findings";
    worksheet.getCell(`B${summaryStartRow + 3}`).value =
      reportData.summary.totalFindings;

    worksheet.getCell(`A${summaryStartRow + 4}`).value = "High Severity";
    worksheet.getCell(`B${summaryStartRow + 4}`).value =
      reportData.summary.highSeverity;

    worksheet.getCell(`A${summaryStartRow + 5}`).value = "Compliance Score";
    worksheet.getCell(`B${summaryStartRow + 5}`).value =
      `${reportData.summary.complianceScore}%`;

    await workbook.xlsx.writeFile(outputPath);
    return outputPath;
  } catch (error) {
    console.error("Compliance report generation error:", error);
    throw error;
  }
}

/**
 * Generate incident report as Excel
 */
export async function generateIncidentReport(
  incidents: Array<{
    date: string;
    type: string;
    severity: string;
    location: string;
    description: string;
    status: string;
  }>,
  outputPath: string = "./incident-report.xlsx"
): Promise<string> {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Incidents");

    worksheet.columns = [
      { header: "Date", key: "date", width: 12 },
      { header: "Type", key: "type", width: 20 },
      { header: "Severity", key: "severity", width: 10 },
      { header: "Location", key: "location", width: 20 },
      { header: "Description", key: "description", width: 30 },
      { header: "Status", key: "status", width: 12 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDC2626" },
    };

    incidents.forEach((incident) => {
      worksheet.addRow(incident);
    });

    await workbook.xlsx.writeFile(outputPath);
    return outputPath;
  } catch (error) {
    console.error("Incident report generation error:", error);
    throw error;
  }
}

/**
 * Generate training records report
 */
export async function generateTrainingReport(
  trainingRecords: Array<{
    employeeName: string;
    training: string;
    completionDate: string;
    score: number;
    status: string;
  }>,
  outputPath: string = "./training-report.xlsx"
): Promise<string> {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Training Records");

    worksheet.columns = [
      { header: "Employee Name", key: "employeeName", width: 20 },
      { header: "Training", key: "training", width: 25 },
      { header: "Completion Date", key: "completionDate", width: 15 },
      { header: "Score", key: "score", width: 8 },
      { header: "Status", key: "status", width: 12 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF059669" },
    };

    trainingRecords.forEach((record) => {
      const row = worksheet.addRow(record);
      const scoreCell = row.getCell("score");
      if (record.score >= 80) {
        scoreCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFdbeafe" },
        };
      }
    });

    await workbook.xlsx.writeFile(outputPath);
    return outputPath;
  } catch (error) {
    console.error("Training report generation error:", error);
    throw error;
  }
}

/**
 * Generate custom report with multiple sheets
 */
export async function generateMultiSheetReport(
  reportName: string,
  sheets: Array<{
    name: string;
    data: any[];
    columns: Array<{ header: string; key: string; width?: number }>;
  }>,
  outputPath: string = "./report.xlsx"
): Promise<string> {
  try {
    const workbook = new ExcelJS.Workbook();

    sheets.forEach((sheetConfig) => {
      const worksheet = workbook.addWorksheet(sheetConfig.name);

      worksheet.columns = sheetConfig.columns.map((col) => ({
        header: col.header,
        key: col.key,
        width: col.width || 15,
      }));

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1e40af" },
      };

      sheetConfig.data.forEach((row) => {
        worksheet.addRow(row);
      });
    });

    await workbook.xlsx.writeFile(outputPath);
    return outputPath;
  } catch (error) {
    console.error("Multi-sheet report generation error:", error);
    throw error;
  }
}

/**
 * Generate analytics dashboard data export
 */
export async function exportAnalyticsDashboard(
  analyticsData: Record<string, any>,
  outputPath: string = "./analytics.xlsx"
): Promise<string> {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Analytics");

    let rowNum = 1;

    Object.entries(analyticsData).forEach(([key, value]) => {
      worksheet.getCell(`A${rowNum}`).value = key;
      worksheet.getCell(`B${rowNum}`).value = value;
      rowNum++;
    });

    await workbook.xlsx.writeFile(outputPath);
    return outputPath;
  } catch (error) {
    console.error("Analytics export error:", error);
    throw error;
  }
}
