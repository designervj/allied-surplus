"use client";

import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/store/hooks";

export default function ThemeInitializer() {
  const { businessBlueprint } = useAppSelector((state) => state.businessBlueprint);

  const cssVariables = useMemo(() => {
    if (!businessBlueprint) return "";

    const { public_theme: themeConfig } = businessBlueprint.payload || {};
    const { colors, typography } = themeConfig || {};

    // Generate @font-face for custom fonts
    const fontFaces = typography?.customFonts?.map(font => `
      @font-face {
        font-family: '${font.name}';
        src: url('${font.url}');
        font-weight: ${font.weight};
        font-style: ${font.style};
        font-display: swap;
      }
    `).join("\n");

    return `
      ${fontFaces}
      
      :root {
        /* UI Matrix Core Variables */
        --primary-color: ${colors.primary};
        --secondary-color: ${colors.secondary};
        --accent-color: ${colors.accent};
        --bg-color: ${colors.background};
        --surface-color: ${colors.surface};
        --text-color: ${colors.text};
        
        /* Button Tactical Variables */
        --btn-primary-bg: ${colors.buttons.primary};
        --btn-primary-text: ${colors.buttons.primaryText};
        --btn-secondary-bg: ${colors.buttons.secondary};
        --btn-secondary-text: ${colors.buttons.secondaryText};
        
        /* Typography Engine Variables */
        --font-main: ${typography.bodyFont};
        --font-heading: ${typography.headingFont};

        /* Overrides for Legacy Global Variables */
        --c-ink: ${colors.background};
        --c-charcoal: ${colors.surface};
        --c-olive: ${colors.buttons.primary};
        --c-gold: ${colors.accent};
        --font-body: ${typography.bodyFont};
        --font-head: ${typography.headingFont};
      }
      
      /* Global Application Overrides */
      body {
        background-color: var(--bg-color) !important;
        color: var(--text-color) !important;
        font-family: var(--font-main), sans-serif !important;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading), sans-serif !important;
      }

      /* Specific element overrides to ensure theme adherence */
      .bg-olive { background-color: #7a8a32ff !important; }
      .text-gold { color: var(--accent-color) !important; }
      .bg-ink { background-color: var(--bg-color) !important; }
      .bg-charcoal { background-color: var(--surface-color) !important; }
    `;
  }, [businessBlueprint]);

  useEffect(() => {
    if (!cssVariables) return;

    let styleTag = document.getElementById("dynamic-theme-overrides");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "dynamic-theme-overrides";
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = cssVariables;
  }, [cssVariables]);

  return null;
}
