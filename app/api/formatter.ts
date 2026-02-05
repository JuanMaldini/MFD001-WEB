type DimensionMode = "inches" | "feet-inches" | "metric";

interface DimensionValue {
  mode: DimensionMode;
  inches?: number;
  feet?: number;
  inchMain?: number;
  numerator?: number;
  denominator?: number;
  millimeters?: number;
}

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

const formatDimension = (value: DimensionValue) => {
  if (value.mode === "feet-inches") {
    const feet = value.feet || 0;
    const inches = value.inchMain || 0;
    const numerator = value.numerator || 0;
    const denominator = value.denominator || 0;
    const fraction =
      denominator > 0 && numerator > 0 ? ` ${numerator}/${denominator}` : "";
    return `${feet}' ${inches}"${fraction}`.trim();
  }

  if (value.mode === "inches") {
    return `${value.inches || 0} in`;
  }

  return `${value.millimeters || 0} mm`;
};

const buildUserBlock = (projectInfo: ProjectInfo) => {
  const name =
    projectInfo.contactPerson?.trim() ||
    projectInfo.projectName?.trim() ||
    "User";
  return {
    name,
    email: projectInfo.email || "",
  };
};

const mapValue = (
  value: string | number | boolean | null | undefined,
  map: Record<string, string>,
) => {
  if (value === null || value === undefined) return value;
  const key = String(value);
  return map[key] ?? value;
};

const OPERABLE_LABELS = {
  panelConfig: {
    paired: "Paired Panel",
    single: "Single Panel",
    "single-parallel": "Single Panel Parallel Stack",
  },
  pocketType: {
    wtw: "Wall to Wall",
    inside: "Pocket Inside Room",
    outside: "Pocket Outside Room",
  },
  durability: {
    highest: "Highest Durability",
    high: "High Durability",
    standard: "Standard Durability",
  },
  closure: {
    expandable: "Expandable Closure",
    hinged: "Hinged Closure",
  },
  track: {
    standard: "#17 Modernfold Track",
    heavy: "#14 Heavy Duty Track",
  },
  bottomSeal: {
    automatic: "Automatic Bottom Seal",
    operable: "Operable Bottom Seal",
  },
  finishType: {
    tba: "To Be Advised",
    vinyl: "Vinyl",
    fabric: "Fabric",
    carpet: "Carpet",
    com: "Customer's Own (COM)",
  },
  hingeType: {
    standard: "Standard Hinge",
    soss: "SOSS Invisible",
  },
  trimColor: {
    clear: "Clear Anodized",
    bronze: "Bronze",
    black: "Black",
    white: "White",
    custom: "Custom",
  },
  workSurfaceType: {
    marker_board: "Marker Board",
    tack_board: "Tack Board",
  },
};

const GLASS_LABELS = {
  panelConfig: {
    "single-panel": "Single Panel",
    "dual-panel": "Dual Panel",
    "multi-panel": "Multi-Panel",
  },
  pocketType: {
    wtw: "Wall to Wall",
    inside: "Pocket Inside Room",
    outside: "Pocket Outside Room",
  },
  closure: {
    pivot: "Pivot Closure",
    sliding: "Sliding Closure",
  },
  rail: {
    surface: "Surface Rails",
    patch: "Patch Fittings",
  },
  egress: {
    none: "No Egress",
    breakaway: "Breakaway",
    swing: "Swing Door",
  },
  model: {
    "acousti-clear": "Acousti-Clear",
    hsw: "HSW Glass Wall",
  },
  track: {
    standard: "Standard Track",
    heavy: "Heavy Duty Track",
  },
  glassType: {
    clear: "Clear Glass",
    frosted: "Frosted Glass",
    custom: "Custom Glass",
  },
  finishType: {
    clear: "Clear Anodized",
    bronze: "Bronze Anodized",
    black: "Black Anodized",
    satin: "Satin Stainless",
    custom: "Custom Finish",
  },
};

export const buildOperableJson = (data: {
  location: string;
  width: DimensionValue;
  height: DimensionValue;
  panelConfig: string | null;
  pocketType: string | null;
  hasPocketDoor: boolean;
  durability: string | null;
  stc: number | null;
  closure: string | null;
  track: string | null;
  bottomSeal: string | null;
  finishType: string | null;
  hingeType: string | null;
  trimColor: string | null;
  passdoor: boolean;
  workSurface: boolean;
  workSurfaceType: string;
  projectInfo: ProjectInfo;
}) => {
  const user = buildUserBlock(data.projectInfo);
  return {
    product: "operable-partition",
    sections: [
      {
        title: "Dimensions",
        fields: {
          location: data.location,
          widthFormatted: formatDimension(data.width),
          width: data.width,
          heightFormatted: formatDimension(data.height),
          height: data.height,
        },
      },
      {
        title: "Configuration",
        fields: {
          panelConfig: mapValue(data.panelConfig, OPERABLE_LABELS.panelConfig),
        },
      },
      {
        title: "Pocket",
        fields: {
          pocketType: mapValue(data.pocketType, OPERABLE_LABELS.pocketType),
          pocketDoor: data.hasPocketDoor
            ? "Include Pocket Door"
            : "Not Included",
        },
      },
      {
        title: "Durability",
        fields: {
          durability: mapValue(data.durability, OPERABLE_LABELS.durability),
        },
      },
      {
        title: "STC",
        fields: {
          stc: data.stc,
        },
      },
      {
        title: "Closure",
        fields: {
          closure: mapValue(data.closure, OPERABLE_LABELS.closure),
        },
      },
      {
        title: "Track",
        fields: {
          track: mapValue(data.track, OPERABLE_LABELS.track),
        },
      },
      {
        title: "Bottom Seal",
        fields: {
          bottomSeal: mapValue(data.bottomSeal, OPERABLE_LABELS.bottomSeal),
        },
      },
      {
        title: "Finish",
        fields: {
          finishType: mapValue(data.finishType, OPERABLE_LABELS.finishType),
        },
      },
      {
        title: "Hinge & Trim",
        fields: {
          hingeType: mapValue(data.hingeType, OPERABLE_LABELS.hingeType),
          trimColor: mapValue(data.trimColor, OPERABLE_LABELS.trimColor),
        },
      },
      {
        title: "Options",
        fields: {
          passdoor: data.passdoor ? "Passdoor" : "Not Selected",
          workSurface: data.workSurface ? "Worksurface" : "Not Selected",
          workSurfaceType: data.workSurface
            ? mapValue(data.workSurfaceType, OPERABLE_LABELS.workSurfaceType)
            : "Not Selected",
        },
      },
      {
        title: "Project Info",
        fields: {
          projectName: data.projectInfo.projectName,
          city: data.projectInfo.city,
          state: data.projectInfo.state,
          zip: data.projectInfo.zip,
          architect: data.projectInfo.architect,
          contactPerson: data.projectInfo.contactPerson,
          email: data.projectInfo.email,
          phone: data.projectInfo.phone,
        },
      },
      {
        title: "User",
        fields: user,
      },
    ],
  };
};

export const buildGlassJson = (data: {
  location: string;
  width: DimensionValue;
  height: DimensionValue;
  panelConfig: string | null;
  pocketType: string | null;
  hasPocketDoor: boolean;
  closure: string | null;
  rail: string | null;
  egress: string | null;
  model: string | null;
  track: string | null;
  glassType: string | null;
  finishType: string | null;
  projectInfo: ProjectInfo;
}) => {
  const user = buildUserBlock(data.projectInfo);
  return {
    product: "glass-partition",
    sections: [
      {
        title: "Dimensions",
        fields: {
          location: data.location,
          widthFormatted: formatDimension(data.width),
          width: data.width,
          heightFormatted: formatDimension(data.height),
          height: data.height,
        },
      },
      {
        title: "Configuration",
        fields: {
          panelConfig: mapValue(data.panelConfig, GLASS_LABELS.panelConfig),
        },
      },
      {
        title: "Pocket",
        fields: {
          pocketType: mapValue(data.pocketType, GLASS_LABELS.pocketType),
          pocketDoor: data.hasPocketDoor
            ? "Include Pocket Door"
            : "Not Included",
        },
      },
      {
        title: "Closure",
        fields: {
          closure: mapValue(data.closure, GLASS_LABELS.closure),
        },
      },
      {
        title: "Rail System",
        fields: {
          rail: mapValue(data.rail, GLASS_LABELS.rail),
        },
      },
      {
        title: "Egress",
        fields: {
          egress: mapValue(data.egress, GLASS_LABELS.egress),
        },
      },
      {
        title: "Model",
        fields: {
          model: mapValue(data.model, GLASS_LABELS.model),
        },
      },
      {
        title: "Track",
        fields: {
          track: mapValue(data.track, GLASS_LABELS.track),
        },
      },
      {
        title: "Glass Type",
        fields: {
          glassType: mapValue(data.glassType, GLASS_LABELS.glassType),
        },
      },
      {
        title: "Finish",
        fields: {
          finishType: mapValue(data.finishType, GLASS_LABELS.finishType),
        },
      },
      {
        title: "Project Info",
        fields: {
          projectName: data.projectInfo.projectName,
          city: data.projectInfo.city,
          state: data.projectInfo.state,
          zip: data.projectInfo.zip,
          architect: data.projectInfo.architect,
          contactPerson: data.projectInfo.contactPerson,
          email: data.projectInfo.email,
          phone: data.projectInfo.phone,
        },
      },
      {
        title: "User",
        fields: user,
      },
    ],
  };
};
