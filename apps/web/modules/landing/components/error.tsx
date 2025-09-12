import { Button } from "@meetzeen/ui/src/components/button";
import { IconRefresh, IconAlertCircle } from "@tabler/icons-react";
import { useState, useEffect } from "react";

interface ErrorProps {
  className?: string;
  icon?: React.ReactNode;
  retry?: () => void;
  message?: string | string[];
}

export function Error({
  className,
  icon,
  retry,
  message,
}: ErrorProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const messages = Array.isArray(message) 
    ? message 
    : message 
    ? [message] 
    : ["Algo salió mal"];
  
  const hasMultipleMessages = Array.isArray(message) && message.length > 1;

  useEffect(() => {
    if (!hasMultipleMessages) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasMultipleMessages, messages.length]);

  const currentMessage = messages[currentMessageIndex];
  const defaultIcon = <IconAlertCircle className="w-8 h-8 text-red-500" />;

  return (
    <div className={`flex flex-col items-center justify-center h-[70vh] space-y-4 ${className}`}>
      {/* Icono */}
      <div className="flex items-center justify-center">
        {icon || defaultIcon}
      </div>
      
      {/* Mensaje de error */}
      <div className="text-center">
        <p 
          className={`text-red-500 text-lg font-medium transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Error: {currentMessage}
        </p>
      </div>

      {/* Botón de reintentar */}
      {retry && (
        <Button 
          onClick={retry} 
          variant="outline"
          className="mt-4 flex items-center space-x-2"
        >
          <IconRefresh className="w-4 h-4" />
          <span>Reintentar</span>
        </Button>
      )}
    </div>
  );
}