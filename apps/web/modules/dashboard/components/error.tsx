import { Button } from "@meetzeen/ui/src/components/button";
import { IconRefresh } from "@tabler/icons-react";

export function Error({
  className,
  icon,
  retry,
  message,
}: {
  className?: string;
  icon?: React.ReactNode;
  retry?: () => void;
  message?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {icon && <span className="mr-2">{icon}</span>}
      <p className="text-red-500">Error: {message || "Something went wrong"}</p>
      {retry && (
        <Button onClick={retry} variant={"outline"}>
          <IconRefresh className="mr-2" />
          Reintentar
        </Button>
      )}
    </div>
  );
}
