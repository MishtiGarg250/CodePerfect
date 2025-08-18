interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
}

declare global {
  
interface Window {
  SpeechRecognition: {
    new (): SpeechRecognition;
  };
  webkitSpeechRecognition: {
    new (): SpeechRecognition;
  };
}
  }


import { useEffect, useRef } from "react";

export function useVoicePagination(
  page: number,
  setPage: (n: number) => void,
  totalPages: number,
  toast?: (msg: string) => void
) {
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
  if (typeof window === "undefined" || (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window))) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      if (transcript.includes("next")) {
        if (page < totalPages) {
          setPage(page + 1);
        } else if (toast) {
          toast("Already at last page");
        }
      } else if (transcript.includes("prev") || transcript.includes("previous")) {
        if (page > 1) {
          setPage(page - 1);
        } else if (toast) {
          toast("Already at first page");
        }
      } 
    };

    (window as any).startPaginationVoice = () => recognition.start();

    return () => {
      recognition.abort();
      (window as any).startPaginationVoice = undefined;
    };
  }, [page, totalPages, setPage, toast]);
}
