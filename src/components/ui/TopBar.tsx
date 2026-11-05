// src/components/ui/TopBar.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Search,
  Bell,
  Package,
  Layers,
  DollarSign,
  Truck,
  HelpCircle,
  Phone,
  Mail,
  Users,
  LogOut,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Menu,
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import type { UserRole } from '@/types/shipment';

interface TopBarProps {
  readonly title: string;
  readonly userRole: UserRole;
  readonly userName: string;
  readonly onMenuToggle: () => void;
  readonly onSignOut?: () => void;
}

export function TopBar({
  title,
  userRole,
  userName,
  onMenuToggle,
  onSignOut,
}: TopBarProps): React.JSX.Element {
  const router = useRouter();

  // Active open dropdown menu: 'shipping' | 'tracking' | 'support' | 'account' | 'user' | 'search' | 'notifications' | null
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState<string>('');
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName: string) => {
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = searchVal.trim().replace(/\s+/g, '');
    if (cleaned) {
      router.push(`/tracking?query=${encodeURIComponent(cleaned)}`);
      setActiveMenu(null);
      setSearchVal('');
    }
  };

  const displayName = userName || 'AFAZ';

  return (
    <header
      ref={menuContainerRef}
      className="fixed inset-x-0 top-0 z-40 bg-white/95 backdrop-blur-md text-slate-800 select-none border-b border-slate-200/90 shadow-xs h-14"
    >
      <div className="w-full px-4 sm:px-6 h-full flex items-center justify-between">
        {/* ─────────────────────────────────────────────────────────────
            LEFT SECTION: Mobile Toggle + NTGX Logo + Nav Dropdowns
            ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
          {/* Mobile Sidebar Hamburger Toggle */}
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="Toggle sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* NTGX Brand Logo */}
          <Link href="/dashboard" className="flex items-center shrink-0">
            <BrandLogo size="md" variant="dark" />
          </Link>

          {title && (
            <span className="hidden xl:inline text-xs font-semibold text-slate-400 pl-3 border-l border-slate-200">
              {title}
            </span>
          )}

          {/* Primary Top Navigation Dropdowns (Light, Executive styling) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 text-xs font-semibold text-slate-600">
            {/* 1. SHIPPING DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('shipping')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  activeMenu === 'shipping'
                    ? 'bg-red-50 text-ntgx-red font-bold'
                    : 'hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span>Shipping</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    activeMenu === 'shipping' ? 'rotate-180 text-ntgx-red' : 'text-slate-400'
                  }`}
                />
              </button>

              {activeMenu === 'shipping' && (
                <div className="absolute left-0 top-full mt-1.5 w-60 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/shipments/new"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-red-50 text-ntgx-red">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Create Shipment</div>
                      <div className="text-[10px] text-slate-400">Outbound 3-page AWB</div>
                    </div>
                  </Link>

                  <Link
                    href="/shipments"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Shipments Manifest</div>
                      <div className="text-[10px] text-slate-400">All outbound parcels</div>
                    </div>
                  </Link>

                  <Link
                    href="/shipments"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Batch Shipping</div>
                      <div className="text-[10px] text-slate-400">Multi-parcel manifests</div>
                    </div>
                  </Link>

                  <div className="my-1.5 border-t border-slate-100" />

                  <Link
                    href="/admin/rates"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Shipping Rates &amp; Zones</div>
                      <div className="text-[10px] text-slate-400">Dimensional rate cards</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. TRACKING DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('tracking')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  activeMenu === 'tracking'
                    ? 'bg-red-50 text-ntgx-red font-bold'
                    : 'hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span>Tracking</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    activeMenu === 'tracking' ? 'rotate-180 text-ntgx-red' : 'text-slate-400'
                  }`}
                />
              </button>

              {activeMenu === 'tracking' && (
                <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/tracking"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-red-50 text-ntgx-red">
                      <Search className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Track a Shipment</div>
                      <div className="text-[10px] text-slate-400">12-Digit Mod-11 query</div>
                    </div>
                  </Link>

                  <Link
                    href="/tracking?query=879098800901"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Reference Parcel (Delivered)</div>
                      <div className="text-[10px] text-slate-500 font-mono">TRK# 8790 9880 0901</div>
                    </div>
                  </Link>

                  <div className="my-1.5 border-t border-slate-100" />

                  <Link
                    href="/reports"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Performance Reports</div>
                      <div className="text-[10px] text-slate-400">Export cross-tenant Excel</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. SUPPORT DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('support')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  activeMenu === 'support'
                    ? 'bg-red-50 text-ntgx-red font-bold'
                    : 'hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span>Support</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    activeMenu === 'support' ? 'rotate-180 text-ntgx-red' : 'text-slate-400'
                  }`}
                />
              </button>

              {activeMenu === 'support' && (
                <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/support"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-red-50 text-ntgx-red">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Help Center &amp; Guides</div>
                      <div className="text-[10px] text-slate-400">AWB Form 0430 &amp; Customs FAQs</div>
                    </div>
                  </Link>

                  <div className="my-1.5 border-t border-slate-100" />

                  <div className="px-4 py-2 text-slate-600">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      <span>24/7 Hotline</span>
                    </div>
                    <div className="text-2xs text-slate-500 mt-0.5 font-mono">+880 1989-451709</div>
                  </div>

                  <div className="px-4 py-2 text-slate-600">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Mail className="h-3.5 w-3.5 text-blue-600" />
                      <span>Email Operations</span>
                    </div>
                    <div className="text-2xs text-slate-500 mt-0.5">operations@ntgx.com</div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. ACCOUNT DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('account')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  activeMenu === 'account'
                    ? 'bg-red-50 text-ntgx-red font-bold'
                    : 'hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span>Account</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    activeMenu === 'account' ? 'rotate-180 text-ntgx-red' : 'text-slate-400'
                  }`}
                />
              </button>

              {activeMenu === 'account' && (
                <div className="absolute left-0 top-full mt-1.5 w-60 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/admin/users"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-red-50 text-ntgx-red">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">User Management</div>
                      <div className="text-[10px] text-slate-400">KYC approval queue</div>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Operations Dashboard</div>
                      <div className="text-[10px] text-slate-400">KPI metrics &amp; stats</div>
                    </div>
                  </Link>

                  <div className="my-1.5 border-t border-slate-100" />

                  {onSignOut ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenu(null);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors text-left font-bold"
                    >
                      <LogOut className="h-4 w-4" />
                      <div>Sign Out</div>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors font-bold"
                    >
                      <LogOut className="h-4 w-4" />
                      <div>Sign In / Switch</div>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT SECTION: User Profile + Search Modal + 99+ Bell
            ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
          {/* User Profile Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu('user')}
              className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-full pl-3 pr-1.5 py-1 transition-all"
            >
              <span className="font-bold tracking-wide text-xs">{displayName}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            </button>

            {/* User Profile Dropdown Card */}
            {activeMenu === 'user' && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-2xl p-4 z-50 text-xs ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-ntgx-red text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    {displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="font-extrabold text-slate-900 truncate">{displayName}</div>
                    <span className="text-2xs text-slate-600 font-mono uppercase bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-0.5 font-semibold">
                      {userRole}
                    </span>
                  </div>
                </div>

                <div className="pt-3 space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center justify-between text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-2.5 py-2 rounded-lg transition-colors font-medium"
                  >
                    <span>Operations Dashboard</span>
                    <span className="text-2xs text-slate-400">&rarr;</span>
                  </Link>

                  <Link
                    href="/admin/users"
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center justify-between text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-2.5 py-2 rounded-lg transition-colors font-medium"
                  >
                    <span>User Management</span>
                    <span className="text-2xs text-slate-400">&rarr;</span>
                  </Link>

                  <div className="pt-2 border-t border-slate-100 mt-2">
                    {onSignOut ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenu(null);
                          onSignOut();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-ntgx-red rounded-lg font-bold transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" /> Sign Out
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setActiveMenu(null)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-ntgx-red rounded-lg font-bold transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" /> Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu('search')}
              aria-label="Search"
              className={`p-2 rounded-lg transition-colors ${
                activeMenu === 'search'
                  ? 'bg-red-50 text-ntgx-red'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Quick Search Popover */}
            {activeMenu === 'search' && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-2xl p-4 z-50 text-xs ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
                <form onSubmit={handleSearchSubmit} className="space-y-3">
                  <div className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                    Track Shipment Telemetry
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      placeholder="Enter 12-digit TRK# (e.g. 8790 9880 0901)"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono focus:bg-white focus:border-ntgx-red focus:ring-1 focus:ring-ntgx-red focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-ntgx-red hover:bg-ntgx-redHover text-white font-bold rounded-lg transition-colors text-xs shadow-xs"
                    >
                      Track
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-2xs text-slate-500 pt-1">
                    <span>Quick:</span>
                    <button
                      type="button"
                      onClick={() => {
                        router.push('/tracking?query=879098800901');
                        setActiveMenu(null);
                      }}
                      className="font-mono text-slate-700 hover:text-ntgx-red underline"
                    >
                      8790 9880 0901
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        router.push('/tracking?query=879098800902');
                        setActiveMenu(null);
                      }}
                      className="font-mono text-slate-700 hover:text-ntgx-red underline"
                    >
                      8790 9880 0902
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Notifications Trigger Button (With 99+ Badge) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu('notifications')}
              aria-label="Notifications"
              className={`relative p-2 rounded-lg transition-colors ${
                activeMenu === 'notifications'
                  ? 'bg-red-50 text-ntgx-red'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-ntgx-red text-[10px] font-bold text-white shadow-xs">
                99+
              </span>
            </button>

            {/* Notifications Popover */}
            {activeMenu === 'notifications' && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-2xl p-4 z-50 text-xs ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Bell className="h-4 w-4 text-ntgx-red" /> Operations Alerts (99+)
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono font-bold">
                    Live
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2 space-y-1">
                  <Link
                    href="/tracking?query=879098800901"
                    onClick={() => setActiveMenu(null)}
                    className="block p-2.5 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-2xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Delivered Successfully
                    </div>
                    <div className="text-slate-800 mt-0.5 font-medium">
                      TRK# 8790 9880 0901 signed by D. Salman in New York.
                    </div>
                    <div className="text-slate-400 text-[10px] mt-0.5 font-mono">2 mins ago</div>
                  </Link>

                  <Link
                    href="/tracking?query=879098800903"
                    onClick={() => setActiveMenu(null)}
                    className="block p-2.5 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-2 text-blue-700 font-bold text-2xs">
                      <Truck className="h-3.5 w-3.5" /> Out for Delivery
                    </div>
                    <div className="text-slate-800 mt-0.5 font-medium">
                      TRK# 8790 9880 0903 with Dhaka local courier on schedule.
                    </div>
                    <div className="text-slate-400 text-[10px] mt-0.5 font-mono">14 mins ago</div>
                  </Link>

                  <Link
                    href="/admin/users"
                    onClick={() => setActiveMenu(null)}
                    className="block p-2.5 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-2 text-amber-700 font-bold text-2xs">
                      <AlertTriangle className="h-3.5 w-3.5" /> KYC Approval Required
                    </div>
                    <div className="text-slate-800 mt-0.5 font-medium">
                      Bengal Knitwear Exports Ltd. registered new account.
                    </div>
                    <div className="text-slate-400 text-[10px] mt-0.5 font-mono">38 mins ago</div>
                  </Link>

                  <Link
                    href="/shipments"
                    onClick={() => setActiveMenu(null)}
                    className="block p-2.5 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-2xs">
                      <Clock className="h-3.5 w-3.5 text-ntgx-red" /> Dual Dispatch Confirmation
                    </div>
                    <div className="text-slate-800 mt-0.5 font-medium">
                      AWB Form 0430 &amp; Invoice emailed to client and office operations.
                    </div>
                    <div className="text-slate-400 text-[10px] mt-0.5 font-mono">1 hour ago</div>
                  </Link>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-2xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => alert('All notifications marked as read.')}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Mark all as read
                  </button>
                  <Link
                    href="/reports"
                    onClick={() => setActiveMenu(null)}
                    className="text-ntgx-red hover:underline font-bold"
                  >
                    View All Audit Logs &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
