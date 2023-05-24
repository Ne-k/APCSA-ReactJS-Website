import React, { useState, useEffect } from 'react';
import Grid from './Grid';

function Home() {
    const [tabs, setTabs] = useState([]);
    const [tab, setTab] = useState(null);

    useEffect(() => {
        fetch('http://172.16.0.2:3002/tabs')
            .then(response => response.json())
            .then(tabs => {
                const filteredTabs = tabs.filter(tab => /^Period \d+$/.test(tab));
                setTabs(filteredTabs);
                setTab(filteredTabs[0]);
            });
    }, []);

    return (
        <div>
            {tabs.map(tab => (
                <button className="custom-button" style={{color:"#767d8a"}} key={tab} onClick={() => setTab(tab)}>
                    {tab}
                </button>

            ))}
            {tab && <Grid key={tab} tab={tab} />}
        </div>
    );
}

export default Home;
