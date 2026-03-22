import React from "react";
import type { Scene } from "../types/schema";
import { IconGrid } from "./scenes/IconGrid";
import { Timeline } from "./scenes/Timeline";
import { Mapping } from "./scenes/Mapping";
import { BranchDiagram } from "./scenes/BranchDiagram";
import { IconTextCard } from "./scenes/IconTextCard";
import { SectionTitle } from "./scenes/SectionTitle";
import { ProgressBar } from "./scenes/ProgressBar";
import { FeatureList } from "./scenes/FeatureList";
import { Comparison } from "./scenes/Comparison";
import { BarChart } from "./scenes/BarChart";
import { DonutChart } from "./scenes/DonutChart";
import { FlowDiagram } from "./scenes/FlowDiagram";
import { BigNumber } from "./scenes/BigNumber";
import { GifScene } from "./scenes/GifScene";

export const SceneRouter: React.FC<{ scene: Scene }> = ({ scene }) => {
  switch (scene.type) {
    case "IconGrid":
      return <IconGrid {...scene} />;
    case "Timeline":
      return <Timeline {...scene} />;
    case "Mapping":
      return <Mapping {...scene} />;
    case "BranchDiagram":
      return <BranchDiagram {...scene} />;
    case "IconTextCard":
      return <IconTextCard {...scene} />;
    case "SectionTitle":
      return <SectionTitle {...scene} />;
    case "ProgressBar":
      return <ProgressBar {...scene} />;
    case "FeatureList":
      return <FeatureList {...scene} />;
    case "Comparison":
      return <Comparison {...scene} />;
    case "BarChart":
      return <BarChart {...scene} />;
    case "DonutChart":
      return <DonutChart {...scene} />;
    case "FlowDiagram":
      return <FlowDiagram {...scene} />;
    case "BigNumber":
      return <BigNumber {...scene} />;
    case "GifScene":
      return <GifScene {...scene} />;
    default:
      return null;
  }
};
