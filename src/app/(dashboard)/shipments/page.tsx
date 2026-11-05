// src/app/(dashboard)/shipments/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ShipmentStatus, ExcelReportFilterQuery } from '@/types/shipment';
import { getStatusBadgeStyle } from '@/lib/tokens';
import { Table } from '@/components/ui/Table';
import type { Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ExcelExportModal } from '@/components/features/reports/ExcelExportModal';
import { Plus, FileSpreadsheet, Eye, Search, Loader2 } from 'lucide-react';

interface ShipmentRow {
  readonly id: string;
  readonly trackingNumber: string;
  readonly recipient: string;
  readonly destination: string;
  readonly status: ShipmentStatus;
  readonly service: string;
  readonly weight: string;
  readonly createdAt: string;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'DRAFT_INCOMPLETE', label: 'Draft / Incomplete' },
  { value: 'SHIPMENT_CREATED_PRINTED', label: 'Label Created' },
  { value: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled' },
  { value: 'PICKED_UP', label: 'Picked Up' },
  { value: 'AT_ORIGIN_FACILITY', label: 'At Origin Facility' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'AT_DESTINATION_FACILITY', label: 'At Destination' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'DELIVERY_EXCEPTION', label: 'Exception' },
  { value: 'RETURNED_TO_SHIPPER', label: 'Returned' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function ShipmentsPage(): React.JSX.Element {
  const router = useRouter();
  const [shipments, setShipments] = useState<readonly ShipmentRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  useEffect(() => {
    void fetch('/api/shipments')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setShipments(data);
        }
      })
      .catch(() => {
        setShipments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredShipments = shipments.filter((row) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      search === '' ||
      (row.trackingNumber || '').toLowerCase().includes(searchLower) ||
      (row.recipient || '').toLowerCase().includes(searchLower) ||
      (row.destination || '').toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === '' || row.status === statusFilter;
    const matchesFrom = fromDate === '' || (row.createdAt || '') >= fromDate;
    const matchesTo = toDate === '' || (row.createdAt || '') <= toDate;
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  const handleExport = async (query: ExcelReportFilterQuery): Promise<void> => {
    try {
      const res = await fetch('/api/reports/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NTGX-Shipments-${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Export failed';
      alert(`Export Error: ${msg}`);
    }
  };

  const columns: readonly Column<ShipmentRow>[] = [
    {
      header: 'Tracking #',
      key: 'trackingNumber',
      render: (row) => (
        <Link
          href={`/tracking?query=${row.trackingNumber}`}
          onClick={(e) => e.stopPropagation()}
          className="font-mono font-bold text-ntgx-red hover:underline text-xs inline-flex items-center gap-1 group"
          title="Track Live Telemetry"
        >
          <span>{row.trackingNumber}</span>
          <Search className="h-3 w-3 text-neutral-400 group-hover:text-ntgx-red transition-colors opacity-0 group-hover:opacity-100" />
        </Link>
      ),
    },
    { header: 'Recipient', key: 'recipient' },
    { header: 'Destination', key: 'destination' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => {
        const style = getStatusBadgeStyle(row.status);
        return (
          <Badge status={row.status} aria-label={style.label} />
        );
      },
    },
    { header: 'Service', key: 'service' },
    { header: 'Weight', key: 'weight', align: 'right' },
    { header: 'Created', key: 'createdAt' },
    {
      header: 'Actions',
      key: 'actions',
      align: 'center',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/shipments/${row.id}`);
          }}
        >
          <Eye className="h-3.5 w-3.5 mr-1" /> View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-neutral-textPrimary tracking-tight">
            Shipments
          </h1>
          <p className="text-sm text-neutral-textSecondary mt-0.5">
            Manage and track all outbound shipments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExportOpen(true)}
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Export Excel
          </Button>
          <Link href="/shipments/new">
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4 mr-1.5" /> New Shipment
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-end bg-neutral-surface border border-neutral-border rounded-lg p-4">
        <div className="flex-1 min-w-0">
          <Input
            label="Search"
            placeholder="Tracking # or recipient name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <Input
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <Input
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0"
          onClick={() => {
            setSearch('');
            setStatusFilter('');
            setFromDate('');
            setToDate('');
          }}
        >
          Clear
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mb-2 text-ntgx-red" />
          <span className="text-xs font-medium">Loading shipments from live database...</span>
        </div>
      ) : (
        <Table<ShipmentRow>
          columns={columns}
          data={filteredShipments}
          keyExtractor={(row) => row.id}
          emptyMessage="No shipments found in database matching your filters."
          onRowClick={(row) => router.push(`/shipments/${row.id}`)}
        />
      )}

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
