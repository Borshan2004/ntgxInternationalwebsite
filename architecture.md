# FedEx Enterprise Replica — System Architecture Specification (`architecture.md`)

**Document Version:** 2.0.0  
**Phase:** 2 — Architecture & Design (`/replica-architect` & `/replica-design`)  
**Standard:** Enterprise Carrier Logistics SaaS (FedEx Ship Manager & Track REST API Parity)  
**TypeScript Compliance:** Strict mode (`strictNullChecks: true`, `noImplicitAny: true`, zero `any`)

---

## 1. Architectural Boundaries & Layering

The platform enforces a strict 4-layer separation of concerns. UI components remain entirely free of direct database or third-party logic, allowing individual services to scale or be extracted as standalone microservices if required:

```mermaid
flowchart TD
    subgraph L1 ["1. Presentation Layer (src/app, src/components)"]
        UI_ATOMIC["Atomic Primitives (src/components/ui/)<br/>- Button, Input, Select, Checkbox, Badge, Table, Modal"]
        UI_FEATURE["Feature Views (src/components/features/)<br/>- Shipment Manager 7-Step Accordion<br/>- Document Viewer & Barcode Canvas<br/>- Real-time Timeline Telemetry"]
    end

    subgraph L2 ["2. Application & Hook Layer (src/hooks)"]
        H_FORM["useShipmentForm (Zod Schema Validation & Draft Sync)"]
        H_RATE["useRateCalculator (Debounced Volumetric Engine)"]
        H_AUTH["useAuth (Tenant & RBAC Context)"]
        H_EXCEL["useExcelExport (Filter & Stream Download)"]
    end

    subgraph L3 ["3. Domain Service Layer (src/services)"]
        S_BARCODE["barcodeService.ts (12-Digit Mod-11 & SVG Code 128)"]
        S_RATE["rateEngineService.ts (Actual vs Volumetric, Zone Matrix)"]
        S_PDF["pdfService.ts (3-Page AWB Form 0430 + Commercial Invoice)"]
        S_EMAIL["emailService.ts (Dual Transactional Dispatcher)"]
        S_EXCEL["excelService.ts (ExcelJS Multi-Tab Worksheets)"]
    end

    subgraph L4 ["4. Data Persistence & Multi-Tenant Layer (src/lib/prisma.ts)"]
        DB_POOL["Neon Serverless PostgreSQL (PgBouncer Pooling)"]
        TENANT_GUARD["Tenant Isolation Middleware (organizationId Scoping)"]
        AUDIT_LOGGER["Audit Trail & KYC Approval Pipeline"]
    end

    L1 --> L2
    L2 --> L3
    L3 --> L4
```

### Layer Contracts:
- **Presentation Layer (`src/components/ui/`, `src/components/features/`)**: Stateless primitives styled purely through tokens in `design-tokens.json` mapped via `tailwind.config.ts`. Form components communicate exclusively via strongly-typed React hook controllers.
- **Application & Hook Layer (`src/hooks/`)**: Implements client-side state transitions, debounced rate calculations, optimistic UI updates, and local storage draft restoration.
- **Domain Service Layer (`src/services/`)**: Pure TypeScript business logic isolated from DOM dependencies. Every service has deterministic inputs, explicit return types, and isolated unit testability.
- **Data Persistence Layer (`src/lib/prisma.ts`, `prisma/schema.prisma`)**: Direct connection pooling through Neon PgBouncer with non-bypassable `organizationId` filtering on tenant operations.

---

## 2. Multi-Tenant Isolation Model (`organizationId` Enforcement)

To fulfill strict tenant privacy and support granular customer-specific reporting, every customer-generated record is bound to an `organizationId`.

```mermaid
sequenceDiagram
    autonumber
    actor Shipper as Customer (Shipper)
    participant NextApi as Next.js API Route Handler
    participant Guard as Tenant Context Validator
    participant Prisma as Prisma Client Middleware
    participant Neon as Neon PostgreSQL DB

    Shipper->>NextApi: Request Shipments List / Query (/api/shipments)
    NextApi->>Guard: Extract JWT Session & Verify KYC (status == ACTIVE)
    Guard-->>NextApi: Session Validated (User: role=CUSTOMER, orgId="org_abc123")
    NextApi->>Prisma: prisma.shipment.findMany({ where: { status: 'IN_TRANSIT' } })
    Note over Prisma: Automatic Middleware Injection:<br/>where.organizationId = "org_abc123"
    Prisma->>Neon: SELECT * FROM shipments WHERE status = 'IN_TRANSIT' AND organization_id = 'org_abc123'
    Neon-->>Prisma: Scoped Tenant Records Only
    Prisma-->>NextApi: Verified Records
    NextApi-->>Shipper: Scoped Results (200 OK)
```

### 2.1 Role-Based Access Control (RBAC) Matrix

| Resource / Action | ADMIN (Superuser) | EMPLOYEE (Staff - 3 Users) | CUSTOMER (Approved) | DRIVER (Courier) |
| :--- | :---: | :---: | :---: | :---: |
| **User KYC Approval / Rejection** | Full Access | Full Access | Denied | Denied |
| **Zone Matrix & Rate Configuration** | Full Access | Read-Only | Denied | Denied |
| **Shipment Creation / Finalization** | All Tenants | All Tenants | Own `organizationId` Only | Denied |
| **Air Waybill & Invoice Generation** | All Tenants | All Tenants | Own `organizationId` Only | Read-Only |
| **Scan Events & Proof of Delivery** | Full Access | Full Access | Read-Only (Own Shipments) | Assigned Routes |
| **Multi-Sheet Excel Reporting** | Global & Per-Tenant | Global & Per-Tenant | Own `organizationId` Only | Denied |
| **Audit Log Inspection** | Full Access | Read-Only | Denied | Denied |

---

## 3. The 7-Step FedEx Ship Manager State Pipeline

The shipment creation process faithfully replicates the production FedEx Ship Manager accordion pipeline, enforcing step-by-step validation:

```mermaid
stateDiagram-v2
    [*] --> Step1_ShipFrom
    Step1_ShipFrom --> Step2_DeliverTo: Valid Sender Address & Tax ID
    Step2_DeliverTo --> Step3_PackageDetails: Valid Recipient Address & Hub
    Step3_PackageDetails --> Step4_CustomsContents: Dimensions & Weight Verified
    Step4_CustomsContents --> Step5_ServiceDetails: Commodities & HS Codes Validated
    Step5_ServiceDetails --> Step6_PickupSchedule: Service Tier & Signature Picked
    Step6_PickupSchedule --> Step7_BillingNotifications: Window / Drop-Off Configured
    Step7_BillingNotifications --> ActionDecision: Payer & Alerts Set

    state ActionDecision <<choice>>
    ActionDecision --> DraftSaved: Action: SAVE_DRAFT
    ActionDecision --> Finalized: Action: FINALIZE

    DraftSaved --> [*]: Status = DRAFT_INCOMPLETE
    Finalized --> PipelineExecution: Status = SHIPMENT_CREATED_PRINTED
    
    state PipelineExecution {
        [*] --> GenerateMod11Tracking
        GenerateMod11Tracking --> RenderBarcodes
        RenderBarcodes --> Render3PageAWB
        Render3PageAWB --> RenderCommercialInvoice
        RenderCommercialInvoice --> TriggerDualEmails
    }
```

### Detailed Section Validations:
1. **Step 1 — Ship From (Sender)**:
   - Verified against sender address book or new entry.
   - Requires Contact Name, Phone, Email, Address Line 1, City, Postal Code, Country Code (`BD` default), Origin Airport Code (`DACA`).
2. **Step 2 — Deliver To (Recipient)**:
   - Contact Name, Phone, Email, Street Address, City, Postal Code, Destination Country Code.
   - Automatic hub resolver maps destination country/city to standard IATA hub (e.g., `US` $\rightarrow$ `EWR`).
   - Residential flag toggles residential delivery fee surcharge.
3. **Step 3 — Package Details**:
   - Supports multi-package entry.
   - For each package: Length $\times$ Width $\times$ Height (cm or in) and Gross Weight (kg or lb).
   - Dynamic volumetric calculation: $\frac{L \times W \times H}{5000} \text{ kg}$.
   - Chargeable weight: $\max(W_{\text{actual}}, W_{\text{volumetric}})$.
4. **Step 4 — Package Contents & Customs**:
   - Classification: Documents Only vs. Commercial Commodities.
   - Line items: Description, HS Tariff Code (6 to 10 digits), Quantity, Unit of Measure (`PKS`, `PCS`, `KGS`, etc.), Unit Value (USD), Net Weight (kg).
   - Automated aggregation of Customs Declared Value.
5. **Step 5 — Service & Transit**:
   - Service Tiers: `INTERNATIONAL_PRIORITY`, `INTERNATIONAL_ECONOMY`, `INTERNATIONAL_FIRST`, `STANDARD_OVERNIGHT`, `PRIORITY_OVERNIGHT`, `GROUND_STANDARD`.
   - Signature Confirmation: `NO_SIGNATURE_REQUIRED`, `INDIRECT_SIGNATURE`, `DIRECT_SIGNATURE`, `ADULT_SIGNATURE`.
6. **Step 6 — Pickup / Drop-off Schedule**:
   - Toggle: Counter Drop-off vs. Scheduled Driver Pickup.
   - Ready time (e.g. `08:00 AM`) and latest pickup window (e.g. `01:30 PM`).
   - Special driver instructions and optional alternate pickup site.
7. **Step 7 — Billing & Dual Notification**:
   - Bill transportation to: `MY_ACCOUNT`, `RECIPIENT`, or `THIRD_PARTY`.
   - Customer reference (`referenceCode`), commercial invoice number (`invoiceNumber`), CAD number (`260504077/INET4535`).
   - Notification dispatch configurations for both Client and Company Operations.

---

## 4. Mod-11 12-Digit Tracking Number & Barcode Boundaries

### 4.1 Modulo-11 Check Digit Algorithm
FedEx 12-digit tracking numbers follow a weighted Mod-11 calculation:

$$\text{Tracking Number: } [d_1, d_2, d_3, d_4, d_5, d_6, d_7, d_8, d_9, d_{10}, d_{11}, c_{12}]$$

$$\text{Weights } W = [1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3]$$

$$\text{Sum} = \sum_{i=1}^{11} (d_i \times W[i-1])$$

$$\text{Remainder } R = \text{Sum} \pmod{11}$$

$$\text{Check Digit } c_{12} = \begin{cases} 0 & \text{if } R = 0 \text{ or } R = 10 \\ R & \text{otherwise} \end{cases}$$

### 4.2 Barcode Service Boundary (`barcodeService.ts`)
- **Linear Code 128 / GS1-128**: Rendered as crisp, resolution-independent SVG paths for direct printing on 203 DPI / 300 DPI thermal printers or standard laser printers.
- **Routing Data Header**: Encodes formatted routing string (e.g., `XA MTPA 58KJ1/70DF/484B`) with service acronym (`IP EOD`) and destination airport code (`EWR`).
- **Checksum Verification**: Provides `verifyTrackingNumber(tracking: string): boolean` for ingress scanning validation by driver devices.

---

## 5. Document Generation Pipeline (3-Page Air Waybill + Commercial Invoice)

```mermaid
flowchart LR
    A["Shipment Finalized Event"] --> B["Document Generation Engine (pdfService.ts)"]
    B --> C["Air Waybill (Form 0430)"]
    B --> D["Commercial Invoice"]
    
    subgraph AWB_Copies ["3-Page Air Waybill Output"]
        C1["Page 1: Consignee Copy<br/>(Pouch Front)"]
        C2["Page 2: FedEx AWB Copy<br/>(Pouch Behind)"]
        C3["Page 3: Shipper Copy<br/>(Accounting Record)"]
    end
    
    subgraph CI_Sections ["Commercial Invoice Output"]
        D1["Exporter & Consignee Tax ID Blocks"]
        D2["Itemized Commodity Grid with HS Codes"]
        D3["Financial Breakdown & Declaration Sign-off"]
    end
    
    C --> C1
    C --> C2
    C --> C3
    D --> D1
    D --> D2
    D --> D3
```

### 5.1 Document Specifications:
- **Form Code**: `0430` (FedEx International Air Waybill Standard).
- **Page Dimensions**: ISO A4 / US Letter compliant print-ready layout with high-contrast monochrome ink specifications (`#000000`).
- **Rendering Technology**: Stream-based serverless PDF generation (`@react-pdf/renderer` or headless vector canvas) returning `application/pdf` streams with `Content-Disposition: inline`.

---

## 6. Dual-Email Dispatch Notification Triggers

When a shipment moves from `DRAFT_INCOMPLETE` to `SHIPMENT_CREATED_PRINTED`, the `emailService.ts` executes parallel asynchronous dispatches:

```mermaid
sequenceDiagram
    autonumber
    participant Engine as Finalize Controller
    participant EmailSvc as emailService.ts
    participant ClientSMTP as Resend/SMTP (Client Channel)
    participant OpsSMTP as Resend/SMTP (Operations Channel)

    Engine->>EmailSvc: dispatchShipmentFinalizedEmails(shipmentId)
    par Notify Shipper Client
        EmailSvc->>ClientSMTP: Send Confirmation
        Note over ClientSMTP: Subject: FedEx Shipment Confirmation & Tracking: #8790 9880 0901<br/>Contains: Routing, Est Delivery, Direct Track Link, Download Links
    and Notify Operations Hub
        EmailSvc->>OpsSMTP: Send Dispatch Alert
        Note over OpsSMTP: Subject: [NEW SHIPMENT DISPATCHED] Client: ASI - TRK #8790 9880 0901<br/>Contains: Ready Time, Pickup Window, Driver Dispatch Link<br/>Attachments: AWB-879098800901.pdf, Invoice-879098800901.pdf
    end
```

---

## 7. Multi-Sheet ExcelJS Export Architecture

The reporting engine provides deep, multi-worksheet Excel spreadsheets configured for customer audit, customs reconciliation, and internal logistics telemetry:

```mermaid
flowchart TD
    REQ["Export Query Request (ExcelReportFilterQuery)"] --> AUTH{"Check User Role"}
    AUTH -->|CUSTOMER| ORG_FILTER["Enforce organizationId = user.orgId"]
    AUTH -->|ADMIN / EMPLOYEE| CUSTOM_FILTER["Apply Optional Tenant Filter"]

    ORG_FILTER --> BUILDER["excelService.ts (ExcelJS Workbook)"]
    CUSTOM_FILTER --> BUILDER

    BUILDER --> S1["Sheet 1: Shipment Overview<br/>- Creation & Ship Date<br/>- Tracking & Form 0430 Code<br/>- Origin / Destination Hubs<br/>- Actual vs Volumetric Weight<br/>- Pricing & Surcharges"]
    BUILDER --> S2["Sheet 2: Commodities & HS Codes<br/>- Tracking Number<br/>- Item Description<br/>- HS Tariff Code (e.g., 98110060)<br/>- Units, Net Weight, Unit Value<br/>- Total Customs USD"]
    BUILDER --> S3["Sheet 3: Transit Milestones<br/>- Event Code (OC, PU, AF, IT, DL)<br/>- Timestamp & Hub (DACA, DXB, EWR)<br/>- Status Description<br/>- Signature & Signee Name"]

    S1 --> OUT["Formatted .xlsx File Stream<br/>(Header styling, Auto-width columns, Numeric formatting)"]
    S2 --> OUT
    S3 --> OUT
```

---

## 8. Summary of Engineering Invariants

1. **Zero `any` Policy**: Every function signature, hook state, and database response is statically typed.
2. **Single Source of Truth**: All domain statuses, codes, and units originate from `src/types/shipment.ts` and correspond 1:1 with `prisma/schema.prisma`.
3. **Print Precision**: All AWB vector barcodes and layout containers follow exact millimeter/point dimensions aligned with standard FedEx physical pouches.
4. **Fail-Safe Tenancy**: No database query for shipment or address book resources executes without an explicit `organizationId` parameter when invoked by a Customer session.
