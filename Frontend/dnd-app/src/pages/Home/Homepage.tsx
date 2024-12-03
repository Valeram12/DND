import React, {useEffect, useRef} from 'react'


import styles from './Homepage.module.css'
import '../../assets/css/show-move.css'
import {Link} from "react-router-dom";
import {useAuth} from "../../Context/AuthContext";


const Homepage = () => {
    const posterLogoRef = useRef<HTMLDivElement | null>(null);
    const characterTextNButtonRef = useRef<HTMLDivElement | null>(null);
    const bestiaryTextNButtonRef = useRef<HTMLDivElement | null>(null);
    const diceTextNButtonRef = useRef<HTMLDivElement | null>(null);
    const { user } = useAuth();
    useEffect(() => {
        const options = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observerDown = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-down');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const observerLeft = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-left');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const observerRight = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-right');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Спостерігаємо за елементами
        if (posterLogoRef.current) observerDown.observe(posterLogoRef.current);
        if (characterTextNButtonRef.current) observerLeft.observe(characterTextNButtonRef.current);
        if (bestiaryTextNButtonRef.current) observerRight.observe(bestiaryTextNButtonRef.current);
        if (diceTextNButtonRef.current) observerLeft.observe(diceTextNButtonRef.current);

        // Очищення спостерігачів при демонтажі компонента
        return () => {
            observerDown.disconnect();
            observerLeft.disconnect();
            observerRight.disconnect();
        };
    }, []);
    return (
        <div>
            <main>
                <div className={styles.poster}>
                    <div className={styles['poster-top']}>
                        <p>BECOME A DUNGEON MASTER</p>
                    </div>
                    <div className={styles['poster-big-logo']} id="posterLogo" ref={posterLogoRef}></div>
                </div>

                <div className={styles.character}>
                    <div className={styles['character-content']}>
                        <div className={styles['character-text-n-button']} id="characterTextNButton"
                             ref={characterTextNButtonRef}>
                            <div className={styles['character-text']} id="characterButton">
                                <p>Створіть свого першого персонажа тут</p>
                            </div>
                            {user?.username ? (
                                <Link to="/charlist">
                                    <div className={styles['character-button']} id="characterText">
                                        <p>Створити</p>
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/auth">
                                    <div className={styles['character-button']} id="characterText">
                                        <p>Авторизуватися</p>
                                    </div>
                                </Link>
                            )}
                        </div>
                        <div className={styles['character-right-logo']}>
                            <img src={'assets/img/char-dragon.png'} alt="Дракон"/>
                        </div>
                    </div>
                </div>

                <div className={styles.bestiary}>
                    <div className={styles['character-content']}>
                        <div className={`${styles['character-right-logo']} ${styles['bestiary-pic']}`}>
                            <img src={'assets/img/bestiary-pic.png'} alt="Бестіарій"/>
                        </div>
                        <div className={`${styles['character-text-n-button']} ${styles['bestiary-text-n-button']}`}>
                            <div className={`${styles['character-text']} ${styles['bestiary-text']}`}>
                                <p>Бестіарій<br/>(Правила та фішки гри)</p>
                            </div>
                            <a>
                                <div className={styles['character-button']}>
                                    <p>Дізнатися</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.dice}>
                    <div className={styles['character-content']}>
                        <div className={styles['character-text-n-button']} id="diceTextNButton"
                             ref={diceTextNButtonRef}>
                            <div className={styles['character-text']}>
                                <p>Рандомайзер дайсів</p>
                            </div>
                            <a>
                                <div className={`${styles['character-button']} ${styles['dice-button']}`}>
                                    <p>Дізнатися</p>
                                </div>
                            </a>
                        </div>
                        <div className={`${styles['character-right-logo']} ${styles['dice-pic']}`}>
                            <img src={'assets/img/dice-pic.png'} alt="Дайси"/>
                        </div>
                    </div>
                </div>
            </main>

            <div className={styles.merge}>
                <div className={styles['merge-div']}>
                    <div className={styles['merge-div-pic']}>
                        <img src={'assets/img/merge-pic.jpg'} alt="Мерч"/>
                    </div>
                    <div className={styles['merge-div-text-n-button']}>
                        <div className={styles['merge-div-text']}>
                            <p>Мерч<br/>Dungeons and Dragons</p>
                        </div>
                        <Link to="/merche">
                            <div className={`${styles['character-button']} ${styles['merge-div-button']}`}>
                                <p>Дізнатися</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage