import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  timeout?: number;
};

export function useCopyToClipboard(options?: Options) {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    setError(null);
    if (!text) return false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!successful) throw new Error("Copy command failed");
      }

      setIsCopied(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(
        () => setIsCopied(false),
        options?.timeout ?? 2000
      );
      return true;
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setIsCopied(false);
      return false;
    }
  }, [options?.timeout]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copyToClipboard, isCopied, error };
}