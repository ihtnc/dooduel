import { ReactNode } from "react";

export type IconButtonProps = {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  imageAlt?: string;
};