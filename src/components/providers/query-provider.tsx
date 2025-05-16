"use client"

import React from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/get-query-client";


export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // const [queryClient] = React.useState(() => new QueryClient())
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryStreamedHydration> */}
        {children}
      {/* </ReactQueryStreamedHydration> */}
    </QueryClientProvider>
  );
}
