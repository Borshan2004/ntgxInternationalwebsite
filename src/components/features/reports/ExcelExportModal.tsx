// src/components/features/reports/ExcelExportModal.tsx
'use client';

import React, { useState } from 'react';
import type { ExcelReportFilterQuery, ShipmentStatus, ServiceTier } from '@/types/shipment';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { FileSpreadsheet, Download } from 'lucide-react';

export interface ExcelExportModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly userRole: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER' | 'DRIVER';
  readonly userOrganizationId?: string;
  readonly onExport: (query: ExcelReportFilterQuery) => Promise<void>;
}

const SERVICE_TIER_FILTER_OPTIONS = [
  { value: '', label: 'All Service Tiers' },
  { value: 'INTERNATIONAL_PRIORITY', label: 'International Priority' },
  { value: 'INTERNATIONAL_ECONOMY', label: 'International Economy' },
  { value: 'INTERNATIONAL_FIRST', label: 'International First' },
  { value: 'STANDARD_OVERNIGHT', label: 'Standard Overnight' },
];

const DESTINATION_OPTIONS = [
  { value: '', label: 'All Destination Countries' },
  { value: 'US', label: 'United States (US)' },
  { value: 'CA', label: 'Canada (CA)' },
  { value: 'GB', label: 'United Kingdom (GB)' },
  { value: 'DE', label: 'Germany (DE)' },
  { value: 'AE', label: 'United Arab Emirates (AE)' },
];

export const ExcelExportModal: React.FC<ExcelExportModalProps> = ({
  isOpen,
  onClose,
  userRole,
  userOrganizationId,
  onExport,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const thirtyDaysAgoStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [fromDate, setFromDate] = useState<string>(thirtyDaysAgoStr);
  const [toDate, setToDate] = useState<string>(todayStr);
  const [destinationCountry, setDestinationCountry] = useState<string>('');
  const [serviceTier, setServiceTier] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleDownload = async (): Promise<void> => {
    setIsExporting(true);
    try {
      const query: ExcelReportFilterQuery = {
        organizationId: userRole === 'CUSTOMER' ? userOrganizationId : undefined,
        fromDate,
        toDate,
        destinationCountry: destinationCountry || undefined,
        serviceTier: (serviceTier as ServiceTier) || undefined,
        statuses: undefined as readonly ShipmentStatus[] | undefined,
      };
      await onExport(query);
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Multi-Worksheet Logistics Report (.xlsx)"
      description="Generates an authentic Excel workbook formatted with Shipment Overview, Commodities & HS Codes, and Transit Milestones sheets."
      maxWidth="lg"
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3 bg-brand-purpleSubtle rounded-md border border-purple-200 text-xs text-brand-purple">
          <FileSpreadsheet className="h-6 w-6 shrink-0" />
          <span>
            {userRole === 'CUSTOMER'
              ? 'Tenant-Partitioned Report: Scoped strictly to your organization shipping records.'
              : 'Global Logistics Report: All customer accounts or optional tenant-filtered exports.'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="From Date"
            type="date"
            required
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Input
            label="To Date"
            type="date"
            required
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Destination Filter"
            options={DESTINATION_OPTIONS}
            value={destinationCountry}
            onChange={(e) => setDestinationCountry(e.target.value)}
          />
          <Select
            label="Service Tier Filter"
            options={SERVICE_TIER_FILTER_OPTIONS}
            value={serviceTier}
            onChange={(e) => setServiceTier(e.target.value)}
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-border">
          <Button variant="ghost" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownload}
            isLoading={isExporting}
            className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover"
          >
            <Download className="h-4 w-4" /> Download Multi-Sheet Excel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
