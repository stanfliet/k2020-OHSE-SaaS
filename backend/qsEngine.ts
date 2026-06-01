export interface BOQItem {
  item_number: string;
  description: string;
  unit: string;
  quantity: number;
  rate?: number;
  amount?: number;
}

export interface RateComponents {
  materials: number;
  labour: number;
  plant: number;
  overheads: number;
  profit: number;
  total: number;
}

export class QSEngine {
  async parseBOQ(fileData: string, fileType: string = "csv"): Promise<BOQItem[]> {
    try {
      if (fileType === "csv") {
        return this.parseCSV(fileData);
      }
      throw new Error("XLSX parsing not yet implemented");
    } catch (error) {
      throw new Error(`Failed to parse BOQ: ${(error as Error).message}`);
    }
  }

  private parseCSV(csvData: string): BOQItem[] {
    const lines = csvData.split("\n").filter((line) => line.trim());
    const items: BOQItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim());
      if (parts.length >= 4) {
        items.push({
          item_number: parts[0],
          description: parts[1],
          unit: parts[2],
          quantity: parseFloat(parts[3]) || 0,
        });
      }
    }

    return items;
  }

  async buildRates(
    items: BOQItem[],
    assumptions: {
      labourRate?: number;
      overheadPercentage?: number;
      profitPercentage?: number;
      contingency?: number;
    } = {}
  ): Promise<BOQItem[]> {
    const {
      labourRate = 1000,
      overheadPercentage = 15,
      profitPercentage = 20,
    } = assumptions;

    return items.map((item) => {
      let baseRate = 0;
      const desc = item.description.toLowerCase();

      if (desc.includes("concrete")) baseRate = 1200 * item.quantity;
      else if (desc.includes("brick")) baseRate = 0.5 * item.quantity;
      else if (desc.includes("steel")) baseRate = 15000 * item.quantity;
      else if (desc.includes("labour")) baseRate = labourRate * item.quantity;
      else if (desc.includes("excavation")) baseRate = 50 * item.quantity;
      else baseRate = 500 * item.quantity;

      const overheads = (baseRate * overheadPercentage) / 100;
      const subtotal = baseRate + overheads;
      const profit = (subtotal * profitPercentage) / 100;
      const rate = (subtotal + profit) / item.quantity;

      return {
        ...item,
        rate: Math.round(rate),
        amount: Math.round(rate * item.quantity),
      };
    });
  }

  calculateMetrics(items: BOQItem[]): {
    totalValue: number;
    averageRate: number;
    itemCount: number;
    assumptions: string;
  } {
    const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const averageRate =
      items.reduce((sum, item) => sum + (item.rate || 0), 0) / items.length;

    return {
      totalValue: Math.round(totalAmount),
      averageRate: Math.round(averageRate),
      itemCount: items.length,
      assumptions:
        "AI-assisted estimates require professional review and approval before submission",
    };
  }

  validateBOQ(items: BOQItem[]): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!items || items.length === 0) {
      errors.push("BOQ is empty");
    }

    items.forEach((item, index) => {
      if (!item.item_number) errors.push(`Item ${index + 1}: Missing item number`);
      if (!item.description) errors.push(`Item ${index + 1}: Missing description`);
      if (!item.unit) warnings.push(`Item ${index + 1}: Missing unit`);
      if (item.quantity <= 0) errors.push(`Item ${index + 1}: Invalid quantity`);
    });

    return { valid: errors.length === 0, errors, warnings };
  }
}
