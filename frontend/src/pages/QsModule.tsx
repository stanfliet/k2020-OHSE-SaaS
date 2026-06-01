import React, { useState, useRef } from "react";
import { Upload, Download, FileText, AlertCircle } from "lucide-react";

interface BOQItem {
  item_number: string;
  description: string;
  unit: string;
  quantity: number;
  rate?: number;
  amount?: number;
}

interface ParsedBOQ {
  items: BOQItem[];
  validation: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
}

const QsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "pricing">("upload");
  const [boqData, setBOQData] = useState<BOQItem[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [assumptions, setAssumptions] = useState({
    labourRate: 1000,
    overheadPercentage: 15,
    profitPercentage: 20,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fileData = await file.text();

      const response = await fetch("/api/qs/parse-boq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          fileData,
          fileType: file.name.endsWith(".csv") ? "csv" : "xlsx",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBOQData(result.items);
        if (result.validation.errors.length > 0) {
          setErrors(result.validation.errors);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrors(["Failed to parse BOQ file"]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuildRates = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/qs/build-rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          items: boqData,
          assumptions,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBOQData(result.items);
        setMetrics(result.metrics);
        setActiveTab("pricing");
      }
    } catch (error) {
      console.error("Rate building error:", error);
      setErrors(["Failed to build rates"]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Item No", "Description", "Unit", "Quantity", "Rate", "Amount"];
    const rows = boqData.map((item) => [
      item.item_number,
      item.description,
      item.unit,
      item.quantity,
      item.rate || "-",
      item.amount || "-",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "boq-with-rates.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Quantity Surveyor Module
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Parse BOQs, build rates, and generate pricing estimates
        </p>
      </div>

      {/* Disclaimer Alert */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-900 dark:text-amber-200">
            AI-Assisted Estimates
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
            All rate calculations are AI-assisted recommendations requiring professional review and
            approval before submission. Not guaranteed for legal, engineering, or pricing accuracy.
          </p>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="font-semibold text-red-900 dark:text-red-200 mb-2">Errors:</p>
          <ul className="space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="text-sm text-red-800 dark:text-red-300">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "upload"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload & Parse
        </button>
        <button
          onClick={() => setActiveTab("pricing")}
          disabled={boqData.length === 0}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "pricing"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Pricing & Export
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div className="space-y-6">
          {/* File Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upload BOQ File
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop or click to select CSV or Excel file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Select File
            </button>
          </div>

          {/* Parsed Items */}
          {boqData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Parsed Items ({boqData.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                        Item No
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                        Description
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                        Unit
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {boqData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                          {item.item_number}
                        </td>
                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                          {item.description}
                        </td>
                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                          {item.unit}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-900 dark:text-white">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleBuildRates}
                disabled={loading}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Building Rates..." : "Build Rates"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === "pricing" && (
        <div className="space-y-6">
          {/* Assumptions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Pricing Assumptions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Labour Rate (ZAR/day)
                </label>
                <input
                  type="number"
                  value={assumptions.labourRate}
                  onChange={(e) =>
                    setAssumptions({ ...assumptions, labourRate: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Overhead (%)
                </label>
                <input
                  type="number"
                  value={assumptions.overheadPercentage}
                  onChange={(e) =>
                    setAssumptions({
                      ...assumptions,
                      overheadPercentage: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profit (%)
                </label>
                <input
                  type="number"
                  value={assumptions.profitPercentage}
                  onChange={(e) =>
                    setAssumptions({
                      ...assumptions,
                      profitPercentage: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Metrics */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Total Value
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-1">
                  R {metrics.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Average Rate
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200 mt-1">
                  R {metrics.averageRate.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Item Count
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200 mt-1">
                  {metrics.itemCount}
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                  Status
                </p>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mt-2">
                  Requires Review
                </p>
              </div>
            </div>
          )}

          {/* Priced Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Priced Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                      Item No
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                      Unit
                    </th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                      Qty
                    </th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                      Rate
                    </th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {boqData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-2 text-gray-900 dark:text-white">
                        {item.item_number}
                      </td>
                      <td className="px-4 py-2 text-gray-900 dark:text-white">
                        {item.description}
                      </td>
                      <td className="px-4 py-2 text-gray-900 dark:text-white">
                        {item.unit}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-900 dark:text-white">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-900 dark:text-white font-medium">
                        R {item.rate?.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-900 dark:text-white font-bold">
                        R {item.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={exportToCSV}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QsModule;
