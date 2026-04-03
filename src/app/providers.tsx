"use client";

import { ApolloProvider } from "@apollo/client/react";
import { Toaster } from "react-hot-toast";
import apolloClient from "@/lib/apollo-client";
import { AuthProvider } from "@/lib/auth/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        {children}
        <Toaster position="bottom-right" />
      </AuthProvider>
    </ApolloProvider>
  );
}
