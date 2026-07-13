"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ClipboardCheck,
  FileStack,
  LayoutDashboard,
  MapPin,
  PanelLeftClose,
  PanelLeft,
  Settings,
} from "lucide-react"

import { BrandMark } from "@/components/brand-mark"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OrgSwitcher } from "@/components/layout/org-switcher"

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/app/inspections", label: "Inspections", icon: ClipboardCheck },
  { href: "/app/templates", label: "Templates", icon: FileStack },
  { href: "/app/sites", label: "Sites", icon: MapPin },
  { href: "/app/settings", label: "Settings", icon: Settings },
]

type AppSidebarProps = {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function AppSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 lg:static",
          collapsed ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          {collapsed ? (
            <BrandMark compact iconOnly />
          ) : (
            <div className="flex min-w-0 items-center gap-2">
              <BrandMark compact iconOnly />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Qualti.io</p>
                <p className="truncate text-xs text-muted-foreground">Inspection platform</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-3">
          <OrgSwitcher collapsed={collapsed} />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="hidden border-t border-sidebar-border p-3 lg:block">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={onToggle}
          >
            {collapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <>
                <PanelLeftClose className="size-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </>
  )
}
