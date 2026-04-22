import { useEffect, useState } from "react";
import { FormNumericInput } from "../components/formUtils/FormNumericInput";

type DimensionMode = "inches" | "metric";
type Step =
  | "dimensions"
  | "configuration"
  | "pocket"
  | "closure"
  | "rail"
  | "egress"
  | "model"
  | "track"
  | "glass"
  | "finish"
  | "project_info"
  | "summary";

interface DimensionValue {
  mode: DimensionMode;
  inches?: number;
  millimeters?: number;
}

type PanelConfig = "single-panel" | "dual-panel" | "multi-panel";
type PocketType = "wtw" | "inside" | "outside";
type ClosureType = "pivot" | "sliding";
type RailType = "surface" | "patch";
type EgressType = "none" | "breakaway" | "swing";
type ModelType = "acousti-clear" | "hsw";
type TrackType = "standard" | "heavy";
type GlassType = "clear" | "frosted" | "custom";
type FinishType = "clear" | "bronze" | "black" | "satin" | "custom";

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
  const ACCENT = "emerald-600";
  const card = "bg-white border border-slate-200 rounded-xl p-3 shadow-sm";
  const STEP_ORDER: Step[] = [
    "dimensions",
    "configuration",
    "pocket",
    "closure",
    "rail",
    "egress",
    "model",
    "track",
    "glass",
    "finish",
    "project_info",
    "summary",
  ];

  const STEP_LABELS: Record<Step, string> = {
    dimensions: "Dimensions",
    configuration: "Configuration",
    pocket: "Storage Condition",
    closure: "Closure",
    rail: "Rail System",
    egress: "Egress",
    model: "Model",
    track: "Track",
    glass: "Glass Type",
    finish: "Finish",
    project_info: "Project Info",
    summary: "Summary",
  };

  const goToStep = (id: Step) => setCurrentStep(id);
  const [currentStep, setCurrentStep] = useState<Step>("dimensions");
  const [visitedSteps, setVisitedSteps] = useState<Set<Step>>(
    () => new Set(["dimensions"]),
  );
  const [location, setLocation] = useState("");
  const [dimensionMode, setDimensionMode] = useState<DimensionMode>("inches");
  const [width, setWidth] = useState<DimensionValue>({
    mode: "inches",
    inches: 0,
  });
  const [height, setHeight] = useState<DimensionValue>({
    mode: "inches",
    inches: 0,
  });
  const [panelConfig, setPanelConfig] = useState<PanelConfig | null>(null);

  // Pocket State
  const [pocketType, setPocketType] = useState<PocketType | null>(null);
  const [hasPocketDoor, setHasPocketDoor] = useState(false);

  // New State for Glass Hardware
  const [closure, setClosure] = useState<ClosureType | null>(null);
  const [rail, setRail] = useState<RailType | null>(null);
  const [egress, setEgress] = useState<EgressType | null>(null);

  // New State for Glass Model
  const [model, setModel] = useState<ModelType | null>(null);
  const [track, setTrack] = useState<TrackType | null>(null);
  const [glassType, setGlassType] = useState<GlassType | null>(null);

  // New State for Aesthetics
  const [finishType, setFinishType] = useState<FinishType | null>(null);

  // New State for Project Info
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: "",
    city: "",
    state: "",
    zip: "",
    architect: "",
    contactPerson: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisitedSteps((prev) => {
      const next = new Set(prev);
      next.add(currentStep);
      return next;
    });
  }, [currentStep]);
  const isDimensionsComplete = () => {
    if (!location.trim()) return false;

    const isValueValid = (val: DimensionValue) => {
      if (val.mode === "inches") return (val.inches || 0) > 0;
      if (val.mode === "metric") return (val.millimeters || 0) > 0;
      return false;
    };

    return isValueValid(width) && isValueValid(height);
  };

  const isStepComplete = (step: Step) => {
    switch (step) {
      case "dimensions":
        return isDimensionsComplete();
      case "configuration":
        return !!panelConfig;
      case "pocket":
        return !!pocketType;
      case "closure":
        return !!closure;
      case "rail":
        return !!rail;
      case "egress":
        return !!egress;
      case "model":
        return !!model;
      case "track":
        return !!track;
      case "glass":
        return !!glassType;
      case "finish":
        return !!finishType;
      case "project_info":
        return !!projectInfo.projectName.trim() && !!projectInfo.email.trim();
      case "summary":
        return false;
      default:
        return false;
    }
  };

  const isFormComplete = () => {
    return STEP_ORDER.filter((step) => step !== "summary").every((step) =>
      isStepComplete(step),
    );
  };

  const formatDimensionForSummary = (value: DimensionValue) => {
    if (value.mode === "inches") {
      return `${value.inches || 0} in`;
    }

    return `${value.millimeters || 0} mm`;
  };

  const resetForm = () => {
    setLocation("");
    setDimensionMode("inches");
    setWidth({
      mode: "inches",
      inches: 0,
    });
    setHeight({
      mode: "inches",
      inches: 0,
    });
    setPanelConfig(null);
    setPocketType(null);
    setHasPocketDoor(false);
    setClosure(null);
    setRail(null);
    setEgress(null);
    setModel(null);
    setTrack(null);
    setGlassType(null);
    setFinishType(null);
    setProjectInfo({
      projectName: "",
      city: "",
      state: "",
      zip: "",
      architect: "",
      contactPerson: "",
      email: "",
      phone: "",
    });
    setVisitedSteps(new Set(["dimensions"]));
    setCurrentStep("dimensions");
  };

  const handleDimensionModeChange = (mode: DimensionMode) => {
    setDimensionMode(mode);
    setWidth((prev) => ({ ...prev, mode }));
    setHeight((prev) => ({ ...prev, mode }));
  };

  const updateWidth = (nextValue: Partial<DimensionValue>) => {
    setWidth((prev) => ({
      ...prev,
      mode: dimensionMode,
      ...nextValue,
    }));
  };

  const updateHeight = (nextValue: Partial<DimensionValue>) => {
    setHeight((prev) => ({
      ...prev,
      mode: dimensionMode,
      ...nextValue,
    }));
  };

  const renderDimensionRow = (
    label: string,
    value: DimensionValue,
    onChange: (nextValue: Partial<DimensionValue>) => void,
  ) => {
    if (dimensionMode === "inches") {
      return (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            {label}
          </p>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
            <span className="text-[10px] font-medium text-slate-500">
              Inches
            </span>
            <FormNumericInput
              value={value.inches}
              onValueChange={(inches) => onChange({ inches })}
              min={0}
              step={0.01}
              usage="decimal"
              clampMode="hard"
              styleType="minimal"
              placeholder="total inches"
              ariaLabel={`${label} total inches`}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          {label}
        </p>
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
          <span className="text-[10px] font-medium text-slate-500">
            Millimeters
          </span>
          <FormNumericInput
            value={value.millimeters}
            onValueChange={(millimeters) => onChange({ millimeters })}
            min={0}
            step={0.1}
            usage="decimal"
            clampMode="hard"
            styleType="minimal"
            placeholder="millimeters"
            ariaLabel={`${label} millimeters`}
          />
        </div>
      </div>
    );
  };

  const renderOpeningDimensionsCompact = () => {
    return (
      <div className={`${card} w-full`}>
        <div className="mb-2 border-b border-slate-200 pb-2">
          <h3 className="text-sm font-semibold tracking-wide text-slate-700">
            Opening Dimensions
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {renderDimensionRow("Width", width, updateWidth)}
          {renderDimensionRow("Height", height, updateHeight)}
        </div>
      </div>
    );
  };

  const renderConfigurationStep = () => {
    const options = [
      {
        id: "single-panel-90" as PanelConfig,
        title: "Single Panel 90° Side Stack",
        description:
          "Single panel system where panels move one at a time and stack at a 90-degree angle.",
        app: "Conference rooms, Office partitions, Private spaces.",
      },
      {
        id: "single-panel-parallel" as PanelConfig,
        title: "Single Panel Parallel Stack",
        description:
          "Single panel system where panels move one at a time and are stacked parallel to the track run.",
        app: "Conference rooms, Office partitions, Private spaces.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Select Panel Configuration
          </h2>
          <p className="text-slate-600 text-sm">
            Choose the operational mode that best fits your space requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPanelConfig(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                panelConfig === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${panelConfig === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    panelConfig === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {panelConfig === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-2 leading-relaxed">
                {opt.description}
              </p>
              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">
                  Common Applications
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {opt.app}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPocketStep = () => {
    const options = [
      {
        id: "wtw" as PocketType,
        title: "Wall to Wall",
        description:
          "No pocket. Panels stack against the wall within the room.",
        allowDoor: false,
      },
      {
        id: "inside" as PocketType,
        title: "Pocket Inside Room",
        description: "Storage pocket constructed within the room boundaries.",
        allowDoor: true,
      },
      {
        id: "outside" as PocketType,
        title: "Pocket Outside Room",
        description:
          "Storage pocket constructed outside the room boundaries (remote).",
        allowDoor: true,
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Select Storage Condition
          </h2>
          <p className="text-slate-400 text-sm">
            Define how and where the panels will be stored when not in use.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`relative rounded-2xl border transition-all ${
                pocketType === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => {
                  setPocketType(opt.id);
                  if (!opt.allowDoor) setHasPocketDoor(false);
                }}
                className="w-full text-left p-2"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className={`text-xl font-bold ${pocketType === opt.id ? "text-emerald-400" : "text-white"}`}
                  >
                    {opt.title}
                  </h3>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      pocketType === opt.id
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-white/20"
                    }`}
                  >
                    {pocketType === opt.id && (
                      <div className="w-2 h-2 bg-black rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {opt.description}
                </p>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClosureStep = () => {
    const options = [
      {
        id: "pivot" as ClosureType,
        title: "Pivot Closure",
        description:
          "Panel pivots on center or offset axis. Provides elegant entry and exit points.",
      },
      {
        id: "sliding" as ClosureType,
        title: "Sliding Closure",
        description:
          "Panel slides along track system. Ideal for space-efficient operation.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Select Closure Method
          </h2>
          <p className="text-slate-400 text-sm">
            Choose how the final panel closes the opening.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setClosure(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                closure === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${closure === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    closure === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {closure === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderRailStep = () => {
    const options = [
      {
        id: "surface" as RailType,
        title: "Surface Rails",
        description:
          "Traditional overhead track system. Visible hardware with robust support.",
      },
      {
        id: "patch" as RailType,
        title: "Patch Fittings",
        description:
          "Minimalist point-fixed system. Nearly invisible hardware for modern aesthetics.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">Rail System</h2>
          <p className="text-slate-400 text-sm">
            Select the mounting and support system for the glass panels.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setRail(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                rail === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${rail === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    rail === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {rail === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderEgressStep = () => {
    const options = [
      {
        id: "none" as EgressType,
        title: "No Egress",
        description:
          "Standard fixed panel installation with no emergency exit.",
      },
      {
        id: "breakaway" as EgressType,
        title: "Breakaway",
        description:
          "Panels release from track under pressure for emergency egress.",
      },
      {
        id: "swing" as EgressType,
        title: "Swing Door",
        description:
          "Dedicated swing door panel for code-compliant emergency exit.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">Egress Option</h2>
          <p className="text-slate-400 text-sm">
            Select emergency exit requirements for the installation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setEgress(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                egress === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${egress === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    egress === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {egress === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderModelStep = () => {
    const options = [
      {
        id: "acousti-clear" as ModelType,
        title: "Acousti-Clear",
        description:
          "Acoustic glass panel system. Provides sound control with visual transparency.",
        app: "Conference rooms, Huddle spaces, Executive offices.",
      },
      {
        id: "hsw" as ModelType,
        title: "HSW Glass Wall",
        description:
          "Heavy-duty glass wall system. Maximum structural integrity for large spans.",
        app: "Lobbies, Atriums, High-traffic areas.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Select Glass Model
          </h2>
          <p className="text-slate-400 text-sm">
            Choose the glass partition system type.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setModel(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                model === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${model === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    model === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {model === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-2 leading-relaxed">
                {opt.description}
              </p>
              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">
                  Applications
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {opt.app}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTrackStep = () => {
    const options = [
      {
        id: "standard" as TrackType,
        title: "Standard Track",
        description:
          "Standard aluminum track system for typical glass panel weights.",
      },
      {
        id: "heavy" as TrackType,
        title: "Heavy Duty Track",
        description:
          "Reinforced track system for larger, heavier glass panels.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">Track System</h2>
          <p className="text-slate-400 text-sm">
            Select the suspension system suitable for your configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTrack(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                track === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${track === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    track === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {track === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderGlassStep = () => {
    const options = [
      {
        id: "clear" as GlassType,
        title: "Clear Glass",
        description: "Standard transparent glass. Maximum light transmission.",
      },
      {
        id: "frosted" as GlassType,
        title: "Frosted Glass",
        description:
          "Translucent finish. Provides privacy while allowing light.",
      },
      {
        id: "custom" as GlassType,
        title: "Custom Glass",
        description: "Tinted, patterned, or specialty glass options available.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">Glass Type</h2>
          <p className="text-slate-400 text-sm">
            Select the glass transparency and finish.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setGlassType(opt.id)}
              className={`text-left p-2 rounded-xl border transition-all flex items-center justify-between group ${
                glassType === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div>
                <h3
                  className={`font-bold ${glassType === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1">{opt.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  glassType === opt.id
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-white/20"
                }`}
              >
                {glassType === opt.id && (
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderFinishStep = () => {
    const options = [
      { id: "black_anodized" as FinishType, title: "Black Anodized" },
      { id: "clear_anodized" as FinishType, title: "Clear Anodized" },
      {
        id: "dark_bronze_anodized" as FinishType,
        title: "Dark Bronze Anodized",
      },
      { id: "polished_brass" as FinishType, title: "Polished Brass" },

      {
        id: "polished_stainless_steel" as FinishType,
        title: "Polished Stainless Steel",
      },
      {
        id: "ral_gloss" as FinishType,
        title: 'RAL "Classic" Powder Coat (Gloss Finish)',
      },
      {
        id: "ral_satin" as FinishType,
        title: 'RAL "Classic" Powder Coat (Satin Finish)',
      },
      { id: "satin_brass" as FinishType, title: "Satin Brass" },

      {
        id: "satin_stainless_anodized" as FinishType,
        title: "Satin Stainless Anodized",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Hardware Finish
          </h2>
          <p className="text-slate-400 text-sm">
            Select the finish for all metal components.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFinishType(opt.id)}
              className={`text-left p-2 rounded-xl border transition-all flex items-center justify-between group ${
                finishType === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div>
                <h3
                  className={`font-bold ${finishType === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  finishType === opt.id
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-white/20"
                }`}
              >
                {finishType === opt.id && (
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectInfoStep = () => {
    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Project Information
          </h2>
          <p className="text-slate-400 text-sm">
            Please provide details about the project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={projectInfo.projectName}
              onChange={(e) =>
                setProjectInfo({ ...projectInfo, projectName: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
              placeholder="e.g. Modernfold HQ Renovation"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              City
            </label>
            <input
              type="text"
              value={projectInfo.city}
              onChange={(e) =>
                setProjectInfo({ ...projectInfo, city: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              State / Zip
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={projectInfo.state}
                onChange={(e) =>
                  setProjectInfo({ ...projectInfo, state: e.target.value })
                }
                className="w-1/3 bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="State"
              />
              <input
                type="text"
                value={projectInfo.zip}
                onChange={(e) =>
                  setProjectInfo({ ...projectInfo, zip: e.target.value })
                }
                className="w-2/3 bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="Zip Code"
              />
            </div>
          </div>

          <div className="col-span-2 h-[1px] bg-white/5 my-2" />

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Architect / Designer
            </label>
            <input
              type="text"
              value={projectInfo.architect}
              onChange={(e) =>
                setProjectInfo({ ...projectInfo, architect: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              value={projectInfo.contactPerson}
              onChange={(e) =>
                setProjectInfo({
                  ...projectInfo,
                  contactPerson: e.target.value,
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={projectInfo.email}
              onChange={(e) =>
                setProjectInfo({ ...projectInfo, email: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={projectInfo.phone}
              onChange={(e) =>
                setProjectInfo({ ...projectInfo, phone: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modernfold-light bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500/30 w-full min-h-full pb-6">
      <div className="flex flex-col w-full">
        {/* Main Content */}
        <div className="w-full relative">
          <div className="w-full max-w-5xl mx-auto px-3 md:px-5 py-3">
            <header className={`${card} mb-4`}>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                <div className="h-6 w-2 bg-[color:var(--accent,#10b981)] rounded-sm" />
                <h1 className="text-xl font-black tracking-tight text-slate-700 flex items-baseline gap-2">
                  Design Planner
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {STEP_LABELS[currentStep]}
                  </span>
                </h1>
              </div>

              <div className="flex gap-2 flex-wrap">
                {STEP_ORDER.map((id, idx) => {
                  const isActive = currentStep === id;
                  const furthestReachedIndex = Math.max(
                    ...Array.from(visitedSteps).map((step) =>
                      STEP_ORDER.indexOf(step),
                    ),
                  );
                  const isCurrentComplete = isStepComplete(currentStep);
                  const isCompleted =
                    id === "summary"
                      ? currentStep === "summary" && isFormComplete()
                      : isStepComplete(id);
                  const isNextEnabled =
                    idx === furthestReachedIndex + 1 && isCurrentComplete;
                  const isUnlockedByHistory = idx <= furthestReachedIndex;
                  const isDisabled = !(isUnlockedByHistory || isNextEnabled);
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        if (isDisabled) return;
                        goToStep(id);
                      }}
                      aria-current={isActive}
                      disabled={isDisabled}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${isCompleted ? `bg-${ACCENT} text-black` : "bg-white/5 text-slate-500"} ${isNextEnabled && !isActive && !isCompleted ? "ring-1 ring-emerald-400/40 text-emerald-400/80" : ""} ${isActive ? "ring-2 ring-emerald-400/70" : ""} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                      title={`${idx + 1}. ${STEP_LABELS[id]}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </header>

            <section className="space-y-3">
              {currentStep === "dimensions" && (
                <div className="space-y-3">
                  <div className={`${card} w-full`}>
                    <div className="mb-3 pb-2 border-b border-slate-200">
                      <h3 className="text-sm font-bold tracking-wide text-slate-700">
                        Partition Location
                      </h3>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location name"
                        className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>
                  <div className={`${card} w-full`}>
                    <div className="mb-3 pb-2 border-b border-slate-200">
                      <h3 className="text-sm font-bold tracking-wide text-slate-700">
                        Dimension Unit
                      </h3>
                    </div>
                    <div className="grid grid-flow-col auto-cols-max gap-1 bg-slate-100 p-0.5 rounded-lg w-full border border-slate-200 overflow-x-auto">
                      {(["inches", "metric"] as DimensionMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleDimensionModeChange(mode)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide whitespace-nowrap transition-all ${
                            dimensionMode === mode
                              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                              : "text-slate-600 hover:text-slate-900 hover:bg-white"
                          }`}
                        >
                          {mode === "inches" ? "Inches" : "Metric"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {renderOpeningDimensionsCompact()}
                  </div>
                </div>
              )}

              {currentStep === "configuration" && renderConfigurationStep()}

              {currentStep === "pocket" && renderPocketStep()}

              {currentStep === "closure" && renderClosureStep()}

              {currentStep === "rail" && renderRailStep()}

              {currentStep === "egress" && renderEgressStep()}

              {currentStep === "model" && renderModelStep()}

              {currentStep === "track" && renderTrackStep()}

              {currentStep === "glass" && renderGlassStep()}

              {currentStep === "finish" && renderFinishStep()}

              {currentStep === "project_info" && renderProjectInfoStep()}

              {currentStep === "summary" && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 animate-in zoom-in-95 duration-500">
                  {isFormComplete() ? (
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-8 h-8 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-8 h-8 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-white mb-2 text-center">
                    {isFormComplete()
                      ? "Configuration Complete"
                      : "Configuration Incomplete"}
                  </h2>
                  <p className="text-slate-400 mb-4 text-center">
                    {isFormComplete()
                      ? "Here is the summary of your glass partition specification."
                      : "Complete all steps to finalize the configuration."}
                  </p>

                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/5 pb-4">
                      <span className="text-emerald-400 font-bold col-span-2 text-xs uppercase tracking-wider mb-1">
                        Dimensions & Location
                      </span>
                      <span className="text-slate-500">Location:</span>{" "}
                      <span className="text-right">{location}</span>
                      <span className="text-slate-500">Width:</span>{" "}
                      <span className="text-right">
                        {formatDimensionForSummary({
                          ...width,
                          mode: dimensionMode,
                        })}
                      </span>
                      <span className="text-slate-500">Height:</span>{" "}
                      <span className="text-right">
                        {formatDimensionForSummary({
                          ...height,
                          mode: dimensionMode,
                        })}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/5 pb-4">
                      <span className="text-emerald-400 font-bold col-span-2 text-xs uppercase tracking-wider mb-1">
                        Configuration
                      </span>
                      <span className="text-slate-500">Panel Layout:</span>{" "}
                      <span className="text-right capitalize">
                        {panelConfig}
                      </span>
                      <span className="text-slate-500">Pocket:</span>{" "}
                      <span className="text-right capitalize">
                        {pocketType === "wtw" ? "Wall to Wall" : pocketType}
                      </span>
                      <span className="text-slate-500">Pocket Door:</span>{" "}
                      <span className="text-right">
                        {hasPocketDoor ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/5 pb-4">
                      <span className="text-emerald-400 font-bold col-span-2 text-xs uppercase tracking-wider mb-1">
                        Hardware & Glass
                      </span>
                      <span className="text-slate-500">Closure:</span>{" "}
                      <span className="text-right capitalize">{closure}</span>
                      <span className="text-slate-500">Rail System:</span>{" "}
                      <span className="text-right capitalize">{rail}</span>
                      <span className="text-slate-500">Egress:</span>{" "}
                      <span className="text-right capitalize">{egress}</span>
                      <span className="text-slate-500">Model:</span>{" "}
                      <span className="text-right capitalize">{model}</span>
                      <span className="text-slate-500">Track:</span>{" "}
                      <span className="text-right capitalize">{track}</span>
                      <span className="text-slate-500">Glass Type:</span>{" "}
                      <span className="text-right capitalize">{glassType}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/5 pb-4">
                      <span className="text-emerald-400 font-bold col-span-2 text-xs uppercase tracking-wider mb-1">
                        Finish
                      </span>
                      <span className="text-slate-500">Hardware Finish:</span>{" "}
                      <span className="text-right capitalize">
                        {finishType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <span className="text-emerald-400 font-bold col-span-2 text-xs uppercase tracking-wider mb-1">
                        Project Info
                      </span>
                      <span className="text-slate-500">Project:</span>{" "}
                      <span className="text-right">
                        {projectInfo.projectName}
                      </span>
                      <span className="text-slate-500">Contact:</span>{" "}
                      <span className="text-right">
                        {projectInfo.contactPerson}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full rounded-md bg-emerald-600 py-2 text-sm font-bold text-white transition-all hover:brightness-110"
                    >
                      Start new form
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
