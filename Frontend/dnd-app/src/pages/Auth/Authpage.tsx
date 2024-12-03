import React, {useState} from 'react';
import styles from './Authpage.module.css'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../Context/AuthContext";

const Authpage = () => {

    const {login} = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            // console.log("Login error:", error);
            setErrorMessage("Пароль або електронна пошта невірні!");
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <form className={`${styles.form} ${styles.aunt}`} action="" method="POST">
                        <div className={styles.buttons}>
                            <h1 className={styles.text}>Вхід</h1>
                            <input
                                className={styles.regInput}
                                type="email"
                                name="email"
                                value={email}
                                id="email"
                                placeholder="E-mail"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            /><br/>
                            <input
                                className={styles.regInput}
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                placeholder="Пароль"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            /><br/>
                            <input
                                className={`${styles.button} ${styles.regInput}`}
                                type="button"
                                value="ВХІД"
                                onClick={() => handleLogin()}
                            />
                            {errorMessage && (
                               <p className={styles.error}>{errorMessage}</p> // Відображення повідомлення про помилку
                           )}
                            <div className={styles.pas}>
                                <p>
                                    Якщо не авторизовані, натисніть
                                    <a className={styles.dec} href="/registration"> РЕЄСТРАЦІЯ</a>
                                </p>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </section>
    );
};

export default Authpage;
