// prisma/seed.ts
import {
  PrismaClient,
  UserRole,
  UserStatus,
  AddressType,
  PackagingType,
  ServiceTier,
  SignatureOption,
  CustomsContentType,
  WeightUnit,
  DimensionUnit,
  ShipmentStatus,
  ScanEventCode,
  BillTransportationTo,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting FedEx Enterprise Replica Database Seed...');

  const defaultPassword = 'FedExPassword2026!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // ──────────────────────────────────────────────────────────────
  // 1. Organizations
  // ──────────────────────────────────────────────────────────────
  console.log('🏢 Seeding Organizations...');

  const orgFedExOps = await prisma.organization.upsert({
    where: { code: 'FDX-BD' },
    update: {},
    create: {
      name: 'FedEx Express Bangladesh Operations',
      code: 'FDX-BD',
      taxId: 'BIN-100294820',
      accountNumber: '100000001',
      phone: '+88028801234',
      email: 'operations@company.com',
      isActive: true,
    },
  });

  const orgApparelSourcing = await prisma.organization.upsert({
    where: { code: 'ASI-BD' },
    update: {},
    create: {
      name: 'Apparel Sourcing International Inc.',
      code: 'ASI-BD',
      taxId: 'BIN-880198945',
      vatNumber: 'BD-VAT-908122',
      accountNumber: '987654321',
      phone: '+8801989451709',
      email: 'export@apparelsourcing.bd',
      isActive: true,
    },
  });

  const orgBengalKnitwear = await prisma.organization.upsert({
    where: { code: 'BKE-BD' },
    update: {},
    create: {
      name: 'Bengal Knitwear Exports Ltd.',
      code: 'BKE-BD',
      taxId: 'BIN-445892110',
      vatNumber: 'BD-VAT-445892',
      accountNumber: '123456789',
      phone: '+8801711223344',
      email: 'info@bengalknit.bd',
      isActive: true,
    },
  });

  // ──────────────────────────────────────────────────────────────
  // 2. Users (4 RBAC Tiers)
  // ──────────────────────────────────────────────────────────────
  console.log('👥 Seeding RBAC Users...');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: { passwordHash },
    create: {
      name: 'System Administrator',
      email: 'admin@company.com',
      passwordHash,
      phone: '+8801700000001',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      organizationId: orgFedExOps.id,
    },
  });

  const staff1 = await prisma.user.upsert({
    where: { email: 'staff1@company.com' },
    update: { passwordHash },
    create: {
      name: 'Rahim Chowdhury (Operations Lead)',
      email: 'staff1@company.com',
      passwordHash,
      phone: '+8801700000002',
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
      organizationId: orgFedExOps.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'staff2@company.com' },
    update: { passwordHash },
    create: {
      name: 'Nasrin Sultana (Customs Specialist)',
      email: 'staff2@company.com',
      passwordHash,
      phone: '+8801700000003',
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
      organizationId: orgFedExOps.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'staff3@company.com' },
    update: { passwordHash },
    create: {
      name: 'Karim Islam (Dispatch Officer)',
      email: 'staff3@company.com',
      passwordHash,
      phone: '+8801700000004',
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
      organizationId: orgFedExOps.id,
    },
  });

  const customerActive = await prisma.user.upsert({
    where: { email: 'export@apparelsourcing.bd' },
    update: { passwordHash },
    create: {
      name: 'Arafat / Gunjan',
      email: 'export@apparelsourcing.bd',
      passwordHash,
      phone: '+8801989451709',
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      organizationId: orgApparelSourcing.id,
      approvedById: staff1.id,
      approvedAt: new Date('2026-10-01T09:00:00Z'),
    },
  });

  await prisma.user.upsert({
    where: { email: 'info@bengalknit.bd' },
    update: { passwordHash },
    create: {
      name: 'Mustafa Zaman',
      email: 'info@bengalknit.bd',
      passwordHash,
      phone: '+8801711223344',
      role: UserRole.CUSTOMER,
      status: UserStatus.PENDING_APPROVAL,
      organizationId: orgBengalKnitwear.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'courier.dhaka@company.com' },
    update: { passwordHash },
    create: {
      name: 'Tariqul Alam (Dhaka Hub Courier)',
      email: 'courier.dhaka@company.com',
      passwordHash,
      phone: '+8801800000005',
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      organizationId: orgFedExOps.id,
    },
  });

  void adminUser;

  // ──────────────────────────────────────────────────────────────
  // 3. Shipping Zones & Rate Cards
  // ──────────────────────────────────────────────────────────────
  console.log('🌐 Seeding Shipping Zones and Rate Cards...');

  const zoneDomestic = await prisma.shippingZone.upsert({
    where: { code: 'ZONE_DOM' },
    update: {},
    create: {
      code: 'ZONE_DOM',
      name: 'Bangladesh Domestic Express',
      originCountryCode: 'BD',
      destCountryCodes: ['BD'],
      defaultDestHubCode: 'DACA',
      estimatedTransitMin: 1,
      estimatedTransitMax: 2,
      isActive: true,
    },
  });

  const zoneMiddleEast = await prisma.shippingZone.upsert({
    where: { code: 'ZONE_ME' },
    update: {},
    create: {
      code: 'ZONE_ME',
      name: 'Middle East & GCC (UAE, Saudi Arabia, Qatar)',
      originCountryCode: 'BD',
      destCountryCodes: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'],
      defaultDestHubCode: 'DXB',
      estimatedTransitMin: 2,
      estimatedTransitMax: 4,
      isActive: true,
    },
  });

  const zoneEurope = await prisma.shippingZone.upsert({
    where: { code: 'ZONE_EU' },
    update: {},
    create: {
      code: 'ZONE_EU',
      name: 'Europe & United Kingdom',
      originCountryCode: 'BD',
      destCountryCodes: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'DK', 'CH'],
      defaultDestHubCode: 'LHR',
      estimatedTransitMin: 3,
      estimatedTransitMax: 5,
      isActive: true,
    },
  });

  const zoneNorthAmerica = await prisma.shippingZone.upsert({
    where: { code: 'ZONE_US_CA' },
    update: {},
    create: {
      code: 'ZONE_US_CA',
      name: 'North America (United States & Canada)',
      originCountryCode: 'BD',
      destCountryCodes: ['US', 'CA'],
      defaultDestHubCode: 'EWR',
      estimatedTransitMin: 2,
      estimatedTransitMax: 4,
      isActive: true,
    },
  });

  const rateCards = [
    {
      zoneId: zoneDomestic.id,
      serviceTier: ServiceTier.STANDARD_OVERNIGHT,
      baseWeightKg: 0.5,
      baseRateUsd: 8.0,
      ratePerAdditionalKg: 3.0,
      serviceMultiplier: 1.0,
      fuelSurchargePercent: 10.0,
      residentialFeeUsd: 1.5,
      directSignatureFee: 2.0,
      adultSignatureFee: 3.5,
      insuranceRatePer100: 0.75,
    },
    {
      zoneId: zoneMiddleEast.id,
      serviceTier: ServiceTier.INTERNATIONAL_PRIORITY,
      baseWeightKg: 0.5,
      baseRateUsd: 36.0,
      ratePerAdditionalKg: 12.0,
      serviceMultiplier: 1.0,
      fuelSurchargePercent: 14.5,
      residentialFeeUsd: 4.5,
      directSignatureFee: 5.5,
      adultSignatureFee: 7.0,
      insuranceRatePer100: 1.0,
    },
    {
      zoneId: zoneEurope.id,
      serviceTier: ServiceTier.INTERNATIONAL_PRIORITY,
      baseWeightKg: 0.5,
      baseRateUsd: 42.0,
      ratePerAdditionalKg: 14.5,
      serviceMultiplier: 1.0,
      fuelSurchargePercent: 14.5,
      residentialFeeUsd: 4.5,
      directSignatureFee: 5.5,
      adultSignatureFee: 7.0,
      insuranceRatePer100: 1.0,
    },
    {
      zoneId: zoneNorthAmerica.id,
      serviceTier: ServiceTier.INTERNATIONAL_PRIORITY,
      baseWeightKg: 0.5,
      baseRateUsd: 48.0,
      ratePerAdditionalKg: 16.5,
      serviceMultiplier: 1.0,
      fuelSurchargePercent: 14.5,
      residentialFeeUsd: 4.5,
      directSignatureFee: 5.5,
      adultSignatureFee: 7.0,
      insuranceRatePer100: 1.0,
    },
    {
      zoneId: zoneNorthAmerica.id,
      serviceTier: ServiceTier.INTERNATIONAL_ECONOMY,
      baseWeightKg: 0.5,
      baseRateUsd: 38.0,
      ratePerAdditionalKg: 12.0,
      serviceMultiplier: 0.85,
      fuelSurchargePercent: 14.5,
      residentialFeeUsd: 4.5,
      directSignatureFee: 5.5,
      adultSignatureFee: 7.0,
      insuranceRatePer100: 1.0,
    },
  ];

  for (const card of rateCards) {
    await prisma.rateCard.upsert({
      where: {
        zoneId_serviceTier: {
          zoneId: card.zoneId,
          serviceTier: card.serviceTier,
        },
      },
      update: {},
      create: card,
    });
  }

  // ──────────────────────────────────────────────────────────────
  // 4. Address Book
  // ──────────────────────────────────────────────────────────────
  console.log('📖 Seeding Address Book...');

  await prisma.addressBookEntry.upsert({
    where: { id: 'addr-asi-hq' },
    update: {},
    create: {
      id: 'addr-asi-hq',
      organizationId: orgApparelSourcing.id,
      type: AddressType.BUSINESS,
      isDefaultSender: true,
      contactName: 'Arafat / Gunjan',
      company: 'Apparel Sourcing International Inc.',
      taxId: 'BIN-880198945',
      phone: '8801989451709',
      email: 'export@apparelsourcing.bd',
      addressLine1: 'House # 30 (3rd Floor), Apt-B3, Western Road',
      addressLine2: 'Banani DOHS',
      city: 'Dhaka',
      stateProvince: 'Dhaka Division',
      postalCode: '1206',
      countryCode: 'BD',
      airportHubCode: 'DACA',
    },
  });

  // ──────────────────────────────────────────────────────────────
  // 5. Complete Suite of 8 Enterprise Shipments
  // ──────────────────────────────────────────────────────────────
  console.log('📦 Seeding 8 Comprehensive Enterprise Shipments...');

  const shipmentsData = [
    {
      trackingNumber: '879098800901',
      recipientName: 'Dakota / Salman',
      recipientCompany: 'Bernette Textile Co. Ltd.',
      recipientAddress1: '42 West 39th Street, 11th Floor',
      recipientCity: 'New York',
      recipientState: 'NY',
      recipientPostal: '10018',
      recipientCountry: 'US',
      destAirportCode: 'EWR',
      status: ShipmentStatus.DELIVERED,
      serviceTier: ServiceTier.INTERNATIONAL_PRIORITY,
      totalWeight: 4.0,
      totalCost: 173.91,
      createdAt: new Date('2026-10-23T10:15:00Z'),
      actualDelivery: new Date('2026-10-27T14:45:00Z'),
      signedBy: 'D. Salman',
      commodityDesc: "Sample of Men's Shorts (97% Cotton, 3% Spandex)",
      events: [
        { code: ScanEventCode.OC, title: 'Shipment created and Air Waybill generated', city: 'Dhaka', country: 'BD', time: '2026-10-23T10:15:00Z' },
        { code: ScanEventCode.PU, title: 'Picked up by FedEx courier', city: 'Dhaka', country: 'BD', time: '2026-10-23T14:30:00Z' },
        { code: ScanEventCode.DP, title: 'Departed origin sort facility (Hazrat Shahjalal Int)', city: 'Dhaka', country: 'BD', time: '2026-10-24T02:10:00Z' },
        { code: ScanEventCode.AR, title: 'Arrived at international transit hub', city: 'Dubai', country: 'AE', time: '2026-10-25T13:45:00Z' },
        { code: ScanEventCode.OD, title: 'On delivery vehicle with Manhattan courier #14B', city: 'New York', country: 'US', time: '2026-10-27T08:15:00Z' },
        { code: ScanEventCode.DL, title: 'Delivered', city: 'New York', country: 'US', time: '2026-10-27T14:45:00Z', signedBy: 'D. Salman' },
      ],
    },
    {
      trackingNumber: '879098800902',
      recipientName: "James O'Brien",
      recipientCompany: 'Apex Global Imports LLC',
      recipientAddress1: '120 Broadway, Suite 1500',
      recipientCity: 'New York',
      recipientState: 'NY',
      recipientPostal: '10271',
      recipientCountry: 'US',
      destAirportCode: 'EWR',
      status: ShipmentStatus.DELIVERED,
      serviceTier: ServiceTier.INTERNATIONAL_ECONOMY,
      totalWeight: 1.2,
      totalCost: 68.4,
      createdAt: new Date('2026-10-20T08:30:00Z'),
      actualDelivery: new Date('2026-10-24T16:10:00Z'),
      signedBy: 'J. O\'Brien',
      commodityDesc: 'Apparel Fabric Samples',
      events: [
        { code: ScanEventCode.OC, title: 'Shipment created and Air Waybill generated', city: 'Dhaka', country: 'BD', time: '2026-10-20T08:30:00Z' },
        { code: ScanEventCode.PU, title: 'Picked up by FedEx courier', city: 'Dhaka', country: 'BD', time: '2026-10-20T11:00:00Z' },
        { code: ScanEventCode.DP, title: 'Departed origin sort facility', city: 'Dhaka', country: 'BD', time: '2026-10-21T03:15:00Z' },
        { code: ScanEventCode.AR, title: 'Arrived at destination facility (EWR Sort)', city: 'Newark', country: 'US', time: '2026-10-23T19:20:00Z' },
        { code: ScanEventCode.OD, title: 'Out for delivery', city: 'New York', country: 'US', time: '2026-10-24T09:00:00Z' },
        { code: ScanEventCode.DL, title: 'Delivered to reception desk', city: 'New York', country: 'US', time: '2026-10-24T16:10:00Z', signedBy: 'J. O\'Brien' },
      ],
    },
    {
      trackingNumber: '879098800903',
      recipientName: 'Ayesha Khan',
      recipientCompany: 'Maple Leaf Retailers Inc.',
      recipientAddress1: '200 Bay Street, Suite 2400',
      recipientCity: 'Toronto',
      recipientState: 'ON',
      recipientPostal: 'M5J 2J1',
      recipientCountry: 'CA',
      destAirportCode: 'YYZ',
      status: ShipmentStatus.OUT_FOR_DELIVERY,
      serviceTier: ServiceTier.INTERNATIONAL_PRIORITY,
      totalWeight: 4.8,
      totalCost: 195.2,
      createdAt: new Date('2026-10-22T09:15:00Z'),
      commodityDesc: 'Knitted Sweaters & Cardigans (Fine Gauge)',
      events: [
        { code: ScanEventCode.OC, title: 'Shipment created and Air Waybill generated', city: 'Dhaka', country: 'BD', time: '2026-10-22T09:15:00Z' },
        { code: ScanEventCode.PU, title: 'Picked up from shipper', city: 'Dhaka', country: 'BD', time: '2026-10-22T13:40:00Z' },
        { code: ScanEventCode.DP, title: 'Departed origin airport DACA', city: 'Dhaka', country: 'BD', time: '2026-10-23T01:50:00Z' },
        { code: ScanEventCode.AR, title: 'Arrived at Toronto Sort Facility YYZ', city: 'Toronto', country: 'CA', time: '2026-10-25T14:10:00Z' },
        { code: ScanEventCode.OD, title: 'Out for delivery with courier route 42', city: 'Toronto', country: 'CA', time: '2026-10-26T08:30:00Z' },
      ],
    },
    {
      trackingNumber: '879098800904',
      recipientName: 'Sven Nilsson',
      recipientCompany: 'Nordic Fashion House AB',
      recipientAddress1: 'Kungsgatan 32',
      recipientCity: 'Stockholm',
      recipientState: 'Stockholm',
      recipientPostal: '111 35',
      recipientCountry: 'SE',
      destAirportCode: 'ARN',
      status: ShipmentStatus.PICKUP_SCHEDULED,
      serviceTier: ServiceTier.INTERNATIONAL_ECONOMY,
      totalWeight: 0.75,
      totalCost: 52.8,
      createdAt: new Date('2026-10-25T14:00:00Z'),
      commodityDesc: 'Organic Cotton Fabric Swatches',
      events: [
        { code: ScanEventCode.OC, title: 'Shipment created and Air Waybill generated', city: 'Dhaka', country: 'BD', time: '2026-10-25T14:00:00Z' },
      ],
    },
    {
      trackingNumber: '879098800905',
      recipientName: 'Maria Santos',
      recipientCompany: 'Al-Futtaim Logistics LLC',
      recipientAddress1: 'Cargo Village, Building B',
      recipientCity: 'Dubai',
      recipientState: 'Dubai',
      recipientPostal: '54321',
      recipientCountry: 'AE',
      destAirportCode: 'DXB',
      status: ShipmentStatus.AT_ORIGIN_FACILITY,
      serviceTier: ServiceTier.INTERNATIONAL_PRIORITY,
      totalWeight: 3.1,
      totalCost: 112.5,
      createdAt: new Date('2026-10-24T11:20:00Z'),
      commodityDesc: 'High-Density Denim Trousers',
      events: [
        { code: ScanEventCode.OC, title: 'Shipment created and Air Waybill generated', city: 'Dhaka', country: 'BD', time: '2026-10-24T11:20:00Z' },
        { code: ScanEventCode.PU, title: 'Picked up by courier', city: 'Dhaka', country: 'BD', time: '2026-10-24T15:30:00Z' },
        { code: ScanEventCode.AF, title: 'Arrived at origin sort gateway DACA', city: 'Dhaka', country: 'BD', time: '2026-10-24T18:45:00Z' },
      ],
    },
    {
      trackingNumber: '879098800906',
      recipientName: 'Hiroshi Tanaka',
      recipientCompany: 'Shibuya Textiles Corp',
      recipientAddress1: '2-24-12 Shibuya',
      recipientCity: 'Tokyo',
      recipientState: 'Tokyo',
      recipientPostal: '150-0002',
      recipientCountry: 'JP',
      destAirportCode: 'HND',
      status: ShipmentStatus.SHIPMENT_CREATED_PRINTED,
      serviceTier: ServiceTier.INTERNATIONAL_FIRST,
      totalWeight: 0.5,
      totalCost: 48.0,
      createdAt: new Date('2026-10-26T07:45:00Z'),
      commodityDesc: 'Silk Scarf Prototype Samples',
      events: [
        { code: ScanEventCode.OC, title: 'Shipment created and Air Waybill generated', city: 'Dhaka', country: 'BD', time: '2026-10-26T07:45:00Z' },
      ],
    },
    {
      trackingNumber: '879098800907',
      recipientName: 'Olivia Chen',
      recipientCompany: 'Pacific Retail Sydney Ltd.',
      recipientAddress1: '100 George Street, The Rocks',
      recipientCity: 'Sydney',
      recipientState: 'NSW',
      recipientPostal: '2000',
      recipientCountry: 'AU',
      destAirportCode: 'SYD',
      status: ShipmentStatus.DELIVERY_EXCEPTION,
      serviceTier: ServiceTier.INTERNATIONAL_ECONOMY,
      totalWeight: 6.3,
      totalCost: 245.0,
      createdAt: new Date('2026-10-18T09:30:00Z'),
      commodityDesc: 'Knit Outerwear & Fleece Jackets',
      events: [
        { code: ScanEventCode.OC, title: 'Shipment created and Air Waybill generated', city: 'Dhaka', country: 'BD', time: '2026-10-18T09:30:00Z' },
        { code: ScanEventCode.PU, title: 'Picked up from warehouse', city: 'Dhaka', country: 'BD', time: '2026-10-18T14:15:00Z' },
        { code: ScanEventCode.DP, title: 'Departed Dhaka via flight SQ449', city: 'Dhaka', country: 'BD', time: '2026-10-19T02:00:00Z' },
        { code: ScanEventCode.DE, title: 'Customs delay: Additional regulatory documentation required', city: 'Sydney', country: 'AU', time: '2026-10-22T11:30:00Z' },
      ],
    },
    {
      trackingNumber: '879098800908',
      recipientName: 'Carlos Mendez',
      recipientCompany: 'Iberian Moda Distribución S.L.',
      recipientAddress1: 'Calle de Alcalá 45',
      recipientCity: 'Madrid',
      recipientState: 'Madrid',
      recipientPostal: '28014',
      recipientCountry: 'ES',
      destAirportCode: 'MAD',
      status: ShipmentStatus.IN_TRANSIT,
      serviceTier: ServiceTier.INTERNATIONAL_PRIORITY,
      totalWeight: 2.8,
      totalCost: 128.5,
      createdAt: new Date('2026-10-27T10:00:00Z'),
      commodityDesc: 'Casual Cotton Polo Shirts',
      events: [
        { code: ScanEventCode.OC, title: 'Shipment created and Air Waybill generated', city: 'Dhaka', country: 'BD', time: '2026-10-27T10:00:00Z' },
        { code: ScanEventCode.PU, title: 'Picked up by courier #402', city: 'Dhaka', country: 'BD', time: '2026-10-27T13:30:00Z' },
        { code: ScanEventCode.DP, title: 'Departed DACA hub on flight QR639', city: 'Dhaka', country: 'BD', time: '2026-10-28T04:20:00Z' },
        { code: ScanEventCode.AR, title: 'Arrived at European Transit Gateway (CDG)', city: 'Paris', country: 'FR', time: '2026-10-29T12:15:00Z' },
      ],
    },
  ];

  for (const s of shipmentsData) {
    const existing = await prisma.shipment.findUnique({
      where: { trackingNumber: s.trackingNumber },
    });

    if (existing) {
      await prisma.shipment.update({
        where: { trackingNumber: s.trackingNumber },
        data: {
          status: s.status,
          serviceTier: s.serviceTier,
          recipientName: s.recipientName,
          recipientCompany: s.recipientCompany,
          recipientAddress1: s.recipientAddress1,
          recipientCity: s.recipientCity,
          recipientState: s.recipientState,
          recipientPostal: s.recipientPostal,
          recipientCountry: s.recipientCountry,
          totalChargeableWgtKg: s.totalWeight,
          totalShippingCostUsd: s.totalCost,
          actualDelivery: s.actualDelivery,
        },
      });
      console.log(`  Updated existing shipment ${s.trackingNumber}`);
    } else {
      await prisma.shipment.create({
        data: {
          trackingNumber: s.trackingNumber,
          formCode: '0430',
          routingCode: `XA MTPA ${s.trackingNumber.slice(0, 4)}/DACA/${s.destAirportCode}`,
          barcodeSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60"><rect width="400" height="60" fill="#ffffff"/><path d="M10 5h4v50h-4zM20 5h2v50h-2zM28 5h6v50h-6zM40 5h2v50h-2zM48 5h4v50h-4zM60 5h8v50h-8zM75 5h2v50h-2zM85 5h4v50h-4zM95 5h6v50h-6zM110 5h2v50h-2z" fill="#000000"/></svg>`,
          organization: { connect: { id: orgApparelSourcing.id } },
          createdBy: { connect: { id: customerActive.id } },
          status: s.status,
          serviceTier: s.serviceTier,
          signatureOption: SignatureOption.DIRECT_SIGNATURE,
          packagingType: PackagingType.YOUR_PACKAGING,
          customsContentType: CustomsContentType.COMMODITIES,
          shipDate: s.createdAt,
          estimatedDelivery: new Date(s.createdAt.getTime() + 4 * 24 * 60 * 60 * 1000),
          actualDelivery: s.actualDelivery,

          senderName: 'Arafat / Gunjan',
          senderCompany: 'Apparel Sourcing International Inc.',
          senderTaxId: 'BIN-880198945',
          senderPhone: '+8801989451709',
          senderEmail: 'export@apparelsourcing.bd',
          senderAddress1: 'House # 30 (3rd Floor), Apt-B3, Western Road',
          senderAddress2: 'Banani DOHS',
          senderCity: 'Dhaka',
          senderPostal: '1206',
          senderCountry: 'BD',
          originAirportCode: 'DACA',

          recipientName: s.recipientName,
          recipientCompany: s.recipientCompany,
          recipientTaxId: 'TAX-GLOBAL-991',
          recipientPhone: '+1 555 0199',
          recipientEmail: 'receiver@company.com',
          recipientAddress1: s.recipientAddress1,
          recipientCity: s.recipientCity,
          recipientState: s.recipientState,
          recipientPostal: s.recipientPostal,
          recipientCountry: s.recipientCountry,
          destAirportCode: s.destAirportCode,
          isResidential: false,

          packageCount: 1,
          totalActualWeightKg: s.totalWeight,
          totalVolumetricWgtKg: s.totalWeight,
          totalChargeableWgtKg: s.totalWeight,
          totalCustomsValue: 50.0,
          totalDeclaredValue: 50.0,
          currency: 'USD',

          billTransportationTo: BillTransportationTo.MY_ACCOUNT,
          billingAccountNumber: '987654321',
          dutiesBillTo: BillTransportationTo.RECIPIENT,

          baseChargeUsd: s.totalCost * 0.8,
          fuelSurchargeUsd: s.totalCost * 0.15,
          surchargeAmountUsd: s.totalCost * 0.05,
          totalShippingCostUsd: s.totalCost,
          finalizedAt: s.createdAt,
          createdAt: s.createdAt,

          packages: {
            create: [
              {
                packageIndex: 1,
                actualWeight: s.totalWeight,
                weightUnit: WeightUnit.KG,
                length: 40,
                width: 30,
                height: 20,
                dimensionUnit: DimensionUnit.CM,
                volumetricWgt: s.totalWeight,
                chargeableWgt: s.totalWeight,
                declaredValue: 50.0,
              },
            ],
          },
          commodities: {
            create: [
              {
                packageCount: 1,
                description: s.commodityDesc,
                hsTariffCode: '6105.10.00',
                quantity: 10,
                unitOfMeasure: 'PCS',
                netWeightKg: s.totalWeight,
                unitValue: 5.0,
                totalValue: 50.0,
                countryOfMfr: 'BD',
              },
            ],
          },
          trackingEvents: {
            create: s.events.map((ev) => ({
              eventCode: ev.code,
              statusTitle: ev.title,
              description: ev.title,
              city: ev.city,
              countryCode: ev.country,
              signedBy: (ev as any).signedBy ?? null,
              timestamp: new Date(ev.time),
            })),
          },
        },
      });
      console.log(`  Created shipment ${s.trackingNumber} (${s.status})`);
    }
  }

  console.log('✅ Comprehensive Database Seed completed successfully!\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    console.error('❌ Error executing database seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
