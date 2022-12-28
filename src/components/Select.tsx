import { cn } from "@common/utils/classNames";
import { PropsWithChildren } from "react";

export function Select({
  children,
  error,
  label,
  helper,
  ...props
}: PropsWithChildren<JSX.IntrinsicElements["select"]> & {
  error?: boolean;
  label?: string;
  helper?: string;
}) {
  return (
    <div className="form-control w-full mb-2">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      <div className="input-group">
        <select
          className={cn(
            "select select-bordered w-full",
            error ? "select-error" : ""
          )}
          {...props}
        >
          {children}
        </select>
      </div>

      {helper && (
        <label className="label">
          <span className="label-text-alt"></span>
          <span className="label-text-alt">{helper}</span>
        </label>
      )}
    </div>
  );
}
