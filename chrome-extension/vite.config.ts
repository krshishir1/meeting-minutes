import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'


// @ts-ignore


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build:{
    target:"esnext",
    rollupOptions:{
      input:{
        popup: "./popup.html",
      }
      // output:{
      //   entryFileNames: "assets/[name].js"
      // }
    },
  }
});
