// src/app/(dashboard)/shipments/new/page.tsx
'use client';

import React from 'react';
import { NTGXShipManager } from '@/components/features/shipment-manager/NTGXShipManager';

export default function NewShipmentPage(): React.JSX.Element {
  return (
    <NTGXShipManager
      organizationId="org-asi-bd-demo"
      organizationName="Apparel Sourcing International Inc."
      userName="AFAZ"
    />
  );
}
