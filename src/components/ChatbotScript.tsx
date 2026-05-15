"use client";

import { usePathname } from "next/navigation";

export function ChatbotScript() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;

  return (
    <script src="https://cdn.jotfor.ms/agent/embedjs/019d5da1c22a70e1931d32d9348400ca8fc1/embed.js?autoOpenChatIn=1" />
  );
}
