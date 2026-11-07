// src/services/emailService.ts
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import type { ShipmentEntityDTO } from '@/types/shipment';

export interface DualEmailDispatchPayload {
  readonly trackingNumberFormatted: string;
  readonly clientEmail: string;
  readonly companyOperationsEmail: string;
  readonly senderCompanyOrName: string;
  readonly recipientCompanyOrName: string;
  readonly destinationCityCountry: string;
  readonly serviceTier: string;
  readonly chargeableWeightKg: number;
  readonly pickupDate: string;
  readonly pickupWindow: string; // e.g. "08:00 AM - 01:30 PM"
  readonly awbDownloadUrl: string;
  readonly invoiceDownloadUrl: string;
  readonly trackingUrl: string;
}

export interface DualEmailDispatchResult {
  readonly clientEmailSent: boolean;
  readonly companyEmailSent: boolean;
  readonly clientEmail: string;
  readonly companyEmail: string;
  readonly clientSubject: string;
  readonly companySubject: string;
  readonly dispatchedAt: string;
  readonly deliveryMode: 'LIVE_SMTP' | 'LIVE_RESEND' | 'SIMULATED_DISPATCH';
  readonly errorMessage?: string;
}

export class EmailNotificationService {
  /**
   * Generates high-conversion, professional HTML email templates for Client & Operations
   */
  private static generateClientHtml(payload: DualEmailDispatchPayload): string {
    return `
      <div style="font-family: Inter, Arial, sans-serif; color: #111827; max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; background-color: #FFFFFF;">
        <div style="background-color: #08172B; padding: 22px 28px; border-bottom: 4px solid #E51B23;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">
            NTGX <span style="color: #E51B23;">EXPRESS &amp; FREIGHT</span>
          </h1>
          <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
            Global Logistics Telemetry &bull; Dhaka Hub
          </p>
        </div>
        <div style="padding: 28px;">
          <h2 style="color: #08172B; font-size: 19px; margin-top: 0; font-weight: 800;">
            Your Shipment Has Been Finalized
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #374151;">Dear Customer,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #374151;">
            Thank you for shipping with NTGX Express &amp; Freight. Your international export consignment has been registered in the global manifest registry with tracking number:
          </p>
          
          <div style="background-color: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; padding: 14px 20px; text-align: center; margin: 20px 0;">
            <div style="font-size: 11px; font-weight: 700; color: #991B1B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
              Mod-11 Consignment Number
            </div>
            <div style="font-size: 24px; font-weight: 900; color: #E51B23; font-family: monospace; letter-spacing: 2px;">
              ${payload.trackingNumberFormatted}
            </div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px;">
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; color: #64748B; font-weight: 500;">Consignee / Recipient:</td>
              <td style="padding: 10px 0; font-weight: 700; color: #0F172A;">${payload.recipientCompanyOrName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; color: #64748B; font-weight: 500;">Destination:</td>
              <td style="padding: 10px 0; font-weight: 700; color: #0F172A;">${payload.destinationCityCountry}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; color: #64748B; font-weight: 500;">Service Tier:</td>
              <td style="padding: 10px 0; font-weight: 700; color: #0F172A;">${payload.serviceTier}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; color: #64748B; font-weight: 500;">Chargeable Weight:</td>
              <td style="padding: 10px 0; font-weight: 700; color: #0F172A;">${payload.chargeableWeightKg} KG</td>
            </tr>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; color: #64748B; font-weight: 500;">Scheduled Pickup:</td>
              <td style="padding: 10px 0; font-weight: 700; color: #0F172A;">${payload.pickupDate} (${payload.pickupWindow})</td>
            </tr>
          </table>

          <div style="margin: 28px 0; text-align: center;">
            <a href="${payload.trackingUrl}" style="background-color: #E51B23; color: #FFFFFF; padding: 13px 26px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(229, 27, 35, 0.3);">
              Track Live Milestone Scan &rarr;
            </a>
          </div>

          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px 18px; margin-top: 20px;">
            <div style="font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 6px;">Official PDF Documentation:</div>
            <a href="${payload.awbDownloadUrl}" style="color: #E51B23; font-weight: 600; text-decoration: underline; font-size: 13px; display: inline-block; margin-right: 16px;">
              &bull; Download 3-Page Air Waybill (Form 0430)
            </a>
            <a href="${payload.invoiceDownloadUrl}" style="color: #334155; font-weight: 600; text-decoration: underline; font-size: 13px; display: inline-block;">
              &bull; Download Commercial Invoice
            </a>
          </div>
        </div>
        <div style="background-color: #08172B; padding: 16px 28px; font-size: 11px; color: #94A3B8; text-align: center;">
          &copy; ${new Date().getFullYear()} NTGX Express &amp; Freight Logistics. All rights reserved.<br />
          Uttara Sector 4, Airport Road, Dhaka-1230, Bangladesh &bull; Hotline: +880 1681 637836
        </div>
      </div>
    `;
  }

  private static generateCompanyHtml(payload: DualEmailDispatchPayload): string {
    return `
      <div style="font-family: Inter, Arial, sans-serif; color: #111827; max-width: 650px; margin: 0 auto; border: 1px solid #CBD5E1; border-radius: 12px; overflow: hidden; background-color: #FFFFFF;">
        <div style="background-color: #08172B; padding: 20px 28px; border-bottom: 4px solid #E51B23;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 18px; font-weight: 800;">
            NTGX OPERATIONS DISPATCH DESK ALERT
          </h1>
          <p style="color: #F87171; margin: 4px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase;">
            ACTION REQUIRED: NEW EXPORT SHIPMENT TENDERED
          </p>
        </div>
        <div style="padding: 24px;">
          <div style="background-color: #FEF2F2; border-left: 4px solid #E51B23; padding: 14px 18px; border-radius: 4px; margin-bottom: 20px;">
            <strong style="color: #991B1B;">Dispatch Order:</strong> Consignment <strong style="font-family: monospace; color: #E51B23;">${payload.trackingNumberFormatted}</strong> has been finalized by client. Schedule courier pickup accordingly.
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 8px 0; color: #64748B; font-weight: 600; width: 40%;">Shipper / Client:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #0F172A;">${payload.senderCompanyOrName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Client Contact Email:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #E51B23;">${payload.clientEmail}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Consignee / Destination:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #0F172A;">${payload.recipientCompanyOrName} (${payload.destinationCityCountry})</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Service Level:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #0F172A;">${payload.serviceTier}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Total Chargeable Weight:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #0F172A;">${payload.chargeableWeightKg} KG</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Scheduled Pickup:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #0F172A;">${payload.pickupDate} (${payload.pickupWindow})</td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #E2E8F0; display: flex; gap: 12px;">
            <a href="${payload.awbDownloadUrl}" style="background-color: #08172B; color: #FFFFFF; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 12px; display: inline-block;">
              Print 3-Page Air Waybill
            </a>
            &nbsp;&nbsp;
            <a href="${payload.invoiceDownloadUrl}" style="background-color: #F1F5F9; color: #0F172A; border: 1px solid #CBD5E1; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 12px; display: inline-block;">
              Print Commercial Invoice
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Dynamically retrieves environment variables from process.env or directly parses .env on disk.
   */
  private static getEnvConfig(): {
    smtpHost?: string;
    smtpPort?: number;
    smtpSecure?: boolean;
    smtpUser?: string;
    smtpPass?: string;
    emailFrom?: string;
    resendKey?: string;
  } {
    let host = process.env.SMTP_HOST;
    let port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    let secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : undefined;
    let user = process.env.SMTP_USER;
    let pass = process.env.SMTP_PASS;
    let from = process.env.EMAIL_FROM;
    let resend = process.env.RESEND_API_KEY;

    // If SMTP_HOST or SMTP_USER is missing, dynamically read .env from disk
    if (!host || !user || !pass) {
      try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, 'utf8') as string;
          for (const line of content.split(/\r?\n/)) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const match = trimmed.match(/^([A-Za-z0-9_]+)\s*=\s*"?([^"]*)"?$/);
            if (match) {
              const [, k, v] = match;
              if (k === 'SMTP_HOST' && !host) host = v;
              if (k === 'SMTP_PORT' && !port) port = Number(v);
              if (k === 'SMTP_SECURE' && secure === undefined) secure = v === 'true';
              if (k === 'SMTP_USER' && !user) user = v;
              if (k === 'SMTP_PASS' && !pass) pass = v;
              if (k === 'EMAIL_FROM' && !from) from = v;
              if (k === 'RESEND_API_KEY' && !resend) resend = v;
            }
          }
        }
      } catch {
        // ignore disk read errors
      }
    }

    return {
      smtpHost: host,
      smtpPort: port ?? 465,
      smtpSecure: secure ?? true,
      smtpUser: user,
      smtpPass: pass ? pass.replace(/\s+/g, '') : undefined,
      emailFrom: from,
      resendKey: resend,
    };
  }

  /**
   * Sends simultaneous transactional emails to the Client and Company Operations.
   */
  public static async sendShipmentFinalizedEmails(
    payload: DualEmailDispatchPayload
  ): Promise<DualEmailDispatchResult> {
    const clientSubject = `NTGX Shipment Confirmation & Tracking: #${payload.trackingNumberFormatted}`;
    const companySubject = `[NEW SHIPMENT DISPATCHED] Client: ${payload.senderCompanyOrName} - TRK #${payload.trackingNumberFormatted}`;

    const clientHtml = this.generateClientHtml(payload);
    const companyHtml = this.generateCompanyHtml(payload);

    const env = this.getEnvConfig();

    // 1. Try Standard SMTP (Gmail, Brevo, SendGrid, Zoho, Hostinger, cPanel)
    if (env.smtpHost && env.smtpUser && env.smtpPass) {
      try {
        const fromAddress = env.emailFrom ?? `"NTGX Express & Freight" <${env.smtpUser}>`;

        // If company email is placeholder @company.com, route office alert safely to smtpUser
        const targetCompanyEmail =
          payload.companyOperationsEmail.includes('@company.com') ||
          payload.companyOperationsEmail.includes('@example.com')
            ? env.smtpUser
            : payload.companyOperationsEmail;

        const transporter = nodemailer.createTransport({
          host: env.smtpHost,
          port: env.smtpPort,
          secure: env.smtpSecure,
          auth: {
            user: env.smtpUser,
            pass: env.smtpPass,
          },
        });

        // Send both emails individually to avoid one recipient failure impacting the other
        const sendClient = transporter.sendMail({
          from: fromAddress,
          to: payload.clientEmail,
          subject: clientSubject,
          html: clientHtml,
        });

        const sendCompany = transporter.sendMail({
          from: fromAddress,
          to: targetCompanyEmail,
          subject: companySubject,
          html: companyHtml,
        });

        const [clientRes, companyRes] = await Promise.allSettled([sendClient, sendCompany]);

        const clientSent = clientRes.status === 'fulfilled';
        const companySent = companyRes.status === 'fulfilled';

        // eslint-disable-next-line no-console
        console.log(
          `[EmailNotificationService] LIVE SMTP result -> Client (${payload.clientEmail}): ${clientSent}, Company (${targetCompanyEmail}): ${companySent}`
        );

        if (!clientSent) {
          // eslint-disable-next-line no-console
          console.error('[EmailNotificationService] Client email failed:', (clientRes as PromiseRejectedResult).reason);
        }
        if (!companySent) {
          // eslint-disable-next-line no-console
          console.error('[EmailNotificationService] Company email failed:', (companyRes as PromiseRejectedResult).reason);
        }

        return {
          clientEmailSent: clientSent,
          companyEmailSent: companySent,
          clientEmail: payload.clientEmail,
          companyEmail: targetCompanyEmail,
          clientSubject,
          companySubject,
          dispatchedAt: new Date().toISOString(),
          deliveryMode: 'LIVE_SMTP',
        };
      } catch (smtpErr) {
        const errMessage = smtpErr instanceof Error ? smtpErr.message : String(smtpErr);
        // eslint-disable-next-line no-console
        console.error('[EmailNotificationService] SMTP dispatch error:', errMessage);

        return {
          clientEmailSent: false,
          companyEmailSent: false,
          clientEmail: payload.clientEmail,
          companyEmail: payload.companyOperationsEmail,
          clientSubject,
          companySubject,
          dispatchedAt: new Date().toISOString(),
          deliveryMode: 'SIMULATED_DISPATCH',
          errorMessage: `SMTP error: ${errMessage}`,
        };
      }
    }

    // 2. Try Resend HTTP API
    const resendKey = env.resendKey;
    if (resendKey) {
      try {
        const fromAddress = env.emailFrom ?? 'onboarding@resend.dev';

        const [resClient, resCompany] = await Promise.all([
          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromAddress,
              to: payload.clientEmail,
              subject: clientSubject,
              html: clientHtml,
            }),
          }),
          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromAddress,
              to: payload.companyOperationsEmail,
              subject: companySubject,
              html: companyHtml,
            }),
          }),
        ]);

        if (resClient.ok && resCompany.ok) {
          // eslint-disable-next-line no-console
          console.log(`[EmailNotificationService] LIVE RESEND dispatched to ${payload.clientEmail} and ${payload.companyOperationsEmail}`);

          return {
            clientEmailSent: true,
            companyEmailSent: true,
            clientEmail: payload.clientEmail,
            companyEmail: payload.companyOperationsEmail,
            clientSubject,
            companySubject,
            dispatchedAt: new Date().toISOString(),
            deliveryMode: 'LIVE_RESEND',
          };
        }

        const clientErr = !resClient.ok ? await resClient.text() : '';
        const companyErr = !resCompany.ok ? await resCompany.text() : '';
        const combinedErr = `Client: ${clientErr} | Company: ${companyErr}`;
        // eslint-disable-next-line no-console
        console.error('[EmailNotificationService] Resend API error response:', combinedErr);

        return {
          clientEmailSent: false,
          companyEmailSent: false,
          clientEmail: payload.clientEmail,
          companyEmail: payload.companyOperationsEmail,
          clientSubject,
          companySubject,
          dispatchedAt: new Date().toISOString(),
          deliveryMode: 'SIMULATED_DISPATCH',
          errorMessage: `Resend error: ${combinedErr}`,
        };
      } catch (resendErr) {
        const errMessage = resendErr instanceof Error ? resendErr.message : String(resendErr);
        // eslint-disable-next-line no-console
        console.error('[EmailNotificationService] Resend fetch exception:', errMessage);

        return {
          clientEmailSent: false,
          companyEmailSent: false,
          clientEmail: payload.clientEmail,
          companyEmail: payload.companyOperationsEmail,
          clientSubject,
          companySubject,
          dispatchedAt: new Date().toISOString(),
          deliveryMode: 'SIMULATED_DISPATCH',
          errorMessage: `Resend exception: ${errMessage}`,
        };
      }
    }

    // 3. Fallback: Simulation Mode when no credentials are configured in .env
    // eslint-disable-next-line no-console
    console.log(`[EmailNotificationService (SIMULATED)] Sent to Customer (${payload.clientEmail}): ${clientSubject}`);
    // eslint-disable-next-line no-console
    console.log(`[EmailNotificationService (SIMULATED)] Sent to Office (${payload.companyOperationsEmail}): ${companySubject}`);

    return {
      clientEmailSent: true,
      companyEmailSent: true,
      clientEmail: payload.clientEmail,
      companyEmail: payload.companyOperationsEmail,
      clientSubject,
      companySubject,
      dispatchedAt: new Date().toISOString(),
      deliveryMode: 'SIMULATED_DISPATCH',
      errorMessage: 'NO_EMAIL_CREDENTIALS_CONFIGURED: Add SMTP_HOST/SMTP_USER/SMTP_PASS or RESEND_API_KEY in .env to receive real emails in your inbox.',
    };
  }
}

/**
 * Functional wrapper for shipment entity dispatches
 */
export async function dispatchShipmentFinalizedEmails(
  shipment: ShipmentEntityDTO
): Promise<DualEmailDispatchResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const pickupTimeWindow = shipment.pickupOrder
    ? `${shipment.pickupOrder.earliestTime} - ${shipment.pickupOrder.latestTime}`
    : 'Counter Drop-off';

  return EmailNotificationService.sendShipmentFinalizedEmails({
    trackingNumberFormatted: shipment.trackingNumber,
    clientEmail: shipment.senderEmail,
    companyOperationsEmail:
      shipment.notificationSettings?.companyEmail ?? 'operations@company.com',
    senderCompanyOrName: shipment.senderCompany ?? shipment.senderName,
    recipientCompanyOrName: shipment.recipientCompany ?? shipment.recipientName,
    destinationCityCountry: `${shipment.recipientCity}, ${shipment.recipientCountry}`,
    serviceTier: shipment.serviceTier,
    chargeableWeightKg: Number(shipment.totalChargeableWgtKg),
    pickupDate: shipment.pickupOrder
      ? shipment.pickupOrder.pickupDate.toISOString().split('T')[0]
      : shipment.shipDate.toISOString().split('T')[0],
    pickupWindow: pickupTimeWindow,
    awbDownloadUrl: `${appUrl}/api/documents/awb/${shipment.id}`,
    invoiceDownloadUrl: `${appUrl}/api/documents/invoice/${shipment.id}`,
    trackingUrl: `${appUrl}/tracking?query=${shipment.trackingNumber}`,
  });
}