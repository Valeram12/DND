import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import styles from './Character.module.css';
import httpClient from "../../Helpers/httpClient";
import Modal from "../../components/ModalWindow/Modal";


interface CharacterData {
    armor_class: number,
    attack_bonus: number,
    attack_damage: string,
    attack_name: string,
    charisma: number,
    class_name: string,
    constitution: number,
    dexterity: number,
    health_current: number,
    health_max: number,
    initiative: number,
    inspiration: number,
    intelligence: number,
    level: number,
    name: string,
    note: string,
    proficiency_bonus: number,
    racial_group: string,
    speed: number,
    strength: number,
    wisdom: number,
    proficiencies: string[]
}

const defaultCharacterData: CharacterData = {
    armor_class: 10,
    attack_bonus: 0,
    attack_damage: "1d4",
    attack_name: "Unarmed Strike",
    charisma: 10,
    class_name: "Воїн",
    constitution: 10,
    dexterity: 10,
    health_current: 10,
    health_max: 10,
    initiative: 0,
    inspiration: 0,
    intelligence: 10,
    level: 1,
    name: "Unnamed Hero",
    note: "",
    proficiency_bonus: 2,
    racial_group: "Гном",
    speed: 30,
    strength: 10,
    wisdom: 10,
    proficiencies: [],
};

const Character: React.FC = () => {
    const {id} = useParams<Record<string, string>>();
    const [characterData, setCharacter] = useState<CharacterData | null>(defaultCharacterData);

    const [nameOfUser] = useState<string>(() => {
        return JSON.parse(localStorage.getItem('user') || '{"username": "Unknown"}').username;
    });

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await httpClient.get(`//localhost:5000/characters/api/character/${id}`);
                const characterData: CharacterData = response.data;
                setCharacter(characterData);
            } catch (error) {
                console.error(error);
            }
        };

        if (id) {
            fetchCharacter();
        }

    }, [id]);


    const isChecked = (skill: string) =>
        characterData?.proficiencies.includes(skill) ?? false;


    const renderProficiencyElement = (
        label: string,
        id: string,
        parentId: string,
        parentValue: number
    ) => {
        return (
            <div className={styles["character-stats-prof-list-element"]} key={`${parentId}-${id}`}>
                <input
                    type="checkbox"
                    className={`${styles["character-stats-check"]} ${
                        label.includes("Рятівні")
                            ? `${styles["save-throw"]}`
                            : `${styles["regular-throw"]}`
                    }`}
                    checked={isChecked(label)}
                    onChange={(event) => {
                        const isChecked = event.target.checked;
                        setCharacter((prevCharacter) => {
                            if (!prevCharacter) return null;

                            const updatedProficiencies = isChecked
                                ? [...prevCharacter.proficiencies, label]
                                : prevCharacter.proficiencies.filter((skill) => skill !== label);
                            return {...prevCharacter, proficiencies: updatedProficiencies};
                        });

                    }}
                />
                <input
                    type="number"
                    min="0"
                    max="99"
                    className={`${styles["input-level"]} ${styles["center-input"]} ${styles["child"]}`}
                    value={getChildValue(parentId, id, Math.floor(parentValue / 4))} // Значення для конкретного parentId і id
                    id={id}
                    data-parent={parentId}
                    onChange={(event) => {
                        const newValue = parseInt(event.target.value, 10);
                        if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                            updateChildValue(parentId, id, newValue); // Оновлюємо тільки конкретне значення
                        }
                    }}
                    onKeyDown={(event) => {
                        const allowedKeys = [
                            "Backspace", "Delete", "ArrowLeft", "ArrowRight",
                            "Tab", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                        ];
                        if (!allowedKeys.includes(event.key)) {
                            event.preventDefault();
                        }
                    }}
                />
                <p>
                    {label.includes("Рятівні кидки")
                        ? "Рятівні кидки"
                        : label.includes("Приборкання")
                            ? "Приборкання"
                            : label}
                </p>
            </div>
        );
    };


    const [valuesByParent, setValuesByParent] = useState<Record<string, Record<string, number>>>({});



    const updateChildValue = (parentId: string, id: string, value: number) => {
        setValuesByParent((prev) => ({
            ...prev,
            [parentId]: {
                ...prev[parentId],
                [id]: value,
            },
        }));
    };

    const getChildValue = (parentId: string, id: string, defaultValue: number) => {
        return valuesByParent[parentId]?.[id] ?? defaultValue;
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCreate = async () => {
        try {
            console.log(characterData)
            const response = await httpClient.post(`//localhost:5000/characters/api/character/${id}`, characterData);
            if (response.status === 200) {
                console.log("Персонаж успішно редагований");
                // Тут можна оновити список персонажів або виконати інші дії
            }
        } catch (error) {
            console.error('Помилка при редагуванні персонажа:', error);
        } finally {
            setIsModalOpen(false);
        }
    };

    const handleSubmitClick = (event: React.FormEvent) => {
        event.preventDefault();
        setIsModalOpen(true); // Відкрити модальне вікно для підтвердження створення
    };


    if (!characterData) {
        return <div>Loading...</div>;
    }
    return (
        <main className={styles["main"]}>
            <form onSubmit={(event) => handleSubmitClick(event)}>
                <div className={styles["wrapper"]}>

                    <div className={styles["character-caption"]}>
                        <div className={styles["character-caption-flex"]}>

                            {/* Логотип та ім'я */}
                            <div className={styles["character-caption-element-double"]}>
                                <div className={styles["character-caption-element"]}>
                                    <img src="../../assets/img/character-logo.png" alt="Character Logo"/>
                                </div>
                                <div className={styles["character-caption-element"]}>
                                    <input
                                        className={styles["name-input"]}
                                        maxLength={50}
                                        type="text"
                                        value={characterData.name}
                                        name="name_ch"
                                        placeholder="Ім'я персонажа"
                                        required
                                        onChange={(event) => setCharacter({
                                            ...characterData,
                                            name: event.target.value
                                        })}
                                    />
                                </div>
                            </div>

                            {/* Клас і раса */}
                            <div className={styles["character-caption-element-double"]}>
                                <div className={styles["character-caption-element"]}>
                                    <p>Клас:</p>
                                    <input
                                        className={`${styles["name-input"]} ${styles["class-width"]}`}
                                        type="text"
                                        value={characterData.class_name}
                                        readOnly={true}
                                    />
                                </div>
                                <div className={`${styles["character-caption-element"]} ${styles["race-block-width"]}`}>
                                    <p>Раса:</p>
                                    <input
                                        className={`${styles["name-input"]} ${styles["race-width"]}`}
                                        type="text"
                                        value={characterData.racial_group}
                                        readOnly={true}
                                    />
                                </div>
                            </div>


                            <div className={styles["character-caption-element-double"]}>
                                <div className={`${styles["character-caption-element"]} ${styles["less-num-ud"]}`}>
                                    <p>Рівень:</p>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        className={styles["input-level"]}
                                        value={characterData.level}
                                        name="level"
                                        onChange={(event) => {
                                            const newValue = parseInt(event.target.value, 10);
                                            if (!isNaN(newValue) && newValue >= 1 && newValue <= 20) {
                                                setCharacter({...characterData, level: newValue});
                                            }
                                        }}
                                        onKeyDown={(event) => {
                                            const allowedKeys = [
                                                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                            ];
                                            if (!allowedKeys.includes(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </div>

                                <div className={`${styles["character-caption-element"]} ${styles["race-block-width"]}`}>
                                    <p>Ім'я користувача:</p>
                                    <input
                                        className={`${styles["name-input"]} ${styles["race-width"]}`}
                                        type="text"
                                        value={nameOfUser}
                                        readOnly={true}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className={styles["character-params"]}>
                        <div className={styles["character-params-element"]}>
                            <p>Клас броні:</p>
                            <img src="../../assets/img/armor-class.png" alt="Armor Class"/>
                            <input
                                type="number"
                                className={styles["input-level"]}
                                value={characterData.armor_class}
                                name="armor_class"
                                onChange={(event) => {
                                    const newValue = parseInt(event.target.value, 10);
                                    if (!isNaN(newValue) && newValue >= 1 && newValue <= 100) {
                                        setCharacter({...characterData, armor_class: newValue});
                                    }
                                }}
                                onKeyDown={(event) => {
                                    const allowedKeys = [
                                        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                    ];
                                    if (!allowedKeys.includes(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </div>
                        <div className={styles["character-params-element"]}>
                            <p>Швидкість:</p>
                            <img src="../../assets/img/speed-icon.png" alt="Speed"/>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                className={styles["input-level"]}
                                value={characterData.speed}
                                name="speed"
                                onChange={(event) => {
                                    const newValue = parseInt(event.target.value, 10);
                                    if (!isNaN(newValue) && newValue >= 1 && newValue <= 100) {
                                        setCharacter({...characterData, speed: newValue});
                                    }
                                }}
                                onKeyDown={(event) => {
                                    const allowedKeys = [
                                        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                    ];
                                    if (!allowedKeys.includes(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </div>
                        <div className={styles["character-params-element"]}>
                            <p>Інтіціатива:</p>
                            <img src="../../assets/img/initiative.png" alt="Initiative"/>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className={styles["input-level"]}
                                value={characterData.initiative}
                                name="initiative"
                                onChange={(event) => {
                                    const newValue = parseInt(event.target.value, 10);
                                    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                                        setCharacter({...characterData, initiative: newValue});
                                    }
                                }}
                                onKeyDown={(event) => {
                                    const allowedKeys = [
                                        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                    ];
                                    if (!allowedKeys.includes(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </div>
                        <div className={styles["character-params-element"]}>
                            <p>Здоров'я:</p>
                            <img src="../../assets/img/health.png" alt="Health"/>
                            <div className={styles["health-flex"]}>
                                <input
                                    type="number"
                                    min="0"
                                    max="1000"
                                    className={styles["input-level"]}
                                    value={characterData.health_current}
                                    name="health_current"
                                    onChange={(event) => {
                                        const newValue = parseInt(event.target.value, 10);
                                        if (!isNaN(newValue) && newValue >= 0 && newValue <= 1000) {
                                            setCharacter({...characterData, health_current: newValue});
                                        }
                                    }}
                                    onKeyDown={(event) => {
                                        const allowedKeys = [
                                            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                        ];
                                        if (!allowedKeys.includes(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                                <p>/</p>
                                <input
                                    type="number"
                                    min="0"
                                    max="1000"
                                    className={styles["input-level"]}
                                    value={characterData.health_max}
                                    name="health_max"
                                    onChange={(event) => {
                                        const newValue = parseInt(event.target.value, 10);
                                        if (!isNaN(newValue) && newValue >= 0 && newValue <= 1000) {
                                            setCharacter({...characterData, health_max: newValue});
                                        }
                                    }}
                                    onKeyDown={(event) => {
                                        const allowedKeys = [
                                            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                        ];
                                        if (!allowedKeys.includes(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles["character-bonus"]}>
                        <div className={styles["character-bonus-element"]}>
                            <img src="../../assets/img/mastery.png" alt="Mastery Bonus"/>
                            <div className={styles["character-bonus-element-info"]}>
                                <div className={styles["character-bonus-text"]}>
                                    <p>Бонус майстерності:</p>
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className={styles["input-level"]}
                                    value={characterData.proficiency_bonus}
                                    name="proficiency_bonus"
                                    onChange={(event) => {
                                        const newValue = parseInt(event.target.value, 10);
                                        if (!isNaN(newValue) && newValue >= 1 && newValue <= 100) {
                                            setCharacter({...characterData, proficiency_bonus: newValue});
                                        }
                                    }}
                                    onKeyDown={(event) => {
                                        const allowedKeys = [
                                            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                        ];
                                        if (!allowedKeys.includes(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}

                                />
                            </div>
                        </div>
                        <div className={styles["character-bonus-element"]}>
                            <img src="../../assets/img/inspiration.png" alt="Inspiration"/>
                            <div className={styles["character-bonus-element-info"]}>
                                <div className={styles["character-bonus-text"]}>
                                    <p>Натхнення</p>
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className={styles["input-level"]}
                                    value={characterData.inspiration}
                                    name="inspiration"
                                    onChange={(event) => {
                                        const newValue = parseInt(event.target.value, 10);
                                        if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                                            setCharacter({...characterData, inspiration: newValue});
                                        }
                                    }}
                                    onKeyDown={(event) => {
                                        const allowedKeys = [
                                            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                        ];
                                        if (!allowedKeys.includes(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/*----------------------------------------------------------------------------*/}


                    <div className={styles["character-stats"]}>
                        <div className={styles["character-stats-flex"]}>
                            <div className={`${styles["character-stats-element"]} ${styles["border-1"]}`}>
                                <div className={styles["character-stats-element-stat"]}>
                                    <div className={styles["character-stats-element-stat-text"]}>
                                        <p>Сила</p>
                                    </div>
                                    <img src="../../assets/img/strength.png" alt="Strength"/>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        className={`${styles["input-level"]} ${styles["parent"]}`}
                                        value={characterData.strength}
                                        name="strength"
                                        id="parent1"
                                        onChange={(event) => {
                                            const newValue = parseInt(event.target.value, 10);
                                            if (!isNaN(newValue) && newValue >= 1 && newValue <= 20) {
                                                setCharacter({...characterData, strength: newValue});
                                            }
                                        }}
                                        onKeyDown={(event) => {
                                            const allowedKeys = [
                                                "Backspace", "Delete", "ArrowLeft", "ArrowRight",
                                                "Tab", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                                            ];
                                            if (!allowedKeys.includes(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </div>
                                <div className={styles["character-stats-prof-list"]}>
                                    {[
                                        {label: "Рятівні кидки Сила", id: "child1_1", parentId: "parent1"},
                                        {label: "Атлетика", id: "child1_2", parentId: "parent1"},
                                    ].map(({label, id, parentId}) =>
                                        renderProficiencyElement(label, id, parentId, characterData.strength)
                                    )}
                                </div>
                            </div>


                            <div className={`${styles["character-stats-element"]} ${styles["border-2"]}`}>
                                <div className={styles["character-stats-element-stat"]}>
                                    <div className={styles["character-stats-element-stat-text"]}>
                                        <p>Інтелект</p>
                                    </div>
                                    <img src="../../assets/img/intelect.png" alt="Intellect"/>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        className={`${styles["input-level"]} ${styles["parent"]}`}
                                        value={characterData.intelligence}
                                        name="intelligence"
                                        id="parent2"
                                        onChange={(event) => {
                                            const newValue = parseInt(event.target.value, 10);
                                            if (!isNaN(newValue) && newValue >= 1 && newValue <= 20) {
                                                setCharacter({...characterData, intelligence: newValue});
                                            }
                                        }}
                                        onKeyDown={(event) => {
                                            const allowedKeys = [
                                                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                                                'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                            ];
                                            if (!allowedKeys.includes(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}

                                    />
                                </div>
                                <div className={styles["character-stats-prof-list"]}>
                                    {[
                                        {label: "Рятівні кидки Інтелект", id: "child2_1", parentId: "parent2"},
                                        {label: "Магія", id: "child2_2", parentId: "parent2"},
                                        {label: "Історія", id: "child2_3", parentId: "parent2"},
                                        {label: "Природознавство", id: "child2_4", parentId: "parent2"},
                                        {label: "Релігія", id: "child2_5", parentId: "parent2"},
                                        {label: "Розслідування", id: "child2_6", parentId: "parent2"},
                                    ].map(({label, id, parentId}) =>
                                        renderProficiencyElement(label, id, parentId, characterData.intelligence)
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className={styles["character-stats-flex"]}>
                            {/* Dexterity Section */}
                            <div className={`${styles["character-stats-element"]} ${styles["border-3"]}`}>
                                <div className={styles["character-stats-element-stat"]}>
                                    <div className={styles["character-stats-element-stat-text"]}>
                                        <p>Спритність</p>
                                    </div>
                                    <img src="../../assets/img/dexterity.png" alt="Dexterity"/>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        className={`${styles["input-level"]} ${styles["parent"]}`}
                                        value={characterData.dexterity}
                                        name="dexterity"
                                        id="parent3"
                                        onChange={(event) => {
                                            const newValue = parseInt(event.target.value, 10);
                                            if (!isNaN(newValue) && newValue >= 1 && newValue <= 20) {
                                                setCharacter({...characterData, dexterity: newValue});
                                            }
                                        }}
                                        onKeyDown={(event) => {
                                            const allowedKeys = [
                                                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                                                'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                            ];
                                            if (!allowedKeys.includes(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}

                                    />
                                </div>
                                <div className={styles["character-stats-prof-list"]}>
                                    {[
                                        {label: "Рятівні кидки Спритність", id: "child3_1", parentId: "parent3"},
                                        {label: "Акробатика", id: "child3_2", parentId: "parent3"},
                                        {label: "Непомітність", id: "child3_3", parentId: "parent3"},
                                        {label: "Легка рука", id: "child3_4", parentId: "parent3"},
                                    ].map(({label, id, parentId}) =>
                                        renderProficiencyElement(label, id, parentId, characterData.dexterity)
                                    )}
                                </div>
                            </div>

                            {/* Wisdom Section */}
                            <div className={`${styles["character-stats-element"]} ${styles["border-4"]}`}>
                                <div className={styles["character-stats-element-stat"]}>
                                    <div className={styles["character-stats-element-stat-text"]}>
                                        <p>Мудрість</p>
                                    </div>
                                    <img src="../../assets/img/wisdom.png" alt="Wisdom"/>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        className={`${styles["input-level"]} ${styles["parent"]}`}
                                        value={characterData.wisdom}
                                        name="wisdom"
                                        id="parent4"
                                        onChange={(event) => {
                                            const newValue = parseInt(event.target.value, 10);
                                            if (!isNaN(newValue) && newValue >= 1 && newValue <= 20) {
                                                setCharacter({...characterData, wisdom: newValue});
                                            }
                                        }}
                                        onKeyDown={(event) => {
                                            const allowedKeys = [
                                                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                                                'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                            ];
                                            if (!allowedKeys.includes(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}

                                    />
                                </div>
                                <div className={styles["character-stats-prof-list"]}>
                                    {[
                                        {label: "Рятівні кидки Мудрість", id: "child4_1", parentId: "parent4"},
                                        {label: "Виживання", id: "child4_2", parentId: "parent4"},
                                        {label: "Медицина", id: "child4_3", parentId: "parent4"},
                                        {label: "Приборкання тварин", id: "child4_4", parentId: "parent4"},
                                        {label: "Проникливість", id: "child4_5", parentId: "parent4"},
                                        {label: "Уважність", id: "child4_6", parentId: "parent4"},
                                    ].map(({label, id, parentId}) =>
                                        renderProficiencyElement(label, id, parentId, characterData.wisdom)
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className={styles["character-stats-flex"]}>
                            <div className={`${styles["character-stats-element"]} ${styles["border-5"]}`}>
                                <div className={styles["character-stats-element-stat"]}>
                                    <div className={styles["character-stats-element-stat-text"]}>
                                        <p>Статура</p>
                                    </div>
                                    <img src="../../assets/img/constitution.png" alt="Constitution"/>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        className={`${styles["input-level"]} ${styles["parent"]}`}
                                        value={characterData.constitution}
                                        name="constitution"
                                        id="parent5"
                                        onChange={(event) => {
                                            const newValue = parseInt(event.target.value, 10);
                                            if (!isNaN(newValue) && newValue >= 1 && newValue <= 20) {
                                                setCharacter({...characterData, constitution: newValue});
                                            }
                                        }}
                                        onKeyDown={(event) => {
                                            const allowedKeys = [
                                                "Backspace", "Delete", "ArrowLeft", "ArrowRight",
                                                "Tab", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                                            ];
                                            if (!allowedKeys.includes(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </div>
                                <div className={styles["character-stats-prof-list"]}>
                                    {[
                                        {label: "Рятівні кидки Статура", id: "child5_1", parentId: "parent5"},
                                    ].map(({label, id, parentId}) =>
                                        renderProficiencyElement(label, id, parentId, characterData.constitution)
                                    )}
                                </div>
                            </div>


                            <div className={`${styles["character-stats-element"]} ${styles["border-6"]}`}>
                                <div className={styles["character-stats-element-stat"]}>
                                    <div className={styles["character-stats-element-stat-text"]}>
                                        <p>Харизма</p>
                                    </div>
                                    <img src="../../assets/img/charisma.png" alt="Charisma"/>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        className={`${styles["input-level"]} ${styles["parent"]}`}
                                        value={characterData.charisma}
                                        name="charisma"
                                        id="parent6"
                                        onChange={(event) => {
                                            const newValue = parseInt(event.target.value, 10);
                                            if (!isNaN(newValue) && newValue >= 1 && newValue <= 20) {
                                                setCharacter({...characterData, charisma: newValue});
                                            }
                                        }}
                                        onKeyDown={(event) => {
                                            const allowedKeys = [
                                                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                                            ];
                                            if (!allowedKeys.includes(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </div>
                                <div className={styles["character-stats-prof-list"]}>
                                    {[
                                        {label: "Рятівні кидки Харизма", id: "child6_1", parentId: "parent6"},
                                        {label: "Артистизм", id: "child6_2", parentId: "parent6"},
                                        {label: "Залякування", id: "child6_3", parentId: "parent6"},
                                        {label: "Обман", id: "child6_4", parentId: "parent6"},
                                        {label: "Переконливість", id: "child6_5", parentId: "parent6"}
                                    ].map(({label, id, parentId}) =>
                                        renderProficiencyElement(label, id, parentId, characterData.charisma)
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles["character-spells"]}>
                        <div className={styles["character-spells-caption"]}>
                            <p>Атака та чаротворство</p>
                        </div>
                        <div className={styles["character-spells-list"]}>
                            <div className={styles["character-spells-list-element"]}>
                                <p>Назва</p>
                                <div style={{marginLeft: '110px'}}>
                                    <p>Бонус атаки</p>
                                </div>
                                <p>Пошкодження/Тип</p>
                            </div>
                            <div className={styles["character-spells-list-element"]}>
                                <input
                                    className={`${styles["name-input"]} ${styles["more-height"]}`}
                                    maxLength={50}
                                    type="text"
                                    placeholder="Назва заклинання"
                                    value={characterData.attack_name}
                                    name="attack_name"
                                    onChange={(event) => {
                                        const newValue = event.target.value; // Це завжди рядок
                                        if (newValue.length >= 1 && newValue.length <= 50) {
                                            setCharacter({...characterData, attack_name: newValue});
                                        }
                                    }}

                                />
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    className={styles["input-level"]}
                                    value={characterData.attack_bonus}
                                    name="attack_bonus"
                                    onChange={(event) => {
                                        const newValue = parseInt(event.target.value, 10);
                                        if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                                            setCharacter({...characterData, attack_bonus: newValue});
                                        }
                                    }}

                                />
                                <input
                                    className={`${styles["name-input"]} ${styles["more-height"]}`}
                                    maxLength={50}
                                    type="text"
                                    placeholder="Опис заклинання"
                                    value={characterData.attack_damage}
                                    name="attack_damage"
                                    onChange={(event) => {
                                        const newValue = event.target.value; // Це завжди рядок
                                        if (newValue.length >= 1 && newValue.length <= 50) {
                                            setCharacter({...characterData, attack_damage: newValue});
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles["character-inventory"]}>
                        <div className={styles["character-inventory-caption"]}>Спорядження та інші примітки</div>
                        <textarea
                            className={`${styles["name-input"]} ${styles["textarea-style"]}`}
                            maxLength={2000}
                            placeholder=""
                            name="note"
                            value={characterData.note}
                            onChange={(event) => {
                                const newValue = event.target.value; // Це завжди рядок
                                if (newValue.length >= 0 && newValue.length <= 2000) {
                                    setCharacter({...characterData, note: newValue});
                                }
                            }}
                        />
                    </div>
                </div>

                <div className={styles["button-flex"]}>
                    <input type="submit" className={styles["submit-button"]} value="Зберегти зміни"
                           disabled={characterData.name.trim() === ''}/>
                </div>
            </form>
            <Modal
                isOpen={isModalOpen}
                message="Ви впевнені, що хочете відредагувати персонажа з такими характеристиками?"
                onConfirm={handleCreate}
                onCancel={() => setIsModalOpen(false)}
            />
        </main>
    );
};

export default Character;