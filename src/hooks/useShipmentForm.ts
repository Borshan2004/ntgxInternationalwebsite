// src/hooks/useShipmentForm.ts
'use client';

import { useState, useCallback } from 'react';
import type {
  PartyAddressData,
  PackageDimensionItem,
  CommodityLineItem,
  ServiceSelectionData,
  PickupScheduleData,
  BillingAndNotificationData,
  ShipmentFormPayload,
  PackagingType,
  CustomsContentType,
} from '@/types/shipment';
import { calculateVolumetricWeightKg } from '@/services/rateEngineService';

export interface FormStepStatus {
  readonly step1Complete: boolean;
  readonly step2Complete: boolean;
  readonly step3Complete: boolean;
  readonly step4Complete: boolean;
  readonly step5Complete: boolean;
  readonly step6Complete: boolean;
  readonly step7Complete: boolean;
}

const INITIAL_SENDER: PartyAddressData = {
  contactName: 'Arafat / Gunjan',
  company: 'Apparel Sourcing International Inc.',
  taxId: 'BIN-908122-BD',
  phone: '8801989451709',
  email: 'shipping@apparelsourcing.com',
  addressLine1: 'House # 30 (3rd Floor), Apt-B3',
  addressLine2: 'Western Road, Banani DOHS',
  city: 'Dhaka',
  postalCode: '1206',
  countryCode: 'BD',
  airportHubCode: 'DACA',
  isResidential: false,
};

const INITIAL_RECIPIENT: PartyAddressData = {
  contactName: 'Dakota / Salman',
  company: 'Bernette Textile Co. Ltd.',
  taxId: 'US-EIN-13-987654',
  phone: '212-279-5526',
  email: 'logistics@bernettetextile.com',
  addressLine1: '42 West 39th Street, 11th Floor',
  city: 'New York',
  stateProvince: 'NY',
  postalCode: '10018',
  countryCode: 'US',
  airportHubCode: 'EWR',
  isResidential: false,
};

const INITIAL_PACKAGE: PackageDimensionItem = {
  packageIndex: 1,
  actualWeight: 2.5,
  weightUnit: 'KG',
  length: 51,
  width: 35,
  height: 11,
  dimensionUnit: 'CM',
  volumetricWeightKg: 3.93,
  chargeableWeightKg: 3.93,
  declaredValueUsd: 100,
};

const INITIAL_COMMODITY: CommodityLineItem = {
  packageCount: 1,
  description: "Sample of Men's Shorts (97% Cotton, 3% Spandex)",
  hsTariffCode: '98110060',
  quantity: 4,
  unitOfMeasure: 'PKS',
  netWeightKg: 2.2,
  unitValueUsd: 1.5,
  totalValueUsd: 6.0,
  countryOfMfr: 'BD',
};

const INITIAL_SERVICE: ServiceSelectionData = {
  serviceTier: 'INTERNATIONAL_PRIORITY',
  shipDate: new Date().toISOString().split('T')[0],
  signatureOption: 'NO_SIGNATURE_REQUIRED',
  holdAtLocation: false,
};

const INITIAL_PICKUP: PickupScheduleData = {
  isDropOff: false,
  pickupDate: new Date().toISOString().split('T')[0],
  earliestTime: '08:00 AM',
  latestTime: '01:30 PM',
  instructions: 'Please call recipient upon pickup arrival at gate 2.',
};

const INITIAL_BILLING: BillingAndNotificationData = {
  billTransportationTo: 'MY_ACCOUNT',
  billingAccountNumber: '987654321',
  dutiesBillTo: 'RECIPIENT',
  referenceCode: 'BNI/CC/P-1780009697',
  invoiceNumber: 'ASI-25075',
  poNumber: 'PO-99104',
  notifications: {
    clientEmail: 'shipping@apparelsourcing.com',
    companyEmail: 'operations@company.com',
    language: 'en',
    notifyCreated: true,
    notifyScheduled: true,
    notifyPickedUp: true,
    notifyInTransit: true,
    notifyDelivered: true,
    notifyException: true,
  },
};

export function useShipmentForm(organizationId: string) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [sender, setSender] = useState<PartyAddressData>(INITIAL_SENDER);
  const [recipient, setRecipient] = useState<PartyAddressData>(INITIAL_RECIPIENT);
  const [packagingType, setPackagingType] = useState<PackagingType>('YOUR_PACKAGING');
  const [packages, setPackages] = useState<readonly PackageDimensionItem[]>([INITIAL_PACKAGE]);
  const [customsContentType, setCustomsContentType] = useState<CustomsContentType>('COMMODITIES');
  const [commodities, setCommodities] = useState<readonly CommodityLineItem[]>([INITIAL_COMMODITY]);
  const [currency] = useState<string>('USD');
  const [service, setService] = useState<ServiceSelectionData>(INITIAL_SERVICE);
  const [pickup, setPickup] = useState<PickupScheduleData>(INITIAL_PICKUP);
  const [billing, setBilling] = useState<BillingAndNotificationData>(INITIAL_BILLING);

  // Package helpers
  const updatePackage = useCallback(
    (index: number, partial: Partial<PackageDimensionItem>): void => {
      setPackages((prev) =>
        prev.map((pkg, i) => {
          if (i !== index) return pkg;
          const merged = { ...pkg, ...partial };
          const volKg = calculateVolumetricWeightKg(
            merged.length,
            merged.width,
            merged.height,
            merged.dimensionUnit
          );
          const actKg =
            merged.weightUnit === 'LB'
              ? merged.actualWeight * 0.45359237
              : merged.actualWeight;
          const chgKg = Math.max(actKg, volKg);
          return {
            ...merged,
            volumetricWeightKg: Number(volKg.toFixed(2)),
            chargeableWeightKg: Number(chgKg.toFixed(2)),
          };
        })
      );
    },
    []
  );

  const addPackage = useCallback((): void => {
    setPackages((prev) => [
      ...prev,
      {
        packageIndex: prev.length + 1,
        actualWeight: 1.0,
        weightUnit: 'KG',
        length: 30,
        width: 20,
        height: 10,
        dimensionUnit: 'CM',
        volumetricWeightKg: 1.2,
        chargeableWeightKg: 1.2,
        declaredValueUsd: 0,
      },
    ]);
  }, []);

  const removePackage = useCallback((index: number): void => {
    setPackages((prev) => {
      if (prev.length <= 1) return prev;
      return prev
        .filter((_, i) => i !== index)
        .map((pkg, i) => ({ ...pkg, packageIndex: i + 1 }));
    });
  }, []);

  // Commodity helpers
  const updateCommodity = useCallback(
    (index: number, partial: Partial<CommodityLineItem>): void => {
      setCommodities((prev) =>
        prev.map((item, i) => {
          if (i !== index) return item;
          const merged = { ...item, ...partial };
          const totalVal = merged.quantity * merged.unitValueUsd;
          return {
            ...merged,
            totalValueUsd: Number(totalVal.toFixed(2)),
          };
        })
      );
    },
    []
  );

  const addCommodity = useCallback((): void => {
    setCommodities((prev) => [
      ...prev,
      {
        packageCount: 1,
        description: '',
        hsTariffCode: '',
        quantity: 1,
        unitOfMeasure: 'PCS',
        netWeightKg: 0.5,
        unitValueUsd: 0,
        totalValueUsd: 0,
        countryOfMfr: sender.countryCode || 'BD',
      },
    ]);
  }, [sender.countryCode]);

  const removeCommodity = useCallback((index: number): void => {
    setCommodities((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Step completions
  const stepStatus: FormStepStatus = {
    step1Complete: Boolean(
      sender.contactName &&
        sender.phone &&
        sender.addressLine1 &&
        sender.city &&
        sender.countryCode
    ),
    step2Complete: Boolean(
      recipient.contactName &&
        recipient.phone &&
        recipient.addressLine1 &&
        recipient.city &&
        recipient.countryCode
    ),
    step3Complete: packages.length > 0 && packages.every((p) => p.actualWeight > 0),
    step4Complete:
      customsContentType === 'DOCUMENTS_ONLY' ||
      (commodities.length > 0 &&
        commodities.every(
          (c) => c.description && c.hsTariffCode && c.quantity > 0
        )),
    step5Complete: Boolean(service.serviceTier && service.shipDate),
    step6Complete: Boolean(pickup.pickupDate && pickup.earliestTime && pickup.latestTime),
    step7Complete: Boolean(billing.billTransportationTo && billing.notifications.clientEmail),
  };

  const getPayload = (action: 'SAVE_DRAFT' | 'FINALIZE'): ShipmentFormPayload => {
    return {
      organizationId,
      action,
      sender,
      recipient,
      packagingType,
      packages,
      customsContentType,
      commodities,
      currency,
      service,
      pickup,
      billing,
    };
  };

  return {
    activeStep,
    setActiveStep,
    stepStatus,
    sender,
    setSender,
    recipient,
    setRecipient,
    packagingType,
    setPackagingType,
    packages,
    updatePackage,
    addPackage,
    removePackage,
    customsContentType,
    setCustomsContentType,
    commodities,
    updateCommodity,
    addCommodity,
    removeCommodity,
    currency,
    service,
    setService,
    pickup,
    setPickup,
    billing,
    setBilling,
    getPayload,
  };
}
