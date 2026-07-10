import React, { useState } from 'react';
import { Cpu, RefreshCw, Key, Save, Play, Check, ShieldCheck, Volume2, Database, KeyRound, AlertCircle } from 'lucide-react';
import { ModelProvider } from '../types';

interface SettingsProps {
  providers: ModelProvider[];
  onUpdateProviders: (updated: ModelProvider[]) => void;
}

export default function Settings({ providers, onUpdateProviders }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'models' | 'speech' | 'storage'>('models');
  const [localProviders, setLocalProviders] = useState<ModelProvider[]>(providers);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [isSavedNotify, setIsSavedNotify] = useState(false);

  // Extra config states
  const [ttsEngine, setTtsEngine] = useState('openai-tts');
  const [voiceGender, setVoiceGender] = useState('female-warm');
  const [sttLanguage, setSttLanguage] = useState('zh-CN');
  const [retentionDays, setRetentionDays] = useState('90');
  const [recordCalls, setRecordCalls] = useState(true);

  // Key edits input field values
  const [keyEdits, setKeyEdits] = useState<{ [id: string]: string }>({});

  const handleKeyChange = (providerId: string, value: string) => {
    setKeyEdits((prev) => ({ ...prev, [providerId]: value }));
  };

  const handleToggleConnect = (providerId: string) => {
    const prov = localProviders.find((p) => p.id === providerId);
    if (!prov) return;

    const nextConnected = !prov.connected;
    const providedKey = keyEdits[providerId] || prov.apiKey;

    if (nextConnected && !providedKey.trim() && !prov.apiKey) {
      alert(`请输入 ${prov.name} 的 API 密钥！`);
      return;
    }

    const updated = localProviders.map((p) => {
      if (p.id === providerId) {
        return {
          ...p,
          connected: nextConnected,
          balance: nextConnected ? `¥${(Math.random() * 200 + 50).toFixed(2)}` : '¥0.00',
          apiKey: nextConnected ? providedKey : '',
        };
      }
      return p;
    });

    setLocalProviders(updated);
    onUpdateProviders(updated);
  };

  const handleRefresh = (providerId: string) => {
    const prov = localProviders.find((p) => p.id === providerId);
    if (!prov?.connected) return;

    setRefreshingId(providerId);
    setTimeout(() => {
      setRefreshingId(null);
      const updated = localProviders.map((p) => {
        if (p.id === providerId) {
          // Simulate updated balance
          const prevFloat = parseFloat(p.balance.replace('¥', '')) || 0;
          const nextFloat = Math.max(0, prevFloat - Math.random() * 0.45);
          return {
            ...p,
            balance: `¥${nextFloat.toFixed(2)}`,
          };
        }
        return p;
      });
      setLocalProviders(updated);
      onUpdateProviders(updated);
    }, 1000);
  };

  const handleSaveGlobal = () => {
    setIsSavedNotify(true);
    setTimeout(() => setIsSavedNotify(false), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-8 overflow-y-auto">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900" id="settings-title">
            系统设置
          </h2>
          <p className="font-sans text-xs text-slate-400 mt-1">
            配置底座大语言模型供应商、语音生成参数、API 节点秘钥及持久化设定
          </p>
        </div>
      </div>

      {/* Internal Navigation tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('models')}
          className={`px-4 py-2 text-xs uppercase font-semibold tracking-wider border-b-2 font-sans transition-all duration-150 ${
            activeTab === 'models'
              ? 'border-black text-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🤖 模型供应商
        </button>
        <button
          onClick={() => setActiveTab('speech')}
          className={`px-4 py-2 text-xs uppercase font-semibold tracking-wider border-b-2 font-sans transition-all duration-150 ${
            activeTab === 'speech'
              ? 'border-black text-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🎙️ 语音合成与识别
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`px-4 py-2 text-xs uppercase font-semibold tracking-wider border-b-2 font-sans transition-all duration-150 ${
            activeTab === 'storage'
              ? 'border-black text-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          💾 数据与存储
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6 max-w-4xl">
        {activeTab === 'models' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100">
              <Cpu className="w-5 h-5 text-slate-400" />
              <h3 className="font-sans text-base font-semibold text-slate-900">
                支持的模型服务商
              </h3>
            </div>

            <div className="space-y-6">
              {localProviders.map((provider) => {
                const isRefreshing = refreshingId === provider.id;
                const inputKeyVal = keyEdits[provider.id] !== undefined ? keyEdits[provider.id] : (provider.apiKey ? '••••••••••••••••' : '');

                return (
                  <div
                    key={provider.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border border-slate-100 rounded bg-slate-50/40 hover:bg-slate-50 transition-colors"
                  >
                    {/* Brand Name */}
                    <div className="flex items-center gap-3 w-44">
                      <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-sm font-semibold text-xs">
                        {provider.name[0]}
                      </div>
                      <div>
                        <p className="font-sans font-semibold text-slate-900 text-sm">
                          {provider.name}
                        </p>
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-sans mt-0.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              provider.connected ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          />
                          {provider.connected ? '已连接' : '未连接'}
                        </span>
                      </div>
                    </div>

                    {/* API key paste field */}
                    <div className="flex-1 min-w-0 flex gap-2">
                      <div className="relative flex-1">
                        <KeyRound className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="password"
                          disabled={provider.connected}
                          placeholder={provider.connected ? "已绑定API密钥" : "请输入 API Key 密钥"}
                          value={inputKeyVal}
                          onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                          className="w-full bg-white disabled:bg-slate-100/50 border border-slate-200 rounded py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-black font-mono"
                        />
                      </div>
                      <button
                        onClick={() => handleToggleConnect(provider.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded transition-all ${
                          provider.connected
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-black text-white hover:bg-slate-900'
                        }`}
                      >
                        {provider.connected ? '断开' : '连接'}
                      </button>
                    </div>

                    {/* Balance & Refresh Actions */}
                    <div className="flex items-center gap-4 w-48 justify-end font-sans text-sm">
                      <span className="font-mono text-slate-700 font-medium">{provider.balance}</span>
                      <button
                        onClick={() => handleRefresh(provider.id)}
                        disabled={!provider.connected || isRefreshing}
                        className={`flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-medium px-2 py-1.5 rounded border border-slate-100 disabled:opacity-40 transition-all ${
                          isRefreshing ? 'opacity-70 bg-slate-100' : ''
                        }`}
                      >
                        <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                        刷新状态
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'speech' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Volume2 className="w-5 h-5 text-slate-400" />
              <h3 className="font-sans text-base font-semibold text-slate-900">
                AI 语音播报合成参数
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  默认文本转语音 (TTS) 引擎
                </label>
                <select
                  value={ttsEngine}
                  onChange={(e) => setTtsEngine(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-sm text-slate-900 focus:outline-none focus:border-black"
                >
                  <option value="openai-tts">OpenAI Audio TTS (高清版)</option>
                  <option value="edge-tts">Edge Chromium TTS (极速版)</option>
                  <option value="gaga-custom-voice">Gaga 极拟真克隆发音引擎</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  语音播报音色风格
                </label>
                <select
                  value={voiceGender}
                  onChange={(e) => setVoiceGender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-sm text-slate-900 focus:outline-none focus:border-black"
                >
                  <option value="female-warm">林晚晚 (温柔女声 - 情感陪伴)</option>
                  <option value="male-expert">周医生 (沉稳男声 - 医疗咨询)</option>
                  <option value="female-professional">小智 (干练女声 - 通用前台)</option>
                  <option value="male-business">陈经理 (知性男声 - 商务公关)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  语音识别 (STT) 首选语言
                </label>
                <select
                  value={sttLanguage}
                  onChange={(e) => setSttLanguage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-sm text-slate-900 focus:outline-none focus:border-black"
                >
                  <option value="zh-CN">普通话 (简体中文)</option>
                  <option value="zh-HK">粤语 (繁体中文 - 香港)</option>
                  <option value="en-US">英语 (美式英语)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Database className="w-5 h-5 text-slate-400" />
              <h3 className="font-sans text-base font-semibold text-slate-900">
                数据持久化与自动录音控制
              </h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 border border-slate-100 rounded hover:bg-slate-100/50 transition-colors">
                <input
                  type="checkbox"
                  checked={recordCalls}
                  onChange={(e) => setRecordCalls(e.target.checked)}
                  className="w-4 h-4 rounded text-black focus:ring-black accent-black"
                />
                <div>
                  <span className="block text-sm font-sans font-semibold text-slate-800">
                    自动对所有 AI 通话进行全量录音
                  </span>
                  <span className="block text-xs font-sans text-slate-400 mt-0.5">
                    开启后，每通呼叫将自动留存录音文件、语音文本对齐轨以用于后续分析。
                  </span>
                </div>
              </label>

              <div>
                <label className="block text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  录音与历史对话留存期限 (Retention Period)
                </label>
                <select
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-sm text-slate-900 focus:outline-none focus:border-black"
                >
                  <option value="30">30 天 (自动销毁)</option>
                  <option value="90">90 天 (推荐选项)</option>
                  <option value="365">1 年 (企业合规期限)</option>
                  <option value="forever">永久保留 (不自动清理)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Controls */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
          {isSavedNotify && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md">
              <ShieldCheck className="w-4 h-4" /> 全局配置已成功同步到安全网关！
            </span>
          )}
          <button
            onClick={handleSaveGlobal}
            className="flex items-center gap-2 bg-black hover:bg-slate-950 text-white font-semibold text-xs py-3 px-8 rounded shadow-md hover:shadow-lg active:scale-95 duration-100 uppercase tracking-wider font-sans"
            id="btn-save-global-settings"
          >
            <Save className="w-4 h-4" />
            保存全局配置
          </button>
        </div>
      </div>
    </div>
  );
}
