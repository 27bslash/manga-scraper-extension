import React from 'react';
import './App.css';
// import MangaList from './components/popup/manga-list';
import Popup from './components/popup/popup';

function App() {
    return (
        <div className="App">
            <React.StrictMode>
                <Popup />
            </React.StrictMode >
        </div>
    );
}

export default App;