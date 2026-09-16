import React, { useState } from 'react';
import { X, Server, Terminal, Copy, Check, ShieldCheck, Database, Globe, Cpu } from 'lucide-react';

interface HostingerDocsModalProps {
  onClose: () => void;
}

export const HostingerDocsModal: React.FC<HostingerDocsModalProps> = ({ onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sampleNginxConfig = `# Nginx Configuration for Hostinger VPS
server {
    listen 80;
    server_name dastaan.pk www.dastaan.pk;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}`;

  const sampleEcosystem = `module.exports = {
  apps: [{
    name: 'dastaan-restaurant',
    script: 'npm',
    args: 'run start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000d0] backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#111118] border border-[#2c2c3e] rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#20202e] flex items-center justify-between bg-[#0d0d14]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181824] border border-[#d4af3740] flex items-center justify-center text-[#d4af37]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-[#f5efe6]">
                Hostinger Node.js &amp; Cloud Deployment Handbook
              </h2>
              <p className="text-xs text-[#8f8e9e]">
                Step-by-step guide for hosting Dastaan Restaurant on Hostinger VPS / Cloud Hosting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1a1a26] text-[#a09fae] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Handbook Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-[#b8b6c4] leading-relaxed">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#d4af37]">
              <Cpu className="w-4 h-4" />
              <span>Step 1: Hostinger Server Provisioning (Node.js 20 LTS)</span>
            </div>
            <p>
              Log into your <strong>Hostinger hPanel</strong> or <strong>Hostinger VPS Dashboard</strong>. Select Ubuntu 22.04 or Debian 12 with Node.js 20 LTS. Connect via SSH:
            </p>
            <div className="p-3 rounded-xl bg-[#09090e] font-mono text-[11px] text-[#4ade80] border border-[#1e1e2c]">
              ssh root@your_server_ip
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#d4af37]">
              <Terminal className="w-4 h-4" />
              <span>Step 2: Clone &amp; Install Dependencies</span>
            </div>
            <p>
              Clone your Dastaan project directory and install all production modules:
            </p>
            <div className="p-3 rounded-xl bg-[#09090e] font-mono text-[11px] text-[#bae6fd] border border-[#1e1e2c] space-y-1">
              <div>git clone https://github.com/your-username/dastaan-restaurant.git</div>
              <div>cd dastaan-restaurant</div>
              <div>npm install</div>
              <div>npm run build</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#d4af37]">
              <Globe className="w-4 h-4" />
              <span>Step 3: PM2 Process Manager Setup</span>
            </div>
            <p>
              To ensure 24/7 uninterrupted uptime, use PM2 so the application restarts automatically upon server reboot:
            </p>
            <div className="relative">
              <pre className="p-3 rounded-xl bg-[#09090e] font-mono text-[11px] text-[#fde047] border border-[#1e1e2c] overflow-x-auto">
                {sampleEcosystem}
              </pre>
              <button
                onClick={() => copyToClipboard(sampleEcosystem, 'pm2')}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-[#1d1d2b] text-[#9d9ba9] hover:text-white cursor-pointer"
              >
                {copiedSection === 'pm2' ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="p-2 rounded bg-[#09090e] font-mono text-[11px] text-[#4ade80] border border-[#1e1e2c]">
              pm2 start ecosystem.config.js &amp;&amp; pm2 save &amp;&amp; pm2 startup
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
              <span>Step 4: Nginx Reverse Proxy &amp; SSL Certificate (Certbot)</span>
            </div>
            <p>
              Route external traffic from port 80/443 to the Node app port 3000:
            </p>
            <div className="relative">
              <pre className="p-3 rounded-xl bg-[#09090e] font-mono text-[11px] text-[#d6d3e0] border border-[#1e1e2c] overflow-x-auto">
                {sampleNginxConfig}
              </pre>
              <button
                onClick={() => copyToClipboard(sampleNginxConfig, 'nginx')}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-[#1d1d2b] text-[#9d9ba9] hover:text-white cursor-pointer"
              >
                {copiedSection === 'nginx' ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="p-2 rounded bg-[#09090e] font-mono text-[11px] text-[#4ade80] border border-[#1e1e2c]">
              certbot --nginx -d dastaan.pk -d www.dastaan.pk
            </div>
          </div>

          {/* Step 5 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#d4af37]">
              <Database className="w-4 h-4" />
              <span>Step 5: Cloud Firestore &amp; Environment Variables</span>
            </div>
            <p>
              Add your `.env` variables to Hostinger:
            </p>
            <div className="p-3 rounded-xl bg-[#09090e] font-mono text-[11px] text-[#93c5fd] border border-[#1e1e2c] space-y-1">
              <div>VITE_FIREBASE_PROJECT_ID="gen-lang-client-0234102459"</div>
              <div>ADMIN_EMAIL="bilalit.rfc@gmail.com"</div>
              <div>PORT=3000</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0d0d14] border-t border-[#20202e] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#d4af37] text-[#0b0b0d] font-bold text-xs cursor-pointer shadow"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
