import React from 'react';
import { LayoutDashboard, Users, Bot, AlarmClock, Settings, Sparkles } from 'lucide-react';
import { ScreenId } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (target: ScreenId) => void;
}

export default function Sidebar({ currentScreen, onNavigate }: SidebarProps) {
  // Alarms page has a slightly different sidebar matching Screenshot 4
  const isAlarmScreen = currentScreen === 'alarms';

  const menuItems = isAlarmScreen
    ? [
        { id: 'overview' as ScreenId, label: '仪表盘', icon: LayoutDashboard },
        { id: 'phonebook' as ScreenId, label: '电话簿', icon: Users },
        { id: 'ai_roles' as ScreenId, label: 'AI 角色', icon: Bot },
        { id: 'alarms' as ScreenId, label: '自动闹钟', icon: AlarmClock },
        { id: 'settings' as ScreenId, label: '系统设置', icon: Settings },
      ]
    : [
        { id: 'overview' as ScreenId, label: '概览', icon: LayoutDashboard },
        { id: 'phonebook' as ScreenId, label: '电话簿', icon: Users },
        { id: 'ai_roles' as ScreenId, label: 'AI 角色', icon: Bot },
        { id: 'alarms' as ScreenId, label: '自动闹钟', icon: AlarmClock },
        { id: 'settings' as ScreenId, label: '设置', icon: Settings },
      ];

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-screen shrink-0 select-none">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white font-mono font-bold text-lg">
            G
          </div>
          <div>
            <h1 className="font-sans font-semibold tracking-tight text-slate-950 text-lg leading-tight">
              Gaga Phone
            </h1>
            <p className="font-sans text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              AI 后台管理系统
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-150 ${
                isActive
                  ? 'bg-slate-200/60 text-slate-950 font-medium'
                  : 'text-slate-500 hover:bg-slate-200/30 hover:text-slate-800'
              }`}
              id={`nav-link-${item.id}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span className="font-sans text-sm">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Footer Controls & User profile */}
      <div className="p-4 border-t border-slate-200 space-y-4">
        {isAlarmScreen && (
          <button
            onClick={() => alert('新建通话任务功能已激活')}
            className="w-full bg-black text-white hover:bg-slate-900 transition-all text-xs font-medium py-2.5 rounded shadow-sm hover:shadow active:scale-95 duration-100 uppercase tracking-wider font-sans"
            id="btn-new-call-task"
          >
            新建通话任务
          </button>
        )}

        <div className="flex items-center gap-3 p-2 rounded-md">
          <div className="relative">
            <img
              src={
                isAlarmScreen
                  ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'
                  : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
              }
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-slate-100"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-50 rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-sans font-medium text-slate-950 text-sm truncate">
              {isAlarmScreen ? 'Admin Gaga' : 'Admin User'}
            </p>
            <p className="font-sans text-xs text-slate-400 truncate">
              {isAlarmScreen ? 'SYSTEM ADMIN' : 'System Manager'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
