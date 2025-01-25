import React, { createContext, useContext, useEffect, useState } from 'react';

type FontContextType = {
    font: string;
    setFont: (font: string) => void;
};

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {



    const [font, _setFont] = useState(
        () => {
            const savedFont = localStorage.getItem('font');
            return savedFont || 'inter';
        }
    );

    useEffect(() => {
        const applyFont = (font: string) => {
            const root = document.documentElement; // <html> element
            root.classList.remove('font-inter', 'font-system', 'font-manrope'); // Remove all font classes
            root.classList.add(`font-${font}`); // Add the selected font class
        }

        applyFont(font);
    }, [font]);


    const setFont = (font: string) => {
        localStorage.setItem('font', font);
        _setFont(font)
    }






    return (
        <FontContext.Provider value={{ font, setFont }}>
            {children}
        </FontContext.Provider>
    );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useFont = () => {
    const context = useContext(FontContext);
    if (!context) {
        throw new Error('useFont must be used within a FontProvider');
    }
    return context;
};


