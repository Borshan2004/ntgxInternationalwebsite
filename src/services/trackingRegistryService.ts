// src/services/trackingRegistryService.ts
import fs from 'fs';
import path from 'path';
import type {
  FedExTrackApiResponse,
  ScanEventCode,
  ShipmentStatus,
  WeightUnit,
} from '@/types/shipment';
import { BarcodeService } from './barcodeService';

export interface KnownShipmentRecord {
  readonly id: string;
  readonly trackingNumber: string;
  readonly recipient: string;
  readonly destinationCity: string;
  readonly destinationCountry: string;
  readonly destAirportHub: string;
  status: ShipmentStatus;
  readonly serviceTier: string;
  readonly weightKg: number;
  readonly createdAt: string;
  signedBy?: string;
  readonly senderCity?: string;
  readonly senderCountry?: string;
}

export interface CustomScanRecord {
  readonly timestamp: string;
  readonly eventType: ScanEventCode;
  readonly eventDescription: string;
  readonly scanLocation: {
    readonly city: string;
    readonly stateOrProvinceCode?: string;
    readonly postalCode?: string;
    readonly countryCode: string;
  };
  readonly signedBy?: string;
}

const INITIAL_SEED_SHIPMENTS: KnownShipmentRecord[] = [
  {
    id: 'shp_001',
    trackingNumber: '879098800901',
    recipient: 'Lena Fischer',
    destinationCity: 'Berlin',
    destinationCountry: 'DE',
    destAirportHub: 'BER',
    status: 'IN_TRANSIT',
    serviceTier: 'International Priority',
    weightKg: 2.5,
    createdAt: '2026-10-23',
    senderCity: 'Dhaka',
    senderCountry: 'BD',
  },
  {
    id: 'shp_002',
    trackingNumber: '879098800902',
    recipient: "James O'Brien",
    destinationCity: 'New York',
    destinationCountry: 'US',
    destAirportHub: 'EWR',
    status: 'DELIVERED',
    serviceTier: 'International Economy',
    weightKg: 1.2,
    createdAt: '2026-10-20',
    signedBy: 'J. O’Brien',
    senderCity: 'Dhaka',
    senderCountry: 'BD',
  },
  {
    id: 'shp_003',
    trackingNumber: '879098800903',
    recipient: 'Ayesha Khan',
    destinationCity: 'Toronto',
    destinationCountry: 'CA',
    destAirportHub: 'YYZ',
    status: 'OUT_FOR_DELIVERY',
    serviceTier: 'International Priority',
    weightKg: 4.8,
    createdAt: '2026-10-22',
    senderCity: 'Dhaka',
    senderCountry: 'BD',
  },
  {
    id: 'shp_004',
    trackingNumber: '879098800904',
    recipient: 'Sven Nilsson',
    destinationCity: 'Stockholm',
    destinationCountry: 'SE',
    destAirportHub: 'ARN',
    status: 'PICKUP_SCHEDULED',
    serviceTier: 'International Economy',
    weightKg: 0.75,
    createdAt: '2026-10-25',
    senderCity: 'Dhaka',
    senderCountry: 'BD',
  },
  {
    id: 'shp_005',
    trackingNumber: '879098800905',
    recipient: 'Maria Santos',
    destinationCity: 'Dubai',
    destinationCountry: 'AE',
    destAirportHub: 'DXB',
    status: 'AT_ORIGIN_FACILITY',
    serviceTier: 'International Priority',
    weightKg: 3.1,
    createdAt: '2026-10-24',
    senderCity: 'Dhaka',
    senderCountry: 'BD',
  },
  {
    id: 'shp_006',
    trackingNumber: '879098800906',
    recipient: 'Hiroshi Tanaka',
    destinationCity: 'Tokyo',
    destinationCountry: 'JP',
    destAirportHub: 'NRT',
    status: 'SHIPMENT_CREATED_PRINTED',
    serviceTier: 'International First',
    weightKg: 0.5,
    createdAt: '2026-10-26',
    senderCity: 'Dhaka',
    senderCountry: 'BD',
  },
  {
    id: 'shp_007',
    trackingNumber: '879098800907',
    recipient: 'Olivia Chen',
    destinationCity: 'Sydney',
    destinationCountry: 'AU',
    destAirportHub: 'SYD',
    status: 'DELIVERY_EXCEPTION',
    serviceTier: 'International Economy',
    weightKg: 6.3,
    createdAt: '2026-10-18',
    senderCity: 'Dhaka',
    senderCountry: 'BD',
  },
  {
    id: 'shp_008',
    trackingNumber: '879098800908',
    recipient: 'Carlos Mendez',
    destinationCity: 'Madrid',
    destinationCountry: 'ES',
    destAirportHub: 'MAD',
    status: 'DRAFT_INCOMPLETE',
    serviceTier: 'International Economy',
    weightKg: 1.9,
    createdAt: '2026-10-27',
    senderCity: 'Dhaka',
    senderCountry: 'BD',
  },
];

interface DiskStorageData {
  shipments: KnownShipmentRecord[];
  customScans: Record<string, CustomScanRecord[]>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'tracking_store.json');

function loadFromDisk(): DiskStorageData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as DiskStorageData;
      if (Array.isArray(parsed.shipments)) {
        if (!parsed.customScans || typeof parsed.customScans !== 'object') {
          parsed.customScans = {};
        }
        return parsed;
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[TrackingRegistryService] Disk read error, falling back to seed data:', err);
  }

  // Create initial file
  const initialData: DiskStorageData = {
    shipments: INITIAL_SEED_SHIPMENTS,
    customScans: {},
  };
  saveToDisk(initialData);
  return initialData;
}

function saveToDisk(data: DiskStorageData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!data.customScans) {
      data.customScans = {};
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[TrackingRegistryService] Disk write error:', err);
  }
}

export class TrackingRegistryService {
  /**
   * Returns all known shipments (sorted by newest created first)
   */
  public static getAllShipments(): KnownShipmentRecord[] {
    const data = loadFromDisk();
    return [...data.shipments].reverse();
  }

  /**
   * Registers a newly finalized or drafted shipment so it is permanently saved to disk
   */
  public static registerShipment(record: KnownShipmentRecord): void {
    const data = loadFromDisk();
    const existingIndex = data.shipments.findIndex(
      (s) => s.trackingNumber === record.trackingNumber || s.id === record.id
    );

    if (existingIndex >= 0) {
      data.shipments[existingIndex] = { ...data.shipments[existingIndex], ...record };
    } else {
      data.shipments.push({ ...record });
    }

    saveToDisk(data);
  }

  /**
   * Finds a shipment by tracking number or shipment ID
   */
  public static findShipment(query: string): KnownShipmentRecord | null {
    const cleaned = query.replace(/\s+/g, '');
    const data = loadFromDisk();
    const found = data.shipments.find(
      (s) => s.trackingNumber === cleaned || s.id === cleaned
    );
    return found || null;
  }

  /**
   * Admin and Employee operations update endpoint (Permanently saved to disk)
   */
  public static updateShipmentMilestone(params: {
    trackingNumber: string;
    newStatus: ShipmentStatus;
    eventCode: ScanEventCode;
    description: string;
    city: string;
    stateOrProvinceCode?: string;
    countryCode: string;
    signedBy?: string;
  }): FedExTrackApiResponse {
    const cleaned = params.trackingNumber.replace(/\s+/g, '');
    const data = loadFromDisk();

    let recordIndex = data.shipments.findIndex((s) => s.trackingNumber === cleaned || s.id === cleaned);

    if (recordIndex < 0) {
      // Auto-create a tracked shipment record if not previously indexed
      const newRec: KnownShipmentRecord = {
        id: `shp_${cleaned}`,
        trackingNumber: cleaned,
        recipient: 'Consignee',
        destinationCity: params.city,
        destinationCountry: params.countryCode,
        destAirportHub: 'EWR',
        status: params.newStatus,
        serviceTier: 'NTGX International Priority',
        weightKg: 2.5,
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString().split('T')[0],
        senderCity: 'Dhaka',
        senderCountry: 'BD',
        signedBy: params.signedBy,
      };
      data.shipments.push(newRec);
      recordIndex = data.shipments.length - 1;
    } else {
      data.shipments[recordIndex].status = params.newStatus;
      if (params.signedBy) {
        data.shipments[recordIndex].signedBy = params.signedBy;
      }
    }

    // Append custom scan event
    if (!data.customScans || typeof data.customScans !== 'object') {
      data.customScans = {};
    }
    if (!data.customScans[cleaned]) {
      data.customScans[cleaned] = [];
    }

    const newScan: CustomScanRecord = {
      timestamp: new Date().toISOString(),
      eventType: params.eventCode,
      eventDescription: params.description,
      scanLocation: {
        city: params.city,
        stateOrProvinceCode: params.stateOrProvinceCode,
        countryCode: params.countryCode,
      },
      signedBy: params.signedBy,
    };
    data.customScans[cleaned].push(newScan);

    saveToDisk(data);

    return this.getTelemetry(cleaned);
  }

  /**
   * Builds realistic, status-synchronized telemetry data for any query
   */
  public static getTelemetry(query: string): FedExTrackApiResponse {
    const cleaned = query.replace(/\s+/g, '');
    const record = this.findShipment(cleaned);

    if (record) {
      return this.buildTelemetryForRecord(record);
    }

    // Dynamic generation for arbitrary valid tracking number
    const isMod11Valid = BarcodeService.validateTrackingNumber(cleaned);
    const mockRecord: KnownShipmentRecord = {
      id: `shp_${cleaned}`,
      trackingNumber: cleaned,
      recipient: isMod11Valid ? 'International Consignee' : 'Guest Recipient',
      destinationCity: 'New York',
      destinationCountry: 'US',
      destAirportHub: 'EWR',
      status: cleaned.endsWith('1') || cleaned.endsWith('0') ? 'DELIVERED' : 'IN_TRANSIT',
      serviceTier: 'NTGX International Priority',
      weightKg: 2.5,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      senderCity: 'Dhaka',
      senderCountry: 'BD',
      signedBy: cleaned.endsWith('1') || cleaned.endsWith('0') ? 'D. Salman' : undefined,
    };

    return this.buildTelemetryForRecord(mockRecord);
  }

  private static buildTelemetryForRecord(rec: KnownShipmentRecord): FedExTrackApiResponse {
    const baseDate = new Date(rec.createdAt);
    const now = new Date();

    const originCity = rec.senderCity || 'Dhaka';
    const originCountry = rec.senderCountry || 'BD';
    const destCity = rec.destinationCity;
    const destCountry = rec.destinationCountry;

    // Base timeline events based on the shipment's status
    const events: Array<{
      readonly timestamp: string;
      readonly eventType: ScanEventCode;
      readonly eventDescription: string;
      readonly scanLocation: {
        readonly city: string;
        readonly stateOrProvinceCode?: string;
        readonly postalCode?: string;
        readonly countryCode: string;
      };
      readonly signedBy?: string;
    }> = [];

    // Step 1: OC - Order Created
    const t1 = new Date(baseDate.getTime() + 10 * 60000);
    events.push({
      timestamp: t1.toISOString(),
      eventType: 'OC',
      eventDescription: 'Shipment created and Air Waybill generated (Form 0430 printed)',
      scanLocation: { city: originCity, countryCode: originCountry },
    });

    // Step 2: PU - Picked Up
    if (rec.status !== 'DRAFT_INCOMPLETE' && rec.status !== 'SHIPMENT_CREATED_PRINTED') {
      const t2 = new Date(baseDate.getTime() + 4 * 3600000);
      events.push({
        timestamp: t2.toISOString(),
        eventType: 'PU',
        eventDescription: `Picked up by NTGX courier from shipper loading dock`,
        scanLocation: { city: originCity, countryCode: originCountry },
      });
    }

    // Step 3: AF - At Origin Hub
    if (
      rec.status === 'AT_ORIGIN_FACILITY' ||
      rec.status === 'IN_TRANSIT' ||
      rec.status === 'AT_DESTINATION_FACILITY' ||
      rec.status === 'OUT_FOR_DELIVERY' ||
      rec.status === 'DELIVERED' ||
      rec.status === 'DELIVERY_EXCEPTION'
    ) {
      const t3 = new Date(baseDate.getTime() + 9 * 3600000);
      events.push({
        timestamp: t3.toISOString(),
        eventType: 'AF',
        eventDescription: `Arrived at NTGX Central Air Gateway Hub (DACA)`,
        scanLocation: { city: originCity, countryCode: originCountry },
      });
    }

    // Step 4: IT - In Transit
    if (
      rec.status === 'IN_TRANSIT' ||
      rec.status === 'AT_DESTINATION_FACILITY' ||
      rec.status === 'OUT_FOR_DELIVERY' ||
      rec.status === 'DELIVERED' ||
      rec.status === 'DELIVERY_EXCEPTION'
    ) {
      const t4 = new Date(baseDate.getTime() + 18 * 3600000);
      events.push({
        timestamp: t4.toISOString(),
        eventType: 'IT',
        eventDescription: `Departed origin hub DACA via international air cargo connection`,
        scanLocation: { city: originCity, countryCode: originCountry },
      });
    }

    // Step 5: AR - At Destination Hub
    if (
      rec.status === 'AT_DESTINATION_FACILITY' ||
      rec.status === 'OUT_FOR_DELIVERY' ||
      rec.status === 'DELIVERED' ||
      rec.status === 'DELIVERY_EXCEPTION'
    ) {
      const t5 = new Date(baseDate.getTime() + 32 * 3600000);
      events.push({
        timestamp: t5.toISOString(),
        eventType: 'AR',
        eventDescription: `Arrived at destination gateway hub (${rec.destAirportHub})`,
        scanLocation: { city: destCity, countryCode: destCountry },
      });
    }

    // Step 6: OD / DE - Out for Delivery or Exception
    if (rec.status === 'OUT_FOR_DELIVERY' || rec.status === 'DELIVERED') {
      const t6 = new Date(baseDate.getTime() + 44 * 3600000);
      events.push({
        timestamp: t6.toISOString(),
        eventType: 'OD',
        eventDescription: `On NTGX delivery vehicle for scheduled handover to ${rec.recipient}`,
        scanLocation: { city: destCity, countryCode: destCountry },
      });
    } else if (rec.status === 'DELIVERY_EXCEPTION') {
      const t6 = new Date(baseDate.getTime() + 40 * 3600000);
      events.push({
        timestamp: t6.toISOString(),
        eventType: 'DE',
        eventDescription: `Delivery exception: Customs inspection document review required`,
        scanLocation: { city: destCity, countryCode: destCountry },
      });
    }

    // Step 7: DL - Delivered
    if (rec.status === 'DELIVERED') {
      const t7 = new Date(baseDate.getTime() + 48 * 3600000);
      events.push({
        timestamp: t7.toISOString(),
        eventType: 'DL',
        eventDescription: `Delivered to recipient address and handed over to ${rec.recipient}`,
        scanLocation: { city: destCity, countryCode: destCountry },
        signedBy: rec.signedBy || rec.recipient,
      });
    }

    // Merge any custom scans saved to disk
    const diskData = loadFromDisk();
    const customScans = (diskData.customScans && diskData.customScans[rec.trackingNumber]) || [];
    for (const cs of customScans) {
      events.push(cs);
    }

    // Sort events chronological
    events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const latest = events[events.length - 1];

    // Estimated or actual delivery string
    let estDelivery = 'Scheduled Delivery';
    if (rec.status === 'DELIVERED') {
      const d = new Date(latest.timestamp);
      estDelivery = `Delivered on ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (rec.status === 'OUT_FOR_DELIVERY') {
      estDelivery = 'Today by 5:00 PM';
    } else if (rec.status === 'IN_TRANSIT') {
      const d = new Date(now.getTime() + 24 * 3600000);
      estDelivery = `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} by end of day`;
    } else {
      const d = new Date(now.getTime() + 48 * 3600000);
      estDelivery = `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} by 5:00 PM`;
    }

    return {
      trackingNumberInfo: {
        trackingNumber: rec.trackingNumber,
        carrierCode: 'NTGX',
      },
      latestStatusDetail: {
        code: latest.eventType,
        statusBy: rec.status,
        description: latest.eventDescription,
        scanLocation: latest.scanLocation,
        estimatedDeliveryTime: estDelivery,
      },
      packageWeight: {
        units: 'KG' as WeightUnit,
        value: rec.weightKg,
      },
      dateAndTime: [
        {
          type: rec.status === 'DELIVERED' ? 'ACTUAL_DELIVERY' : 'ESTIMATED_DELIVERY',
          dateTime: latest.timestamp,
        },
      ],
      scanEvents: events,
    };
  }
}
