/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ChakraProvider,
    ChakraTheme,
    defineStyleConfig,
    extendTheme,
} from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App.tsx";

const theme = extendTheme({
    config: {
        initialColorMode: "system",
        useSystemColorMode: true,
    },
    styles: {
        global: {
            body: {
                overflow: "hidden",
                position: "relative",
            },
            html: {
                overflow: "hidden",
            },
        } as any,
    },
    components: {
        Button: defineStyleConfig({
            sizes: {
                lg: {
                    paddingTop: "1.5em",
                    paddingBottom: "1.5em",
                    paddingLeft: "1em",
                    paddingRight: "1em",
                    borderRadius: "lg",
                },
            },
        }),
    } as any,
} as ChakraTheme);

createRoot(document.getElementById("root")!).render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>
);
