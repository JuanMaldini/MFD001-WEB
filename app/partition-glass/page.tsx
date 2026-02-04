'use client';
import { useState } from 'react';
import Image from 'next/image';

type DimensionMode = 'inches' | 'feet-inches' | 'metric';
type Step = 'dimensions' | 'configuration' | 'pocket' | 'closure' | 'rails' | 'egress' | 'model' | 'track' | 'glass' | 'finish' | 'project_info' | 'summary';

interface DimensionValue {
  mode: DimensionMode;
  inches?: number;
  feet?: number;
  inchMain?: number;
  numerator?: number;
  denominator?: number;
  millimeters?: number;
}

// Glass specific types
type PanelConfig = 'single' | 'single-parallel';
type PocketType = 'wtw' | 'inside' | 'outside';
type ClosureType = 'pivot' | 'sliding';
type RailType = 'rails' | 'patch';
type EgressType = 'none' | 'end_pivot' | 'passdoor';
type ModelType = 'acousti-clear' | 'hsw'; // Using Educated guesses based on "Glass" context
type TrackType = 'standard' | 'heavy';
type GlassType = 'clear' | 'frosted' | 'custom';
type FinishType = 'clear_anodized' | 'bronze_anodized' | 'black_anodized' | 'white_powder' | 'custom';

interface ProjectInfo {
    projectName: string;
    city: string;
    state: string;
    zip: string;
    architect: string;
    contactPerson: string;
    email: string;
    phone: string;
}

export default function GlassPartition() {
  const [currentStep, setCurrentStep] = useState<Step>('dimensions');
  const [location, setLocation] = useState('');
  const [width, setWidth] = useState<DimensionValue>({ mode: 'feet-inches', feet: 0, inchMain: 0, numerator: 0, denominator: 0 });
  const [height, setHeight] = useState<DimensionValue>({ mode: 'feet-inches', feet: 0, inchMain: 0, numerator: 0, denominator: 0 });
  
  const [panelConfig, setPanelConfig] = useState<PanelConfig | null>(null);
  const [pocketType, setPocketType] = useState<PocketType | null>(null);
  
  // Placeholders for state
  const [closure, setClosure] = useState<ClosureType | null>(null);
  const [rail, setRail] = useState<RailType | null>(null);
  const [egress, setEgress] = useState<EgressType | null>(null);
  const [model, setModel] = useState<ModelType | null>(null);
  const [track, setTrack] = useState<TrackType | null>(null);
  const [glass, setGlass] = useState<GlassType | null>(null);
  const [finish, setFinish] = useState<FinishType | null>(null);

  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
      projectName: '',
      city: '',
      state: '',
      zip: '',
      architect: '',
      contactPerson: '',
      email: '',
      phone: ''
  });

  const validateDimensions = () => {
    if (!location.trim()) {
      alert('Please enter a partition location.');
      return false;
    }
    const isValueValid = (val: DimensionValue) => {
      if (val.mode === 'feet-inches') return (val.feet || 0) > 0 || (val.inchMain || 0) > 0;
      if (val.mode === 'inches') return (val.inches || 0) > 0;
      if (val.mode === 'metric') return (val.millimeters || 0) > 0;
      return false;
    };
    if (!isValueValid(width) || !isValueValid(height)) {
      alert('Please enter valid dimensions for width and height.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
      if (currentStep === 'dimensions') {
          if (validateDimensions()) setCurrentStep('configuration');
      } else if (currentStep === 'configuration') {
          if (!panelConfig) {
              alert('Please select a panel configuration.');
              return false;
          }
          setCurrentStep('pocket');
      } else if (currentStep === 'pocket') {
          if (!pocketType) {
              alert('Please select a storage condition.');
              return false;
          }
          setCurrentStep('closure');
      } else if (currentStep === 'closure') {
          if (!closure) {
              alert('Please select a closure method.');
              return false;
          }
          setCurrentStep('rails');
      } else if (currentStep === 'rails') {
          if (!rail) {
              alert('Please select rails or patch fittings.');
              return false;
          }
          setCurrentStep('egress');
      } else if (currentStep === 'egress') {
          if (!egress) {
              alert('Please select an egress option.');
              return false;
          }
          setCurrentStep('model');
      } else if (currentStep === 'model') {
          if (!model) {
              alert('Please select a model.');
              return false;
          }
          setCurrentStep('track');
      } else if (currentStep === 'track') {
          if (!track) {
              alert('Please select a track system.');
              return false;
          }
          setCurrentStep('glass');
      } else if (currentStep === 'glass') {
          if (!glass) {
              alert('Please select a glass option.');
              return false;
          }
          setCurrentStep('finish');
      } else if (currentStep === 'finish') {
          if (!finish) {
              alert('Please select a finish option.');
              return false;
          }
          setCurrentStep('project_info');
      } else if (currentStep === 'project_info') {
          if (!projectInfo.projectName || !projectInfo.email) {
              alert('Please fill in at least Project Name and Email.');
              return false;
          }
          setCurrentStep('summary');
      } else if (currentStep === 'summary') {
          // Final submission logic could go here
          alert('Form Submitted!');
          resetForm();
      }
  };

  const handlePrevStep = () => {
      if (currentStep === 'configuration') setCurrentStep('dimensions');
      if (currentStep === 'pocket') setCurrentStep('configuration');
      if (currentStep === 'closure') setCurrentStep('pocket');
      if (currentStep === 'rails') setCurrentStep('closure');
      if (currentStep === 'egress') setCurrentStep('rails');
      if (currentStep === 'model') setCurrentStep('egress');
      if (currentStep === 'track') setCurrentStep('model');
      if (currentStep === 'glass') setCurrentStep('track');
      if (currentStep === 'finish') setCurrentStep('glass');
      if (currentStep === 'project_info') setCurrentStep('finish');
      if (currentStep === 'summary') setCurrentStep('project_info');
  };

  const resetForm = () => {
      setLocation('');
      setWidth({ mode: 'feet-inches', feet: 0, inchMain: 0, numerator: 0, denominator: 0 });
      setHeight({ mode: 'feet-inches', feet: 0, inchMain: 0, numerator: 0, denominator: 0 });
      setClosure(null);
      setRail(null);
      setEgress(null);
      setModel(null);
      setTrack(null);
      setGlass(null);
      setFinish(null);
      setProjectInfo({
          projectName: '',
          city: '',
          state: '',
          zip: '',
          architect: '',
          contactPerson: '',
          email: '',
          phone: ''
      });
      setCurrentStep('dimensions');
  };

  const renderDimensionInput = (label: string, value: DimensionValue, onChange: (val: DimensionValue) => void) => {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transition-all hover:border-emerald-500/30 group">
        <h3 className="text-xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          {label}
        </h3>
        
        <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-xl w-fit border border-white/5">
          {(['feet-inches', 'inches', 'metric'] as DimensionMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onChange({ ...value, mode })}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                value.mode === mode 
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {mode === 'feet-inches' ? 'Ft & In' : mode === 'inches' ? 'Inches' : 'Metric'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {value.mode === 'feet-inches' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">Feet</label>
                <input 
                  type="number" 
                  defaultValue={value.feet || ''} 
                  onBlur={(e) => onChange({ ...value, feet: Number(e.target.value) })}
                  className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">Inches</label>
                <input 
                  type="number" 
                  defaultValue={value.inchMain || ''} 
                  onBlur={(e) => onChange({ ...value, inchMain: Number(e.target.value) })}
                  className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">Fraction</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={value.numerator || ''} 
                    onBlur={(e) => onChange({ ...value, numerator: Number(e.target.value) })}
                    className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all w-full font-mono text-center"
                    placeholder="Num"
                  />
                  <span className="text-white/20 font-light text-2xl">/</span>
                  <input 
                    type="number" 
                    defaultValue={value.denominator || ''} 
                    onBlur={(e) => onChange({ ...value, denominator: Number(e.target.value) })}
                    className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all w-full font-mono text-center"
                    placeholder="Den"
                  />
                </div>
              </div>
            </>
          )}

          {value.mode === 'inches' && (
            <div className="flex flex-col gap-1.5 col-span-4">
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">Total Inches</label>
              <input 
                type="number" 
                step="0.01"
                defaultValue={value.inches || ''} 
                onBlur={(e) => onChange({ ...value, inches: Number(e.target.value) })}
                className="bg-black/60 border border-white/10 rounded-xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-xl"
                placeholder="0.00"
              />
            </div>
          )}

          {value.mode === 'metric' && (
            <div className="flex flex-col gap-1.5 col-span-4">
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">Millimeters (mm)</label>
              <input 
                type="number" 
                step="0.1"
                defaultValue={value.millimeters || ''} 
                onBlur={(e) => onChange({ ...value, millimeters: Number(e.target.value) })}
                className="bg-black/60 border border-white/10 rounded-xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-xl"
                placeholder="0.0"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderConfigurationStep = () => {
    const options = [
      {
        id: 'single' as PanelConfig,
        title: 'Single Panel 90° Side Stack',
        description: 'Panels move one at a time. Ideal for simple layouts.',
      },
      {
        id: 'single-parallel' as PanelConfig,
        title: 'Single Panel Parallel Stack',
        description: 'Panels move one at a time and stack parallel to track run.',
      }
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Select Configuration</h2>
          <p className="text-slate-400 text-sm">Choose the operational mode for the glass partition.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPanelConfig(opt.id)}
              className={`text-left p-6 rounded-2xl border transition-all ${
                panelConfig === opt.id 
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xl font-bold ${panelConfig === opt.id ? 'text-emerald-400' : 'text-white'}`}>
                  {opt.title}
                </h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  panelConfig === opt.id ? 'border-emerald-500 bg-emerald-500' : 'border-white/20'
                }`}>
                  {panelConfig === opt.id && <div className="w-2 h-2 bg-black rounded-full" />}
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPocketStep = () => {
      const options = [
        {
          id: 'wtw' as PocketType,
          title: 'Wall to Wall',
          description: 'No pocket. Panels stack against the wall within the room.',
        },
        {
          id: 'inside' as PocketType,
          title: 'Pocket Inside Room',
          description: 'Storage pocket constructed within the room boundaries.',
        },
        {
          id: 'outside' as PocketType,
          title: 'Pocket Outside Room',
          description: 'Storage pocket constructed outside the room boundaries (remote).',
        }
      ];
  
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Select Storage Condition</h2>
              <p className="text-slate-400 text-sm">Define how and where the panels will be stored when not in use.</p>
          </div>
  
          <div className="grid grid-cols-1 gap-4">
              {options.map((opt) => (
                  <button
                      key={opt.id}
                      onClick={() => setPocketType(opt.id)}
                      className={`text-left p-6 rounded-2xl border transition-all ${
                          pocketType === opt.id
                              ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                  >
                      <div className="flex justify-between items-start mb-2">
                          <h3 className={`text-xl font-bold ${pocketType === opt.id ? 'text-emerald-400' : 'text-white'}`}>
                              {opt.title}
                          </h3>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              pocketType === opt.id ? 'border-emerald-500 bg-emerald-500' : 'border-white/20'
                          }`}>
                              {pocketType === opt.id && <div className="w-2 h-2 bg-black rounded-full" />}
                          </div>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{opt.description}</p>
                  </button>
              ))}
          </div>
        </div>
      );
    };
    
  const renderClosureStep = () => {
    const options = [
      {
        id: 'pivot' as ClosureType,
        title: 'Pivot Panel',
        description: 'Closure panel swings around. Can also be used as a pass door.',
      },
      {
        id: 'sliding' as ClosureType,
        title: 'Sliding Panel',
        description: 'Closure panel closes to the face of the pocket.',
      }
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Select Closure Method</h2>
            <p className="text-slate-400 text-sm">Choose how the system terminates and locks.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setClosure(opt.id)}
                    className={`text-left p-6 rounded-2xl border transition-all ${
                        closure === opt.id
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-bold ${closure === opt.id ? 'text-emerald-400' : 'text-white'}`}>
                            {opt.title}
                        </h3>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            closure === opt.id ? 'border-emerald-500 bg-emerald-500' : 'border-white/20'
                        }`}>
                            {closure === opt.id && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{opt.description}</p>
                </button>
            ))}
        </div>
      </div>
    );
  };

  const renderRailsStep = () => {
    const options = [
      {
        id: 'rails' as RailType,
        title: 'Horizontal Rails',
        description: 'Complete range of top and bottom rails. Meets ADA requirements. Multiple finish options.',
      },
      {
        id: 'patch' as RailType,
        title: 'Patch Fittings',
        description: 'Flush-mounted singlepoint fittings for an elegant all-glass appearance.',
      }
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Rails or Patch Fittings</h2>
            <p className="text-slate-400 text-sm">Select the hardware style for the glass panels.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setRail(opt.id)}
                    className={`text-left p-6 rounded-2xl border transition-all ${
                        rail === opt.id
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-bold ${rail === opt.id ? 'text-emerald-400' : 'text-white'}`}>
                            {opt.title}
                        </h3>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            rail === opt.id ? 'border-emerald-500 bg-emerald-500' : 'border-white/20'
                        }`}>
                            {rail === opt.id && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{opt.description}</p>
                </button>
            ))}
        </div>
      </div>
    );
  };

  const renderEgressStep = () => {
    const options = [
      {
        id: 'none' as EgressType,
        title: 'None',
        description: 'No egress option required.',
      },
      {
        id: 'end_pivot' as EgressType,
        title: 'End Pivot Panel',
        description: 'Fixed panel, provides final closure method as well as door option when optional push & pull handles are selected.',
      },
      {
        id: 'passdoor' as EgressType,
        title: 'Passdoor',
        description: 'Single or optional double passdoor. Available with multiple door handle hardware options.',
      }
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Egress Options</h2>
            <p className="text-slate-400 text-sm">Select passage options for the partition.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setEgress(opt.id)}
                    className={`text-left p-6 rounded-2xl border transition-all ${
                        egress === opt.id
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-bold ${egress === opt.id ? 'text-emerald-400' : 'text-white'}`}>
                            {opt.title}
                        </h3>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            egress === opt.id ? 'border-emerald-500 bg-emerald-500' : 'border-white/20'
                        }`}>
                            {egress === opt.id && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{opt.description}</p>
                </button>
            ))}
        </div>
      </div>
    );
  };



  const renderModelStep = () => {
    const options = [
      {
        id: 'acousti-clear' as ModelType,
        title: 'Acousti-Clear®',
        description: 'Modern, high-STC glass wall systems.',
      },
      {
        id: 'hsw' as ModelType,
        title: 'HSW Systems',
        description: 'Horizontal Sliding Walls for versatile space configuration.',
      }
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Select Model</h2>
            <p className="text-slate-400 text-sm">Choose the specific product line.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setModel(opt.id)}
                    className={`text-left p-6 rounded-2xl border transition-all ${
                        model === opt.id
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-bold ${model === opt.id ? 'text-emerald-400' : 'text-white'}`}>
                            {opt.title}
                        </h3>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            model === opt.id ? 'border-emerald-500 bg-emerald-500' : 'border-white/20'
                        }`}>
                            {model === opt.id && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{opt.description}</p>
                </button>
            ))}
        </div>
      </div>
    );
  };

  const renderTrackStep = () => {
    const options = [
      {
        id: 'standard' as TrackType,
        title: 'Standard Track',
        description: 'Durable aluminum track for standard applications.',
      },
      {
        id: 'heavy' as TrackType,
        title: 'Heavy Duty Track',
        description: 'Reinforced track system for taller or heavier panels.',
      }
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Select Track System</h2>
            <p className="text-slate-400 text-sm">Choose the suspension system.</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setTrack(opt.id)}
                    className={`text-left p-6 rounded-2xl border transition-all ${
                        track === opt.id
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-bold ${track === opt.id ? 'text-emerald-400' : 'text-white'}`}>
                            {opt.title}
                        </h3>
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            track === opt.id ? 'border-emerald-500 bg-emerald-500' : 'border-white/20'
                        }`}>
                            {track === opt.id && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{opt.description}</p>
                </button>
            ))}
        </div>
      </div>
    );
  };

  const renderGlassStep = () => {
    const options = [
      {
        id: 'clear' as GlassType,
        title: 'Clear',
        description: 'Standard clear tempered glass.',
      },
      {
        id: 'frosted' as GlassType,
        title: 'Frosted / Etched',
        description: 'Satin finish or etched design for privacy.',
      },
      {
        id: 'custom' as GlassType,
        title: 'Custom Glass Solutions',
        description: 'Contact Modernfold distributor for custom options.',
      }
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Select Glass Option</h2>
            <p className="text-slate-400 text-sm">Choose the glass transparency and style.</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setGlass(opt.id)}
                    className={`text-left p-6 rounded-2xl border transition-all ${
                        glass === opt.id
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                         <h3 className={`text-xl font-bold ${glass === opt.id ? 'text-emerald-400' : 'text-white'}`}>
                            {opt.title}
                        </h3>
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            glass === opt.id ? 'border-emerald-500 bg-emerald-500' : 'border-white/20'
                        }`}>
                            {glass === opt.id && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{opt.description}</p>
                </button>
            ))}
        </div>
      </div>
    );
  };

  const renderFinishStep = () => {
    const options = [
      { id: 'clear_anodized' as FinishType, title: 'Clear Anodized', color: '#e2e2e2' },
      { id: 'bronze_anodized' as FinishType, title: 'Bronze Anodized', color: '#cd7f32' },
      { id: 'black_anodized' as FinishType, title: 'Black Anodized', color: '#000000' },
      { id: 'white_powder' as FinishType, title: 'White Powder Coat', color: '#ffffff' },
      { id: 'custom' as FinishType, title: 'Custom Color', color: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)' }
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Rail Finish</h2>
            <p className="text-slate-400 text-sm">Select the finish for the top and bottom rails.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setFinish(opt.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        finish === opt.id
                            ? 'bg-emerald-500/10 border-emerald-500'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                    <div 
                        className="w-12 h-12 rounded-full border border-white/20 shadow-lg"
                        style={{ background: opt.color }}
                    />
                    <span className={`font-bold ${finish === opt.id ? 'text-emerald-400' : 'text-white'}`}>
                        {opt.title}
                    </span>
                </button>
            ))}
        </div>
      </div>
    );
  };

  const renderProjectInfoStep = () => {
      return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Project Information</h2>
                  <p className="text-slate-400 text-sm">Please provide details about the project.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                      { key: 'projectName', label: 'Project Name' },
                      { key: 'city', label: 'City' },
                      { key: 'state', label: 'State' },
                      { key: 'zip', label: 'Zip' },
                      { key: 'architect', label: 'Architect' },
                      { key: 'contactPerson', label: 'Contact Person' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' }
                  ].map((field) => (
                      <div key={field.key} className="space-y-2">
                          <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">
                              {field.label}
                          </label>
                          <input
                              type="text"
                              value={(projectInfo as any)[field.key]}
                              onChange={(e) => setProjectInfo({ ...projectInfo, [field.key]: e.target.value })}
                              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium placeholder:text-slate-700"
                              placeholder={`Enter ${field.label}`}
                          />
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  const renderSummaryStep = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-8 text-center mb-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all duration-1000" />
                <h2 className="text-3xl font-black text-white mb-2 relative z-10 italic">ALL DONE!</h2>
                <p className="text-emerald-400 relative z-10 font-bold tracking-wide">Review your Glass Partition Design</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { label: 'Location', value: location },
                    { label: 'Width', value: width.mode === 'feet-inches' ? `${width.feet}' ${width.inchMain}"` : `${width.inches}"` },
                    { label: 'Height', value: height.mode === 'feet-inches' ? `${height.feet}' ${height.inchMain}"` : `${height.inches}"` },
                    { label: 'Configuration', value: panelConfig },
                    { label: 'Pocket', value: pocketType },
                    { label: 'Closure', value: closure },
                    { label: 'Rails', value: rail },
                    { label: 'Egress', value: egress },
                    { label: 'Model', value: model },
                    { label: 'Track', value: track },
                    { label: 'Glass', value: glass },
                    { label: 'Finish', value: finish }
                ].map((item) => (
                    <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-slate-500 text-xs font-black uppercase tracking-widest">{item.label}</span>
                        <span className="text-white font-bold capitalize">{item.value || '-'}</span>
                    </div>
                ))}
            </div>
            
            <div className="pt-8">
                 <button 
                  onClick={() => {
                      alert('Design Saved!');
                      resetForm();
                  }}
                  className="w-full py-4 rounded-xl font-black uppercase tracking-tighter text-black bg-blue-500 shadow-[0_10px_30px_rgba(59,130,246,0.2)] transition-all hover:translate-y-[-2px] hover:shadow-[0_15px_40px_rgba(59,130,246,0.3)] active:translate-y-0 italic"
                >
                  Finish & Create Another
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-emerald-500/30">
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        
        {/* Left Side: Visual Preview */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center p-12 overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 z-0">
             <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" />
             <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[120px] rounded-full" />
          </div>
          
          <div className="relative z-10 w-full h-full max-w-2xl max-height-2xl flex flex-col justify-center gap-12">
            <div className="space-y-4 px-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                Glass Configuration
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white italic">
                Acousti-Clear <span className="text-blue-500 not-italic">Glass</span>
              </h2>
              <p className="text-slate-500 leading-relaxed text-lg font-medium">
                Modern, transparent space division with high acoustic performance.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="w-full lg:w-1/2 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0a0a0a] to-[#050505] relative">
          <div className="max-w-xl mx-auto px-8 py-16 lg:py-24">
            
            <header className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-3 bg-blue-500 rounded-sm skew-x-12" />
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                  Design <span className="text-blue-500 not-italic font-light">Planner</span>
                </h1>
              </div>
              
              {/* Step Tracker */}
              <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                {['dimensions', 'configuration', 'pocket', 'closure', 'rails', 'model', 'finish', 'summary'].map((step, idx) => {
                  const isActive = currentStep === step || 
                    (step === 'rails' && (currentStep === 'egress')) ||
                    (step === 'model' && (currentStep === 'track')) ||
                    (step === 'finish' && (currentStep === 'glass' || currentStep === 'project_info'));
                    
                  // Simplified tracker for display
                  if (!['dimensions', 'configuration', 'pocket', 'closure', 'rails', 'model', 'finish', 'summary'].includes(step)) return null;
                  return (
                    <div key={step} className="flex items-center gap-2 shrink-0">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black transition-all rotate-45 ${
                        isActive ? 'bg-blue-500 text-black shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 
                        'bg-white/5 border border-white/10 text-slate-600'
                      }`}>
                        <span className="-rotate-45">{idx + 1}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-700'}`}>
                        {step.slice(0, 3)}
                      </span>
                      {idx < 3 && <div className="w-4 h-[1px] bg-white/5" />}
                    </div>
                  );
                })}
              </div>
            </header>

            <section className="space-y-12">
              {currentStep === 'dimensions' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl transition-all hover:border-emerald-500/30">
                    <label className="block text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-4 ml-1">Partition Location</label>
                    <input 
                      type="text" 
                      defaultValue={location}
                      onBlur={(e) => setLocation(e.target.value)}
                      placeholder="EX: OFFICE 101..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold placeholder:text-slate-800 uppercase tracking-tight"
                    />
                  </div>
                  <div className="space-y-8">
                    {renderDimensionInput('Opening Width', width, setWidth)}
                    {renderDimensionInput('Opening Height', height, setHeight)}
                  </div>
                </div>
              )}

              {currentStep === 'configuration' && renderConfigurationStep()}
              
              {currentStep === 'pocket' && renderPocketStep()}
              
              {currentStep === 'closure' && renderClosureStep()}
              
              {currentStep === 'rails' && renderRailsStep()}
              
              {currentStep === 'egress' && renderEgressStep()}

              {currentStep === 'model' && renderModelStep()}
              
              {currentStep === 'track' && renderTrackStep()}
              
              {currentStep === 'glass' && renderGlassStep()}
              
              {currentStep === 'finish' && renderFinishStep()}

              {currentStep === 'project_info' && renderProjectInfoStep()}

              {currentStep === 'summary' && renderSummaryStep()}

              <div className="flex items-center justify-between pt-12 border-t border-white/5">
                <button 
                  onClick={handlePrevStep}
                  className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                    currentStep === 'dimensions' ? 'text-slate-800 pointer-events-none' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  ← Previous Step
                </button>
                
                <button 
                  onClick={handleNextStep}
                  className="group relative px-12 py-4 rounded-xl font-black uppercase tracking-tighter text-black bg-blue-500 shadow-[0_10px_30px_rgba(59,130,246,0.2)] transition-all hover:translate-y-[-2px] hover:shadow-[0_15px_40px_rgba(59,130,246,0.3)] active:translate-y-0 italic overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10">
                    {currentStep === 'summary' ? 'Finish' : 'Continue Step →'}
                  </span>
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
