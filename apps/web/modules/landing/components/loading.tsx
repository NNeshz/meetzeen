import { IconLoader } from "@tabler/icons-react";
import { useState, useEffect } from "react";

interface LoadingProps {
  className?: string;
  message?: string | string[];
}

export function Loading({ className, message }: LoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const messages = Array.isArray(message) ? message : message ? [message] : [];
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

  return (
    <div className={`flex flex-col items-center justify-center h-[70vh] ${className}`}>
      <IconLoader className="animate-spin mb-4 w-8 h-8" />
      {currentMessage && (
        <span 
          className={`text-center transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {currentMessage}
        </span>
      )}
    </div>
  );
}