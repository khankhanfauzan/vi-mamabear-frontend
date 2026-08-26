import { MessageCircle } from "lucide-react";
import React from "react";

export default function ChatWidget() {
  return (
    <button className="hidden md:flex fixed bottom-6 right-6 w-14 h-14 bg-pink-500 text-white rounded-full shadow-xl items-center justify-center hover:bg-pink-600 hover:scale-110 transition-all z-50 group">
      <MessageCircle className="w-7 h-7 group-hover:animate-bounce" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-300"></span>
      </span>
    </button>
  );
}
