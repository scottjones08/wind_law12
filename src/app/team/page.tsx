'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Select } from '@/components/ui/Select';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { mockUsers, mockCases, mockTasks } from '@/lib/mock-data';
import { formatDate, formatPhone, getFullName, cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Mail,
  Phone,
  Briefcase,
  CheckSquare,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserCog,
} from 'lucide-react';

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
  admin: { label: 'Administrator', color: 'text-purple-700', bg: 'bg-purple-100' },
  attorney: { label: 'Attorney', color: 'text-blue-700', bg: 'bg-blue-100' },
  paralegal: { label: 'Paralegal', color: 'text-green-700', bg: 'bg-green-100' },
  case_manager: { label: 'Case Manager', color: 'text-orange-700', bg: 'bg-orange-100' },
  intake_specialist: { label: 'Intake Specialist', color: 'text-teal-700', bg: 'bg-teal-100' },
  receptionist: { label: 'Receptionist', color: 'text-gray-700', bg: 'bg-gray-100' },
};

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const filteredMembers = mockUsers.filter(user => {
    const matchesSearch =
      getFullName(user.firstName, user.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getMemberStats = (userId: string) => {
    const cases = mockCases.filter(c => c.leadAttorneyId === userId || c.assignedStaff.includes(userId));
    const tasks = mockTasks.filter(t => t.assignedTo === userId);
    const pendingTasks = tasks.filter(t => t.status !== 'completed');
    return { cases: cases.length, tasks: tasks.length, pendingTasks: pendingTasks.length };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500 mt-1">
            Manage your team members and their roles.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Add Team Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
            <p className="text-sm text-gray-500">Team Members</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {mockUsers.filter(u => u.role === 'attorney' || u.role === 'admin').length}
            </p>
            <p className="text-sm text-gray-500">Attorneys</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {mockUsers.filter(u => u.role === 'paralegal' || u.role === 'case_manager').length}
            </p>
            <p className="text-sm text-gray-500">Support Staff</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {mockUsers.filter(u => u.isActive).length}
            </p>
            <p className="text-sm text-gray-500">Active Members</p>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Select
              options={[
                { value: 'all', label: 'All Roles' },
                ...Object.entries(roleConfig).map(([value, config]) => ({
                  value,
                  label: config.label,
                })),
              ]}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-44"
            />
          </div>
        </CardBody>
      </Card>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const role = roleConfig[member.role] || roleConfig.receptionist;
          const stats = getMemberStats(member.id);

          return (
            <Card key={member.id} hover>
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      firstName={member.firstName}
                      lastName={member.lastName}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getFullName(member.firstName, member.lastName)}
                      </h3>
                      <Badge className={cn(role.bg, role.color)}>
                        {role.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                    {selectedMember === member.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setSelectedMember(null)} />
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                            <UserCog className="w-4 h-4" />
                            Permissions
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 w-full">
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {member.email}
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {formatPhone(member.phone)}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{stats.cases}</p>
                    <p className="text-xs text-gray-500">Cases</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                      <CheckSquare className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{stats.tasks}</p>
                    <p className="text-xs text-gray-500">Tasks</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                      <CheckSquare className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-lg font-semibold text-orange-600">{stats.pendingTasks}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Add Team Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Team Member"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" placeholder="Enter first name" />
            <Input label="Last Name" placeholder="Enter last name" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email" type="email" placeholder="email@windlaw.com" />
            <Input label="Phone" placeholder="(804) 555-0123" />
          </div>
          <Select
            label="Role"
            options={Object.entries(roleConfig).map(([value, config]) => ({
              value,
              label: config.label,
            }))}
            placeholder="Select role"
          />
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Permissions
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                <span className="text-gray-700">Can manage cases</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                <span className="text-gray-700">Can access billing</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                <span className="text-gray-700">Can manage team</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                <span className="text-gray-700">Can view reports</span>
              </label>
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button>Add Member</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
