import { DialogProvider } from "./DialogContext";
import { SelectionProvider } from "./SelectionContext";
import { SessionProvider } from "./SessionContext";
import { ThemeProvider } from "./ThemeContext";

// src/context/AppProviders.tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider>
                <DialogProvider>
                    <SelectionProvider>
                        {children}
                    </SelectionProvider>
                </DialogProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
