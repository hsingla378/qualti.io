'use client';

import { Building2, ShieldCheck, Users } from 'lucide-react';
import { currentOrg, currentUser, teamMembers } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { useHasPermission } from '@/features/auth/hooks';
import { Permission } from '@/features/auth/permissions';
import Link from 'next/link';

export default function SettingsPage() {
  const canReadAudit = useHasPermission(Permission.AuditRead);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your organization, team, and account preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-muted-foreground" />
              <CardTitle>Organization</CardTitle>
            </div>
            <CardDescription>Basic organization details and branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization name</Label>
              <Input id="org-name" defaultValue={currentOrg.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-slug">URL slug</Label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                  qualti.io/
                </span>
                <Input id="org-slug" className="rounded-l-none" defaultValue={currentOrg.slug} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Current plan</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {currentOrg.plan} · Billed monthly
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {currentOrg.plan}
              </Badge>
            </div>
            <Button>Save changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Full name</Label>
              <Input id="user-name" defaultValue={currentUser.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input id="user-email" type="email" defaultValue={currentUser.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Input id="user-role" defaultValue={currentUser.role} disabled />
            </div>
            <Button>Update profile</Button>
          </CardContent>
        </Card>

        {canReadAudit ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-muted-foreground" />
                <CardTitle>Audit log</CardTitle>
              </div>
              <CardDescription>
                Review sign-ins, organization events, and site changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/app/settings/audit-log">View audit log</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-muted-foreground" />
            <div>
              <CardTitle>Team members</CardTitle>
              <CardDescription>
                {teamMembers.length} members in {currentOrg.name}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Invite member
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="hidden px-6 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Role</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b last:border-0">
                    <td className="px-6 py-4 font-medium">{member.name}</td>
                    <td className="hidden px-6 py-4 text-muted-foreground sm:table-cell">
                      {member.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
