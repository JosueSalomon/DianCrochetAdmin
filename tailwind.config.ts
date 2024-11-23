import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    fontFamily: {
      lekton: ['var(--lekton)'],
      rubik: ['var(--rubik)'],
      koulen: ['var(--koulen)'],
      inter: ['var(--inter)'],
      crimson: ['var(--crimson)'],
      roboto:['var(--roboto)'],
      robotoMono:['var(--robotoMono)'],
      opensans: ['var(--opensans)'],
      opensansm: ['var(--opensansm)']
    },
  },
  plugins: [forms],
};
export default config;
