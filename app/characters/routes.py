from flask import redirect, url_for, abort, request, render_template, flash
from flask_login import login_required, current_user

from app.characters import bp
from app.models.Characters import *


@bp.route("/<id_class_f>", methods=("POST", "GET"))
@login_required
def character(id_class_f):
    character_obj = Character.query.filter_by(id_character=id_class_f).first()

    if current_user.id_user != character_obj.id_user:
        return redirect(url_for('characters.charlist'))

    if character_obj is None:
        abort(404)
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

    char_to_update = Character.query.get_or_404(id_class_f)
    if request.method == "POST":
        char_to_update.name = request.form.get('name_ch')
        char_to_update.level = request.form.get('level')
        char_to_update.armor_class = request.form.get('armor_class')
        char_to_update.speed = request.form.get('speed')
        char_to_update.initiative = request.form.get('initiative')
        char_to_update.health_current = request.form.get('health_current')
        char_to_update.health_max = request.form.get('health_max')
        char_to_update.proficiency_bonus = request.form.get('proficiency_bonus')
        char_to_update.inspiration = request.form.get('inspiration')
        char_to_update.strength = request.form.get('strength')
        char_to_update.dexterity = request.form.get('dexterity')
        char_to_update.constitution = request.form.get('constitution')
        char_to_update.intelligence = request.form.get('intelligence')
        char_to_update.wisdom = request.form.get('wisdom')
        char_to_update.charisma = request.form.get('charisma')
        char_to_update.attack.name = request.form.get('attack_name')
        char_to_update.attack.attack_bonus = request.form.get('attack_bonus')
        char_to_update.attack.damage_type = request.form.get('damage_type')
        char_to_update.note.text = request.form.get('note')
        try:
            db.session.commit()
            return redirect(url_for('characters.character', id_class_f=id_class_f))
        except Exception as e:
            db.session.rollback()
            print("Помилка оновлення в БД:", e)

    print(proficiencies_list)

    return render_template("character.html", character=character_dict, name=current_user.username,
                           proficiencies_list=proficiencies_list)


@bp.route("/create-new", methods=("POST", "GET"))
@login_required
def create_char():
    if request.method == "POST":
        id_user = current_user.id_user
        name_ch = request.form.get('name_ch')
        racial_group_name = request.form.get('race')
        class_name = request.form.get('class')
        level = request.form.get('level')
        strength = request.form.get('strength')
        dexterity = request.form.get('dexterity')
        constitution = request.form.get('constitution')
        intelect = request.form.get('intelect')
        wisdom = request.form.get('wisdom')
        charisma = request.form.get('charisma')
        answers = request.form.getlist('answer1')
        equipments = request.form.getlist('answer2')

        # Отримання пов'язаних об'єктів із БД
        racial_group = RacialGroup.query.filter_by(racial_group=racial_group_name).first()
        class_obj = Class.query.filter_by(class_name=class_name).first()

        if not racial_group or not class_obj:
            flash("Race or class not found!")
            return redirect(url_for('characters.create_char'))

        # Розрахунок характеристик
        health_max = 7 + int(constitution) * 3

        # Додавання атаки
        new_attack = Attack(name='', attack_bonus=1, damage_type='')
        db.session.add(new_attack)

        # Додавання нотаток
        note_text = '\n'.join(equipments)
        new_note = Note(text=note_text)
        db.session.add(new_note)

        db.session.flush()

        new_character = Character(
            name=name_ch,
            level=level,
            strength=strength,
            dexterity=dexterity,
            constitution=constitution,
            intelligence=intelect,
            wisdom=wisdom,
            charisma=charisma,
            armor_class=10,
            speed=30,
            initiative=dexterity,
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

        # Додавання вмінь персонажа
        if answers:
            for answer in answers:
                proficiency = Proficiency.query.filter_by(proficiency=answer).first()
                if proficiency:
                    new_ch_proficiency = CharacterProficiency(
                        checker=True, id_proficiency=proficiency.id_proficiency, id_character=new_character.id_character
                    )
                    db.session.add(new_ch_proficiency)

        # Додавання спорядження персонажа
        if equipments:
            for equipment in equipments:
                equipment_obj = Equipment.query.filter_by(equipment=equipment).first()
                if equipment_obj:
                    new_ch_equipment = CharacterEquipment(
                        checker=True, id_equipment=equipment_obj.id_equipment, id_character=new_character.id_character
                    )
                    db.session.add(new_ch_equipment)

        db.session.commit()
        return redirect(url_for("characters.charlist"))

    return render_template("create-char.html", name=current_user.username)


@bp.route('/list')
@login_required
def charlist():
    character_list = Character.query.filter_by(id_user=current_user.id_user).all()
    character_dict = {
        character.id_character: [
            character.name,
            character.class_name.class_name,
            character.racial_group.racial_group,
            character.level
        ] for character in character_list
    }
    return render_template('charlist.html', name=current_user.username, character_dict=character_dict)
