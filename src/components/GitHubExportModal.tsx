import React, { useState } from 'react';
import { X, Copy, Check, Github, ExternalLink, Sparkles, Terminal } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  isKazakh: boolean;
}

export const GitHubExportModal: React.FC<GitHubModalProps> = ({
  isOpen,
  onClose,
  isKazakh,
}) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  if (!isOpen) return null;

  const pushCommand = `git remote add origin https://github.com/<СІЗДІҢ_GITHUB_АККАУНТ>/nearpod-alternative.git\ngit branch -M main\ngit push -u origin main`;

  const handleCopy = (text: string, stepIdx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIdx);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
            <Github className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold font-display">
            {isKazakh ? 'GitHub-қа жүктеу және тікелей сайт ашу' : 'Deploy to GitHub & GitHub Pages'}
          </h2>
          <p className="text-slate-300 text-xs mt-1">
            {isKazakh
              ? 'Жоба GitHub Pages арқылы автоматты түрде онлайн жұмыс істейтіндей толық бапталған.'
              : 'Configured with automated GitHub Actions for instant GitHub Pages hosting.'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Step 1 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-mono text-xs">
                1
              </span>
              <span>{isKazakh ? 'GitHub-та жаңа репозиторий құрыңыз' : 'Create a repository on GitHub'}</span>
            </div>
            <p className="text-slate-600 pl-7">
              {isKazakh
                ? 'GitHub.com сайтында «New repository» батырмасын басып, атауын жазыңыз (мысалы: nearpod-app).'
                : 'Go to github.com/new and create a public or private repository.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-mono text-xs">
                  2
                </span>
                <span>{isKazakh ? 'Терминалда репозиторийге жіберіңіз' : 'Push code to your repository'}</span>
              </div>
              <button
                onClick={() => handleCopy(pushCommand, 2)}
                className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1 text-xs"
              >
                {copiedStep === 2 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedStep === 2 ? (isKazakh ? 'Көшірілді' : 'Copied') : (isKazakh ? 'Көшіру' : 'Copy')}</span>
              </button>
            </div>
            <div className="pl-7">
              <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                {pushCommand}
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-mono text-xs">
                3
              </span>
              <span>{isKazakh ? 'GitHub Pages параметрін қосыңыз' : 'Turn on GitHub Pages'}</span>
            </div>
            <p className="text-slate-600 pl-7 leading-relaxed">
              {isKazakh
                ? 'Репозиторийіңіздің Settings → Pages бөлімінде Build and deployment → Source мәнін «GitHub Actions» деп таңдаңыз. Сайтыңыз 1-2 минутта автоматты түрде интернетте ашылады!'
                : 'In your repository, navigate to Settings → Pages → Build and deployment → Source, and choose "GitHub Actions".'}
            </p>
          </div>

          {/* Current Live URL Notice */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
            <span className="font-bold block mb-1">
              {isKazakh ? 'Қазірдің өзінде тікелей көру сілтемесі:' : 'Your live URL right now:'}
            </span>
            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="font-mono text-[11px] truncate text-emerald-800">
                https://ais-pre-7wb6wcijj4dtxhyl5rdwqx-76753843311.asia-southeast1.run.app
              </span>
              <a
                href="https://ais-pre-7wb6wcijj4dtxhyl5rdwqx-76753843311.asia-southeast1.run.app"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-emerald-600 text-white font-semibold rounded text-[11px] hover:bg-emerald-700 shrink-0 flex items-center gap-1"
              >
                <span>{isKazakh ? 'Ашу' : 'Open'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            {isKazakh ? 'Түсінікті, жабу' : 'Got it, close'}
          </button>
        </div>
      </div>
    </div>
  );
};
