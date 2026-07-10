import React, { useState } from 'react';
import { AlarmClock, Calendar, Clock, Sparkles, Trash2, SwitchCamera, Search, Bell, HelpCircle } from 'lucide-react';
import { Alarm } from '../types';

interface AlarmsProps {
  alarms: Alarm[];
  onAddAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  onToggleAlarm: (id: string) => void;
  onDeleteAlarm: (id: string) => void;
}

export default function Alarms({ alarms, onAddAlarm, onToggleAlarm, onDeleteAlarm }: AlarmsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [repeatMode, setRepeatMode] = useState<'once' | 'daily'>('once');
  const [alarmDate, setAlarmDate] = useState('2026-07-10');
  const [alarmTime, setAlarmTime] = useState('08:00');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [isSavedNotify, setIsSavedNotify] = useState(false);

  const filteredAlarms = alarms.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.time.includes(q) ||
      a.mode.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q)
    );
  });

  const handleSaveAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastContent.trim()) {
      alert('请填写播报内容！');
      return;
    }

    const modeString = repeatMode === 'once' ? `一次性 ${alarmDate}` : '每天循环';

    onAddAlarm({
      time: alarmTime,
      mode: modeString,
      date: repeatMode === 'once' ? alarmDate : '',
      content: broadcastContent,
      active: true,
    });

    setBroadcastContent('');
    setIsSavedNotify(true);
    setTimeout(() => setIsSavedNotify(false), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-8 overflow-y-auto">
      {/* Search and Top Notification row in header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
        <div className="relative w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索闹钟任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md py-1.5 pl-9 pr-4 text-xs text-slate-900 focus:outline-none focus:border-black placeholder-slate-400"
          />
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button className="p-1 hover:text-slate-700 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-1 hover:text-slate-700 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Main Form: 新增闹钟 */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 shadow-sm">
        <h3 className="font-sans font-semibold text-slate-900 text-base mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-500" />
          新增闹钟
        </h3>

        <form onSubmit={handleSaveAlarm} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Inputs (8 columns) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Repeat Mode */}
              <div>
                <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  循环模式
                </label>
                <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => setRepeatMode('once')}
                    className={`flex-1 font-sans text-xs font-semibold py-2 rounded transition-all duration-150 ${
                      repeatMode === 'once' ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    一次性
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepeatMode('daily')}
                    className={`flex-1 font-sans text-xs font-semibold py-2 rounded transition-all duration-150 ${
                      repeatMode === 'daily' ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    每天循环
                  </button>
                </div>
              </div>

              {/* Set Date */}
              <div>
                <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  设定日期
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    disabled={repeatMode === 'daily'}
                    value={alarmDate}
                    onChange={(e) => setAlarmDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 disabled:bg-slate-100/50 disabled:text-slate-400 rounded py-2 pl-9 pr-3 text-sm text-slate-900 focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              {/* Set Time */}
              <div>
                <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  设定时间
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    required
                    value={alarmTime}
                    onChange={(e) => setAlarmTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded py-2 pl-9 pr-3 text-sm text-slate-900 focus:outline-none focus:border-black font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Broadcast Content */}
            <div>
              <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider mb-2">
                播报内容
              </label>
              <textarea
                required
                rows={3}
                value={broadcastContent}
                onChange={(e) => setBroadcastContent(e.target.value)}
                placeholder="输入闹钟响铃时需要 AI 播报的文本内容..."
                className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-900 leading-relaxed focus:outline-none focus:border-black placeholder-slate-400 resize-none font-sans"
              />
            </div>
          </div>

          {/* Right Button Column (4 columns) */}
          <div className="lg:col-span-4 flex flex-col justify-end items-end gap-3 pb-0.5">
            {isSavedNotify && (
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-md font-sans">
                闹钟配置成功并就绪！
              </span>
            )}
            <button
              type="submit"
              className="w-full bg-black hover:bg-slate-950 text-white font-semibold text-xs py-3 rounded-md shadow-sm transition-all duration-150 tracking-wider uppercase"
              id="btn-save-alarm-settings"
            >
              保存闹钟设置
            </button>
          </div>
        </form>
      </div>

      {/* Alarm List Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
          <h3 className="font-sans font-semibold text-slate-900 text-base flex items-center gap-2">
            <AlarmClock className="w-4.5 h-4.5 text-slate-400" />
            闹钟列表
          </h3>
          <span className="font-sans text-xs text-slate-400">
            共 {filteredAlarms.length} 个闹钟
          </span>
        </div>

        {/* List table */}
        <div className="border border-slate-100 rounded-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase w-24">时间</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase w-32">模式</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">播报内容摘要</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right w-24">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlarms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm text-slate-400 font-sans">
                    暂无待执行闹钟任务
                  </td>
                </tr>
              ) : (
                filteredAlarms.map((alarm) => (
                  <tr key={alarm.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-semibold text-slate-900 text-base">
                      {alarm.time}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-sans font-medium">
                        {alarm.mode}
                      </span>
                    </td>
                    <td className="p-4 font-sans text-xs text-slate-600 leading-relaxed max-w-md truncate">
                      {alarm.content}
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => onDeleteAlarm(alarm.id)}
                          className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors"
                          title="删除闹钟"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {/* Custom visual toggle switch */}
                        <button
                          onClick={() => onToggleAlarm(alarm.id)}
                          className={`w-10 h-6 rounded-full p-0.5 transition-all duration-150 focus:outline-none ${
                            alarm.active ? 'bg-blue-600' : 'bg-slate-200'
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-150 transform ${
                              alarm.active ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
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
  );
}
