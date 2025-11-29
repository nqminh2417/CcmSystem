import { DialogProvider } from "./DialogContext";
import { SessionProvider } from "./SessionContext";

// src/context/AppProviders.tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <DialogProvider>
                {children}
            </DialogProvider>
        </SessionProvider>
    );
}
