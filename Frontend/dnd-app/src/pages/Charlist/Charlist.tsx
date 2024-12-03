import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import styles from "./Charlist.module.css"
import httpClient from "../../Helpers/httpClient";
import Modal from "../../components/ModalWindow/Modal";

interface Character {
    id: number;
    name: string;
    class_name: string;
    racial_group: string;
    level: number;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await httpClient.get('/characters/api/list');
                const data: Character[] = response.data;
                setCharacters(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCharacters();
    }, []);


    const getClassIcon = (className: string): string => {
        switch (className) {
            case 'Варвар':
                return '../../assets/img/ico-barbar.png';
            case 'Бард':
                return '../../assets/img/ico-bard.png';
            case 'Друїд':
                return '../../assets/img/ico-druid.png';
            case 'Рейнджер':
                return '../../assets/img/ico-hunt.png';
            case 'Чаклун':
                return '../../assets/img/ico-mage.png';
            case 'Монах':
                return '../../assets/img/ico-monk.png';
            case 'Паладін':
                return '../../assets/img/ico-pala.png';
            case 'Розбійник':
                return '../../assets/img/ico-plut.png';
            case 'Клірик':
                return '../../assets/img/ico-priest.png';
            case 'Заклинатель':
                return '../../assets/img/ico-sorc.png';
            case 'Воїн':
                return '../../assets/img/ico-war.png';
            case 'Чорнокнижник':
                return '../../assets/img/ico-warlock.png';
            default:
                return '';
        }
    };


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [characterToDelete, setCharacterToDelete] = useState<number | null>(null);

    const handleDelete = async () => {
        if (characterToDelete !== null) {
            try {
                const response = await httpClient.delete(`/characters/api/delete/${characterToDelete}`);
                if (response.status === 200) {
                    setCharacters((prev) => prev.filter((char) => char.id !== characterToDelete));
                }
            } catch (error) {
                console.error('Error deleting character:', error);
            } finally {
                setIsModalOpen(false);
                setCharacterToDelete(null);
            }
        }
    };

    const handleDeleteClick = (characterId: number) => {
        setCharacterToDelete(characterId);
        setIsModalOpen(true);
    };


    return (
        <main>
            <div className={styles["charlist-container"]}>
                <div className={styles["charlist-itself"]}>
                    {characters.map((character) => (
                        <div className={styles["charlist-wrapper"]} key={character.id}>
                            <Link to={`/character/${character.id}`}>
                                <div className={styles["charlist-element"]}>
                                    <div className={styles["badge-container"]}>
                                        <img src={getClassIcon(character.class_name)} alt={character.class_name}/>
                                    </div>
                                    <div className={styles["name-container"]}>
                                        <div
                                            className={`${styles["charlist-text"]} ${styles["charlist-text-interval"]}`}>
                                            <p>Ім'я</p>
                                        </div>
                                        <div className={`${styles["name-bot"]} ${styles["charlist-text"]}`}>
                                            <p>{character.name}</p>
                                        </div>
                                    </div>
                                    <div className={styles["class-container"]}>
                                        <div
                                            className={`${styles["class-top"]} ${styles["charlist-text"]} ${styles["charlist-text-interval"]}`}
                                        >
                                            <p>Клас:</p>
                                        </div>
                                        <div className={`${styles["class-bot"]} ${styles["charlist-text"]}`}>
                                            <p>{character.class_name}</p>
                                        </div>
                                    </div>
                                    <div className={styles["race-container"]}>
                                        <div
                                            className={`${styles["race-top"]} ${styles["charlist-text"]} ${styles["charlist-text-interval"]}`}
                                        >
                                            <p>Раса:</p>
                                        </div>
                                        <div className={`${styles["race-bot"]} ${styles["charlist-text"]}`}>
                                            <p>{character.racial_group}</p>
                                        </div>
                                    </div>
                                    <div className={styles["level-container"]}>
                                        <div
                                            className={`${styles["level-top"]} ${styles["charlist-text"]} ${styles["charlist-text-interval"]}`}
                                        >
                                            <p>Рівень:</p>
                                        </div>
                                        <div className={`${styles["level-bot"]} ${styles["charlist-text"]}`}>
                                            <p>{character.level}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className={styles["charlist-delete-element"]}
                                 onClick={() => handleDeleteClick(character.id)}>
                                <div className={styles["delete"]}>
                                    <div className={styles["cross"]}></div>
                                </div>
                            </div>

                        </div>
                    ))}
                    <Link to="/create-new">
                        <div
                            className={`${styles["charlist-element"]} ${styles["charlist-new"]} ${styles["charlist-text"]}`}>
                            <p>Створити нового персонажа</p>
                            <img className={styles["border-hover"]} src="../../assets/img/plus.png" alt="plus"/>
                        </div>
                    </Link>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                message="Ви впевнені, що хочете видалити цього персонажа?"
                onConfirm={handleDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </main>
    );
};

export default CharacterList;
