import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4
 * El tema (colores, fuentes, animaciones) se define en globals.css con @theme.
 * Este archivo solo es necesario para configuraciones que no caben en CSS.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
