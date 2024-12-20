import { UserContextProvider } from "@/app/context/getUserContext";
import { ClerkLoaded } from "@clerk/nextjs";
import React from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen bg-white">
      <ClerkLoaded>
        <UserContextProvider>{children}</UserContextProvider>
      </ClerkLoaded>
    </section>
  );
}
