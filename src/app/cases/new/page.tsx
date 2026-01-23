'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { caseTypeLabels } from '@/lib/utils';
import { mockUsers, mockClients } from '@/lib/mock-data';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function NewCasePage() {
  const [defendants, setDefendants] = useState([{ id: 1, name: '', type: 'individual' }]);
  const [insurance, setInsurance] = useState([{ id: 1, name: '', claimNumber: '' }]);

  const addDefendant = () => {
    setDefendants([...defendants, { id: Date.now(), name: '', type: 'individual' }]);
  };

  const removeDefendant = (id: number) => {
    setDefendants(defendants.filter(d => d.id !== id));
  };

  const addInsurance = () => {
    setInsurance([...insurance, { id: Date.now(), name: '', claimNumber: '' }]);
  };

  const removeInsurance = (id: number) => {
    setInsurance(insurance.filter(i => i.id !== id));
  };

  const caseTypeOptions = Object.entries(caseTypeLabels).map(([value, label]) => ({
    value,
    label,
  }));

  const clientOptions = mockClients.map(c => ({
    value: c.id,
    label: `${c.firstName} ${c.lastName}`,
  }));

  const attorneyOptions = mockUsers
    .filter(u => u.role === 'admin' || u.role === 'attorney')
    .map(u => ({
      value: u.id,
      label: `${u.firstName} ${u.lastName}`,
    }));

  const staffOptions = mockUsers.map(u => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName} (${u.role.replace('_', ' ')})`,
  }));

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/cases">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Case</h1>
          <p className="text-gray-500 mt-1">Create a new personal injury case</p>
        </div>
      </div>

      {/* Case Information */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Case Information</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Case Title" placeholder="e.g., Smith v. ABC Company" />
            <Select label="Case Type" options={caseTypeOptions} placeholder="Select case type" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Priority" options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]} placeholder="Select priority" />
            <Select label="Lead Source" options={[
              { value: 'website', label: 'Website' },
              { value: 'referral', label: 'Referral' },
              { value: 'google', label: 'Google' },
              { value: 'social_media', label: 'Social Media' },
              { value: 'tv_ad', label: 'TV Advertisement' },
              { value: 'other', label: 'Other' },
            ]} placeholder="Select source" />
          </div>
        </CardBody>
      </Card>

      {/* Client Selection */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Client</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Select
            label="Select Existing Client"
            options={clientOptions}
            placeholder="Choose a client or create new"
          />
          <div className="text-center text-sm text-gray-500">
            - or -
          </div>
          <Link href="/clients?new=true">
            <Button variant="secondary" leftIcon={<Plus className="w-4 h-4" />} className="w-full">
              Create New Client
            </Button>
          </Link>
        </CardBody>
      </Card>

      {/* Incident Details */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Incident Details</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Incident Date" type="date" />
            <Input label="Incident Location" placeholder="Enter location" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Incident Description
            </label>
            <textarea
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={4}
              placeholder="Describe the incident in detail..."
            />
          </div>
          <Input label="Statute of Limitations" type="date" helperText="Typically 2 years from incident date in Virginia" />
        </CardBody>
      </Card>

      {/* Defendants */}
      <Card>
        <CardHeader action={
          <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={addDefendant}>
            Add Defendant
          </Button>
        }>
          <h2 className="font-semibold text-gray-900">Defendants</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {defendants.map((defendant, index) => (
            <div key={defendant.id} className="p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Defendant {index + 1}</h4>
                {defendants.length > 1 && (
                  <button
                    onClick={() => removeDefendant(defendant.id)}
                    className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Defendant name" />
                <Select options={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'company', label: 'Company' },
                ]} placeholder="Type" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Attorney (if known)" />
                <Input placeholder="Phone number" />
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Insurance Information */}
      <Card>
        <CardHeader action={
          <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={addInsurance}>
            Add Insurance
          </Button>
        }>
          <h2 className="font-semibold text-gray-900">Insurance Information</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {insurance.map((ins, index) => (
            <div key={ins.id} className="p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Insurance Company {index + 1}</h4>
                {insurance.length > 1 && (
                  <button
                    onClick={() => removeInsurance(ins.id)}
                    className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Insurance company name" />
                <Input placeholder="Claim number" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="Adjuster name" />
                <Input placeholder="Adjuster phone" />
                <Input placeholder="Policy limit" type="number" />
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Damages */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Damages (Estimated)</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Medical Expenses" type="number" placeholder="0" leftIcon={<span className="text-gray-400">$</span>} />
            <Input label="Lost Wages" type="number" placeholder="0" leftIcon={<span className="text-gray-400">$</span>} />
            <Input label="Other Damages" type="number" placeholder="0" leftIcon={<span className="text-gray-400">$</span>} />
          </div>
        </CardBody>
      </Card>

      {/* Team Assignment */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Team Assignment</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Select
            label="Lead Attorney"
            options={attorneyOptions}
            placeholder="Select lead attorney"
          />
          <Select
            label="Assigned Staff"
            options={staffOptions}
            placeholder="Select team members"
          />
        </CardBody>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Additional Notes</h2>
        </CardHeader>
        <CardBody>
          <textarea
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={4}
            placeholder="Any additional notes about this case..."
          />
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pb-8">
        <Link href="/cases">
          <Button variant="secondary">Cancel</Button>
        </Link>
        <Button>Create Case</Button>
      </div>
    </div>
  );
}
