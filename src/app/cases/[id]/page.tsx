'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockCases, mockDocuments, mockTasks, mockUsers, mockEvents } from '@/lib/mock-data';
import {
  caseStatusConfig,
  caseTypeLabels,
  priorityConfig,
  formatCurrency,
  formatDate,
  formatSmartDate,
  daysUntil,
  cn,
  getFullName,
} from '@/lib/utils';
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  CheckSquare,
  MessageSquare,
  AlertTriangle,
  Plus,
  Upload,
  Phone,
  Mail,
  Building,
  Shield,
  Scale,
  TrendingUp,
  Users,
  Gavel,
} from 'lucide-react';
import type { CaseStatus } from '@/types';

const caseStages: CaseStatus[] = ['intake', 'investigation', 'demand', 'negotiation', 'litigation', 'trial', 'settled'];

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const caseItem = mockCases.find(c => c.id === id);

  if (!caseItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold text-gray-900">Case Not Found</h2>
        <p className="text-gray-500 mt-2">The case you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/cases">
          <Button variant="secondary" className="mt-4" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Cases
          </Button>
        </Link>
      </div>
    );
  }

  const statusConfig = caseStatusConfig[caseItem.status];
  const priorityConf = priorityConfig[caseItem.priority];
  const solDays = daysUntil(caseItem.statuteOfLimitations);
  const totalDamages = caseItem.medicalExpenses + caseItem.lostWages + caseItem.otherDamages;

  const caseDocs = mockDocuments.filter(d => d.caseId === caseItem.id);
  const caseTasks = mockTasks.filter(t => t.caseId === caseItem.id);
  const caseEvents = mockEvents.filter(e => e.caseId === caseItem.id);

  const currentStageIndex = caseStages.indexOf(caseItem.status as CaseStatus);
  const stageProgress = ((currentStageIndex + 1) / caseStages.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cases">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{caseItem.caseNumber}</h1>
              <Badge className={cn(statusConfig.bgColor, statusConfig.color)}>
                {statusConfig.label}
              </Badge>
              <Badge className={cn(priorityConf.bgColor, priorityConf.color)}>
                {priorityConf.label} Priority
              </Badge>
            </div>
            <p className="text-gray-500 mt-1">{caseItem.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leftIcon={<Edit className="w-4 h-4" />}>
            Edit Case
          </Button>
          <Button variant="ghost">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Case Progress */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Case Progress</h3>
            <span className="text-sm text-gray-500">{Math.round(stageProgress)}% complete</span>
          </div>
          <div className="relative">
            <ProgressBar value={stageProgress} size="lg" />
            <div className="flex justify-between mt-3">
              {caseStages.map((stage, index) => {
                const stageConfig = caseStatusConfig[stage];
                const isComplete = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <div key={stage} className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                        isComplete ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400',
                        isCurrent && 'ring-2 ring-primary-200'
                      )}
                    >
                      {index + 1}
                    </div>
                    <span className={cn(
                      'text-xs mt-1',
                      isCurrent ? 'text-primary-600 font-medium' : 'text-gray-400'
                    )}>
                      {stageConfig.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Alert Banner for SOL */}
      {solDays <= 90 && (
        <div className={cn(
          'rounded-lg p-4 flex items-center gap-3',
          solDays <= 30 ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'
        )}>
          <AlertTriangle className={cn('w-5 h-5', solDays <= 30 ? 'text-red-600' : 'text-orange-600')} />
          <div>
            <p className={cn('font-medium', solDays <= 30 ? 'text-red-800' : 'text-orange-800')}>
              Statute of Limitations Approaching
            </p>
            <p className={cn('text-sm', solDays <= 30 ? 'text-red-600' : 'text-orange-600')}>
              {solDays} days remaining until {formatDate(caseItem.statuteOfLimitations)}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Client</h3>
            </CardHeader>
            <CardBody>
              {caseItem.client && (
                <Link href={`/clients/${caseItem.client.id}`} className="block">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Avatar
                      firstName={caseItem.client.firstName}
                      lastName={caseItem.client.lastName}
                      size="lg"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {getFullName(caseItem.client.firstName, caseItem.client.lastName)}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {caseItem.client.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </CardBody>
          </Card>

          {/* Incident Details */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Incident Details</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Scale className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Case Type</p>
                  <p className="text-sm text-gray-900">{caseTypeLabels[caseItem.caseType]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Incident Date</p>
                  <p className="text-sm text-gray-900">{formatDate(caseItem.incidentDate)}</p>
                </div>
              </div>
              {caseItem.incidentLocation && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{caseItem.incidentLocation}</p>
                  </div>
                </div>
              )}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{caseItem.incidentDescription}</p>
              </div>
            </CardBody>
          </Card>

          {/* Financials */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Financials</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Medical Expenses</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(caseItem.medicalExpenses)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lost Wages</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(caseItem.lostWages)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Other Damages</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(caseItem.otherDamages)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="text-sm font-semibold text-gray-900">Total Damages</span>
                <span className="text-sm font-bold text-green-600">
                  {formatCurrency(totalDamages)}
                </span>
              </div>
              {caseItem.demandAmount && (
                <div className="flex justify-between pt-2">
                  <span className="text-sm text-gray-600">Demand Amount</span>
                  <span className="text-sm font-medium text-primary-600">
                    {formatCurrency(caseItem.demandAmount)}
                  </span>
                </div>
              )}
              {caseItem.settlementAmount && (
                <div className="flex justify-between bg-green-50 -mx-6 -mb-6 mt-3 px-6 py-4 rounded-b-xl">
                  <span className="text-sm font-semibold text-green-800">Settlement</span>
                  <span className="text-sm font-bold text-green-600">
                    {formatCurrency(caseItem.settlementAmount)}
                  </span>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Case Team</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {caseItem.leadAttorney && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar
                      firstName={caseItem.leadAttorney.firstName}
                      lastName={caseItem.leadAttorney.lastName}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getFullName(caseItem.leadAttorney.firstName, caseItem.leadAttorney.lastName)}
                      </p>
                      <p className="text-xs text-gray-500">Lead Attorney</p>
                    </div>
                  </div>
                </div>
              )}
              {caseItem.assignedStaff.map((staffId) => {
                const staff = mockUsers.find(u => u.id === staffId);
                if (!staff) return null;
                return (
                  <div key={staffId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar firstName={staff.firstName} lastName={staff.lastName} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getFullName(staff.firstName, staff.lastName)}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {staff.role.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Card>
            <Tabs defaultValue="overview">
              <CardHeader className="pb-0">
                <TabsList>
                  <TabsTrigger value="overview" icon={<TrendingUp className="w-4 h-4" />}>
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="documents" icon={<FileText className="w-4 h-4" />}>
                    Documents ({caseDocs.length})
                  </TabsTrigger>
                  <TabsTrigger value="tasks" icon={<CheckSquare className="w-4 h-4" />}>
                    Tasks ({caseTasks.length})
                  </TabsTrigger>
                  <TabsTrigger value="parties" icon={<Users className="w-4 h-4" />}>
                    Parties
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardBody>
                <TabsContent value="overview" className="mt-4">
                  <div className="space-y-6">
                    {/* Key Dates */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Key Dates</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">Statute of Limitations</span>
                          </div>
                          <p className={cn(
                            'font-semibold',
                            solDays <= 90 ? 'text-orange-600' : 'text-gray-900'
                          )}>
                            {formatDate(caseItem.statuteOfLimitations)}
                          </p>
                          <p className="text-xs text-gray-400">{solDays} days remaining</p>
                        </div>
                        {caseItem.nextCourtDate && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                              <Gavel className="w-4 h-4" />
                              <span className="text-xs">Next Court Date</span>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {formatDate(caseItem.nextCourtDate)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upcoming Events */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Upcoming Events</h4>
                      {caseEvents.length > 0 ? (
                        <div className="space-y-2">
                          {caseEvents.slice(0, 3).map((event) => (
                            <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="p-2 bg-primary-100 rounded-lg">
                                <Calendar className="w-4 h-4 text-primary-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                <p className="text-xs text-gray-500">{formatSmartDate(event.startTime)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No upcoming events</p>
                      )}
                    </div>

                    {/* Notes */}
                    {caseItem.notes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                          {caseItem.notes}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    {caseItem.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {caseItem.tags.map((tag) => (
                            <Badge key={tag} variant="gray">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Case Documents</h4>
                    <Button size="sm" leftIcon={<Upload className="w-4 h-4" />} onClick={() => setShowUploadModal(true)}>
                      Upload
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {caseDocs.length > 0 ? (
                      caseDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200">
                              <FileText className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-400">
                                Uploaded {formatDate(doc.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="gray">{doc.type.replace('_', ' ')}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No documents uploaded yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Case Tasks</h4>
                    <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowAddTaskModal(true)}>
                      Add Task
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {caseTasks.length > 0 ? (
                      caseTasks.map((task) => {
                        const taskPriority = priorityConfig[task.priority];
                        return (
                          <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <input
                              type="checkbox"
                              checked={task.status === 'completed'}
                              className="mt-1 w-4 h-4 text-primary-600 rounded border-gray-300"
                              readOnly
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className={cn(
                                  'text-sm font-medium',
                                  task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'
                                )}>
                                  {task.title}
                                </p>
                                <Badge className={cn(taskPriority.bgColor, taskPriority.color)}>
                                  {taskPriority.label}
                                </Badge>
                              </div>
                              {task.dueDate && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Due: {formatSmartDate(task.dueDate)}
                                </p>
                              )}
                            </div>
                            {task.assignee && (
                              <Avatar
                                firstName={task.assignee.firstName}
                                lastName={task.assignee.lastName}
                                size="xs"
                              />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No tasks for this case</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="parties" className="mt-4">
                  <div className="space-y-6">
                    {/* Defendants */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Defendants</h4>
                      <div className="space-y-2">
                        {caseItem.defendants.map((defendant) => (
                          <div key={defendant.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-red-100 rounded-lg">
                                {defendant.type === 'company' ? (
                                  <Building className="w-4 h-4 text-red-600" />
                                ) : (
                                  <User className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{defendant.name}</p>
                                {defendant.attorney && (
                                  <p className="text-sm text-gray-500">
                                    Attorney: {defendant.attorney}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Insurance Companies */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Insurance Companies</h4>
                      <div className="space-y-2">
                        {caseItem.insuranceCompanies.length > 0 ? (
                          caseItem.insuranceCompanies.map((insurance) => (
                            <div key={insurance.id} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Shield className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{insurance.name}</p>
                                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                                    {insurance.claimNumber && (
                                      <p>Claim #: {insurance.claimNumber}</p>
                                    )}
                                    {insurance.adjusterName && (
                                      <p>Adjuster: {insurance.adjusterName}</p>
                                    )}
                                    {insurance.policyLimit && (
                                      <p>Policy Limit: {formatCurrency(insurance.policyLimit)}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic">No insurance information</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardBody>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        title="Add Task"
      >
        <div className="space-y-4">
          <Input label="Task Title" placeholder="Enter task title" />
          <Input label="Description" placeholder="Enter task description" />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
            <Input label="Due Date" type="date" />
          </div>
          <Select
            label="Assign To"
            options={mockUsers.map(u => ({
              value: u.id,
              label: getFullName(u.firstName, u.lastName),
            }))}
          />
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAddTaskModal(false)}>Cancel</Button>
          <Button>Add Task</Button>
        </ModalFooter>
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Drag and drop files here, or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOC, JPG, PNG up to 50MB</p>
          </div>
          <Select
            label="Document Type"
            options={[
              { value: 'medical_record', label: 'Medical Record' },
              { value: 'police_report', label: 'Police Report' },
              { value: 'insurance_document', label: 'Insurance Document' },
              { value: 'correspondence', label: 'Correspondence' },
              { value: 'photo_evidence', label: 'Photo Evidence' },
              { value: 'court_filing', label: 'Court Filing' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Input label="Description" placeholder="Brief description of the document" />
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
          <Button>Upload</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
