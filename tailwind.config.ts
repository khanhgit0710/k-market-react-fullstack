import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./**/*.{js,ts,jsx,tsx,mdx}", // Dòng này là "vét cạn", folder nào nó cũng soi
    ],

    theme: {
        extend: {},
    },
    plugins: [],
};
export default config;