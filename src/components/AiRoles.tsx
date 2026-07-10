import React, { useState } from 'react';
import { Bot, Save, Plus, Trash2, Sliders, AlignLeft, BookOpen, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { AiRole, MemoryRecord } from '../types';

interface AiRolesProps {
  aiRoles: AiRole[];
  onUpdateRole: (updatedRole: AiRole) => void;
  onAddRole: (newRole: Omit<AiRole, 'id' | 'memoryLibrary'>) => void;
}

export default function AiRoles({ aiRoles, onUpdateRole, onAddRole }: AiRolesProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(aiRoles[0]?.id || '');
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isSavedNotify, setIsSavedNotify] = useState(false);

  // Form states for adding AI Role
  const [addName, setAddName] = useState('');
  const [addNum, setAddNum] = useState('');
  const [addPosition, setAddPosition] = useState('');
  const [addPrompt, setAddPrompt] = useState('');

  // Selected role object
  const activeRole = aiRoles.find((r) => r.id === selectedRoleId) || aiRoles[0];

  // Selected role form field local states (for smooth typing experience, synced to activeRole on change)
  const [localPrompt, setLocalPrompt] = useState(activeRole?.prompt || '');
  const [localPosition, setLocalPosition] = useState(activeRole?.rolePosition || '');
  const [localTemp, setLocalTemp] = useState(activeRole?.configParams?.temperature || 0.5);
  const [localMaxTokens, setLocalMaxTokens] = useState(activeRole?.configParams?.maxTokens || 1500);
  const [localPenalty, setLocalPenalty] = useState(activeRole?.configParams?.presencePenalty || 0.2);

  // Inline adding state for Memory Library
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [newMemoryDate, setNewMemoryDate] = useState('2026-07-10');
  const [newMemoryContent, setNewMemoryContent] = useState('');

  // Sync state when activeRole changes
  React.useEffect(() => {
    if (activeRole) {
      setLocalPrompt(activeRole.prompt);
      setLocalPosition(activeRole.rolePosition);
      setLocalTemp(activeRole.configParams.temperature);
      setLocalMaxTokens(activeRole.configParams.maxTokens);
      setLocalPenalty(activeRole.configParams.presencePenalty);
      setIsAddingMemory(false);
      setNewMemoryContent('');
    }
  }, [selectedRoleId]);

  const handleSaveActiveRole = () => {
    if (!activeRole) return;

    const updated: AiRole = {
      ...activeRole,
      rolePosition: localPosition,
      prompt: localPrompt,
      configParams: {
        temperature: localTemp,
        maxTokens: localMaxTokens,
        presencePenalty: localPenalty,
      },
    };

    onUpdateRole(updated);
    setIsSavedNotify(true);
    setTimeout(() => setIsSavedNotify(false), 2000);
  };

  const handleCreateRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addNum.trim()) {
      alert('请填写角色名称和绑定号码！');
      return;
    }
    onAddRole({
      name: addName,
      number: addNum,
      rolePosition: addPosition || '待定义',
      configParams: {
        temperature: 0.5,
        maxTokens: 1500,
        presencePenalty: 0.2,
      },
      prompt: addPrompt || '你是一个专业的智能客服助手。',
    });
    setIsAddRoleModalOpen(false);
    setAddName('');
    setAddNum('');
    setAddPosition('');
    setAddPrompt('');
  };

  const handleAddMemoryRecord = () => {
    if (!newMemoryContent.trim()) {
      alert('请输入记录摘要内容！');
      return;
    }
    if (!activeRole) return;

    const newRecord: MemoryRecord = {
      id: Math.random().toString(),
      date: newMemoryDate,
      content: newMemoryContent,
    };

    const updated: AiRole = {
      ...activeRole,
      memoryLibrary: [newRecord, ...activeRole.memoryLibrary],
    };

    onUpdateRole(updated);
    setIsAddingMemory(false);
    setNewMemoryContent('');
  };

  const handleDeleteMemory = (recordId: string) => {
    if (!activeRole) return;
    const updated: AiRole = {
      ...activeRole,
      memoryLibrary: activeRole.memoryLibrary.filter((m) => m.id !== recordId),
    };
    onUpdateRole(updated);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-8 overflow-y-auto">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900" id="roles-title">
            AI角色配置
          </h2>
          <p className="font-sans text-xs text-slate-400 mt-1">
            定义、微调与定制各号码绑定的专业智能 AI 角色及相关记忆库
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Role List Selector (1/3 width) */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-lg p-6 h-fit shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-sans font-semibold text-slate-900 text-base">角色列表</h3>
            <button
              onClick={() => setIsAddRoleModalOpen(true)}
              className="flex items-center gap-1.5 bg-black hover:bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded"
              id="btn-add-ai-role"
            >
              <Plus className="w-3.5 h-3.5" />
              新增 AI 角色
            </button>
          </div>

          <div className="overflow-hidden border border-slate-100 rounded-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-3 text-xs font-semibold text-slate-500 uppercase">AI角色</th>
                  <th className="p-3 text-xs font-semibold text-slate-500 uppercase text-right">号码</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {aiRoles.map((role) => {
                  const isSelected = role.id === selectedRoleId;
                  return (
                    <tr
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'bg-blue-50/50 hover:bg-blue-50 text-blue-900 font-medium border-l-2 border-blue-600'
                          : 'hover:bg-slate-50/80 text-slate-700'
                      }`}
                    >
                      <td className="p-3 flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            role.number === '404' ? 'bg-slate-300' : 'bg-emerald-500'
                          }`}
                        />
                        <span className="font-sans text-sm">{role.name}</span>
                      </td>
                      <td className="p-3 text-right font-mono text-xs text-slate-500">
                        {role.number}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Role Parameters Panel (2/3 width) */}
        {activeRole ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-800">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-slate-900 text-lg">角色参数</h3>
                    <p className="font-sans text-xs text-slate-400">
                      配置 <span className="font-medium text-slate-700">{activeRole.name}</span> (号码: {activeRole.number})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isSavedNotify && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                      <Check className="w-3.5 h-3.5" /> 已保存
                    </span>
                  )}
                  <button
                    onClick={handleSaveActiveRole}
                    className="flex items-center gap-2 bg-black hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded shadow-sm transition-all duration-150"
                    id="btn-save-role"
                  >
                    <Save className="w-3.5 h-3.5" />
                    保存参数
                  </button>
                </div>
              </div>

              {/* Param inputs */}
              <div className="space-y-6">
                {/* Position */}
                <div>
                  <label className="flex items-center gap-2 font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    <AlignLeft className="w-3.5 h-3.5" /> 角色定位
                  </label>
                  <input
                    type="text"
                    value={localPosition}
                    onChange={(e) => setLocalPosition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Configuration sliders */}
                <div>
                  <label className="flex items-center gap-2 font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    <Sliders className="w-3.5 h-3.5" /> 核心微调参数
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 border border-slate-100 rounded-md p-4">
                    {/* Temperature */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-sans font-medium text-slate-600">随机度 (Temp)</span>
                        <span className="font-mono font-medium text-slate-800">{localTemp}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={localTemp}
                        onChange={(e) => setLocalTemp(parseFloat(e.target.value))}
                        className="w-full accent-black cursor-pointer bg-slate-200 h-1 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Max Tokens */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-sans font-medium text-slate-600">最大回复 (Tokens)</span>
                        <span className="font-mono font-medium text-slate-800">{localMaxTokens}</span>
                      </div>
                      <input
                        type="range"
                        min="200"
                        max="4000"
                        step="100"
                        value={localMaxTokens}
                        onChange={(e) => setLocalMaxTokens(parseInt(e.target.value))}
                        className="w-full accent-black cursor-pointer bg-slate-200 h-1 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Presence Penalty */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-sans font-medium text-slate-600">话题惩罚 (Presence)</span>
                        <span className="font-mono font-medium text-slate-800">{localPenalty}</span>
                      </div>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.1"
                        value={localPenalty}
                        onChange={(e) => setLocalPenalty(parseFloat(e.target.value))}
                        className="w-full accent-black cursor-pointer bg-slate-200 h-1 rounded-lg appearance-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Prompt textarea */}
                <div>
                  <label className="flex items-center gap-2 font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    PROMPT 指令
                  </label>
                  <textarea
                    rows={4}
                    value={localPrompt}
                    onChange={(e) => setLocalPrompt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-900 leading-relaxed focus:outline-none focus:border-black transition-colors resize-y font-sans"
                    placeholder="输入分配给 AI 代理的核心提示指令..."
                  />
                </div>
              </div>
            </div>

            {/* Memory Library */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h4 className="flex items-center gap-2 font-sans font-semibold text-slate-900 text-base">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  记忆库 (MEMORY LIBRARY)
                </h4>
                <button
                  onClick={() => {
                    setIsAddingMemory(!isAddingMemory);
                    setNewMemoryContent('');
                  }}
                  className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded transition-all"
                  id="btn-add-memory"
                >
                  <Plus className="w-3.5 h-3.5" />
                  新增记录
                </button>
              </div>

              {/* Inline adding memory form */}
              {isAddingMemory && (
                <div className="mb-4 bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-1/3">
                      <label className="block text-xs font-sans text-slate-400 uppercase tracking-wider mb-1">更新日期</label>
                      <input
                        type="date"
                        value={newMemoryDate}
                        onChange={(e) => setNewMemoryDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-950"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-sans text-slate-400 uppercase tracking-wider mb-1">摘要内容</label>
                      <input
                        type="text"
                        value={newMemoryContent}
                        onChange={(e) => setNewMemoryContent(e.target.value)}
                        placeholder="输入记忆、事实或应答规范摘要"
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-950 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setIsAddingMemory(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleAddMemoryRecord}
                      className="bg-black hover:bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded"
                    >
                      保存记录
                    </button>
                  </div>
                </div>
              )}

              {/* Memory List */}
              <div className="border border-slate-100 rounded-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-3 text-xs font-semibold text-slate-500 uppercase w-32">更新日期</th>
                      <th className="p-3 text-xs font-semibold text-slate-500 uppercase">内容摘要</th>
                      <th className="p-3 text-xs font-semibold text-slate-500 uppercase text-right w-16">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {activeRole.memoryLibrary.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-xs text-slate-400 font-sans">
                          该角色当前暂无配置记忆库
                        </td>
                      </tr>
                    ) : (
                      activeRole.memoryLibrary.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 text-xs text-slate-500 font-mono">{record.date}</td>
                          <td className="p-3 text-xs text-slate-700 font-sans">{record.content}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteMemory(record.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                              title="删除记录"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination indicators footer */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-1.5">
                  <button className="p-1 border border-slate-200 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-50 transition-colors" disabled>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 border border-slate-200 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-50 transition-colors" disabled>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs font-sans text-slate-400">
                  第 1 / 1 页
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 font-sans">
            请在左侧选择需要配置的 AI 角色
          </div>
        )}
      </div>

      {/* Add AI Role Popup Dialog */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans font-semibold text-slate-900 text-lg">新增 AI 角色</h3>
              <button
                onClick={() => setIsAddRoleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="space-y-4">
              <div>
                <label className="block font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  角色名称 *
                </label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="如: 售前咨询助手"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  绑定系统号码 *
                </label>
                <input
                  type="text"
                  required
                  value={addNum}
                  onChange={(e) => setAddNum(e.target.value)}
                  placeholder="如: 004 或 999"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  角色职责定位
                </label>
                <input
                  type="text"
                  value={addPosition}
                  onChange={(e) => setAddPosition(e.target.value)}
                  placeholder="如: 协助办理线上缴费业务"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Prompt 初始化系统指令
                </label>
                <textarea
                  value={addPrompt}
                  onChange={(e) => setAddPrompt(e.target.value)}
                  placeholder="你是一个专业的..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRoleModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-4 py-2 rounded"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-black hover:bg-slate-950 text-white text-xs font-medium px-4 py-2 rounded"
                >
                  创建并绑定
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
