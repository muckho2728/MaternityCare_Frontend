import React, { createContext, useState } from 'react';

export const FetusContext = createContext();

export const FetusProvider = ({ children }) => {
    const [fetusData, setFetusData] = useState(null);
    const [healthData, setHealthData] = useState({
        weeks: '', 
        headCircumference: '',
        amnioticFluidLevel: '',
        crownRumpLength: '',
        biparietalDiameter: '',
        femurLength: '',
        estimatedFetalWeight: '',
        abdominalCircumference: '',
        gestationalSacDiameter: '',
    });

    return (
        <FetusContext.Provider value={{ fetusData, healthData }}>
            {children}
        </FetusContext.Provider>
    );
};