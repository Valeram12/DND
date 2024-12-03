import {Outlet} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import {AuthProvider} from "./Context/AuthContext";
import './assets/css/style-scrollbar.css'

import {useEffect, useRef} from "react";

function App() {
    const progressBarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const updateProgressBar = () => {
            if (progressBarRef.current) {
                const scrollHeight = document.body.scrollHeight - window.innerHeight;
                const scrollTop = window.scrollY;
                progressBarRef.current.style.height = (scrollTop / scrollHeight) * 100 + "%";
            }
        };

        window.addEventListener("scroll", updateProgressBar);

        // Очищення обробника прокрутки при демонтажі компонента
        return () => {
            window.removeEventListener("scroll", updateProgressBar);
        };
    }, []);


    return (
        <>
            <AuthProvider>
                <div id="progressbar" ref={progressBarRef}></div>
                <Navbar/>
                <Outlet/>
                <Footer/>
            </AuthProvider>
        </>
    );
}

export default App;
