"use client";

import { TemplateProvider } from "../context/TemplateContext";
import Sidebar from "@/components/Sidebar";

export default function ClientLayout({ children }) {
  return (
    <TemplateProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4">{children}</div>
      </div>
    </TemplateProvider>
  );
}
