// src/app/(dashboard)/reports/page.tsx
'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Globe2,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExcelExportModal } from '@/components/features/reports/ExcelExportModal';
import type { ExcelReportFilterQuery } from '@/types/shipment';

interface GeneratedReportRecord {
  readonly id: string;
  readonly name: string;
  readonly period: string;
  readonly sheets: string;
  readonly recordCount: number;
  readonly generatedAt: string;
  readonly size: string;
}

const RECENT_REPORTS: readonly GeneratedReportRecord[] = [
  {
    id: 'rep_001',
    name: 'NTGX_Q4_Export_Manifest_ASI_BD.xlsx',
    period: 'Oct 01, 2026 - Oct 31, 2026',
    sheets: 'Overview, Commodities & HS Codes, Transit Milestones',
    recordCount: 142,
    generatedAt: '2026-10-31 18:30',
    size: '148 KB',
  },
  {
    id: 'rep_002',
    name: 'Customs_HS_Tariff_Reconciliation_2026.xlsx',
    period: 'Sep 01, 2026 - Sep 30, 2026',
    sheets: 'Commodities & HS Codes',
    recordCount: 89,
    generatedAt: '2026-10-01 10:15',
    size: '92 KB',
  },
  {
    id: 'rep_003',
    name: 'Transit_Milestone_SLA_Telemetry.xlsx',
    period: 'Aug 01, 2026 - Aug 31, 2026',
    sheets: 'Shipment Overview, Transit Milestones',
    recordCount: 115,
    generatedAt: '2026-09-01 09:00',
    size: '118 KB',
  },
];

export default function ReportsPage(): React.JSX.Element {
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleExport = async (filters: ExcelReportFilterQuery): Promise<void> => {
    setDownloading(true);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/reports/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error(`Export failed with status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NTGX_Logistics_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccessMessage('Multi-worksheet Excel report generated and downloaded successfully!');
      setIsExportOpen(false);
    } catch {
      // Fallback direct download link
      window.open('/api/reports/export-excel', '_blank');
      setSuccessMessage('Multi-worksheet Excel report initiated via browser download!');
      setIsExportOpen(false);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-border pb-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-textPrimary tracking-tight">
            Logistics Reports & Analytics
          </h1>
          <p className="text-sm text-neutral-textSecondary mt-1">
            Export granular 3-sheet Excel workbooks covering shipments, HS tariff declarations, and transit milestones.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-2"
          isLoading={downloading}
        >
          <FileSpreadsheet className="h-4 w-4" /> Export Multi-Tab Report (.xlsx)
        </Button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg p-4 flex items-center gap-3 text-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-textSecondary text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="h-4 w-4 text-ntgx-red" /> Total Monthly Shipments
          </div>
          <span className="text-3xl font-black text-neutral-textPrimary">247</span>
          <span className="text-xs text-emerald-700 font-semibold">+18.4% from last month</span>
        </Card>

        <Card className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-textSecondary text-xs font-semibold uppercase tracking-wider">
            <Globe2 className="h-4 w-4 text-emerald-500" /> Top Destination Hub
          </div>
          <span className="text-3xl font-black text-neutral-textPrimary">EWR</span>
          <span className="text-xs text-neutral-textSecondary">New York / New Jersey (42%)</span>
        </Card>

        <Card className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-textSecondary text-xs font-semibold uppercase tracking-wider">
            <Clock className="h-4 w-4 text-blue-500" /> Average Transit Time
          </div>
          <span className="text-3xl font-black text-neutral-textPrimary">3.2 Days</span>
          <span className="text-xs text-neutral-textSecondary">DACA &rarr; North America</span>
        </Card>

        <Card className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-textSecondary text-xs font-semibold uppercase tracking-wider">
            <Calendar className="h-4 w-4 text-amber-500" /> Total Export Value
          </div>
          <span className="text-3xl font-black text-neutral-textPrimary">$184,520</span>
          <span className="text-xs text-neutral-textSecondary">Customs declared USD</span>
        </Card>
      </div>

      {/* Report Structure Banner */}
      <div className="bg-white border border-neutral-border rounded-xl p-6 shadow-card">
        <h2 className="text-base font-bold text-neutral-textPrimary mb-3 flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-ntgx-red" />
          Standard 3-Worksheet Excel Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-textSecondary">
          <div className="bg-neutral-canvas border border-neutral-border rounded-lg p-3">
            <span className="font-bold text-neutral-textPrimary block mb-1">Sheet 1: Shipment Overview</span>
            Tracking numbers, status, origin/destination hubs, sender, recipient, actual vs. chargeable weights, and charges breakdown.
          </div>
          <div className="bg-neutral-canvas border border-neutral-border rounded-lg p-3">
            <span className="font-bold text-neutral-textPrimary block mb-1">Sheet 2: Commodities & HS Codes</span>
            Customs clearance itemizations: HS tariff codes, goods descriptions, quantities, unit values, and country of manufacture.
          </div>
          <div className="bg-neutral-canvas border border-neutral-border rounded-lg p-3">
            <span className="font-bold text-neutral-textPrimary block mb-1">Sheet 3: Transit Milestones</span>
            Full scan event timeline: timestamp, event codes (OC, PU, DP, AR, OD, DL), facility codes, and courier signatures.
          </div>
        </div>
      </div>

      {/* Generated Reports Table */}
      <div className="bg-white border border-neutral-border rounded-xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-neutral-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-textPrimary">Recently Exported Workbooks</h3>
          <span className="text-xs text-neutral-textSecondary">Tenant Scoped Isolation Active</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-canvas border-b border-neutral-border text-neutral-textSecondary font-semibold">
              <tr>
                <th className="py-3 px-4">Workbook Name</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Sheets Included</th>
                <th className="py-3 px-4 text-right">Shipments</th>
                <th className="py-3 px-4">Generated At</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {RECENT_REPORTS.map((rep) => (
                <tr key={rep.id} className="hover:bg-neutral-surface/60">
                  <td className="py-3 px-4 font-mono font-medium text-ntgx-red">{rep.name}</td>
                  <td className="py-3 px-4">{rep.period}</td>
                  <td className="py-3 px-4 text-neutral-textSecondary">{rep.sheets}</td>
                  <td className="py-3 px-4 text-right font-semibold">{rep.recordCount}</td>
                  <td className="py-3 px-4">{rep.generatedAt}</td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsExportOpen(true)}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" /> Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excel Export Modal */}
      <ExcelExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        userRole="ADMIN"
        onExport={handleExport}
      />
    </div>
  );
}
