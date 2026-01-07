import React from 'react';
import { useAppStore } from '../store/useAppStore';
import JuicyBox from '../components/organisms/JuicyBox/JuicyBox';

const JuicyBoxPage: React.FC = () => {
    // Select state individualy to prevent loop
    const theme = useAppStore(s => s.theme);


    // Theme Sync
    React.useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <JuicyBox />
        </div>
    );
};

export default JuicyBoxPage;
