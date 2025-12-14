// theme.ts
import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e0fff5" },
          100: { value: "#b4fde3" },
          200: { value: "#86fcd1" },
          500: { value: "#28e092" },
          600: { value: "#1cae72" },
          700: { value: "#107d51" },
        },
      },
    },

    semanticTokens: {
      colors: {
        /* Backgrounds */
        "bg.surface": {
          default: { value: "white" },
          _dark: { value: "#061029ff" },
        },
        "bg.muted": {
          default: { value: "gray.50" },
          _dark: { value: "gray.900" },
        },

        /* Text */
        fg: {
          default: { value: "gray.900" },
          _dark: { value: "gray.100" },
        },

        /* Brand */
        "brand.solid": {
          default: { value: "brand.600" },
          _dark: { value: "brand.400" },
        },
      },
    },
  },
});
