-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EMPLOYEE', 'CUSTOMER', 'DRIVER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BUSINESS', 'RESIDENTIAL');

-- CreateEnum
CREATE TYPE "PackagingType" AS ENUM ('YOUR_PACKAGING', 'FEDEX_ENVELOPE', 'FEDEX_PAK', 'FEDEX_BOX_SMALL', 'FEDEX_BOX_MEDIUM', 'FEDEX_BOX_LARGE', 'FEDEX_TUBE');

-- CreateEnum
CREATE TYPE "ServiceTier" AS ENUM ('INTERNATIONAL_PRIORITY', 'INTERNATIONAL_ECONOMY', 'INTERNATIONAL_FIRST', 'STANDARD_OVERNIGHT', 'PRIORITY_OVERNIGHT', 'GROUND_STANDARD');

-- CreateEnum
CREATE TYPE "SignatureOption" AS ENUM ('NO_SIGNATURE_REQUIRED', 'INDIRECT_SIGNATURE', 'DIRECT_SIGNATURE', 'ADULT_SIGNATURE');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('DRAFT_INCOMPLETE', 'SHIPMENT_CREATED_PRINTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'AT_ORIGIN_FACILITY', 'IN_TRANSIT', 'AT_DESTINATION_FACILITY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_EXCEPTION', 'RETURNED_TO_SHIPPER', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScanEventCode" AS ENUM ('OC', 'PU', 'AF', 'DP', 'IT', 'AR', 'OD', 'DL', 'DE', 'RS', 'CA');

-- CreateEnum
CREATE TYPE "BillTransportationTo" AS ENUM ('MY_ACCOUNT', 'RECIPIENT', 'THIRD_PARTY');

-- CreateEnum
CREATE TYPE "CustomsContentType" AS ENUM ('DOCUMENTS_ONLY', 'COMMODITIES');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('KG', 'LB');

-- CreateEnum
CREATE TYPE "DimensionUnit" AS ENUM ('CM', 'IN');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "taxId" TEXT,
    "vatNumber" TEXT,
    "accountNumber" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address_book_entries" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'BUSINESS',
    "isDefaultSender" BOOLEAN NOT NULL DEFAULT false,
    "contactName" TEXT NOT NULL,
    "company" TEXT,
    "taxId" TEXT,
    "phone" TEXT NOT NULL,
    "phoneExt" TEXT,
    "email" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "addressLine3" TEXT,
    "city" TEXT NOT NULL,
    "stateProvince" TEXT,
    "postalCode" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "airportHubCode" TEXT,
    "isResidential" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "address_book_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_zones" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originCountryCode" TEXT NOT NULL DEFAULT 'BD',
    "destCountryCodes" TEXT[],
    "defaultDestHubCode" TEXT NOT NULL,
    "estimatedTransitMin" INTEGER NOT NULL DEFAULT 2,
    "estimatedTransitMax" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_cards" (
    "id" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "serviceTier" "ServiceTier" NOT NULL,
    "baseWeightKg" DECIMAL(8,2) NOT NULL DEFAULT 0.50,
    "baseRateUsd" DECIMAL(10,2) NOT NULL,
    "ratePerAdditionalKg" DECIMAL(10,2) NOT NULL,
    "serviceMultiplier" DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    "fuelSurchargePercent" DECIMAL(5,2) NOT NULL DEFAULT 14.50,
    "residentialFeeUsd" DECIMAL(8,2) NOT NULL DEFAULT 4.50,
    "directSignatureFee" DECIMAL(8,2) NOT NULL DEFAULT 5.50,
    "adultSignatureFee" DECIMAL(8,2) NOT NULL DEFAULT 7.00,
    "insuranceRatePer100" DECIMAL(8,2) NOT NULL DEFAULT 1.00,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "rate_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "formCode" TEXT NOT NULL DEFAULT '0430',
    "routingCode" TEXT,
    "barcodeSvg" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "zoneId" TEXT,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'DRAFT_INCOMPLETE',
    "serviceTier" "ServiceTier" NOT NULL DEFAULT 'INTERNATIONAL_PRIORITY',
    "signatureOption" "SignatureOption" NOT NULL DEFAULT 'NO_SIGNATURE_REQUIRED',
    "packagingType" "PackagingType" NOT NULL DEFAULT 'YOUR_PACKAGING',
    "customsContentType" "CustomsContentType" NOT NULL DEFAULT 'COMMODITIES',
    "shipDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedDelivery" TIMESTAMP(3),
    "actualDelivery" TIMESTAMP(3),
    "senderName" TEXT NOT NULL,
    "senderCompany" TEXT,
    "senderTaxId" TEXT,
    "senderPhone" TEXT NOT NULL,
    "senderPhoneExt" TEXT,
    "senderEmail" TEXT NOT NULL,
    "senderAddress1" TEXT NOT NULL,
    "senderAddress2" TEXT,
    "senderAddress3" TEXT,
    "senderCity" TEXT NOT NULL,
    "senderState" TEXT,
    "senderPostal" TEXT NOT NULL,
    "senderCountry" TEXT NOT NULL DEFAULT 'BD',
    "originAirportCode" TEXT NOT NULL DEFAULT 'DACA',
    "recipientName" TEXT NOT NULL,
    "recipientCompany" TEXT,
    "recipientTaxId" TEXT,
    "recipientPhone" TEXT NOT NULL,
    "recipientPhoneExt" TEXT,
    "recipientEmail" TEXT NOT NULL,
    "recipientAddress1" TEXT NOT NULL,
    "recipientAddress2" TEXT,
    "recipientAddress3" TEXT,
    "recipientCity" TEXT NOT NULL,
    "recipientState" TEXT,
    "recipientPostal" TEXT NOT NULL,
    "recipientCountry" TEXT NOT NULL,
    "destAirportCode" TEXT NOT NULL DEFAULT 'EWR',
    "isResidential" BOOLEAN NOT NULL DEFAULT false,
    "packageCount" INTEGER NOT NULL DEFAULT 1,
    "totalActualWeightKg" DECIMAL(10,2) NOT NULL,
    "totalVolumetricWgtKg" DECIMAL(10,2) NOT NULL,
    "totalChargeableWgtKg" DECIMAL(10,2) NOT NULL,
    "totalCustomsValue" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "totalDeclaredValue" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billTransportationTo" "BillTransportationTo" NOT NULL DEFAULT 'MY_ACCOUNT',
    "billingAccountNumber" TEXT,
    "dutiesBillTo" "BillTransportationTo" NOT NULL DEFAULT 'RECIPIENT',
    "dutiesAccountNumber" TEXT,
    "referenceCode" TEXT,
    "invoiceNumber" TEXT,
    "poNumber" TEXT,
    "cadNumber" TEXT NOT NULL DEFAULT '260504077/INET4535',
    "baseChargeUsd" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "fuelSurchargeUsd" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "surchargeAmountUsd" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "totalShippingCostUsd" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "finalizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_packages" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "packageIndex" INTEGER NOT NULL DEFAULT 1,
    "actualWeight" DECIMAL(8,2) NOT NULL,
    "weightUnit" "WeightUnit" NOT NULL DEFAULT 'KG',
    "length" DECIMAL(8,2) NOT NULL,
    "width" DECIMAL(8,2) NOT NULL,
    "height" DECIMAL(8,2) NOT NULL,
    "dimensionUnit" "DimensionUnit" NOT NULL DEFAULT 'CM',
    "volumetricWgt" DECIMAL(8,2) NOT NULL,
    "chargeableWgt" DECIMAL(8,2) NOT NULL,
    "declaredValue" DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "shipment_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commodity_items" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "packageCount" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT NOT NULL,
    "hsTariffCode" TEXT NOT NULL,
    "quantity" DECIMAL(8,2) NOT NULL,
    "unitOfMeasure" TEXT NOT NULL DEFAULT 'PKS',
    "netWeightKg" DECIMAL(8,2) NOT NULL,
    "unitValue" DECIMAL(10,2) NOT NULL,
    "totalValue" DECIMAL(10,2) NOT NULL,
    "countryOfMfr" TEXT NOT NULL DEFAULT 'BD',

    CONSTRAINT "commodity_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pickup_orders" (
    "id" TEXT NOT NULL,
    "pickupCode" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "driverId" TEXT,
    "isDropOff" BOOLEAN NOT NULL DEFAULT false,
    "pickupDate" TIMESTAMP(3) NOT NULL,
    "earliestTime" TEXT NOT NULL,
    "latestTime" TEXT NOT NULL,
    "instructions" TEXT,
    "pickupAddress" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pickup_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_events" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "recordedById" TEXT,
    "eventCode" "ScanEventCode" NOT NULL,
    "statusTitle" TEXT NOT NULL,
    "description" TEXT,
    "city" TEXT NOT NULL,
    "stateProvince" TEXT,
    "postalCode" TEXT,
    "countryCode" TEXT NOT NULL,
    "hubCode" TEXT,
    "signedBy" TEXT,
    "signatureImage" TEXT,
    "proofPhotoUrl" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_configs" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "recipientEmail" TEXT,
    "companyEmail" TEXT NOT NULL DEFAULT 'operations@company.com',
    "language" TEXT NOT NULL DEFAULT 'en',
    "notifyCreated" BOOLEAN NOT NULL DEFAULT true,
    "notifyScheduled" BOOLEAN NOT NULL DEFAULT true,
    "notifyPickedUp" BOOLEAN NOT NULL DEFAULT true,
    "notifyInTransit" BOOLEAN NOT NULL DEFAULT true,
    "notifyDelivered" BOOLEAN NOT NULL DEFAULT true,
    "notifyException" BOOLEAN NOT NULL DEFAULT true,
    "customMessage" TEXT,

    CONSTRAINT "notification_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "tenantId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadataJson" JSONB,
    "ipAddress" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_code_key" ON "organizations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_accountNumber_key" ON "organizations"("accountNumber");

-- CreateIndex
CREATE INDEX "organizations_code_idx" ON "organizations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_organizationId_idx" ON "users"("organizationId");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");

-- CreateIndex
CREATE INDEX "address_book_entries_organizationId_countryCode_idx" ON "address_book_entries"("organizationId", "countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_zones_code_key" ON "shipping_zones"("code");

-- CreateIndex
CREATE UNIQUE INDEX "rate_cards_zoneId_serviceTier_key" ON "rate_cards"("zoneId", "serviceTier");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_trackingNumber_key" ON "shipments"("trackingNumber");

-- CreateIndex
CREATE INDEX "shipments_organizationId_createdAt_idx" ON "shipments"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "shipments_trackingNumber_idx" ON "shipments"("trackingNumber");

-- CreateIndex
CREATE INDEX "shipments_status_idx" ON "shipments"("status");

-- CreateIndex
CREATE INDEX "shipments_recipientCountry_idx" ON "shipments"("recipientCountry");

-- CreateIndex
CREATE INDEX "shipment_packages_shipmentId_idx" ON "shipment_packages"("shipmentId");

-- CreateIndex
CREATE INDEX "commodity_items_shipmentId_idx" ON "commodity_items"("shipmentId");

-- CreateIndex
CREATE INDEX "commodity_items_hsTariffCode_idx" ON "commodity_items"("hsTariffCode");

-- CreateIndex
CREATE UNIQUE INDEX "pickup_orders_pickupCode_key" ON "pickup_orders"("pickupCode");

-- CreateIndex
CREATE UNIQUE INDEX "pickup_orders_shipmentId_key" ON "pickup_orders"("shipmentId");

-- CreateIndex
CREATE INDEX "pickup_orders_driverId_pickupDate_idx" ON "pickup_orders"("driverId", "pickupDate");

-- CreateIndex
CREATE INDEX "tracking_events_shipmentId_timestamp_idx" ON "tracking_events"("shipmentId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "notification_configs_shipmentId_key" ON "notification_configs"("shipmentId");

-- CreateIndex
CREATE INDEX "audit_logs_tenantId_timestamp_idx" ON "audit_logs"("tenantId", "timestamp");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address_book_entries" ADD CONSTRAINT "address_book_entries_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_cards" ADD CONSTRAINT "rate_cards_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "shipping_zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "shipping_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_packages" ADD CONSTRAINT "shipment_packages_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commodity_items" ADD CONSTRAINT "commodity_items_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_orders" ADD CONSTRAINT "pickup_orders_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_orders" ADD CONSTRAINT "pickup_orders_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_configs" ADD CONSTRAINT "notification_configs_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

