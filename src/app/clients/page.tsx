'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { mockClients, mockCases } from '@/lib/mock-data';
import { formatDate, formatPhone, getFullName } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Briefcase,
} from 'lucide-react';

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Filter clients based on search
  const filteredClients = mockClients.filter(client => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = getFullName(client.firstName, client.lastName).toLowerCase();
    return (
      fullName.includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchQuery)
    );
  });

  // Get case count for each client
  const getClientCaseCount = (clientId: string) => {
    return mockCases.filter(c => c.clientId === clientId).length;
  };

  const getClientActiveCases = (clientId: string) => {
    return mockCases.filter(c => c.clientId === clientId && c.status !== 'closed' && c.status !== 'dismissed').length;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">
            Manage your client relationships and contact information.
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowNewClientModal(true)}
        >
          Add Client
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search clients by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
                Filters
              </Button>
              <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                Export
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Clients Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Cases</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => {
              const caseCount = getClientCaseCount(client.id);
              const activeCases = getClientActiveCases(client.id);

              return (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        firstName={client.firstName}
                        lastName={client.lastName}
                        size="md"
                      />
                      <div>
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {getFullName(client.firstName, client.lastName)}
                        </Link>
                        <p className="text-sm text-gray-500 capitalize">
                          Prefers {client.preferredContactMethod}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <a href={`mailto:${client.email}`} className="text-gray-600 hover:text-primary-600">
                          {client.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <a href={`tel:${client.phone}`} className="text-gray-600 hover:text-primary-600">
                          {formatPhone(client.phone)}
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {client.address.city}, {client.address.state}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {caseCount} {caseCount === 1 ? 'case' : 'cases'}
                      </span>
                      {activeCases > 0 && (
                        <Badge variant="info">{activeCases} active</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDate(client.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <button
                        onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                      {selectedClient === client.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setSelectedClient(null)}
                          />
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
                            <Link
                              href={`/clients/${client.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </Link>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                              <Edit className="w-4 h-4" />
                              Edit Client
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 w-full">
                              <Trash2 className="w-4 h-4" />
                              Delete Client
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* New Client Modal */}
      <Modal
        isOpen={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        title="Add New Client"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="First Name" placeholder="Enter first name" />
          <Input label="Last Name" placeholder="Enter last name" />
          <Input label="Email" type="email" placeholder="client@email.com" />
          <Input label="Phone" placeholder="(804) 555-0123" />
          <Input label="Alternate Phone" placeholder="(804) 555-0124" />
          <Input label="Date of Birth" type="date" />
          <div className="md:col-span-2">
            <Input label="Street Address" placeholder="123 Main Street" />
          </div>
          <Input label="City" placeholder="Richmond" />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="State"
              options={[
                { value: 'VA', label: 'Virginia' },
                { value: 'MD', label: 'Maryland' },
                { value: 'DC', label: 'Washington DC' },
                { value: 'NC', label: 'North Carolina' },
              ]}
              placeholder="Select state"
            />
            <Input label="ZIP Code" placeholder="23220" />
          </div>
          <Select
            label="Preferred Contact"
            options={[
              { value: 'phone', label: 'Phone' },
              { value: 'email', label: 'Email' },
              { value: 'text', label: 'Text Message' },
            ]}
            placeholder="Select preference"
          />
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowNewClientModal(false)}>
            Cancel
          </Button>
          <Button>Add Client</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
