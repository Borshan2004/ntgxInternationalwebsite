// src/app/(auth)/register/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiPost } from '@/lib/apiClient';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type BusinessType = 'LLC' | 'Corporation' | 'Partnership' | 'SoleProprietorship' | 'Other';

interface CompanyInfo {
  companyName: string;
  businessType: BusinessType | '';
  taxId: string;
  phone: string;
  address: string;
}

interface ContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterPayload {
  company: Omit<CompanyInfo, 'businessType'> & { businessType: BusinessType };
  contact: Omit<ContactPerson, 'confirmPassword'>;
}

interface RegisterResponse {
  message: string;
  userId: string;
}

type Step = 1 | 2 | 3;

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

const BUSINESS_TYPES: BusinessType[] = [
  'LLC',
  'Corporation',
  'Partnership',
  'SoleProprietorship',
  'Other',
];

export default function RegisterPage(): React.JSX.Element {
  const [step, setStep] = useState<Step>(1);

  const [company, setCompany] = useState<CompanyInfo>({
    companyName: '',
    businessType: '',
    taxId: '',
    phone: '',
    address: '',
  });

  const [contact, setContact] = useState<ContactPerson>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* ---- handlers ---- */

  function handleCompanyChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  }

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
    if (name === 'confirmPassword' || name === 'password') {
      setPasswordError(null);
    }
  }

  function handleStep1Next(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    setStep(2);
  }

  function handleStep2Next(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (contact.password !== contact.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (contact.password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    setPasswordError(null);
    setStep(3);
  }

  async function handleFinalSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!company.businessType) {
      setErrorMessage('Please select a business type.');
      setIsLoading(false);
      return;
    }

    const payload: RegisterPayload = {
      company: {
        companyName: company.companyName,
        businessType: company.businessType as BusinessType,
        taxId: company.taxId,
        phone: company.phone,
        address: company.address,
      },
      contact: {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        password: contact.password,
      },
    };

    const response = await apiPost<RegisterResponse>('/api/auth/register', payload);

    if (response.error || response.status === 0) {
      setErrorMessage(response.error ?? 'Registration failed. Please try again.');
    } else if (response.status >= 400) {
      setErrorMessage(
        (response.data as RegisterResponse | null)?.message ?? 'Registration error.'
      );
    } else {
      setSuccessMessage(
        `Account created! Awaiting approval. (User ID: ${response.data?.userId ?? '—'})`
      );
    }

    setIsLoading(false);
  }

  /* ---- step indicator ---- */
  function StepIndicator(): React.JSX.Element {
    const steps: { label: string; num: Step }[] = [
      { label: 'Company', num: 1 },
      { label: 'Contact', num: 2 },
      { label: 'Review', num: 3 },
    ];
    return (
      <div className="flex items-center justify-center gap-0 mb-8">
        {steps.map(({ label, num }, idx) => (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  step >= num
                    ? 'bg-brand-purple border-brand-purple text-white'
                    : 'bg-white border-neutral-border text-neutral-textSecondary'
                }`}
              >
                {num}
              </div>
              <span className="mt-1 text-xs text-neutral-textSecondary">{label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 mb-4 mx-1 transition-colors ${
                  step > num ? 'bg-brand-purple' : 'bg-neutral-border'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  /* ---- success screen ---- */
  if (successMessage) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-neutral-textPrimary">Account Created!</h2>
        <p className="mt-2 text-sm text-neutral-textSecondary">{successMessage}</p>
        <p className="mt-1 text-sm text-neutral-textSecondary">Awaiting admin approval.</p>
        <div className="mt-6">
          <Link href="/pending-approval">
            <Button variant="primary" size="md">
              View Approval Status
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ---- main render ---- */
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-neutral-textPrimary">Create Account</h1>
        <p className="mt-1 text-sm text-neutral-textSecondary">
          Register your company for NTGX Enterprise
        </p>
      </div>

      <StepIndicator />

      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Step 1: Company Info */}
      {step === 1 && (
        <form onSubmit={handleStep1Next} className="space-y-4">
          <Input
            label="Company Name"
            name="companyName"
            value={company.companyName}
            onChange={handleCompanyChange}
            placeholder="Acme Logistics Inc."
            required
          />
          <div className="w-full">
            <label
              htmlFor="businessType"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-textSecondary mb-1.5"
            >
              Business Type <span className="text-red-500">*</span>
            </label>
            <select
              id="businessType"
              name="businessType"
              value={company.businessType}
              onChange={handleCompanyChange}
              required
              className="block w-full rounded-md border border-neutral-border bg-white px-3 py-2 text-sm text-neutral-textPrimary focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
            >
              <option value="" disabled>
                Select business type
              </option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Tax ID / EIN"
            name="taxId"
            value={company.taxId}
            onChange={handleCompanyChange}
            placeholder="12-3456789"
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={company.phone}
            onChange={handleCompanyChange}
            placeholder="+1 (555) 000-0000"
            required
          />
          <Input
            label="Business Address"
            name="address"
            value={company.address}
            onChange={handleCompanyChange}
            placeholder="123 Main St, City, State 00000"
            required
          />
          <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
            Next: Contact Info →
          </Button>
        </form>
      )}

      {/* Step 2: Contact Person */}
      {step === 2 && (
        <form onSubmit={handleStep2Next} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={contact.firstName}
              onChange={handleContactChange}
              placeholder="Jane"
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={contact.lastName}
              onChange={handleContactChange}
              placeholder="Doe"
              required
            />
          </div>
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={contact.email}
            onChange={handleContactChange}
            placeholder="jane@company.com"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={contact.password}
            onChange={handleContactChange}
            placeholder="Min. 8 characters"
            required
            helperText="Must be at least 8 characters"
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={contact.confirmPassword}
            onChange={handleContactChange}
            placeholder="Repeat password"
            required
            error={passwordError ?? undefined}
          />
          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              ← Back
            </Button>
            <Button type="submit" variant="primary" size="lg" className="flex-1">
              Next: Review →
            </Button>
          </div>
        </form>
      )}

      {/* Step 3: KYC / Review */}
      {step === 3 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          {/* Summary */}
          <div className="rounded-lg border border-neutral-border bg-neutral-50 p-4 space-y-3 text-sm">
            <div>
              <span className="font-semibold text-neutral-textSecondary uppercase text-xs tracking-wider">
                Company
              </span>
              <p className="text-neutral-textPrimary font-medium mt-0.5">{company.companyName}</p>
              <p className="text-neutral-textSecondary">{company.businessType} · {company.taxId}</p>
              <p className="text-neutral-textSecondary">{company.address}</p>
            </div>
            <div className="border-t border-neutral-border pt-3">
              <span className="font-semibold text-neutral-textSecondary uppercase text-xs tracking-wider">
                Contact
              </span>
              <p className="text-neutral-textPrimary font-medium mt-0.5">
                {contact.firstName} {contact.lastName}
              </p>
              <p className="text-neutral-textSecondary">{contact.email}</p>
            </div>
          </div>

          {/* KYC Notice */}
          <div className="rounded-lg border border-brand-orange/30 bg-brand-orange/5 px-4 py-4">
            <div className="flex gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-neutral-textPrimary">KYC Verification Required</p>
                <p className="mt-1 text-xs text-neutral-textSecondary">
                  Your account is pending admin approval. Our compliance team will review your KYC
                  documents within <strong>24–48 business hours</strong>. You will receive an email
                  notification once your account is activated.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setStep(2)}
            >
              ← Back
            </Button>
            <Button type="submit" variant="primary" size="lg" className="flex-1" isLoading={isLoading}>
              Submit Registration
            </Button>
          </div>
        </form>
      )}

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-neutral-textSecondary">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-brand-purple hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
