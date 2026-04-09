import React from 'react';
import { Activity, Zap, Cpu, Waves } from 'lucide-react';

interface TechnicalDossierProps {
  specs: {
    frequency_response: string;
    impedance: string;
    sensitivity: string;
  };
  driverConfig: string;
  glowColor: string;
}

const TechnicalDossier: React.FC<TechnicalDossierProps> = ({ specs, driverConfig, glowColor }) => {
  const specRows = [
    { label: 'Acoustic Structure', value: driverConfig, icon: Cpu },
    { label: 'Frequency Scope', value: specs.frequency_response, icon: Waves },
    { label: 'Impedance Control', value: specs.impedance, icon: Zap },
    { label: 'Sensitivity Core', value: specs.sensitivity, icon: Activity },
  ];

  return (
    <div className="w-full space-y-12">
      <div className="flex items-center gap-6">
         <div className="h-[2px] flex-1 bg-white/5" />
         <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 whitespace-nowrap">Technical Dossier // Engineering Records</h3>
         <div className="h-[2px] flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
         {specRows.map((row, idx) => (
           <div key={idx} className="group relative">
              <div className="flex items-center justify-between py-4 border-b border-white/5 transition-all group-hover:border-white/20">
                 <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white/5 text-gray-500 group-hover:text-white transition-colors" style={{ color: `${glowColor}88` }}>
                       <row.icon size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{row.label}</span>
                 </div>
                 <span className="text-sm font-bold text-white font-mono">{row.value}</span>
              </div>
              <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/0 to-transparent w-full group-hover:via-blue-500/50 transition-all duration-700" style={{ backgroundImage: `linear-gradient(to right, transparent, ${glowColor}, transparent)` }} />
           </div>
         ))}
      </div>

      <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl mt-12 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
         <p className="text-[10px] text-gray-500 leading-relaxed font-medium uppercase tracking-[0.1em]">
           Note: Every technical specification listed above is verified through the KZ-Phantom internal laboratory standards. Engineering tolerances are meticulously maintained within the laboratory's strict deviation limits for consistency and acoustic purity.
         </p>
      </div>
    </div>
  );
};

export default TechnicalDossier;
