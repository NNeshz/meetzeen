import { IconInbox } from "@tabler/icons-react";
import { useState, useEffect } from "react";

interface EmptyProps {
  className?: string;
  icon?: React.ReactNode;
  message?: string | string[];
  action?: React.ReactNode;
}

export function Empty({
  className,
  icon,
  message,
  action,
}: EmptyProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Determinar si tenemos un array de mensajes
  const messages = Array.isArray(message) 
    ? message 
    : message 
    ? [message] 
    : ["No hay elementos para mostrar"];
  
  const hasMultipleMessages = Array.isArray(message) && message.length > 1;

  useEffect(() => {
    if (!hasMultipleMessages) return;

    const interval = setInterval(() => {
      // Iniciar el fade out
      setIsVisible(false);
      
      // Después de 300ms (tiempo del fade out), cambiar el mensaje
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasMultipleMessages, messages.length]);

  const currentMessage = messages[currentMessageIndex];
  const defaultIcon = <IconInbox className="w-16 h-16 text-gray-400" />;

  return (
    <div className={`flex flex-col items-center justify-center h-[70vh] space-y-4 ${className}`}>
      {/* Icono */}
      <div className="flex items-center justify-center">
        {icon || defaultIcon}
      </div>
      
      {/* Mensaje de estado vacío */}
      <div className="text-center max-w-md">
        <p 
          className={`text-gray-500 text-lg font-medium transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {currentMessage}
        </p>
      </div>

      {/* Acción opcional (botón, enlace, etc.) */}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}