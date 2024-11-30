from flask import jsonify, session, request
from flask_login import login_required, current_user
from app.characters import bp
from app.models.Characters import *


@bp.route("/api/character/<id_class_f>", methods=["POST", "GET"])
def character_api(id_class_f):
    # Отримання даних персонажа
    character_obj = Character.query.filter_by(id_character=id_class_f).first()
    if character_obj is None:
        return jsonify({"error": "Character not found"}), 404

    character_dict = {
        'name': character_obj.name,
        'level': character_obj.level,
        'class_name': character_obj.class_name.class_name,
        'racial_group': character_obj.racial_group.racial_group,
        'strength': character_obj.strength,
        'dexterity': character_obj.dexterity,
        'constitution': character_obj.constitution,
        'intelligence': character_obj.intelligence,
        'wisdom': character_obj.wisdom,
        'charisma': character_obj.charisma,
        'armor_class': character_obj.armor_class,
        'speed': character_obj.speed,
        'initiative': character_obj.initiative,
        'health_current': character_obj.health_current,
        'health_max': character_obj.health_max,
        'proficiency_bonus': character_obj.proficiency_bonus,
        'inspiration': character_obj.inspiration,
        'attack_name': character_obj.attack.name,
        'attack_bonus': character_obj.attack.attack_bonus,
        'attack_damage': character_obj.attack.damage_type,
        'note': character_obj.note.text,
    }

    proficiency_ch_obj = CharacterProficiency.query.filter_by(id_character=id_class_f).all()
    proficiencies_list = [cp.proficiency.proficiency for cp in proficiency_ch_obj]
    character_dict['proficiencies'] = proficiencies_list

    if request.method == "POST":
        data = request.get_json()
        print(data)
        if not data:
            return jsonify({"error": "No data provided"}), 400

        char_to_update = Character.query.get_or_404(id_class_f)
        char_to_update.name = data.get('name', char_to_update.name)
        char_to_update.level = data.get('level', char_to_update.level)
        char_to_update.armor_class = data.get('armor_class', char_to_update.armor_class)
        char_to_update.speed = data.get('speed', char_to_update.speed)
        char_to_update.initiative = data.get('initiative', char_to_update.initiative)
        char_to_update.health_current = data.get('health_current', char_to_update.health_current)
        char_to_update.health_max = data.get('health_max', char_to_update.health_max)
        char_to_update.proficiency_bonus = data.get('proficiency_bonus', char_to_update.proficiency_bonus)
        char_to_update.inspiration = data.get('inspiration', char_to_update.inspiration)
        char_to_update.strength = data.get('strength', char_to_update.strength)
        char_to_update.dexterity = data.get('dexterity', char_to_update.dexterity)
        char_to_update.constitution = data.get('constitution', char_to_update.constitution)
        char_to_update.intelligence = data.get('intelligence', char_to_update.intelligence)
        char_to_update.wisdom = data.get('wisdom', char_to_update.wisdom)
        char_to_update.charisma = data.get('charisma', char_to_update.charisma)
        char_to_update.attack.name = data.get('attack_name', char_to_update.attack.name)
        char_to_update.attack.attack_bonus = data.get('attack_bonus', char_to_update.attack.attack_bonus)
        char_to_update.attack.damage_type = data.get('attack_damage', char_to_update.attack.damage_type)
        char_to_update.note.text = data.get('note', char_to_update.note.text)

        new_proficiencies = data.get('proficiencies', [])

        current_proficiencies = CharacterProficiency.query.filter_by(id_character=id_class_f).all()

        current_proficiency_names = {cp.proficiency.proficiency for cp in current_proficiencies}
        new_proficiency_names = set(new_proficiencies)

        proficiencies_to_remove = current_proficiency_names - new_proficiency_names

        proficiencies_to_add = new_proficiency_names - current_proficiency_names

        for proficiency_name in proficiencies_to_remove:
            proficiency_obj = Proficiency.query.filter_by(proficiency=proficiency_name).first()
            if proficiency_obj:
                from lab1.app.models.Characters import CharacterProficiency
                CharacterProficiency.query.filter_by(
                    id_character=id_class_f,
                    id_proficiency=proficiency_obj.id_proficiency
                ).delete()

        for proficiency_name in proficiencies_to_add:
            proficiency_obj = Proficiency.query.filter_by(proficiency=proficiency_name).first()
            if proficiency_obj:
                new_character_proficiency = CharacterProficiency(
                    checker=True,
                    id_character=id_class_f,
                    id_proficiency=proficiency_obj.id_proficiency
                )
                db.session.add(new_character_proficiency)

        try:
            db.session.commit()
            return jsonify({"message": "Character updated successfully"}), 200
        except Exception as e:
            db.session.rollback()
            print("Помилка оновлення в БД:", e)
            return jsonify({"error": "Database update error"}), 500

    return jsonify(character_dict), 200


@bp.route("/api/create-new", methods=["POST"])
def create_char_api():
    try:
        data = request.json
        id_user = session.get('id_user')

        racial_group_name = data.get('race')
        class_name = data.get('class')

        racial_group = RacialGroup.query.filter_by(racial_group=racial_group_name).first()
        class_obj = Class.query.filter_by(class_name=class_name).first()

        if not racial_group or not class_obj:
            return jsonify({"error": "Race or class not found"}), 400

        health_max = 7 + int(data.get('constitution', 0)) * 3

        new_attack = Attack(name='', attack_bonus=1, damage_type='')
        db.session.add(new_attack)

        note_text = '\n'.join(data.get('equipment', []))
        new_note = Note(text=note_text)
        db.session.add(new_note)

        db.session.flush()

        new_character = Character(
            name=data.get('name_ch'),
            level=data.get('level', 1),
            strength=data.get('strength', 0),
            dexterity=data.get('dexterity', 0),
            constitution=data.get('constitution', 0),
            intelligence=data.get('intellect', 0),
            wisdom=data.get('wisdom', 0),
            charisma=data.get('charisma', 0),
            armor_class=10,
            speed=30,
            initiative=data.get('dexterity', 0),
            health_current=health_max,
            health_max=health_max,
            proficiency_bonus=0,
            inspiration=0,
            id_attack=new_attack.id_attack,
            id_note=new_note.id_note,
            id_class=class_obj.id_class,
            id_racial_group=racial_group.id_racial_group,
            id_user=id_user
        )
        db.session.add(new_character)
        db.session.flush()

        for proficiency_name in data.get('proficiencies', []):
            proficiency = Proficiency.query.filter_by(proficiency=proficiency_name).first()
            if proficiency:
                new_ch_proficiency = CharacterProficiency(
                    checker=True, id_proficiency=proficiency.id_proficiency, id_character=new_character.id_character
                )
                db.session.add(new_ch_proficiency)

        for equipment_name in data.get('equipment', []):
            equipment_obj = Equipment.query.filter_by(equipment=equipment_name).first()
            if equipment_obj:
                new_ch_equipment = CharacterEquipment(
                    checker=True, id_equipment=equipment_obj.id_equipment, id_character=new_character.id_character
                )
                db.session.add(new_ch_equipment)

        db.session.commit()
        return jsonify({"message": "Character created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@bp.route("/api/delete/<int:character_id>", methods=["DELETE"])
def delete_character_api(character_id):
    try:
        # Отримуємо ID користувача із сесії
        id_user = session.get('id_user')
        if not id_user:
            return jsonify({"error": "Unauthorized"}), 401

        character = Character.query.filter_by(id_character=character_id, id_user=id_user).first()
        if not character:
            return jsonify({"error": "Character not found or not authorized"}), 404

        # Видаляємо всі залежні дані
        CharacterProficiency.query.filter_by(id_character=character_id).delete()
        CharacterEquipment.query.filter_by(id_character=character_id).delete()
        Attack.query.filter_by(id_attack=character.id_attack).delete()
        Note.query.filter_by(id_note=character.id_note).delete()

        # Видаляємо самого персонажа
        db.session.delete(character)
        db.session.commit()

        return jsonify({"message": "Character deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@bp.route('/api/list', methods=["GET"])
def charlist_api():
    characters = Character.query.filter_by(id_user=session.get('id_user')).all()
    character_list = [
        {
            "id": character.id_character,
            "name": character.name,
            "class_name": character.class_name.class_name,
            "racial_group": character.racial_group.racial_group,
            "level": character.level
        }
        for character in characters
    ]
    return jsonify(character_list), 200
