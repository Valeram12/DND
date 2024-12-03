import React, {useEffect, useRef} from 'react';
import styles from './Merche.module.css'
import '../../assets/css/show-move.css'

const Merche = () => {
    const posterBigRef = useRef<HTMLDivElement | null>(null);
    const posterBotRef = useRef<HTMLDivElement | null>(null);
    const bannerOneRef = useRef<HTMLDivElement | null>(null);
    const bannerTwoRef = useRef<HTMLDivElement | null>(null);
    const bannerThreeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const options = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observerDown = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles['show-down']);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const observerDownDelay = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles['show-down-delay']);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const observerLeft = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles['show-left']);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const observerRight = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles['show-right']);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe elements
        if (posterBigRef.current) observerDown.observe(posterBigRef.current);
        if (posterBotRef.current) observerDownDelay.observe(posterBotRef.current);
        if (bannerOneRef.current) observerLeft.observe(bannerOneRef.current);
        if (bannerTwoRef.current) observerLeft.observe(bannerTwoRef.current);
        if (bannerThreeRef.current) observerLeft.observe(bannerThreeRef.current);

        // Cleanup observers on unmount
        return () => {
            observerDown.disconnect();
            observerDownDelay.disconnect();
            observerLeft.disconnect();
            observerRight.disconnect();
        };
    }, []);

    return (
        <main>
            <div className={styles['poster']}>
                <div className={styles['poster-big']} id="posterBig" ref={posterBigRef}>
                    <p>МЕРЧ</p>
                </div>
                <div className={styles['poster-bot']} id="posterBot" ref={posterBotRef}>
                    <p>
                        Якщо ви шукаєте оригінальний подарунок для свого друга, який також цікавиться настільними
                        іграми, то Мерч Dungeon and Dragons - ідеальний вибір. Ви можете знайти багато цікавих і
                        унікальних предметів, які не залишать байдужими навіть справжніх фанатів гри.
                    </p>
                </div>
            </div>
            <div className={styles['merche-dice']}>
                <div className={styles['dice-container']}>
                    <div className={styles['banner-product']}>
                        <div className={styles['product-container']}>
                            <div className={styles['head-flex']}>
                                <div className={styles['product-head']}><p>Продукція</p></div>
                            </div>
                            <div className={styles['product-element-list']}>
                                {/** Перший елемент продукту */}
                                <div className={styles['product-element']}>
                                    <div className={styles['product-pic-frame']}>
                                        <img src="../../assets/img/merche-dice-1.png" alt="Дайси"/>
                                    </div>
                                    <div className={styles['product-type']}><p>Набір кубиків</p></div>
                                    <div className={styles['product-name']}><p>The Witcher Dice Set</p></div>
                                    <div className={styles['buy-button']}><a href="http://surl.li/haaqm"><p>Придбати</p>
                                    </a></div>
                                </div>
                                {/** Другий елемент продукту */}
                                <div className={styles['product-element']}>
                                    <div className={styles['product-pic-frame']}>
                                        <img src="../../assets/img/merche-dice-2.png" alt="Дайси"/>
                                    </div>
                                    <div className={styles['product-type']}><p>Набір кубиків</p></div>
                                    <div className={styles['product-name']}><p>The Witcher Dice Set</p></div>
                                    <div className={styles['buy-button']}><a href="http://surl.li/haaqm"><p>Придбати</p>
                                    </a></div>
                                </div>
                                {/** Третій елемент продукту */}
                                <div className={styles['product-element']}>
                                    <div className={styles['product-pic-frame']}>
                                        <img src="../../assets/img/merche-dice-3.png" alt="Дайси"/>
                                    </div>
                                    <div className={styles['product-type']}><p>Набір кубиків</p></div>
                                    <div className={styles['product-name']}><p>The Witcher Dice Set</p></div>
                                    <div className={styles['buy-button']}><a href="http://surl.li/haaqm"><p>Придбати</p>
                                    </a></div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles['banner']} ${styles['banner-img1']}`}>
                            <div className={`${styles['banner-content']} ${styles['banner-one']}`} id="bannerOne"
                                 ref={bannerOneRef}>
                                <div className={styles['banner-head']}><p>Дайси</p></div>
                                <div className={styles['banner-text']}><p>Універсальні набори, що складається з гральних
                                    кубиків - чотиригранника, шестигранника, восьмигранника, десятигранника,
                                    десятигранника з числами другого розряду, дванадцятигранника і двадцятигранника.</p>
                                </div>
                            </div>
                            <div className={styles['banner-button']}><a href="http://surl.li/haaqm"><p>Дізнатися
                                більше</p></a></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles['line']}></div>

            <div className={styles['merche-dice']}>
                <div className={styles['dice-container']}>
                    <div className={styles['banner-product']}>
                        <div className={`${styles['banner']} ${styles['banner-img2']}`}>
                            <div className={`${styles['banner-content']} ${styles['banner-two']}`} id="bannerTwo"
                                 ref={bannerTwoRef}>
                                <div className={styles['banner-head']}><p>Фігурки</p></div>
                                <div className={styles['banner-text']}><p>Ви знайдете фігурки різних розмірів та
                                    матеріалів від маленьких деталей до великих. Усі фігурки створені з уваженням до
                                    деталей та дизайну, що забезпечує високу якість кожного продукту.</p></div>
                            </div>
                            <div className={styles['banner-button']}><a href="http://surl.li/haapw"><p>Дізнатися
                                більше</p></a></div>
                        </div>
                        <div className={styles['product-container']}>
                            <div className={styles['head-flex']}>
                                <div className={styles['product-head']}><p>Продукція</p></div>
                            </div>
                            <div
                                className={`${styles['product-element-list']} ${styles['product-element-list-right']}`}>
                                <div className={`${styles['product-element']} ${styles['product-element-reverse']}`}>
                                    <div className={styles['product-pic-frame']}>
                                        <img src="../../assets/img/Figure_1.png" alt="Фігурка"/>
                                    </div>
                                    <div className={styles['product-type']}><p>Фігурка</p></div>
                                    <div className={styles['product-name']}><p>Dragonborn knight</p></div>
                                    <div className={styles['buy-button']}><a href="http://surl.li/haapw"><p>Придбати</p>
                                    </a></div>
                                </div>
                                <div className={`${styles['product-element']} ${styles['product-element-reverse']}`}>
                                    <div className={styles['product-pic-frame']}>
                                        <img src="../../assets/img/Figure_2.png" alt="Фігурка"/>
                                    </div>
                                    <div className={styles['product-type']}><p>Фігурка</p></div>
                                    <div className={styles['product-name']}><p>Dragonborn knight</p></div>
                                    <div className={styles['buy-button']}><a href="http://surl.li/haapw"><p>Придбати</p>
                                    </a></div>
                                </div>
                                <div className={`${styles['product-element']} ${styles['product-element-reverse']}`}>
                                    <div className={styles['product-pic-frame']}>
                                        <img src="../../assets/img/Figure_3.png" alt="Фігурка"/>
                                    </div>
                                    <div className={styles['product-type']}><p>Фігурка</p></div>
                                    <div className={styles['product-name']}><p>Dragonborn knight</p></div>
                                    <div className={styles['buy-button']}><a href="http://surl.li/haapw"><p>Придбати</p>
                                    </a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles['line']}></div>

            <div className={styles['merche-dice']}>
                <div className={styles['dice-container']}>
                    <div className={styles['banner-product']}>
                        <div className={styles['product-container']}>
                            <div className={styles['head-flex']}>
                                <div className={styles['product-head']}><p>Продукція</p></div>
                            </div>
                            <div className={styles['product-element-list']}>
                                <div className={styles['product-element']}>
                                    <div className={styles['product-pic-frame-special']}>
                                        <img src="../../assets/img/Book_1.png" alt="Книга"/>
                                    </div>
                                    <div className={styles['product-type']}><p>Стартовій набір</p></div>
                                    <div className={styles['product-name']}><p>Essentials Kit</p></div>
                                    <div className={styles['buy-button']}><a href="http://surl.li/haaqr"><p>Придбати</p>
                                    </a></div>
                                </div>
                                <div className={styles['product-element']}>
                                    <div className={styles['product-pic-frame-special']}>
                                        <img src="../../assets/img/Book_2.png" alt="Книга"/>
                                    </div>
                                    <div className={styles['product-type']}><p>Стартовій набір</p></div>
                                    <div className={styles['product-name']}><p>Essentials Kit</p></div>
                                    <div className={styles['buy-button']}><a href="http://surl.li/haaqr"><p>Придбати</p>
                                    </a></div>
                                </div>
                                <div className={styles['product-element']}>
                                    <div className={styles['product-pic-frame-special']}>
                                        <img src="../../assets/img/Book_3.png" alt="Книга"/>
                                    </div>
                                    <div className={styles['product-type']}><p>Стартовій набір</p></div>
                                    <div className={styles['product-name']}><p>Essentials Kit</p></div>
                                    <div className={styles['buy-button']}><a href="http://surl.li/haaqr"><p>Придбати</p>
                                    </a></div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles['banner']} ${styles['banner-img3']}`}>
                            <div className={`${styles['banner-content']} ${styles['banner-three']}`} id="bannerThree"
                                 ref={bannerThreeRef}>
                                <div className={styles['banner-head']}><p>Стартовий набір</p></div>
                                <div className={styles['banner-text']}><p>Кожен стартовий набір включає основні правила
                                    гри, гральний кубик, карти персонажів та інше обладнання, що допоможе гравцям почати
                                    гру. Набори містять все, що потрібно, щоб почати грати з друзями чи в сім'ї</p>
                                </div>
                            </div>
                            <div className={styles['banner-button-special']}><a href="http://surl.li/haaqr"><p>Дізнатися
                                більше</p></a></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={styles['line']}></div>
        </main>
    );
};

export default Merche;