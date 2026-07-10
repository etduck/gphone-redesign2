import React, { useState } from 'react';
import { Search, UserPlus, Edit2, Trash2, X, Check, Phone, ArrowUpRight } from 'lucide-react';
import { Contact, AiRole } from '../types';

interface PhonebookProps {
  contacts: Contact[];
  aiRoles: AiRole[];
  onAddContact: (contact: Omit<Contact, 'id' | 'callCount' | 'lastCall'>) => void;
  onDeleteContact: (id: string) => void;
  onUpdateContact: (contact: Contact) => void;
}

export default function Phonebook({
  contacts,
  aiRoles,
  onAddContact,
  onDeleteContact,
  onUpdateContact,
}: PhonebookProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Form states for new contact
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newRole, setNewRole] = useState(aiRoles[0]?.name || '无');
  const [newStatus, setNewStatus] = useState<'在线' | '离线' | '待命'>('在线');
  const [newNotes, setNewNotes] = useState('');

  // Search filter
  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.number.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.notes.toLowerCase().includes(q)
    );
  });

  const handleOpenAddModal = () => {
    setNewName('');
    setNewNumber('');
    setNewRole(aiRoles[0]?.name || '无');
    setNewStatus('在线');
    setNewNotes('');
    setIsAddModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newNumber.trim()) {
      alert('请填写姓名和号码！');
      return;
    }
    onAddContact({
      name: newName,
      number: newNumber,
      role: newRole,
      status: newStatus,
      notes: newNotes,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-8 overflow-y-auto flex gap-6">
      {/* Left major table list */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900" id="phonebook-title">
              电话簿
            </h2>
            <p className="font-sans text-xs text-slate-400 mt-1">
              管理系统联系人，配置绑定专职 AI 角色，查看历史交互概况
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-black hover:bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded shadow-sm transition-all duration-150"
            id="btn-add-contact"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + 新增联系人
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="搜索姓名、电话号码、关联角色或备注..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Contacts Table Card */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    姓名
                  </th>
                  <th className="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    号码
                  </th>
                  <th className="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    绑定AI角色
                  </th>
                  <th className="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    通话次数
                  </th>
                  <th className="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    最后通话时间
                  </th>
                  <th className="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    状态
                  </th>
                  <th className="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase text-right">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-slate-400 font-sans">
                      暂无匹配的联系人
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-slate-50' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-sans font-medium text-slate-900">{contact.name}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-sm text-slate-600">{contact.number}</span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-sans font-medium">
                          {contact.role}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-sm text-slate-500">
                        {contact.callCount}
                      </td>
                      <td className="p-4 font-sans text-xs text-slate-500">
                        {contact.lastCall}
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-xs font-sans">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              contact.status === '在线'
                                ? 'bg-emerald-500'
                                : contact.status === '待命'
                                ? 'bg-amber-500'
                                : 'bg-slate-300'
                            }`}
                          />
                          {contact.status}
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                            title="详情"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteContact(contact.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Details Panel (Interactive) */}
      <div className="w-80 shrink-0 bg-white border border-slate-200 rounded-lg p-6 h-fit self-start">
        {selectedContact ? (
          <div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-sans font-semibold text-slate-900 text-lg">联系人详情</h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-sans text-xl font-semibold border border-slate-200 mb-3">
                {selectedContact.name[0]}
              </div>
              <h4 className="font-sans font-semibold text-slate-900 text-base">
                {selectedContact.name}
              </h4>
              <p className="font-mono text-xs text-slate-400 mt-1">{selectedContact.number}</p>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-4 text-sm">
              <div>
                <p className="font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  当前绑定 AI 角色
                </p>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2 rounded">
                  <span className="font-sans text-xs font-medium text-slate-700">
                    {selectedContact.role}
                  </span>
                </div>
              </div>

              <div>
                <p className="font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  备注信息
                </p>
                <p className="font-sans text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded border border-slate-100/60">
                  {selectedContact.notes || '暂无备注'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    累计通话
                  </p>
                  <p className="font-mono font-semibold text-slate-800 text-sm">
                    {selectedContact.callCount} 次
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    最后联系
                  </p>
                  <p className="font-sans text-slate-500 text-xs truncate">
                    {selectedContact.lastCall}
                  </p>
                </div>
              </div>

              <button
                onClick={() => alert(`正在呼叫 ${selectedContact.name}...`)}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-slate-950 text-white font-medium text-xs py-2.5 rounded transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                立即建立通话
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 font-sans text-sm">
            点击列表中的联系人查看详细参数与控制
          </div>
        )}
      </div>

      {/* Add Contact Modal Dialog (Custom popup for high fidelity experience) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans font-semibold text-slate-900 text-lg">新增联系人</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  姓名 *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="请输入姓名"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  电话号码 *
                </label>
                <input
                  type="text"
                  required
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="请输入电话号码"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  绑定 AI 角色
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-950 focus:outline-none focus:border-black transition-colors"
                >
                  <option value="无">无分配角色</option>
                  {aiRoles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  状态
                </label>
                <div className="flex gap-4">
                  {(['在线', '离线', '待命'] as const).map((status) => (
                    <label key={status} className="flex items-center gap-1.5 cursor-pointer text-sm font-sans text-slate-700">
                      <input
                        type="radio"
                        name="status"
                        checked={newStatus === status}
                        onChange={() => setNewStatus(status)}
                        className="text-black focus:ring-black"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  备注说明
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="输入联系人补充信息..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-4 py-2 rounded transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-black hover:bg-slate-950 text-white text-xs font-medium px-4 py-2 rounded transition-colors"
                >
                  确定保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
