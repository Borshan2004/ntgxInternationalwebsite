'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/Sidebar';
import { TopBar } from '@/components/ui/TopBar';
import type { UserRole } from '@/types/shipment';
import type { AuthUser } from '@/types/auth';

interface UserSessionState {
  readonly role: UserRole;
  readonly userName: string;
  readonly organizationName: string;
}

const DEFAULT_SESSION: UserSessionState = {
  role: 'ADMIN',
  userName: 'System Administrator',
  organizationName: 'NTGX Express & Freight',
};

const PAGE_TITLE_MAP: Readonly<Record<string, string>> = {
  '/dashboard': 'Operations Dashboard',
  '/shipments/new': 'Create New Shipment',
  '/shipments': 'Shipment Manifest & Tracking',
  '/tracking': 'Live Telemetry & Milestones',
  '/reports': 'Logistics Reports & Analytics',
  '/admin/users': 'User Management & KYC Approvals',
  '/admin/rates': 'Shipping Zones & Rate Cards',
  '/support': 'Customer Support & Help Center',
};

function resolveTitle(pathname: string): string {
  if (PAGE_TITLE_MAP[pathname] !== undefined) return PAGE_TITLE_MAP[pathname];
  for (const [key, val] of Object.entries(PAGE_TITLE_MAP)) {
    if (pathname.startsWith(key + '/')) return val;
  }
  return 'Dashboard';
}

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [session, setSession] = useState<UserSessionState>(DEFAULT_SESSION);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fedex_user_session');
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed.role && parsed.name) {
          setSession({
            role: parsed.role,
            userName: parsed.name,
            organizationName: parsed.organizationName || 'NTGX Express & Freight',
          });
        }
      }
    } catch {
      // Storage parsing fallback
    }

    void fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user) {
          const u = data.user as AuthUser;
          setSession({
            role: u.role,
            userName: u.name,
            organizationName: u.organizationName || 'NTGX Express & Freight',
          });
        }
      })
      .catch(() => {
        // Offline / fallback to current state
      });
  }, []);

  const handleToggleCollapse = (): void => {
    setIsCollapsed((prev) => !prev);
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await fetch('/api/auth/session', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fedex_user_session');
    }
    router.push('/login');
  };

  const pageTitle = resolveTitle(pathname);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <TopBar
        title={pageTitle}
        userRole={session.role}
        userName={session.userName}
        onMenuToggle={handleToggleCollapse}
        onSignOut={handleSignOut}
      />
      <div className="flex flex-1 pt-14 overflow-hidden">
        <Sidebar
          currentPath={pathname}
          userRole={session.role}
          userName={session.userName}
          organizationName={session.organizationName}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        <main className="flex-1 overflow-y-auto bg-slate-50/70">
          <div className={pathname === '/shipments/new' ? 'p-0 sm:p-2 lg:p-4' : 'p-6'}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
