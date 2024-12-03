import React, {useState, useEffect} from 'react';
import styles from './Registration.module.css';
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../Context/AuthContext";


const Registration: React.FC = () => {
    const {registration} = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Перевірка валідності форми
        const isValid = Boolean(
            username.match(/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/) &&
            email.includes("@") &&
            password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/) &&
            password === confirmPassword
        );
        setIsFormValid(isValid);
        if (password !== confirmPassword) {
            setErrorMessage("Паролі не збігаються");
        } else {
            setErrorMessage(null); // Скидаємо повідомлення про помилку
        }
    }, [username, email, password, confirmPassword]);

    const handleRegister = async () => {
        try {
            await registration(email, password, username);
            navigate("/");
        } catch (error) {
            console.log("Register error:", error);
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleRegister();
                    }} className={styles.form}>
                        <div className={styles.buttons}>
                            <h1 className={styles.text}>Реєстрація</h1>
                            <input
                                className={styles.regInput}
                                type="text"
                                name="username"
                                placeholder="Нікнейм"
                                required
                                pattern="^[a-zA-Z][a-zA-Z0-9_]{2,19}$"
                                title="Ім'я користувача має починатися з літери і містити 3-20 символів. Він може містити літери, цифри та підкреслення."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            /><br/>
                            <input
                                className={styles.regInput}
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            /><br/>
                            <input
                                className={styles.regInput}
                                type="password"
                                name="password"
                                placeholder="Пароль"
                                required
                                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$"
                                title="Пароль має бути не менше 8 символів, містити хоча б одну букву та одну цифру."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            /><br/>
                            <input
                                className={styles.regInput}
                                type="password"
                                placeholder="Підтвердіть пароль"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            /><br/>
                            {errorMessage && <div className={styles.pas}><p className={styles.info}>{errorMessage}</p></div>}
                            <input
                                className={`${styles.button} ${styles.regInput}`}
                                type="submit"
                                value="РЕЄСТРАЦІЯ"
                                disabled={!isFormValid} // Додаємо атрибут `disabled`
                            />
                            <div className={styles.pas}>
                                <p>Якщо вже зареєстровані, натисніть <Link to="/auth"
                                                                           className={styles.dec}> ВХІД</Link></p>
                                <p className={styles.info}>Ім'я користувача має починатися з літери і
                                    містити 3-20 символів. Він може містити літери, цифри та підкреслення.</p>
                                <p className={styles.info}>Пароль має бути не менше 8 символів, містити
                                    хоча б одну букву та одну цифру.</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Registration;
