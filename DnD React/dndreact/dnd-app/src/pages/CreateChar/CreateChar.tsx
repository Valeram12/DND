import React, {useEffect, useRef, useState} from 'react';
import styles from "./CreateChar.module.css"
import "../../assets/css/show-move.css"
import httpClient from "../../Helpers/httpClient";
import {useNavigate} from "react-router-dom";

const CreateChar: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [race, setRace] = useState<string>('Дракононароджений');
    const [charClass, setCharClass] = useState<string>('Воїн');
    const [level, setLevel] = useState<number>(1);
    const [randomStats, setRandomStats] = useState<number[][]>([
        Array(6).fill('?'),
        Array(6).fill('?'),
    ]);

    const handleGenerateStats = () => {
        // Example: Generate random stats between 3 and 18
        setRandomStats([
            Array(6).fill(0).map(() => Math.floor(Math.random() * 16) + 3),
            Array(6).fill(0).map(() => Math.floor(Math.random() * 16) + 3),
        ]);
    };

    const strengthImg = '../../assets/img/strength.png';
    const dexterityImg = '../../assets/img/dexterity.png';
    const constitutionImg = '../../assets/img/constitution.png';
    const intellectImg = '../../assets/img/intelect.png';
    const wisdomImg = '../../assets/img/wisdom.png';
    const charismaImg = '../../assets/img/charisma.png';

    const [stats, setStats] = useState({
        strength: 1,
        dexterity: 1,
        constitution: 1,
        intellect: 1,
        wisdom: 1,
        charisma: 1,
    });

    const handleStatChange = (stat: string, value: number) => {
        setStats((prevStats) => ({
            ...prevStats,
            [stat]: value,
        }));
    };

    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
    const [selectedArmor, setSelectedArmor] = useState<string | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

    const skills = [
        {id: 'Магія', label: 'Магія'},
        {id: 'Обман', label: 'Обман'},
        {id: 'Історія', label: 'Історія'},
        {id: 'Легка рука', label: 'Легка рука'},
        {id: 'Медицина', label: 'Медицина'},
        {id: 'Природа', label: 'Природа'},
        {id: 'Релігія', label: 'Релігія'},
        {id: 'Розслідування', label: 'Розслідування'},
        {id: 'Переконливість', label: 'Переконливість'},
        {id: 'Приборкання тварин', label: 'Приборкання тварин'},
    ];

    const weapons = [
        {id: 'Спис', label: 'Спис'},
        {id: 'Лук', label: 'Лук'},
        {id: 'Полуторний меч', label: 'Полуторний меч'},
        {id: 'Проста зброя', label: 'Проста зброя'},
    ];

    const armors = [
        {id: 'Лускатий обладунок (17)', label: 'Лускатий обладунок (17)'},
        {id: 'Кольчужний обладунок (16)', label: 'Кольчужний обладунок (16)'},
        {id: 'Клепаний шкіряний обладунок (14)', label: 'Клепаний шкіряний обладунок (14)'},
        {id: 'Шкіряний обладунок (12)', label: 'Шкіряний обладунок (12)'},
    ];

    const equipment = [
        {id: 'Молитовник', label: 'Молитовник'},
        {id: 'Святий символ', label: 'Святий символ'},
        {id: 'Набір дослідника', label: 'Набір дослідника'},
        {id: 'Ремісничі інструменти', label: 'Ремісничі інструменти'},
    ];

    const handleSkillChange = (id: string) => {
        setSelectedSkills((prev) =>
            prev.includes(id) ? prev.filter((skill) => skill !== id) : [...prev, id]
        );
    };

    const handleSingleSelection = (id: string, setState: React.Dispatch<React.SetStateAction<string | null>>) => {
        setState((prev) => (prev === id ? null : id));
    };

    const createChar1Ref = useRef<HTMLDivElement>(null);
    const createChar2Ref = useRef<HTMLDivElement>(null);
    const createChar3Ref = useRef<HTMLDivElement>(null);
    const createChar4Ref = useRef<HTMLDivElement>(null);

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

        if (createChar1Ref.current) observerDown.observe(createChar1Ref.current);
        if (createChar2Ref.current) observerLeft.observe(createChar2Ref.current);
        if (createChar3Ref.current) observerLeft.observe(createChar3Ref.current);
        if (createChar4Ref.current) observerLeft.observe(createChar4Ref.current);

        // Cleanup observers on component unmount
        return () => {
            observerDown.disconnect();
            observerDownDelay.disconnect();
            observerLeft.disconnect();
            observerRight.disconnect();
        };
    }, []);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Збираємо всі дані з форми
        const formData = new FormData(e.target as HTMLFormElement);
        const formValues = Object.fromEntries(formData.entries());

        const payload = {
            name_ch: formValues.name_ch,
            race: formValues.race,
            class: formValues.class,
            level: parseInt(formValues.level as string, 10),
            strength: stats.strength,
            dexterity: stats.dexterity,
            constitution: stats.constitution,
            intellect: stats.intellect,
            wisdom: stats.wisdom,
            charisma: stats.charisma,
            proficiencies: selectedSkills, // Наприклад, масив навичок
            equipment: [selectedWeapon, selectedArmor, selectedEquipment], // Об'єднуємо вибрані зброю, обладунок і спорядження
        };


        try {
            const response = await httpClient.post('//localhost:5000/characters/api/create-new', payload);
            if (response.status === 201) {
                navigate('/charlist')
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className={styles.maincls}>
            <form onSubmit={handleSubmit} method="POST">
                <div className={styles["create-char-top"]}>
                    <div className={styles["create-char-top-container"]}>
                        <div ref={createChar1Ref} className={styles["create-char-caption"]} id="id-create-char-caption">
                            <p>Створення персонажу</p>
                        </div>
                        <div ref={createChar2Ref} className={styles["create-char-question"]}
                             id="id-create-char-question">
                            <p>Які у вас ім'я, раса, клас<br/>та рівень?</p>
                        </div>
                        <div className={styles["create-char-input-container"]}>
                            {/* Name Input */}
                            <div className={styles["char-input-element"]}>
                                <div className={`${styles["char-input-text"]} ${styles["more-margin"]}`}>Ім'я</div>
                                <input
                                    className={styles["name-input"]}
                                    maxLength={50}
                                    type="text"
                                    placeholder="Ім'я персонажа"
                                    name="name_ch"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            {/* Race Selection */}
                            <div className={styles["char-input-element"]}>
                                <div className={styles["char-input-text"]}>Раса</div>
                                <div className={styles["list-choice"]}>
                                    <div className={styles["list-choice-title"]}>Раса</div>
                                    <div className={styles["list-choice-objects"]}>
                                        {['Дракононароджений', 'Дварф', 'Ельф', 'Гном', 'Напівельф', 'Напіворк', 'Напіврослик', 'Людина', 'Тифлінг', 'Орк'].map((r) => (
                                            <label key={r}>
                                                <input
                                                    type="radio"
                                                    name="race"
                                                    value={r}
                                                    checked={race === r}
                                                    onChange={() => setRace(r)}
                                                />{' '}
                                                <span>{r}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Class Selection */}
                            <div className={styles["char-input-element"]}>
                                <div className={styles["char-input-text"]}>Клас</div>
                                <div className={styles["list-choice"]}>
                                    <div className={styles["list-choice-title"]}>Клас</div>
                                    <div className={styles["list-choice-objects"]}>
                                        {['Воїн', 'Паладін', 'Чаклун', 'Варвар', 'Клірик', 'Чорнокнижник', 'Розбійник', 'Заклинатель', 'Монах', 'Рейнджер', 'Друїд', 'Бард'].map((c) => (
                                            <label key={c}>
                                                <input
                                                    type="radio"
                                                    name="class"
                                                    value={c}
                                                    checked={charClass === c}
                                                    onChange={() => setCharClass(c)}
                                                />{' '}
                                                <span>{c}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Level Input */}
                            <div className={styles["char-input-element"]}>
                                <div className={styles["char-input-text"]}>Рівень</div>
                                <input
                                    type="number"
                                    min={1}
                                    max={20}
                                    className={styles["input-level"]}
                                    value={level}
                                    name="level"
                                    onChange={(e) => setLevel(Number(e.target.value))}
                                    onKeyDown={(e) =>
                                        ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) ||
                                        (!isNaN(Number(e.key)) && e.key !== ' ')
                                    }
                                />
                            </div>
                        </div>

                        {/* Random Stats */}
                        <div className={styles["random-stats-text"]}>
                            <p>Дозвольте фортуні створити вам два набори характеристик та оберіть той, що подобається
                                більше.</p>
                        </div>
                        {randomStats.map((set, index) => (
                            <div className={styles["random-stats-container"]} key={index}>
                                {set.map((stat, i) => (
                                    <input type="text" value={stat} readOnly key={i}/>
                                ))}
                            </div>
                        ))}

                        <div className={styles["center-button"]}>
                            <div className={styles["random-stats-button"]} onClick={handleGenerateStats}>Згенерувати
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles["create-char-stats"]}>
                    <div className={styles["create-char-top-container"]}>
                        <div className={styles["create-char-stats-caption"]} id="id-create-char-stats-caption">
                            Значення навичок:
                        </div>
                        <div className={styles["create-char-stats-container"]}>
                            {[
                                {label: 'Сила', name: 'strength', img: strengthImg},
                                {label: 'Спритність', name: 'dexterity', img: dexterityImg},
                                {label: 'Статура', name: 'constitution', img: constitutionImg},
                            ].map((stat) => (
                                <div className={styles["create-char-stats-element"]} key={stat.name}>
                                    <div className={styles["create-char-stats-text"]}>{stat.label}</div>
                                    <img src={stat.img} alt={stat.label}/>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        className={`${styles["input-level"]} ${styles["center-input"]}`}
                                        value={stats[stat.name as keyof typeof stats]}
                                        onChange={(e) => handleStatChange(stat.name, Number(e.target.value))}
                                        onKeyDown={(e) =>
                                            ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) ||
                                            (!isNaN(Number(e.key)) && e.key !== ' ')
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        <div className={styles["create-char-stats-container"]}>
                            {[
                                {label: 'Інтелект', name: 'intellect', img: intellectImg},
                                {label: 'Мудрість', name: 'wisdom', img: wisdomImg},
                                {label: 'Харизма', name: 'charisma', img: charismaImg},
                            ].map((stat) => (
                                <div className={styles["create-char-stats-element"]} key={stat.name}>
                                    <div className={styles["create-char-stats-text"]}>{stat.label}</div>
                                    <img src={stat.img} alt={stat.label}/>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        className={`${styles["input-level"]} ${styles["center-input"]}`}
                                        value={stats[stat.name as keyof typeof stats]}
                                        onChange={(e) => handleStatChange(stat.name, Number(e.target.value))}
                                        onKeyDown={(e) =>
                                            ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) ||
                                            (!isNaN(Number(e.key)) && e.key !== ' ')
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles["create-char-bot"]}>
                    <div className={styles["create-char-top-container"]}>
                        <div ref={createChar3Ref}
                             className={`${styles["create-char-stats-caption2"]} ${styles["some-margin"]}`}
                             id="id-create-char-stats-caption">
                            Оберіть<br/>навички та спорядження:
                        </div>

                        <div className={styles["create-char-start-container"]}>

                            {/* Skills */}
                            <div className={styles["create-char-start-container-element"]}>
                                <div className={styles["create-char-start-prof"]}>
                                    <div className={styles["create-char-start-prof-text"]}>Оберіть 3 навички:</div>
                                    <div className={styles["test"]}>
                                        <div className={styles["test-column"]}>
                                            {skills.slice(0, 5).map((skill) => (
                                                <div key={skill.id}>
                                                    <input
                                                        type="checkbox"
                                                        id={skill.id}
                                                        checked={selectedSkills.includes(skill.id)}
                                                        onChange={() => handleSkillChange(skill.id)}
                                                        disabled={selectedSkills.length >= 3 && !selectedSkills.includes(skill.id)}
                                                    />
                                                    <label htmlFor={skill.id}><span></span>{skill.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles["test-column"]}>
                                            {skills.slice(5).map((skill) => (
                                                <div key={skill.id}>
                                                    <input
                                                        type="checkbox"
                                                        id={skill.id}
                                                        checked={selectedSkills.includes(skill.id)}
                                                        onChange={() => handleSkillChange(skill.id)}
                                                        disabled={selectedSkills.length >= 3 && !selectedSkills.includes(skill.id)}
                                                    />
                                                    <label htmlFor={skill.id}><span></span>{skill.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Weapons */}
                            <div className={styles["create-char-start-container-element"]}>
                                <div className={styles["create-char-start-prof"]}>
                                    <div className={styles["create-char-start-prof-text"]}>Оберіть 1 зброю:</div>
                                    <div className={`${styles["test"]} ${styles["less-width"]}`}>
                                        <div className={`${styles["test-column-1"]} ${styles["some-margin"]}`}>
                                            {weapons.map((weapon) => (
                                                <div key={weapon.id}>
                                                    <input
                                                        type="checkbox"
                                                        id={weapon.id}
                                                        checked={selectedWeapon === weapon.id}
                                                        onChange={() => handleSingleSelection(weapon.id, setSelectedWeapon)}
                                                    />
                                                    <label htmlFor={weapon.id}><span></span>{weapon.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Armor */}
                            <div className={styles["create-char-start-container-element"]}>
                                <div className={styles["create-char-start-prof"]}>
                                    <div className={styles["create-char-start-prof-text"]}>Оберіть 1 обладунок:</div>
                                    <div className={styles["test"]}>
                                        <div className={`${styles["test-column-2"]} ${styles["some-margin"]}`}>
                                            {armors.map((armor) => (
                                                <div key={armor.id}>
                                                    <input
                                                        type="checkbox"
                                                        id={armor.id}
                                                        checked={selectedArmor === armor.id}
                                                        onChange={() => handleSingleSelection(armor.id, setSelectedArmor)}
                                                    />
                                                    <label htmlFor={armor.id}><span></span>{armor.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Equipment */}
                            <div className={styles["create-char-start-container-element"]}>
                                <div className={styles["create-char-start-prof"]}>
                                    <div className={styles["create-char-start-prof-text"]}>Оберіть 1 спорядження:</div>
                                    <div className={`${styles["test"]} ${styles["less-width"]}`}>
                                        <div className={`${styles["test-column-3"]} ${styles["some-margin"]}`}>
                                            {equipment.map((item) => (
                                                <div key={item.id}>
                                                    <input
                                                        type="checkbox"
                                                        id={item.id}
                                                        checked={selectedEquipment === item.id}
                                                        onChange={() => handleSingleSelection(item.id, setSelectedEquipment)}
                                                    />
                                                    <label htmlFor={item.id}><span></span>{item.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className={styles["submit-button-flex"]}>
                    <input type="submit" className={styles["submit-button"]} value="Почати пригоди"/>
                </div>
            </form>
        </main>
    );
};

export default CreateChar;