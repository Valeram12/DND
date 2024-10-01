from app.extensions import db

class Character(db.Model):
    id_character = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.Integer, nullable=False)
    strength = db.Column(db.Integer, nullable=False)
    dexterity = db.Column(db.Integer, nullable=False)
    constitution = db.Column(db.Integer, nullable=False)
    intelligence = db.Column(db.Integer, nullable=False)
    wisdom = db.Column(db.Integer, nullable=False)
    charisma = db.Column(db.Integer, nullable=False)
    armor_class = db.Column(db.Integer, nullable=False)
    speed = db.Column(db.Integer, nullable=False)
    initiative = db.Column(db.Integer, nullable=False)
    health_current = db.Column(db.Integer, nullable=False)
    health_max = db.Column(db.Integer, nullable=False)
    proficiency_bonus = db.Column(db.Integer, nullable=False)
    inspiration = db.Column(db.Integer, nullable=False)
    id_attack = db.Column(db.Integer, db.ForeignKey(
        'attack.id_attack'), nullable=False)
    attack = db.relationship('Attack', backref='characters')
    id_note = db.Column(db.Integer, db.ForeignKey(
        'note.id_note'), nullable=False)
    note = db.relationship('Note', backref='characters')
    id_class = db.Column(db.Integer, db.ForeignKey(
        'class.id_class'), nullable=False)
    class_name = db.relationship('Class', backref='characters')
    id_racial_group = db.Column(db.Integer, db.ForeignKey(
        'racial_group.id_racial_group'), nullable=False)
    racial_group = db.relationship('RacialGroup', backref='characters')
    id_user = db.Column(db.Integer, db.ForeignKey(
        'user.id_user'), nullable=False)
    user = db.relationship('User', backref='characters')


class CharacterProficiency(db.Model):
    id_ch_proficiency = db.Column(
        db.Integer, primary_key=True, autoincrement=True)
    checker = db.Column(db.Boolean, nullable=False)
    id_proficiency = db.Column(db.Integer, db.ForeignKey(
        'proficiency.id_proficiency'), nullable=False)
    proficiency = db.relationship(
        'Proficiency', backref='character_proficiencies')
    id_character = db.Column(db.Integer, db.ForeignKey(
        'character.id_character'), nullable=False)
    character = db.relationship('Character', backref='character_proficiencies')


class CharacterEquipment(db.Model):
    id_ch_equipment = db.Column(
        db.Integer, primary_key=True, autoincrement=True)
    checker = db.Column(db.Boolean, nullable=False)
    id_equipment = db.Column(db.Integer, db.ForeignKey(
        'equipment.id_equipment'), nullable=False)
    equipment = db.relationship('Equipment', backref='character_equipments')
    id_character = db.Column(db.Integer, db.ForeignKey(
        'character.id_character'), nullable=False)
    character = db.relationship('Character', backref='character_equipments')


class Class(db.Model):
    id_class = db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_name = db.Column(db.String(50), nullable=False)


class RacialGroup(db.Model):
    id_racial_group = db.Column(
        db.Integer, primary_key=True, autoincrement=True)
    racial_group = db.Column(db.String(50), nullable=False)


class Equipment(db.Model):
    id_equipment = db.Column(db.Integer, primary_key=True, autoincrement=True)
    equipment = db.Column(db.String(50), nullable=False)


class Proficiency(db.Model):
    id_proficiency = db.Column(
        db.Integer, primary_key=True, autoincrement=True)
    proficiency = db.Column(db.String(50), nullable=False)


class Note(db.Model):
    id_note = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.String(2000), nullable=False)


class Attack(db.Model):
    id_attack = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    attack_bonus = db.Column(db.Integer, nullable=False)
    damage_type = db.Column(db.String(100), nullable=False)
