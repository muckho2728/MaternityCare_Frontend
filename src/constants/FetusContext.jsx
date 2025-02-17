import React, { createContext, useState } from 'react';

export const CreateFetusContext = createContext();
export const CreateFetusHealthContext = createContext();

export const FetusProvider = ({ items }) => {
    const [fetusData, setFetusData] = useState({
        conceptionDate: '',
    });

    const [healthData, setHealthData] = useState({
        weeks: '', // Thêm trường weeks để lưu trữ thông tin tuần
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
        <CreateFetusContext.Provider value={{ fetusData, setFetusData }}>
            <CreateFetusHealthContext.Provider value={{ healthData, setHealthData }}>
                <Menu items={items} />
            </CreateFetusHealthContext.Provider>
        </CreateFetusContext.Provider>
    );
};