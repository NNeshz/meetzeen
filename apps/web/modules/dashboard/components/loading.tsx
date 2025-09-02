import { IconLoader } from "@tabler/icons-react";

export function Loading({ className, message } : { className?: string, message?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <IconLoader className="animate-spin" />
      {message && <span className="ml-2">{message}</span>}
    </div>
  );
}