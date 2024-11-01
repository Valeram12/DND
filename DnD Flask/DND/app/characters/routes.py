# from flask import redirect, url_for, abort, request, render_template, flash
# from flask_login import login_required, current_user
#
# from app.characters import bp
# from app.models.Characters import *
#
#
# @bp.route("/<id_class_f>", methods=("POST", "GET"))
# @login_required
# def character(id_class_f):
#     character_obj = Character.query.filter_by(id_character=id_class_f).first()
#
#     if current_user.id_user != character_obj.id_user:
#         return redirect(url_for('characters.charlist'))
#
#     if character_obj is None:
#         abort(404)
#     character_dict = {
#         'name': character_obj.name,
#         'level': character_obj.level,
#         'class_name': character_obj.class_name.class_name,
#         'racial_group': character_obj.racial_group.racial_group,
#         'strength': character_obj.strength,
#         'dexterity': character_obj.dexterity,
#         'constitution': character_obj.constitution,
#         'intelligence': character_obj.intelligence,
#         'wisdom': character_obj.wisdom,
#         'charisma': character_obj.charisma,
#         'armor_class': character_obj.armor_class,
#         'speed': character_obj.speed,
#         'initiative': character_obj.initiative,
#         'health_current': character_obj.health_current,
#         'health_max': character_obj.health_max,
#         'proficiency_bonus': character_obj.proficiency_bonus,
#         'inspiration': character_obj.inspiration,
#         'attack_name': character_obj.attack.name,
#         'attack_bonus': character_obj.attack.attack_bonus,
#         'attack_damage': character_obj.attack.damage_type,
#         'note': character_obj.note.text,
#     }
#
#     proficiency_ch_obj = CharacterProficiency.query.filter_by(id_character=id_class_f).all()
#     proficiencies_list = [cp.proficiency.proficiency for cp in proficiency_ch_obj]
#
#     char_to_update = Character.query.get_or_404(id_class_f)
#     if request.method == "POST":
#         char_to_update.name = request.form.get('name_ch')
#         char_to_update.level = request.form.get('level')
#         char_to_update.armor_class = request.form.get('armor_class')
#         char_to_update.speed = request.form.get('speed')
#         char_to_update.initiative = request.form.get('initiative')
#         char_to_update.health_current = request.form.get('health_current')
#         char_to_update.health_max = request.form.get('health_max')
#         char_to_update.proficiency_bonus = request.form.get('proficiency_bonus')
#         char_to_update.inspiration = request.form.get('inspiration')
#         char_to_update.strength = request.form.get('strength')
#         char_to_update.dexterity = request.form.get('dexterity')
#         char_to_update.constitution = request.form.get('constitution')
#         char_to_update.intelligence = request.form.get('intelligence')
#         char_to_update.wisdom = request.form.get('wisdom')
#         char_to_update.charisma = request.form.get('charisma')
#         char_to_update.attack.name = request.form.get('attack_name')
#         char_to_update.attack.attack_bonus = request.form.get('attack_bonus')
#         char_to_update.attack.damage_type = request.form.get('damage_type')
#         char_to_update.note.text = request.form.get('note')
#         try:
#             db.session.commit()
#             return redirect(url_for('characters.character', id_class_f=id_class_f))
#         except Exception as e:
#             db.session.rollback()
#             print("Помилка оновлення в БД:", e)
#
#     print(proficiencies_list)
#
#     return render_template("character.html", character=character_dict, name=current_user.username,
#                            proficiencies_list=proficiencies_list)
#
#
# @bp.route("/create-new", methods=("POST", "GET"))
# @login_required
# def create_char():
#     if request.method == "POST":
#         id_user = current_user.id_user
#         name_ch = request.form.get('name_ch')
#         racial_group_name = request.form.get('race')
#         class_name = request.form.get('class')
#         level = request.form.get('level')
#         strength = request.form.get('strength')
#         dexterity = request.form.get('dexterity')
#         constitution = request.form.get('constitution')
#         intelect = request.form.get('intelect')
#         wisdom = request.form.get('wisdom')
#         charisma = request.form.get('charisma')
#         answers = request.form.getlist('answer1')
#         equipments = request.form.getlist('answer2')
#
#         # Отримання пов'язаних об'єктів із БД
#         racial_group = RacialGroup.query.filter_by(racial_group=racial_group_name).first()
#         class_obj = Class.query.filter_by(class_name=class_name).first()
#
#         if not racial_group or not class_obj:
#             flash("Race or class not found!")
#             return redirect(url_for('characters.create_char'))
#
#         # Розрахунок характеристик
#         health_max = 7 + int(constitution) * 3
#
#         # Додавання атаки
#         new_attack = Attack(name='', attack_bonus=1, damage_type='')
#         db.session.add(new_attack)
#
#         # Додавання нотаток
#         note_text = '\n'.join(equipments)
#         new_note = Note(text=note_text)
#         db.session.add(new_note)
#
#         db.session.flush()
#
#         new_character = Character(
#             name=name_ch,
#             level=level,
#             strength=strength,
#             dexterity=dexterity,
#             constitution=constitution,
#             intelligence=intelect,
#             wisdom=wisdom,
#             charisma=charisma,
#             armor_class=10,
#             speed=30,
#             initiative=dexterity,
#             health_current=health_max,
#             health_max=health_max,
#             proficiency_bonus=0,
#             inspiration=0,
#             id_attack=new_attack.id_attack,
#             id_note=new_note.id_note,
#             id_class=class_obj.id_class,
#             id_racial_group=racial_group.id_racial_group,
#             id_user=id_user
#         )
#         db.session.add(new_character)
#         db.session.flush()
#
#         # Додавання вмінь персонажа
#         if answers:
#             for answer in answers:
#                 proficiency = Proficiency.query.filter_by(proficiency=answer).first()
#                 if proficiency:
#                     new_ch_proficiency = CharacterProficiency(
#                         checker=True, id_proficiency=proficiency.id_proficiency, id_character=new_character.id_character
#                     )
#                     db.session.add(new_ch_proficiency)
#
#         # Додавання спорядження персонажа
#         if equipments:
#             for equipment in equipments:
#                 equipment_obj = Equipment.query.filter_by(equipment=equipment).first()
#                 if equipment_obj:
#                     new_ch_equipment = CharacterEquipment(
#                         checker=True, id_equipment=equipment_obj.id_equipment, id_character=new_character.id_character
#                     )
#                     db.session.add(new_ch_equipment)
#
#         db.session.commit()
#         return redirect(url_for("characters.charlist"))
#
#     return render_template("create-char.html", name=current_user.username)
#
#
# @bp.route('/list')
# @login_required
# def charlist():
#     character_list = Character.query.filter_by(id_user=current_user.id_user).all()
#     character_dict = {
#         character.id_character: [
#             character.name,
#             character.class_name.class_name,
#             character.racial_group.racial_group,
#             character.level
#         ] for character in character_list
#     }
#     return render_template('charlist.html', name=current_user.username, character_dict=character_dict)

from flask import jsonify, session, request
from flask_login import login_required, current_user
from app.characters import bp
from app.models.Characters import *


@bp.route("/api/character/<id_class_f>", methods=["POST", "GET"])
@login_required
def character_api(id_class_f):
    character_obj = Character.query.filter_by(id_character=id_class_f).first()

    if not character_obj or current_user.id_user != character_obj.id_user:
        return jsonify({"error": "Character not found or access denied"}), 404

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

    if request.method == "POST":
        try:
            data = request.json
            character_obj.name = data.get('name_ch', character_obj.name)
            character_obj.level = data.get('level', character_obj.level)
            character_obj.armor_class = data.get('armor_class', character_obj.armor_class)
            character_obj.speed = data.get('speed', character_obj.speed)
            character_obj.initiative = data.get('initiative', character_obj.initiative)
            character_obj.health_current = data.get('health_current', character_obj.health_current)
            character_obj.health_max = data.get('health_max', character_obj.health_max)
            character_obj.proficiency_bonus = data.get('proficiency_bonus', character_obj.proficiency_bonus)
            character_obj.inspiration = data.get('inspiration', character_obj.inspiration)
            character_obj.strength = data.get('strength', character_obj.strength)
            character_obj.dexterity = data.get('dexterity', character_obj.dexterity)
            character_obj.constitution = data.get('constitution', character_obj.constitution)
            character_obj.intelligence = data.get('intelligence', character_obj.intelligence)
            character_obj.wisdom = data.get('wisdom', character_obj.wisdom)
            character_obj.charisma = data.get('charisma', character_obj.charisma)
            character_obj.attack.name = data.get('attack_name', character_obj.attack.name)
            character_obj.attack.attack_bonus = data.get('attack_bonus', character_obj.attack.attack_bonus)
            character_obj.attack.damage_type = data.get('damage_type', character_obj.attack.damage_type)
            character_obj.note.text = data.get('note', character_obj.note.text)

            db.session.commit()
            return jsonify({"message": "Character updated successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Database update error: {str(e)}"}), 500

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

