// File: components/AutoTranslator.tsx
"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/components/context/translation-context";
import Cookies from "js-cookie";

/**
 * AutoTranslator wraps its children in a div and, whenever the locale changes,
 * walks through every text node inside that div, calls your /ai/translate API
 * for each unique string, and replaces them in-place.
 */
export function AutoTranslator({ children }: { children: React.ReactNode }) {
  const { locale } = useTranslation();
  const cache = useRef<Record<string, string>>({});
  const rootRef = useRef<HTMLDivElement>(null);

  async function fetchTranslation(text: string): Promise<string> {
    if (!text.trim() || locale === "en") return text;
    if (cache.current[text]) return cache.current[text];

    const token = Cookies.get("token") || "";
    try {
      const res = await fetch("http://localhost:3000/a/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, language: locale }),
      });
      const json = await res.json();
      const translated = json.translatedText || text;
      cache.current[text] = translated;
      return translated;
    } catch (err) {
      console.error("Translation fetch error for", text, err);
      return text;
    }
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // 1) gather all unique text strings under our wrapper
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    const strings: string[] = [];
    let node = walker.nextNode() as Text | null;
    while (node) {
      const txt = node.nodeValue?.trim();
      if (txt) strings.push(txt);
      node = walker.nextNode() as Text | null;
    }
    const unique = Array.from(new Set(strings));

    // 2) translate them all, then replace in the DOM
    Promise.all(unique.map(fetchTranslation)).then((results) => {
      const map: Record<string, string> = {};
      unique.forEach((u, i) => (map[u] = results[i]));

      const walker2 = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      let n2 = walker2.nextNode() as Text | null;
      while (n2) {
        const orig = n2.nodeValue?.trim();
        if (orig && map[orig]) {
          n2.nodeValue = n2.nodeValue!.replace(orig, map[orig]);
        }
        n2 = walker2.nextNode() as Text | null;
      }
    });
  }, [locale]);

  return <div ref={rootRef}>{children}</div>;
}
