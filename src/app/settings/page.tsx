'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';
import {
  Building2,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Upload,
  Download,
  Trash2,
  Key,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your firm settings and preferences.
          </p>
        </div>
        <Button
          leftIcon={saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          onClick={handleSave}
          className={cn(saved && 'bg-green-600 hover:bg-green-700')}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <Card>
        <Tabs defaultValue="firm">
          <CardHeader className="pb-0">
            <TabsList>
              <TabsTrigger value="firm" icon={<Building2 className="w-4 h-4" />}>
                Firm Profile
              </TabsTrigger>
              <TabsTrigger value="account" icon={<User className="w-4 h-4" />}>
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" icon={<Bell className="w-4 h-4" />}>
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" icon={<Shield className="w-4 h-4" />}>
                Security
              </TabsTrigger>
              <TabsTrigger value="integrations" icon={<Database className="w-4 h-4" />}>
                Integrations
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardBody>
            {/* Firm Profile */}
            <TabsContent value="firm" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Firm Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Firm Name" defaultValue="Wind Law, LLC" />
                  <Input label="Website" defaultValue="www.windinjurylaw.com" leftIcon={<Globe className="w-4 h-4" />} />
                  <Input label="Phone" defaultValue="(804) 773-3815" leftIcon={<Phone className="w-4 h-4" />} />
                  <Input label="Email" defaultValue="info@windlaw.com" leftIcon={<Mail className="w-4 h-4" />} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Office</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Input label="Street Address" defaultValue="5400-D Glenside Dr" />
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="City" defaultValue="Richmond" />
                    <Select
                      label="State"
                      options={[{ value: 'VA', label: 'Virginia' }]}
                      defaultValue="VA"
                    />
                    <Input label="ZIP" defaultValue="23228" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding</h3>
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-primary-600 rounded-xl flex items-center justify-center mb-2">
                      <span className="text-3xl font-bold text-white">WL</span>
                    </div>
                    <Button variant="secondary" size="sm" leftIcon={<Upload className="w-4 h-4" />}>
                      Upload Logo
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-600 border border-gray-200" />
                        <Input defaultValue="#1e40af" className="w-32" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-500 border border-gray-200" />
                        <Input defaultValue="#f59e0b" className="w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="account" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" defaultValue="Ryan" />
                  <Input label="Last Name" defaultValue="Wind" />
                  <Input label="Email" defaultValue="ryan.wind@windlaw.com" type="email" />
                  <Input label="Phone" defaultValue="(804) 773-3815" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Timezone"
                    options={[
                      { value: 'EST', label: 'Eastern Time (EST)' },
                      { value: 'CST', label: 'Central Time (CST)' },
                      { value: 'MST', label: 'Mountain Time (MST)' },
                      { value: 'PST', label: 'Pacific Time (PST)' },
                    ]}
                    defaultValue="EST"
                  />
                  <Select
                    label="Date Format"
                    options={[
                      { value: 'mdy', label: 'MM/DD/YYYY' },
                      { value: 'dmy', label: 'DD/MM/YYYY' },
                      { value: 'ymd', label: 'YYYY-MM-DD' },
                    ]}
                    defaultValue="mdy"
                  />
                  <Select
                    label="Default Dashboard View"
                    options={[
                      { value: 'overview', label: 'Overview' },
                      { value: 'cases', label: 'Cases Focus' },
                      { value: 'tasks', label: 'Tasks Focus' },
                    ]}
                    defaultValue="overview"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { label: 'New lead received', description: 'Get notified when a new lead comes in' },
                    { label: 'Task assigned', description: 'Notify when a task is assigned to you' },
                    { label: 'Deadline reminders', description: '24-hour reminder before deadlines' },
                    { label: 'Settlement updates', description: 'Updates on settlement negotiations' },
                    { label: 'Document uploads', description: 'When new documents are added to your cases' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SOL Reminders</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-center gap-2 mb-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                      <span className="font-medium text-gray-900">90 Days Before</span>
                    </label>
                    <p className="text-sm text-gray-500">First reminder</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-center gap-2 mb-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                      <span className="font-medium text-gray-900">30 Days Before</span>
                    </label>
                    <p className="text-sm text-gray-500">Second reminder</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-center gap-2 mb-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                      <span className="font-medium text-gray-900">7 Days Before</span>
                    </label>
                    <p className="text-sm text-gray-500">Urgent reminder</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="max-w-md space-y-4">
                  <Input label="Current Password" type="password" placeholder="Enter current password" />
                  <Input label="New Password" type="password" placeholder="Enter new password" />
                  <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
                  <Button>Update Password</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Two-factor authentication is enabled</p>
                      <p className="text-sm text-gray-500">Using authenticator app</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Configure</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {[
                    { device: 'MacBook Pro - Chrome', location: 'Richmond, VA', current: true },
                    { device: 'iPhone 14 - Safari', location: 'Richmond, VA', current: false },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {session.device}
                          {session.current && (
                            <span className="ml-2 text-xs text-green-600">(current)</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{session.location}</p>
                      </div>
                      {!session.current && (
                        <Button variant="ghost" size="sm" className="text-danger-600">
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Integrations */}
            <TabsContent value="integrations" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Services</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Google Calendar', description: 'Sync events and appointments', connected: true },
                    { name: 'Microsoft 365', description: 'Email and document integration', connected: true },
                    { name: 'QuickBooks', description: 'Accounting and invoicing', connected: false },
                    { name: 'DocuSign', description: 'Electronic signatures', connected: false },
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.description}</p>
                      </div>
                      <Button
                        variant={service.connected ? 'secondary' : 'primary'}
                        size="sm"
                      >
                        {service.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Download className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Export Data</p>
                        <p className="text-sm text-gray-500">Download all your data</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Export</Button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Upload className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Import Data</p>
                        <p className="text-sm text-gray-500">Import from another system</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Import</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardBody>
        </Tabs>
      </Card>
    </div>
  );
}
