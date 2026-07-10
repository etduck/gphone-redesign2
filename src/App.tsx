import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Contact, AiRole, ModelProvider, Alarm, ScreenId } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Phonebook from './components/Phonebook';
import AiRoles from './components/AiRoles';
import Settings from './components/Settings';
import Alarms from './components/Alarms';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('overview');
  const [transitionDirection, setTransitionDirection] = useState<'push' | 'push_back' | 'none'>('none');

  // Contact list state
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: '林静',
      number: '001',
      role: '智能客服助手',
      callCount: 154,
      lastCall: '22026-07-10 14:22',
      status: '在线',
      notes: '大客户服务专线，主要处理VIP用户售后与投诉问题。',
    },
    {
      id: '2',
      name: '周泽宇',
      number: '888',
      role: '极简外呼机器人',
      callCount: 89,
      lastCall: '2026-07-10 11:05',
      status: '在线',
      notes: '智能外呼与自动回访，每日定时播报通知并收集基础反馈。',
    },
    {
      id: '3',
      name: '陈美美',
      number: '404',
      role: '暂无分配角色',
      callCount: 0,
      lastCall: '-',
      status: '离线',
      notes: '用于新业务临时测试的备用号码。',
    },
    {
      id: '4',
      name: '王医生',
      number: '002',
      role: '周医生 (医疗咨询)',
      callCount: 32,
      lastCall: '2026-07-10 08:44',
      status: '在线',
      notes: '日常保健与健康常识咨询，不作临床处方依据。',
    },
    {
      id: '5',
      name: '刘阿姨',
      number: '003',
      role: '林晚晚 (情感陪伴)',
      callCount: 421,
      lastCall: '2026-07-09 18:30',
      status: '离线',
      notes: '银发关怀公益热线，提供温暖的日常问候与倾听服务。',
    },
  ]);

  // AI roles configuration state
  const [aiRoles, setAiRoles] = useState<AiRole[]>([
    {
      id: '1',
      name: '智能客服助手',
      number: '001',
      rolePosition: '解答用户关于 Gaga Phone 系统的所有疑问',
      configParams: { temperature: 0.5, maxTokens: 1500, presencePenalty: 0.2 },
      prompt: '你是一个专业的智能客服助手，负责解答用户关于 Gaga Phone 系统的所有疑问。请保持礼貌、专业且高效的沟通风格。',
      memoryLibrary: [
        { id: 'm1', date: '2023-10-24', content: '更新了关于 5G 套餐的常见问题解答。' },
        { id: 'm2', date: '2023-10-20', content: '添加了新版 UI 的操作指南。' },
      ],
    },
    {
      id: '2',
      name: '极简外呼机器人',
      number: '888',
      rolePosition: '主动呼叫与通知播报提醒',
      configParams: { temperature: 0.2, maxTokens: 800, presencePenalty: 0.0 },
      prompt: '你是一个极简外呼机器人。你的职责是清晰、简洁地播报重要通知。不要进行过多的口语化修饰，直接说明主旨。',
      memoryLibrary: [
        { id: 'm3', date: '2023-11-01', content: '上线双十一大促通知模版及回访脚本' },
      ],
    },
    {
      id: '3',
      name: '暂无分配角色',
      number: '404',
      rolePosition: '临时存放的未激活空白配置模板',
      configParams: { temperature: 0.7, maxTokens: 1000, presencePenalty: 0.5 },
      prompt: '你是一个待分配的 AI 助手。请礼貌地告诉用户当前没有分配具体的业务逻辑。',
      memoryLibrary: [],
    },
    {
      id: '4',
      name: '林晚晚 (情感陪伴)',
      number: '003',
      rolePosition: '中老年温馨日常陪伴与倾听',
      configParams: { temperature: 0.8, maxTokens: 2000, presencePenalty: 0.6 },
      prompt: '你叫林晚晚，是一个性格温柔、充满耐心的情感陪伴 AI。请用温暖、体贴、亲切的话语与用户交流，倾听他们的心声。',
      memoryLibrary: [
        { id: 'm4', date: '2023-09-12', content: '完善了中老年关怀温馨词库。' },
      ],
    },
    {
      id: '5',
      name: '周医生 (医疗咨询)',
      number: '002',
      rolePosition: '日常亚健康与医学科普常识咨询',
      configParams: { temperature: 0.3, maxTokens: 1800, presencePenalty: 0.1 },
      prompt: '你是一个资深的健康顾问周医生。请提供严谨、科学的医疗常识解答，并在回复末尾温馨提示：本建议仅供参考，若有不适请及时就医。',
      memoryLibrary: [
        { id: 'm5', date: '2023-10-15', content: '导入了秋季流感预防常识及防护指南。' },
      ],
    },
  ]);

  // Model providers configuration state
  const [providers, setProviders] = useState<ModelProvider[]>([
    {
      id: 'openai',
      name: 'OpenAI',
      icon: 'Rocket',
      connected: true,
      balance: '¥125.50',
      apiKey: 'sk-proj-••••••••••••••••',
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      icon: 'Cloud',
      connected: false,
      balance: '¥0.00',
      apiKey: '',
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      icon: 'Cpu',
      connected: false,
      balance: '¥0.00',
      apiKey: '',
    },
  ]);

  // Automatic Alarm state
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: '1',
      time: '08:00',
      mode: '每天循环',
      date: '',
      content: '早上好，现在是八点整。今天的日程非常紧凑。上午九点您有一次重要的技术研讨会，下午两点是例行周会。天气预报显示今天多云转晴，气温适宜，祝您拥有美好的一天。',
      active: true,
    },
    {
      id: '2',
      time: '10:30',
      mode: '一次性 2023-11-20',
      date: '2023-11-20',
      content: '记得准时参加关于新项目 AI 角色的讨论会议。会议室在 A 栋 402，请携带您的工作笔记本。',
      active: true,
    },
    {
      id: '3',
      time: '14:00',
      mode: '每天循环',
      date: '',
      content: '休息时间。请站起来走动一下，喝杯咖啡。长时间保持坐姿可能会影响血液循环，建议做一到两组简单的伸展运动。',
      active: false,
    },
    {
      id: '4',
      time: '19:00',
      mode: '一次性 2023-11-22',
      date: '2023-11-22',
      content: '晚间播报：今日任务完成情况汇总如下。今天一共处理了 14 个待办事项，3 个未接来电已全部由 AI 客服自动回复，数据备份已成功同步至云端。',
      active: true,
    },
  ]);

  // Handling unified screen transitions logic
  const handleNavigate = (target: ScreenId) => {
    if (target === currentScreen) return;

    // Define transition direction according to navigation spec
    if (currentScreen === 'overview') {
      setTransitionDirection('push'); // push from right
    } else if (target === 'overview') {
      setTransitionDirection('push_back'); // slide back to left
    } else {
      setTransitionDirection('none'); // instant jump
    }

    setCurrentScreen(target);
  };

  // Contact list CRUD
  const handleAddContact = (contactData: Omit<Contact, 'id' | 'callCount' | 'lastCall'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Math.random().toString(),
      callCount: 0,
      lastCall: '-',
    };
    setContacts((prev) => [newContact, ...prev]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateContact = (updated: Contact) => {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  // AI Roles CRUD
  const handleUpdateRole = (updatedRole: AiRole) => {
    setAiRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
  };

  const handleAddRole = (newRoleData: Omit<AiRole, 'id' | 'memoryLibrary'>) => {
    const newRole: AiRole = {
      ...newRoleData,
      id: Math.random().toString(),
      memoryLibrary: [],
    };
    setAiRoles((prev) => [...prev, newRole]);
  };

  // Alarms CRUD
  const handleAddAlarm = (alarmData: Omit<Alarm, 'id'>) => {
    const newAlarm: Alarm = {
      ...alarmData,
      id: Math.random().toString(),
    };
    setAlarms((prev) => [newAlarm, ...prev]);
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  // Define transition animation variants for motion
  const pageVariants = {
    initial: (dir: 'push' | 'push_back' | 'none') => {
      if (dir === 'push') return { x: '100%', opacity: 0.8 };
      if (dir === 'push_back') return { x: '-100%', opacity: 0.8 };
      return { x: 0, opacity: 1 };
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 280, damping: 28 },
    },
    exit: (dir: 'push' | 'push_back' | 'none') => {
      if (dir === 'push') return { x: '-100%', opacity: 0.8, transition: { duration: 0.2 } };
      if (dir === 'push_back') return { x: '100%', opacity: 0.8, transition: { duration: 0.2 } };
      return { x: 0, opacity: 1 };
    },
  };

  return (
    <div className="flex bg-slate-50 text-slate-950 font-sans h-screen w-screen overflow-hidden">
      {/* Dynamic Navigation Sidebar */}
      <Sidebar currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Main Workspace Frame with Animated Transitions */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-screen">
        <AnimatePresence mode="popLayout" custom={transitionDirection}>
          <motion.div
            key={currentScreen}
            custom={transitionDirection}
            variants={pageVariants}
            initial={transitionDirection === 'none' ? false : 'initial'}
            animate="animate"
            exit={transitionDirection === 'none' ? false : 'exit'}
            className="absolute inset-0 flex flex-col h-full w-full"
          >
            {currentScreen === 'overview' && (
              <Dashboard contacts={contacts} aiRoles={aiRoles} />
            )}
            {currentScreen === 'phonebook' && (
              <Phonebook
                contacts={contacts}
                aiRoles={aiRoles}
                onAddContact={handleAddContact}
                onDeleteContact={handleDeleteContact}
                onUpdateContact={handleUpdateContact}
              />
            )}
            {currentScreen === 'ai_roles' && (
              <AiRoles
                aiRoles={aiRoles}
                onUpdateRole={handleUpdateRole}
                onAddRole={handleAddRole}
              />
            )}
            {currentScreen === 'settings' && (
              <Settings providers={providers} onUpdateProviders={setProviders} />
            )}
            {currentScreen === 'alarms' && (
              <Alarms
                alarms={alarms}
                onAddAlarm={handleAddAlarm}
                onToggleAlarm={handleToggleAlarm}
                onDeleteAlarm={handleDeleteAlarm}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
