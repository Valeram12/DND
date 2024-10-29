import React, {useState} from 'react';
import styles from './Navbar.module.css';
import {Link} from 'react-router-dom';
import Logo from '../../assets/img/logo.png';
import {useAuth} from "../../Context/AuthContext";


type Props = {}

const Navbar = (props: Props) => {

    const { user, logout } = useAuth();
    const [showInfo, setShowInfo] = useState(false);

    const handleSvgClick = () => {
        setShowInfo(!showInfo);
    };

    const handleLogout = async () => {
        await logout();
    };



    return (
        <header className={styles.header}>
            <div className={styles.headerFrame}>
                <div className={styles.headerLogo}>
                    <Link to="/">
                        <img src={Logo} alt="Домашня сторінка"/>
                    </Link>
                </div>
                <nav className={styles.headerNav}>
                    <Link to="/bestiary/aboleth">
                        <p className={styles.headerNavElement}>Бестіарій</p>
                    </Link>
                    <Link to="/dice">
                        <p className={styles.headerNavElement}>Дайси</p>
                    </Link>
                    <Link to="/merche">
                        <p className={styles.headerNavElement}>Мерч</p>
                    </Link>

                    {user ? (
                        <div className={styles.accSvgContainer}>
                            <svg
                                id="id_svg"
                                width="40"
                                height="40"
                                viewBox="0 0 30 30"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                onClick={handleSvgClick}
                            >
                                <rect width="30" height="30" fill="url(#pattern0)"/>
                                <defs>
                                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use xlinkHref="#image0_209_43" transform="scale(0.0333333)"/>
                                    </pattern>
                                    <image
                                        id="image0_209_43"
                                        width="30"
                                        height="30"
                                        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAalJREFUSEvtlutNw0AQhGcqgA6ACkgqACoAKgAqIFSAqACoAKiApAKSCggVAB2QCgYNukPWOfadY0UREiv5h2N7v529fYTYkHFDXKwElnQCYD8EPSc56SqgE1jSOYBbANsJ6AvAFcnH0gCKwZLuAFxmHN+THJXAi8Ahtc8lDgGckhzn3i0FzytnugAwimkN6Xc2tipnPuwNlrQL4L3iaEjSgfyapAGA18pPeyQ/2uBZxZIOAbwEJzOSvq+ZpCmAg/DgiKTvG60ruLF4kuLrD3bIktwuPkP37NLzkxTrYEEybbea8qziAHZ/noWvL9J+DQX2EJ4/kXS/t1op2AqsaCd4cyBxWBgSQZ8ABiSdof7goNqVa1gclanjNweQVnwTvUhx/FiSlUeFMQADfzJQojT66gTOpa/L878BDsPEQ8LTzJfNE8rXlOSsVHVWcRiZ1wC8g3P96Wr2grjpNTKT/iwVE9+r9XvVQaPijquwKajGFdkGdsqOu8pM3p+Q9BHVrA1c3Tar8hu3WRvYy93Tqo95qSz9K5St6j7Utm//wevKbHlVrzuCjZ3xN5Iyjh/ou2QrAAAAAElFTkSuQmCC"/>
                                </defs>
                            </svg>

                            <div className={`${styles.userInfoWindow} ${showInfo ? styles.showRight : ''}`}>
                                <div className={styles.navdiv1}>
                                    <div className={styles.userInfoWindowText}>Dungeon Master</div>
                                    <div className={styles.userInfoWindowText}>{user.username}</div>
                                    <div className={styles.navdiv2}>
                                        <div className={styles.userInfoWindowButton}>
                                            <Link className={styles.a_text} to="/charlist">Мої персонажі</Link>
                                        </div>
                                        <div className={styles.userInfoWindowButton}>
                                            <div className={styles.a_text} onClick={() => handleLogout()}>Вихід</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link to="/auth">
                                <p className={styles.headerNavElement}>Вхід</p>
                            </Link>
                            <Link to="/registration">
                                <p className={styles.headerNavElement}>Реєстрація</p>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
