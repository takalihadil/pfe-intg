// File: app/layout.tsx
"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "@/components/navigation";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { TranslationProvider } from "@/components/context/translation-context";
import { AutoTranslator } from "@/components/context/AutoTranslator";  // <— correct path
import { Mascot } from "@/components/mascot/mascot";
import ShiftToast from "@/components/shifts/ShiftToast";
import TimerToast from "@/components/time-tracker/TimerToast";
import { Button } from "@/components/ui/button";
import { AIAssistantProvider } from "@/contexts/AIAssistantContext";
import AIAssistantButton from "@/components/AIAssistantButton/AIAssistantButton";
import AIAssistantPanel from "@/components/AIAssistantButton/AIAssistantPanel";
import AICharacterButton from "@/components/AICharacter/AICharacterButton";
import AICharacterDialog from "@/components/AICharacter/AICharacterDialog";
import { AICharacterProvider } from "@/contexts/AICharacterContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [firstTime, setFirstTime] = useState<boolean | null>(null);
  const [projectType, setProjectType] = useState<"online" | "offline" | null>(null);

  const isAuthPage = pathname.startsWith("/auth");
  const isOnboardingPage = pathname.startsWith("/onboarding");

  useEffect(() => {
    if (isAuthPage) return;
    const checkUser = async () => {
      const token = Cookies.get("token");
      if (!token) { setIsAuthenticated(false); return; }

      try {
        const meRes = await fetch("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) { setIsAuthenticated(false); return; }
        const { sub } = await meRes.json();

        const userRes = await fetch(`http://localhost:3000/auth/${sub}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) { setIsAuthenticated(false); return; }
        const userData = await userRes.json();
        setFirstTime(userData.firstTime);
        setProjectType(userData.projectType);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth error:", error);
        setIsAuthenticated(false);
      }
    };
    checkUser();
  }, [pathname]);

  const blockInteraction = firstTime === false && !isOnboardingPage;

  const assistantRoutes = ["/sales-analytics", "/expenses-analytics", "/timeEntry-analytics", "/profit-analytics"];
  const characterRoutes = ["/freelance", "/freelance/portfolio", "/freelance/clients", "/freelance/invoices", "/project", "/transactions"];
  const isAssistantVisible = projectType === "offline" && assistantRoutes.some(r => pathname.startsWith(r));
  const isCharacterVisible = projectType === "online" && (characterRoutes.some(r => pathname.startsWith(r)) || pathname.startsWith("/project/"));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AIAssistantProvider>
          <AICharacterProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <TranslationProvider>
                {/* Wrap everything in AutoTranslator */}
                <AutoTranslator>
                  {/* Main UI */}
                  {isAuthPage || !isAuthenticated ? (
                    <main className="container mx-auto px-4 py-4">{children}</main>
                  ) : (
                    <Navigation>{children}</Navigation>
                  )}
                  <Toaster />
                  <div className="fixed bottom-4 right-4"><Mascot mood="idle" /></div>
                  <ShiftToast />
                  <TimerToast />
                  {isAssistantVisible && <><AIAssistantButton /><AIAssistantPanel /></>}
                  {isCharacterVisible && <><AICharacterDialog /><AICharacterButton /></>}
                </AutoTranslator>
              </TranslationProvider>
            </ThemeProvider>
          </AICharacterProvider>
        </AIAssistantProvider>
      </body>
    </html>
  );
}
