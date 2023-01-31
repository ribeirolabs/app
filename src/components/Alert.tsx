import { ComponentType, ReactNode, useMemo } from "react";
import {
  ErrorIcon,
  IconProps,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "@common/components/Icons";
import { cn } from "@common/utils/classNames";

const CLASSES = {
  alert: {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  },
  text: {
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  },
};

const ICONS: Record<AlertType, ComponentType<IconProps>> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

export type AlertProps = {
  type?: AlertType;
  onClick?: () => void;
  children: ReactNode;
  fluid?: boolean;
  inverse?: boolean;
  className?: string;
  hideIcon?: boolean;
};

export const Alert = ({
  type = "info",
  onClick,
  children,
  fluid,
  inverse,
  className,
  hideIcon,
}: AlertProps) => {
  const Icon = ICONS[type];

  const classes = useMemo(() => {
    return inverse ? CLASSES.text[type] : CLASSES.alert[type];
  }, [type, inverse]);

  return (
    <div
      className={cn(
        "alert cursor-pointer sm:w-full",
        fluid ? "w-full" : "",
        onClick == null ? "cursor-default" : "",
        classes,
        className
      )}
      onClick={onClick}
    >
      <div className="w-full">
        {hideIcon ? null : <Icon size={24} />}

        <span className="leading-4 text-sm">{children}</span>
      </div>
    </div>
  );
};
