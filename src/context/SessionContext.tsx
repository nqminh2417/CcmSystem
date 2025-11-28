import React, { ReactNode, createContext, useContext, useState } from 'react';

type SessionContextValue = {
    userName: string;
    warehouseCode: string;
    plantCode: string;
    teamCode: string;
    setUserName: (v: string) => void;
    setWarehouseCode: (v: string) => void;
    setPlantCode: (v: string) => void;
    setTeamCode: (v: string) => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    // tạm hard-code; sau này bạn set từ màn Login / API / mmkv
    const [userName, setUserName] = useState('Minh');
    const [warehouseCode, setWarehouseCode] = useState('H100');
    const [plantCode, setPlantCode] = useState('F1');
    const [teamCode, setTeamCode] = useState('CCM');

    return (
        <SessionContext.Provider
            value={{
                userName,
                warehouseCode,
                plantCode,
                teamCode,
                setUserName,
                setWarehouseCode,
                setPlantCode,
                setTeamCode,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => {
    const ctx = useContext(SessionContext);
    if (!ctx) {
        throw new Error('useSessionContext must be used within SessionProvider');
    }
    return ctx;
};
