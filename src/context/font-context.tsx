import React, { createContext, useContext, useEffect, useState } from 'react';

type FontContextType = {
    font: string;
    setFont: (font: string) => void;
};

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [font, setFont] = useState(
        () => {
            const savedFont = localStorage.getItem('font');
            return savedFont || 'inter'; // Default font
        }
    ); // Default font

    useEffect(() => {
        localStorage.setItem('font', font);
    }, [font]);



    return (
        <FontContext.Provider value={{ font, setFont }}>
            {children}
        </FontContext.Provider>
    );
};

export const useFont = () => {
    const context = useContext(FontContext);
    if (!context) {
        throw new Error('useFont must be used within a FontProvider');
    }
    return context;
};