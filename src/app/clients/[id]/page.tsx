'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { mockClients, mockCases, mockDocuments } from '@/lib/mock-data';
import {
  formatDate,
  formatPhone,
  getFullName,
  caseStatusConfig,
  caseTypeLabels,
  formatCurrency,
} from '@/lib/utils';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  MessageSquare,
  User,
  Clock,
  DollarSign,
} from 'lucide-react';

// Mock communications data
const mockCommunications_data: Array<{
  id: string;
  type: 'phone' | 'email';
  direction: 'inbound' | 'outbound';
  subject: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}> = [
  {
    id: '1',
    type: 'phone',
    direction: 'outbound',
    subject: 'Case Status Update',
    content: 'Called to discuss settlement offer from insurance company.',
    createdBy: '1',
    createdAt: new Date('2024-12-14T10:30:00'),
  },
  {
    id: '2',
    type: 'email',
    direction: 'inbound',
    subject: 'Re: Medical Records Request',
    content: 'Client sent updated medical records from recent doctor visit.',
    createdBy: '3',
    createdAt: new Date('2024-12-12T14:15:00'),
  },
];

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const client = mockClients.find(c => c.id === id);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold text-gray-900">Client Not Found</h2>
        <p className="text-gray-500 mt-2">The client you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/clients">
          <Button variant="secondary" className="mt-4" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Clients
          </Button>
        </Link>
      </div>
    );
  }

  const clientCases = mockCases.filter(c => c.clientId === client.id);
  const clientDocuments = mockDocuments.filter(d =>
    clientCases.some(c => c.id === d.caseId)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Avatar
              firstName={client.firstName}
              lastName={client.lastName}
              size="lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getFullName(client.firstName, client.lastName)}
              </h1>
              <p className="text-gray-500">
                Client since {formatDate(client.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <Button leftIcon={<Edit className="w-4 h-4" />}>Edit Client</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Client Info */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900">Contact Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href={`mailto:${client.email}`} className="text-sm text-primary-600 hover:underline">
                    {client.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <a href={`tel:${client.phone}`} className="text-sm text-primary-600 hover:underline">
                    {formatPhone(client.phone)}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm text-gray-900">
                    {client.address.street}<br />
                    {client.address.city}, {client.address.state} {client.address.zipCode}
                  </p>
                </div>
              </div>
              {client.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm text-gray-900">{formatDate(client.dateOfBirth)}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Preferred Contact</p>
                  <p className="text-sm text-gray-900 capitalize">{client.preferredContactMethod}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900">Summary</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{clientCases.length}</p>
                  <p className="text-xs text-gray-500">Total Cases</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {clientCases.filter(c => c.status !== 'closed' && c.status !== 'dismissed').length}
                  </p>
                  <p className="text-xs text-gray-500">Active Cases</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      clientCases.reduce((sum, c) => sum + (c.settlementAmount || 0), 0)
                    )}
                  </p>
                  <p className="text-xs text-gray-500">Total Recovered</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{clientDocuments.length}</p>
                  <p className="text-xs text-gray-500">Documents</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Card>
            <Tabs defaultValue="cases">
              <CardHeader className="pb-0">
                <TabsList>
                  <TabsTrigger value="cases" icon={<Briefcase className="w-4 h-4" />}>
                    Cases ({clientCases.length})
                  </TabsTrigger>
                  <TabsTrigger value="documents" icon={<FileText className="w-4 h-4" />}>
                    Documents ({clientDocuments.length})
                  </TabsTrigger>
                  <TabsTrigger value="communications" icon={<MessageSquare className="w-4 h-4" />}>
                    Communications
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardBody>
                <TabsContent value="cases" className="mt-4">
                  <div className="space-y-4">
                    {clientCases.length === 0 ? (
                      <div className="text-center py-8">
                        <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No cases found for this client</p>
                      </div>
                    ) : (
                      clientCases.map((caseItem) => {
                        const statusConfig = caseStatusConfig[caseItem.status];
                        return (
                          <Link
                            key={caseItem.id}
                            href={`/cases/${caseItem.id}`}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{caseItem.caseNumber}</p>
                                <Badge className={`${statusConfig.bgColor} ${statusConfig.color}`}>
                                  {statusConfig.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{caseItem.title}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {caseTypeLabels[caseItem.caseType]} • Incident: {formatDate(caseItem.incidentDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(caseItem.medicalExpenses + caseItem.lostWages + caseItem.otherDamages)}
                              </p>
                              <p className="text-xs text-gray-400">Total Damages</p>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  <div className="space-y-2">
                    {clientDocuments.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No documents found</p>
                      </div>
                    ) : (
                      clientDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200">
                              <FileText className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-400">{formatDate(doc.uploadedAt)}</p>
                            </div>
                          </div>
                          <Badge variant="gray">{doc.type.replace('_', ' ')}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="communications" className="mt-4">
                  <div className="space-y-4">
                    {mockCommunications_data.map((comm) => (
                      <div key={comm.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-lg ${comm.direction === 'inbound' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {comm.type === 'phone' ? (
                            <Phone className={`w-4 h-4 ${comm.direction === 'inbound' ? 'text-blue-600' : 'text-green-600'}`} />
                          ) : (
                            <Mail className={`w-4 h-4 ${comm.direction === 'inbound' ? 'text-blue-600' : 'text-green-600'}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{comm.subject}</p>
                            <span className="text-xs text-gray-400">{formatDate(comm.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{comm.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </CardBody>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
