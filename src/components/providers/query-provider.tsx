"use client"

import { getQueryClient } from "@/lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // const [queryClient] = React.useState(() => new QueryClient())
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
