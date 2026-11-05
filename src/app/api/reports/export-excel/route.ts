// src/app/api/reports/export-excel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ExcelExportService } from '@/services/excelService';
import type { ExcelReportFilterQuery, ShipmentStatus, ServiceTier } from '@/types/shipment';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId') ?? undefined;
    const fromDate =
      searchParams.get('fromDate') ??
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const toDate = searchParams.get('toDate') ?? new Date().toISOString();
    const destinationCountry = searchParams.get('destinationCountry') ?? undefined;
    const serviceTier = (searchParams.get('serviceTier') as ServiceTier) ?? undefined;
    const statusParam = searchParams.get('status');
    const statuses = statusParam
      ? (statusParam.split(',') as ShipmentStatus[])
      : undefined;

    const query: ExcelReportFilterQuery = {
      organizationId,
      fromDate,
      toDate,
      destinationCountry,
      serviceTier,
      statuses,
    };

    const excelBuffer = await ExcelExportService.buildGranularReportBuffer(query);

    return new NextResponse(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition':
          'attachment; filename="NTGX-Enterprise-Shipments-Report.xlsx"',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Excel export failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as ExcelReportFilterQuery;
    const excelBuffer = await ExcelExportService.buildGranularReportBuffer(body);

    return new NextResponse(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition':
          'attachment; filename="NTGX-Enterprise-Shipments-Report.xlsx"',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Excel export failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
