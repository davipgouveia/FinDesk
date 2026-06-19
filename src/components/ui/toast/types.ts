import type { ReactNode } from "react";

export type SileoState = "success" | "loading" | "error" | "warning" | "info" | "action";

export interface SileoButton {
  title: string;
  onClick: () => void;
}

export const SILEO_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

export type SileoPosition = (typeof SILEO_POSITIONS)[number];

export interface SileoOptions {
  title?: string;
  description?: ReactNode | string;
  type?: SileoState;
  position?: SileoPosition;
  duration?: number | null;
  icon?: ReactNode | null;
  button?: SileoButton;
}

export interface InternalSileoOptions extends SileoOptions {
  id?: string;
  state?: SileoState;
}

export interface SileoItem extends InternalSileoOptions {
  id: string;
  instanceId: string;
  exiting?: boolean;
}
