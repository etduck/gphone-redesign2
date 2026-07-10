import React, { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, PhoneCall, Radio, Activity, Cpu, Bot, CheckCircle } from 'lucide-react';
import { Contact, AiRole } from '../types';

interface DashboardProps {
  contacts: Contact[];
  aiRoles: AiRole[];
}

export default function Dashboard({ contacts, aiRoles }: DashboardProps) {
  const [todayCalls, setTodayCalls] = useState(1284);
  const [activeConns, setActiveConns] = useState(86);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate subtle real-time updates to make the prototype feel fully alive and interactive!
  useEffect(() => {
    const interval = setInterval(() => {
      // Small chance to increment calls
      if (Math.random() > 0.4) {
        setTodayCalls((prev) => prev + 1);
      }
      // Small fluctuation in active connections
      if (Math.random() > 0.6) {
        setActiveConns((prev) => {
          const delta = Math.random() > 0.5 ? 1 : -1;
          const next = prev + delta;
          return next > 60 && next < 110 ? next : prev;
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setTodayCalls((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setActiveConns(84 + Math.floor(Math.random() * 5));
    }, 800);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-8 overflow-y-auto">
      {/* Upper header action area */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900" id="dashboard-title">
            概览
          </h2>
          <p className="font-sans text-xs text-slate-400 mt-1">
            实时运行数据与 AI 代理核心状态概览
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-150"
          id="btn-refresh-dashboard"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          刷新数据
        </button>
      </div>

      {/* Main High-Impact Stats Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 p-6 rounded-lg flex items-center justify-between">
          <div>
            <p className="font-sans text-xs font-medium tracking-wide text-slate-400 uppercase">
              今日通话数
            </p>
            <p className="font-sans text-4xl font-semibold tracking-tight text-slate-900 mt-2 font-mono">
              {todayCalls.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-800">
            <PhoneCall className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg flex items-center justify-between">
          <div>
            <p className="font-sans text-xs font-medium tracking-wide text-slate-400 uppercase">
              活跃连接
            </p>
            <p className="font-sans text-4xl font-semibold tracking-tight text-slate-900 mt-2 font-mono">
              {activeConns}
            </p>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-800 relative">
            <Radio className="w-5 h-5 text-slate-800" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
        </div>
      </div>

      {/* Sub-panels Grid (Model status, AI role status, number status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Status Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-slate-400" />
            <h3 className="font-sans text-base font-semibold text-slate-900">
              模型状态
            </h3>
          </div>
          <ul className="space-y-4 flex-1">
            {[
              { name: 'OpenAI GPT-4o', status: '在线', active: true },
              { name: 'Anthropic Claude 3.5', status: '在线', active: true },
              { name: 'Google Gemini Pro', status: '离线', active: false },
              { name: 'Gaga Local-LLM', status: '在线', active: true },
            ].map((model, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2.5 font-sans text-slate-700">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      model.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'
                    }`}
                  />
                  {model.name}
                </span>
                <span className={`font-sans text-xs ${model.active ? 'text-slate-500' : 'text-slate-400'}`}>
                  {model.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Role Status Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <Bot className="w-4 h-4 text-slate-400" />
            <h3 className="font-sans text-base font-semibold text-slate-900">
              AI 角色状态
            </h3>
          </div>
          <ul className="space-y-4 flex-1">
            {[
              { name: '林晚晚 (情感陪伴)', status: '运行中', active: true },
              { name: '周医生 (医疗咨询)', status: '运行中', active: true },
              { name: '小智助手 (通用)', status: '运行中', active: true },
              { name: '陈经理 (业务办理)', status: '待命', active: false },
            ].map((role, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm">
                <span className="font-sans font-medium text-slate-700">{role.name}</span>
                <span
                  className={`font-sans font-medium text-xs ${
                    role.active ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {role.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Number Status Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <Activity className="w-4 h-4 text-slate-400" />
            <h3 className="font-sans text-base font-semibold text-slate-900">
              号码状态
            </h3>
          </div>
          <ul className="space-y-4 flex-1">
            {[
              { number: '001', status: '在线', active: true },
              { number: '002', status: '在线', active: true },
              { number: '003', status: '离线', active: false },
            ].map((num, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2.5 font-sans text-slate-700 font-mono">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      num.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'
                    }`}
                  />
                  {num.number}
                </span>
                <span className={`font-sans text-xs ${num.active ? 'text-slate-500' : 'text-slate-400'}`}>
                  {num.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Secondary Information section - Recent Logs */}
      <div className="mt-8 bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="font-sans text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-slate-400" />
          系统活动日志 (实时)
        </h3>
        <div className="space-y-3 font-mono text-xs text-slate-500">
          <div className="flex items-start gap-4 py-1.5 border-b border-slate-50">
            <span className="text-emerald-600 font-semibold">[INFO]</span>
            <span className="text-slate-400">14:17:53</span>
            <span>系统在线检测成功: OpenAI GPT-4o 延迟 124ms</span>
          </div>
          <div className="flex items-start gap-4 py-1.5 border-b border-slate-50">
            <span className="text-blue-600 font-semibold">[CALL]</span>
            <span className="text-slate-400">14:15:20</span>
            <span>号码 [001] 与联系人 [林静] 通话结束, 持续 2分45秒. AI角色: 智能客服助手</span>
          </div>
          <div className="flex items-start gap-4 py-1.5 border-b border-slate-50">
            <span className="text-amber-500 font-semibold">[WARN]</span>
            <span className="text-slate-400">14:10:02</span>
            <span>号码 [003] 与服务连接超时, 状态变更为 "离线"</span>
          </div>
          <div className="flex items-start gap-4 py-1.5">
            <span className="text-emerald-600 font-semibold">[INFO]</span>
            <span className="text-slate-400">14:05:11</span>
            <span>自动闹钟播报任务: [08:00 闹钟] AI生成播报文本已成功传送至号码 [001]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
