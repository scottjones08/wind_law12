'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { mockDocuments, mockCases } from '@/lib/mock-data';
import { formatDate, formatFileSize, cn } from '@/lib/utils';
import {
  Upload,
  Search,
  Filter,
  FolderOpen,
  FileText,
  Image,
  File,
  Download,
  Trash2,
  Eye,
  MoreHorizontal,
  Grid,
  List,
} from 'lucide-react';

const documentTypeConfig: Record<string, { icon: typeof FileText; color: string; bg: string; label: string }> = {
  medical_record: { icon: FileText, color: 'text-red-600', bg: 'bg-red-100', label: 'Medical Record' },
  police_report: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Police Report' },
  insurance_document: { icon: FileText, color: 'text-green-600', bg: 'bg-green-100', label: 'Insurance' },
  correspondence: { icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Correspondence' },
  photo_evidence: { icon: Image, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Photo Evidence' },
  video_evidence: { icon: File, color: 'text-pink-600', bg: 'bg-pink-100', label: 'Video Evidence' },
  court_filing: { icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Court Filing' },
  deposition: { icon: FileText, color: 'text-cyan-600', bg: 'bg-cyan-100', label: 'Deposition' },
  expert_report: { icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Expert Report' },
  contract: { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Contract' },
  other: { icon: File, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Other' },
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [typeFilter, setTypeFilter] = useState('all');
  const [caseFilter, setCaseFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesCase = caseFilter === 'all' || doc.caseId === caseFilter;
    return matchesSearch && matchesType && matchesCase;
  });

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    ...Object.entries(documentTypeConfig).map(([value, config]) => ({
      value,
      label: config.label,
    })),
  ];

  const caseOptions = [
    { value: 'all', label: 'All Cases' },
    ...mockCases.map(c => ({
      value: c.id,
      label: c.caseNumber,
    })),
  ];

  const totalSize = mockDocuments.reduce((sum, doc) => sum + doc.fileSize, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 mt-1">
            Manage and organize all case-related documents.
          </p>
        </div>
        <Button leftIcon={<Upload className="w-4 h-4" />} onClick={() => setShowUploadModal(true)}>
          Upload Documents
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardBody className="py-4">
            <p className="text-2xl font-bold text-gray-900">{mockDocuments.length}</p>
            <p className="text-sm text-gray-500">Total Documents</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <p className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</p>
            <p className="text-sm text-gray-500">Total Storage</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <p className="text-2xl font-bold text-gray-900">
              {mockDocuments.filter(d => d.type === 'medical_record').length}
            </p>
            <p className="text-sm text-gray-500">Medical Records</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <p className="text-2xl font-bold text-gray-900">
              {new Set(mockDocuments.map(d => d.caseId)).size}
            </p>
            <p className="text-sm text-gray-500">Cases with Docs</p>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-40"
              />
              <Select
                options={caseOptions}
                value={caseFilter}
                onChange={(e) => setCaseFilter(e.target.value)}
                className="w-36"
              />
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2.5 transition-colors',
                    viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-400 hover:text-gray-600'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2.5 transition-colors border-l border-gray-300',
                    viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-400 hover:text-gray-600'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Documents */}
      {viewMode === 'list' ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Case</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => {
                  const typeConfig = documentTypeConfig[doc.type] || documentTypeConfig.other;
                  const IconComponent = typeConfig.icon;
                  const caseItem = mockCases.find(c => c.id === doc.caseId);

                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('p-2 rounded-lg', typeConfig.bg)}>
                            <IconComponent className={cn('w-5 h-5', typeConfig.color)} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            {doc.description && (
                              <p className="text-sm text-gray-500 truncate max-w-xs">{doc.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn(typeConfig.bg, typeConfig.color)}>
                          {typeConfig.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {caseItem?.caseNumber || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatFileSize(doc.fileSize)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(doc.uploadedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 hover:bg-danger-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-danger-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => {
            const typeConfig = documentTypeConfig[doc.type] || documentTypeConfig.other;
            const IconComponent = typeConfig.icon;
            const caseItem = mockCases.find(c => c.id === doc.caseId);

            return (
              <Card key={doc.id} hover className="cursor-pointer">
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn('p-3 rounded-xl', typeConfig.bg)}>
                      <IconComponent className={cn('w-6 h-6', typeConfig.color)} />
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">{doc.name}</h4>
                  <Badge className={cn(typeConfig.bg, typeConfig.color, 'mb-3')}>
                    {typeConfig.label}
                  </Badge>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>{caseItem?.caseNumber}</span>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <Card>
          <CardBody className="py-12 text-center">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No documents found matching your criteria.</p>
          </CardBody>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Documents"
        size="lg"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-400 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-1">Drop files here to upload</p>
            <p className="text-sm text-gray-500 mb-4">or click to browse from your computer</p>
            <p className="text-xs text-gray-400">PDF, DOC, JPG, PNG, ZIP up to 50MB each</p>
          </div>
          <Select
            label="Document Type"
            options={Object.entries(documentTypeConfig).map(([value, config]) => ({
              value,
              label: config.label,
            }))}
            placeholder="Select document type"
          />
          <Select
            label="Case"
            options={mockCases.map(c => ({
              value: c.id,
              label: `${c.caseNumber} - ${c.title}`,
            }))}
            placeholder="Select case"
          />
          <Input label="Description" placeholder="Brief description of the document(s)" />
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
          <Button>Upload Documents</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
