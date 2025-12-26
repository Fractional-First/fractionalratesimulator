import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-G442PSJ6GM";

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Generic event tracking
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({ category, action, label, value });
};

// Journey-specific events
export const trackStageCompleted = (stageName: string) => {
  trackEvent("Journey", "stage_completed", stageName);
};

export const trackUtilizationChange = (utilizationRate: number) => {
  trackEvent("Input", "utilization_updated", undefined, Math.round(utilizationRate));
};

export const trackPipelineSelected = (health: string) => {
  trackEvent("Input", "pipeline_selected", health);
};

export const trackCtaClicked = (ctaText: string) => {
  trackEvent("Conversion", "cta_clicked", ctaText);
};
