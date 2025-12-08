import React, { ReactNode, createContext, useContext, useState } from 'react';

import { storageUtils } from '../utils/mmkv';

type SessionContextValue = {
    userName: string;
    warehouseCode: string;
    plantCode: string;
    teamCode: string;
    setUserName: (v: string) => void;
    setWarehouseCode: (v: string) => void;
    setPlantCode: (v: string) => void;
    setTeamCode: (v: string) => void;

    resetSession: () => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    // tạm hard-code; sau này bạn set từ màn Login / API / mmkv
    const [userName, setUserName] = useState('Nguyễn Thị Thanh Tuyền');
    const [warehouseCode, _setWarehouseCode] = useState(
        () => storageUtils.getWarehouseCode() ?? ''
    );
    const [plantCode, setPlantCode] = useState('RACH GIA A');
    const [teamCode, setTeamCode] = useState('CCM');

    const setWarehouseCode = (code: string) => {
        _setWarehouseCode(code);
        if (code) {
            storageUtils.setWarehouseCode(code);
        } else {
            storageUtils.clearWarehouseCode();
        }
    };

    const resetSession = () => {
        // clear state trong memory
        setUserName('');
        setWarehouseCode('');
        setPlantCode('');
        setTeamCode('');

        // clear tất cả key trong MMKV
        storageUtils.clearAll();
    };

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
                resetSession,
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
