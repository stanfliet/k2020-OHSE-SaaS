import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export class DocumentExporter {
  async toPDF(
    content: string,
    title: string,
    metadata?: { author?: string; subject?: string }
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const pdf = new PDFDocument({ margin: 50, size: "A4" });
        const chunks: Buffer[] = [];

        pdf.on("data", (chunk) => chunks.push(chunk));
        pdf.on("end", () => resolve(Buffer.concat(chunks)));
        pdf.on("error", reject);

        if (metadata?.author) pdf.info.Author = metadata.author;
        if (metadata?.subject) pdf.info.Subject = metadata.subject;
        pdf.info.Title = title;

        pdf.fontSize(24).font("Helvetica-Bold").text(title, { align: "center" });
        pdf.moveDown();
        pdf.fontSize(10).font("Helvetica").text(
          `Generated: ${new Date().toLocaleDateString()}`,
          { align: "right" }
        );
        pdf.moveDown();
        pdf.moveTo(50, pdf.y).lineTo(550, pdf.y).stroke();
        pdf.moveDown();

        pdf.fontSize(11).font("Helvetica").text(content, {
          align: "left",
          width: 500,
          height: 700,
          overflow: "hidden",
        });

        pdf.fontSize(9).font("Helvetica").text("K2020-OHSE-SaaS", 50, pdf.page.height - 50, {
          align: "center",
        });

        pdf.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async toDocx(
    content: string,
    title: string,
    metadata?: { author?: string; subject?: string }
  ): Promise<Buffer> {
    try {
      const paragraphs = content
        .split("\n")
        .filter((p) => p.trim())
        .map(
          (text) =>
            new Paragraph({
              text,
              spacing: { line: 240, lineRule: "auto" },
            })
        );

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: title,
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: `Generated: ${new Date().toLocaleDateString()}`,
                spacing: { after: 400 },
              }),
              ...paragraphs,
              new Paragraph({
                text: "K2020-OHSE-SaaS Platform",
                spacing: { before: 200 },
              }),
            ],
          },
        ],
      });

      return await Packer.toBuffer(doc);
    } catch (error) {
      throw new Error(`Failed to generate DOCX: ${(error as Error).message}`);
    }
  }
}
