/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Excon", "Arial", "sans-serif"],
      },
      fontSize: {
        xs: ["11px", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        sm: ["13px", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        base: ["15px", { lineHeight: "1.6", letterSpacing: "0" }],
        lg: ["17px", { lineHeight: "1.6", letterSpacing: "0" }],
        xl: ["19px", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        "2xl": ["24px", { lineHeight: "1.4", letterSpacing: "-0.02em" }],
        "3xl": ["30px", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        "4xl": ["36px", { lineHeight: "1.2", letterSpacing: "-0.03em" }],
        "5xl": ["48px", { lineHeight: "1.1", letterSpacing: "-0.04em" }],
        "6xl": ["60px", { lineHeight: "1.1", letterSpacing: "-0.05em" }],
      },
      colors: {
        // Primary & secondary (brand)
        primary: "#b91a1b",
        secondary: "#d6a84f",
        // Primary Colors
        "barca-gold": "#d6a84f", // Secondary - Gold
        "light-gold": "#EFE28D", // Light Gold / Cream
        // Secondary Colors
        "barca-red": "#b91a1b", // Primary - Deep Red
        bronze: "#A66337", // Brown / Bronze
        // Neutral / Supporting Colors
        "dark-charcoal": "#1A1A1A", // Dark Charcoal (instead of pure black)
        "medium-grey": "#5E5952", // Medium Grey
        "light-grey": "#9F9384", // Light Grey
        // Legacy support (mapping old colors to new scheme)
        "barca-blue": "#1A1A1A", // Map to dark charcoal for navbar/header
        "dark-bg": "#4a4a4a",
      },
      backgroundImage: {
        "gradient-barca":
          "linear-gradient(135deg, #1A1A1A 0%, #5E5952 50%, #A66337 100%)",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        "marquee-reverse": "marquee-reverse 25s linear infinite",
        "marquee-vertical": "marquee-vertical 25s linear infinite",
        "marquee-vertical-reverse":
          "marquee-vertical-reverse 25s linear infinite",
        gradient: "gradient 8s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "marquee-vertical": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-100%)" },
        },
        "marquee-vertical-reverse": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
    },
  },
  plugins: [],
};
