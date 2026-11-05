// src/types/shipment.ts

export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER' | 'DRIVER';

export type UserStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

export type AddressType = 'BUSINESS' | 'RESIDENTIAL';

export type PackagingType =
  | 'YOUR_PACKAGING'
  | 'FEDEX_ENVELOPE'
  | 'FEDEX_PAK'
  | 'FEDEX_BOX_SMALL'
  | 'FEDEX_BOX_MEDIUM'
  | 'FEDEX_BOX_LARGE'
  | 'FEDEX_TUBE';

export type ServiceTier =
  | 'INTERNATIONAL_PRIORITY'
  | 'INTERNATIONAL_ECONOMY'
  | 'INTERNATIONAL_FIRST'
  | 'STANDARD_OVERNIGHT'
  | 'PRIORITY_OVERNIGHT'
  | 'GROUND_STANDARD';

export type SignatureOption =
  | 'NO_SIGNATURE_REQUIRED'
  | 'INDIRECT_SIGNATURE'
  | 'DIRECT_SIGNATURE'
  | 'ADULT_SIGNATURE';

export type ShipmentStatus =
  | 'DRAFT_INCOMPLETE'
  | 'SHIPMENT_CREATED_PRINTED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'AT_ORIGIN_FACILITY'
  | 'IN_TRANSIT'
  | 'AT_DESTINATION_FACILITY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELIVERY_EXCEPTION'
  | 'RETURNED_TO_SHIPPER'
  | 'CANCELLED';

export type ScanEventCode =
  | 'OC'
  | 'PU'
  | 'AF'
  | 'DP'
  | 'IT'
  | 'AR'
  | 'OD'
  | 'DL'
  | 'DE'
  | 'RS'
  | 'CA';

export type BillTransportationTo = 'MY_ACCOUNT' | 'RECIPIENT' | 'THIRD_PARTY';

export type CustomsContentType = 'DOCUMENTS_ONLY' | 'COMMODITIES';

export type WeightUnit = 'KG' | 'LB';

export type DimensionUnit = 'CM' | 'IN';

export type UnitOfMeasure = 'PKS' | 'PCS' | 'KGS' | 'DOZ' | 'MTR';

// ==========================================
// 7-STEP FEDEX SHIP MANAGER FORM INTERFACES
// ==========================================

/** Step 1 & Step 2: Address Payload */
export interface PartyAddressData {
  readonly addressBookId?: string;
  readonly contactName: string;
  readonly company?: string;
  readonly taxId?: string; // EORI / BIN / State Tax ID
  readonly phone: string;
  readonly phoneExt?: string;
  readonly email: string;
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly addressLine3?: string;
  readonly city: string;
  readonly stateProvince?: string;
  readonly postalCode: string;
  readonly countryCode: string; // ISO-2 e.g. "BD", "US"
  readonly airportHubCode?: string; // e.g. "DACA", "EWR"
  readonly isResidential: boolean;
  readonly saveToAddressBook?: boolean;
  readonly setAsDefaultSender?: boolean;
}

/** Step 3: Individual Package Line Item */
export interface PackageDimensionItem {
  readonly id?: string;
  readonly packageIndex: number;
  readonly actualWeight: number;
  readonly weightUnit: WeightUnit;
  readonly length: number;
  readonly width: number;
  readonly height: number;
  readonly dimensionUnit: DimensionUnit;
  readonly volumetricWeightKg: number;
  readonly chargeableWeightKg: number;
  readonly declaredValueUsd: number;
}

/** Step 4: Customs & Commercial Invoice Commodity Line Item */
export interface CommodityLineItem {
  readonly id?: string;
  readonly packageCount: number;
  readonly description: string;
  readonly hsTariffCode: string;
  readonly quantity: number;
  readonly unitOfMeasure: UnitOfMeasure;
  readonly netWeightKg: number;
  readonly unitValueUsd: number;
  readonly totalValueUsd: number;
  readonly countryOfMfr: string;
}

/** Step 5: Service & Transit Selection */
export interface ServiceSelectionData {
  readonly serviceTier: ServiceTier;
  readonly shipDate: string; // ISO-8601 Date
  readonly signatureOption: SignatureOption;
  readonly holdAtLocation: boolean;
  readonly estimatedDeliveryDate?: string;
}

/** Step 6: Pickup or Counter Drop-Off Schedule */
export interface PickupScheduleData {
  readonly isDropOff: boolean;
  readonly pickupDate: string; // ISO-8601 Date
  readonly earliestTime: string; // e.g., "08:00 AM"
  readonly latestTime: string; // e.g., "01:30 PM"
  readonly instructions?: string;
  readonly alternatePickupAddress?: string;
}

/** Step 7: Billing & Dual Notification Preferences */
export interface BillingAndNotificationData {
  readonly billTransportationTo: BillTransportationTo;
  readonly billingAccountNumber?: string;
  readonly dutiesBillTo: BillTransportationTo;
  readonly dutiesAccountNumber?: string;
  readonly referenceCode?: string; // e.g., "BNI/CC/P-1780009697"
  readonly invoiceNumber?: string; // e.g., "ASI-25075"
  readonly poNumber?: string;
  readonly notifications: {
    readonly clientEmail: string;
    readonly recipientEmail?: string;
    readonly companyEmail: string;
    readonly language: 'en' | 'bn';
    readonly notifyCreated: boolean;
    readonly notifyScheduled: boolean;
    readonly notifyPickedUp: boolean;
    readonly notifyInTransit: boolean;
    readonly notifyDelivered: boolean;
    readonly notifyException: boolean;
    readonly customMessage?: string;
  };
}

/** Complete Unified Payload for Creating / Saving / Finalizing a Shipment */
export interface ShipmentFormPayload {
  readonly shipmentId?: string;
  readonly organizationId: string;
  readonly action: 'SAVE_DRAFT' | 'FINALIZE';
  readonly sender: PartyAddressData;
  readonly recipient: PartyAddressData;
  readonly packagingType: PackagingType;
  readonly packages: readonly PackageDimensionItem[];
  readonly customsContentType: CustomsContentType;
  readonly commodities: readonly CommodityLineItem[];
  readonly currency: string;
  readonly service: ServiceSelectionData;
  readonly pickup: PickupScheduleData;
  readonly billing: BillingAndNotificationData;
}

// ==========================================
// RATE ENGINE & VOLUMETRIC PRICING TYPES
// ==========================================

export interface RateCalculationInput {
  readonly originCountryCode: string;
  readonly destCountryCode: string;
  readonly serviceTier: ServiceTier;
  readonly packagingType: PackagingType;
  readonly packages: ReadonlyArray<{
    readonly actualWeight: number;
    readonly weightUnit: WeightUnit;
    readonly length: number;
    readonly width: number;
    readonly height: number;
    readonly dimensionUnit: DimensionUnit;
    readonly declaredValueUsd: number;
  }>;
  readonly isResidential: boolean;
  readonly signatureOption: SignatureOption;
}

export interface RateCalculationResult {
  readonly zoneCode: string;
  readonly zoneName: string;
  readonly destAirportHub: string;
  readonly totalActualWeightKg: number;
  readonly totalVolumetricWeightKg: number;
  readonly totalChargeableWeightKg: number;
  readonly baseChargeUsd: number;
  readonly fuelSurchargeUsd: number;
  readonly residentialFeeUsd: number;
  readonly signatureFeeUsd: number;
  readonly insuranceFeeUsd: number;
  readonly totalSurchargesUsd: number;
  readonly totalShippingCostUsd: number;
  readonly currency: 'USD';
  readonly estimatedDeliveryMinDays: number;
  readonly estimatedDeliveryMaxDays: number;
  readonly estimatedDeliveryDate: string;
}

// ==========================================
// DOCUMENT GENERATION (3-PAGE AWB & INVOICE)
// ==========================================

export type AwbPageCopyType =
  | 'CONSIGNEE COPY - PLEASE PLACE IN FRONT OF POUCH'
  | 'NTGX / CARRIER AWB COPY - PLEASE PLACE BEHIND CONSIGNEE COPY'
  | 'SHIPPER / SENDER RECORD COPY';

export interface AirWaybillDocumentData {
  readonly trackingNumberFormatted: string; // e.g., "8790 9880 0901"
  readonly trackingNumberRaw: string; // e.g., "879098800901"
  readonly formCode: string; // "0430"
  readonly shipDateFormatted: string; // e.g., "23OCT26"
  readonly cadNumber: string; // e.g., "260504077/INET4535"
  readonly actualWeightKg: string;
  readonly chargeableWeightKg: string;
  readonly dimensionsFormatted: string; // e.g., "51x35x11 CM"
  readonly billToLabel: string; // e.g., "BILL RECIPIENT"
  readonly referenceCode: string;
  readonly originAirportCode: string; // "DACA"
  readonly destAirportCode: string; // "EWR"
  readonly routingHeader: string; // "XA MTPA 58KJ1/70DF/484B"
  readonly serviceCodeAcronym: string; // "IP EOD"
  readonly signatureAcronym: string; // "NSR" | "DSR" | "ASR"
  readonly sender: PartyAddressData;
  readonly recipient: PartyAddressData;
  readonly commoditySummaryLines: readonly string[];
  readonly customsValueFormatted: string; // "6.00 USD"
  readonly countryOfManufacture: string; // "BD"
  readonly linearBarcodeSvg: string;
  readonly copies: readonly [AwbPageCopyType, AwbPageCopyType, AwbPageCopyType];
}

export interface CommercialInvoiceDocumentData {
  readonly trackingNumberFormatted: string;
  readonly invoiceNumber: string;
  readonly poNumber?: string;
  readonly shipDateFormatted: string;
  readonly exporter: PartyAddressData;
  readonly consignee: PartyAddressData;
  readonly billToParty: string;
  readonly items: readonly CommodityLineItem[];
  readonly totalPackages: number;
  readonly totalNetWeightKg: number;
  readonly totalGrossWeightKg: number;
  readonly subtotalUsd: number;
  readonly freightUsd: number;
  readonly insuranceUsd: number;
  readonly totalInvoiceValueUsd: number;
  readonly currency: string;
  readonly declarationStatement: string;
  readonly authorizedSignatory: string;
}

// ==========================================
// FEDEX TRACK REST API V1 PARITY SCHEMA
// ==========================================

export interface FedExScanLocation {
  readonly city: string;
  readonly stateOrProvinceCode?: string;
  readonly postalCode?: string;
  readonly countryCode: string;
}

export interface FedExScanEvent {
  readonly timestamp: string; // ISO-8601 with timezone offset
  readonly eventType: ScanEventCode;
  readonly eventDescription: string;
  readonly scanLocation: FedExScanLocation;
  readonly signedBy?: string;
}

export interface FedExTrackApiResponse {
  readonly trackingNumberInfo: {
    readonly trackingNumber: string;
    readonly carrierCode: 'FDXE' | 'FDXG' | 'NTGX';
  };
  readonly latestStatusDetail: {
    readonly code: ScanEventCode;
    readonly statusBy: string;
    readonly description: string;
    readonly scanLocation: FedExScanLocation;
    readonly estimatedDeliveryTime?: string;
  };
  readonly packageWeight: {
    readonly units: WeightUnit;
    readonly value: number;
  };
  readonly dateAndTime: ReadonlyArray<{
    readonly type: 'ACTUAL_PICKUP' | 'ESTIMATED_DELIVERY' | 'ACTUAL_DELIVERY';
    readonly dateTime: string;
  }>;
  readonly scanEvents: readonly FedExScanEvent[];
}

// ==========================================
// GRANULAR MULTI-TENANT EXCEL EXPORT TYPES
// ==========================================

export interface ExcelReportFilterQuery {
  readonly organizationId?: string; // Mandatory for CUSTOMER; optional filter for ADMIN/EMPLOYEE
  readonly fromDate: string; // ISO Date
  readonly toDate: string; // ISO Date
  readonly statuses?: readonly ShipmentStatus[];
  readonly destinationCountry?: string;
  readonly serviceTier?: ServiceTier;
}

// ==========================================
// UNIFIED SHIPMENT ENTITY & DTO DEFINITIONS
// ==========================================

export interface OrganizationDTO {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly taxId?: string | null;
  readonly vatNumber?: string | null;
  readonly accountNumber: string;
  readonly phone: string;
  readonly email: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ShipmentPackageDTO {
  readonly id: string;
  readonly shipmentId: string;
  readonly packageIndex: number;
  readonly actualWeight: number;
  readonly weightUnit: WeightUnit;
  readonly length: number;
  readonly width: number;
  readonly height: number;
  readonly dimensionUnit: DimensionUnit;
  readonly volumetricWgt: number;
  readonly chargeableWgt: number;
  readonly declaredValue: number;
}

export interface CommodityItemDTO {
  readonly id: string;
  readonly shipmentId: string;
  readonly packageCount: number;
  readonly description: string;
  readonly hsTariffCode: string;
  readonly quantity: number;
  readonly unitOfMeasure: string;
  readonly netWeightKg: number;
  readonly unitValue: number;
  readonly totalValue: number;
  readonly countryOfMfr: string;
}

export interface PickupOrderDTO {
  readonly id: string;
  readonly pickupCode: string;
  readonly shipmentId: string;
  readonly driverId?: string | null;
  readonly isDropOff: boolean;
  readonly pickupDate: Date;
  readonly earliestTime: string;
  readonly latestTime: string;
  readonly instructions?: string | null;
  readonly pickupAddress: string;
  readonly isCompleted: boolean;
  readonly completedAt?: Date | null;
  readonly createdAt: Date;
}

export interface TrackingEventDTO {
  readonly id: string;
  readonly shipmentId: string;
  readonly recordedById?: string | null;
  readonly eventCode: ScanEventCode;
  readonly statusTitle: string;
  readonly description?: string | null;
  readonly city: string;
  readonly stateProvince?: string | null;
  readonly postalCode?: string | null;
  readonly countryCode: string;
  readonly hubCode?: string | null;
  readonly signedBy?: string | null;
  readonly signatureImage?: string | null;
  readonly proofPhotoUrl?: string | null;
  readonly timestamp: Date;
}

export interface NotificationConfigDTO {
  readonly id: string;
  readonly shipmentId: string;
  readonly clientEmail: string;
  readonly recipientEmail?: string | null;
  readonly companyEmail: string;
  readonly language: string;
  readonly notifyCreated: boolean;
  readonly notifyScheduled: boolean;
  readonly notifyPickedUp: boolean;
  readonly notifyInTransit: boolean;
  readonly notifyDelivered: boolean;
  readonly notifyException: boolean;
  readonly customMessage?: string | null;
}

export interface ShipmentEntityDTO {
  readonly id: string;
  readonly trackingNumber: string;
  readonly formCode: string;
  readonly routingCode?: string | null;
  readonly barcodeSvg?: string | null;
  readonly organizationId: string;
  readonly createdById: string;
  readonly zoneId?: string | null;
  readonly status: ShipmentStatus;
  readonly serviceTier: ServiceTier;
  readonly signatureOption: SignatureOption;
  readonly packagingType: PackagingType;
  readonly customsContentType: CustomsContentType;
  readonly shipDate: Date;
  readonly estimatedDelivery?: Date | null;
  readonly actualDelivery?: Date | null;

  readonly senderName: string;
  readonly senderCompany?: string | null;
  readonly senderTaxId?: string | null;
  readonly senderPhone: string;
  readonly senderPhoneExt?: string | null;
  readonly senderEmail: string;
  readonly senderAddress1: string;
  readonly senderAddress2?: string | null;
  readonly senderAddress3?: string | null;
  readonly senderCity: string;
  readonly senderState?: string | null;
  readonly senderPostal: string;
  readonly senderCountry: string;
  readonly originAirportCode: string;

  readonly recipientName: string;
  readonly recipientCompany?: string | null;
  readonly recipientTaxId?: string | null;
  readonly recipientPhone: string;
  readonly recipientPhoneExt?: string | null;
  readonly recipientEmail: string;
  readonly recipientAddress1: string;
  readonly recipientAddress2?: string | null;
  readonly recipientAddress3?: string | null;
  readonly recipientCity: string;
  readonly recipientState?: string | null;
  readonly recipientPostal: string;
  readonly recipientCountry: string;
  readonly destAirportCode: string;
  readonly isResidential: boolean;

  readonly packageCount: number;
  readonly totalActualWeightKg: number;
  readonly totalVolumetricWgtKg: number;
  readonly totalChargeableWgtKg: number;
  readonly totalCustomsValue: number;
  readonly totalDeclaredValue: number;
  readonly currency: string;

  readonly billTransportationTo: BillTransportationTo;
  readonly billingAccountNumber?: string | null;
  readonly dutiesBillTo: BillTransportationTo;
  readonly dutiesAccountNumber?: string | null;
  readonly referenceCode?: string | null;
  readonly invoiceNumber?: string | null;
  readonly poNumber?: string | null;
  readonly cadNumber: string;

  readonly baseChargeUsd: number;
  readonly fuelSurchargeUsd: number;
  readonly surchargeAmountUsd: number;
  readonly totalShippingCostUsd: number;

  readonly finalizedAt?: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  readonly organization: OrganizationDTO;
  readonly packages: readonly ShipmentPackageDTO[];
  readonly commodities: readonly CommodityItemDTO[];
  readonly pickupOrder?: PickupOrderDTO | null;
  readonly trackingEvents: readonly TrackingEventDTO[];
  readonly notificationSettings?: NotificationConfigDTO | null;
}

export interface ShipmentSummaryItem {
  readonly id: string;
  readonly trackingNumber: string;
  readonly sender?: string;
  readonly origin?: string;
  readonly recipient: string;
  readonly destination: string;
  readonly status: ShipmentStatus;
  readonly service: string;
  readonly weight: string;
  readonly createdAt: string;
  readonly createdDateTime?: string;
  readonly estimatedDelivery?: string | null;
  readonly actualDelivery?: string | null;
}

