from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, Blueprint, render_template, url_for, send_file, request, flash, redirect, session, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_login import login_user, login_required, current_user, UserMixin, LoginManager, logout_user
import json

app = Flask(__name__, static_folder='static')
db = SQLAlchemy()
app.config['SECRET_KEY'] = 'thisismysecretkeydonotstealit'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dnd.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.app_context().push()
db.init_app(app)

Session = scoped_session(sessionmaker(bind=db.engine))

login_manager = LoginManager()
login_manager.login_view = 'auth'
login_manager.init_app(app)


@login_manager.user_loader
def load_user(id_user):
    return Session.get(User, int(id_user))

def all_monsters():
    with open("./static/json/monsters.json") as f:
        data = json.load(f)
    return {i['name']: [i['url'][13:], i['index']] for i in data.get('results', [])}


monsters1 = all_monsters()


def get_monster_details(monster_file):
    monster_properties = {}
    try:
        with open(f"./static/json/all_types_details/monsters/{monster_file}.json") as f:
            data = json.load(f)

        monster_properties = {
            "name": data.get("name", "-"),
            "type": data.get("type", "-"),
            "armor_class": data.get("armor_class", [{"value": "-"}])[0]["value"],
            "speed_walk": data.get("speed", {}).get("walk", "-"),
            "speed_swim": data.get("speed", {}).get("swim", "-"),
            "strength": data.get("strength", "-"),
            "dexterity": data.get("dexterity", "-"),
            "constitution": data.get("constitution", "-"),
            "intelligence": data.get("intelligence", "-"),
            "wisdom": data.get("wisdom", "-"),
            "charisma": data.get("charisma", "-"),
            "damage_vulnerabilities": data.get("damage_vulnerabilities", []),
            "damage_resistances": data.get("damage_resistances", []),
            "damage_immunities": data.get("damage_immunities", []),
            "challenge_rating": data.get("challenge_rating", "-"),
            "hit_points": data.get("hit_points", "-"),
            "special_abilities_name": data.get("special_abilities", [{}])[0].get("name", "-"),
            "special_abilities_desc": data.get("special_abilities", [{}])[0].get("desc", "-"),
            "action_name": data.get("actions", [{}])[0].get("name", "-"),
            "action_desc": data.get("actions", [{}])[0].get("desc", "-"),
            "attack_bonus": data.get("actions", [{}])[0].get("attack_bonus", "-"),
            "damage_type": data.get("actions", [{}])[0].get("damage", [{}])[0].get("damage_type", {}).get("index", "-"),
            "image": data.get("image", "")
        }
    except FileNotFoundError:
        monster_properties["name"] = "Not Found"
    return monster_properties


@app.route("/bestiary/<monsters_name>")
def detail_bestiary(monsters_name):
    monster_properties = {}
    for key, value in monsters1.items():
        if monsters_name.lower() == value[1].lower():
            monster_properties = get_monster_details(value[1])
            break

    name = current_user.username if current_user.is_authenticated else None
    return render_template("bestiary.html", dict_monster_prop=monster_properties, monsters=monsters1, name=name)


@app.route("/", methods=("POST", "GET"))
def index():
    if current_user.is_authenticated:
        name = current_user.username
    else:
        name = None
    if request.method == "GET":
        text_name = request.form.get('text_name')
        email = request.form.get('email')
        text_area = request.form.get('text_area')
    return render_template('index.html', name=name)

#--------------



#---------------

@app.route("/merche.html")
def merche():
    if current_user.is_authenticated:
        name = current_user.username
    else:
        name = None
    return render_template("merche.html", name = name)

@app.route('/charlist.html')
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


@app.route("/create-char.html", methods=("POST", "GET"))
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
            return redirect(url_for('create_char'))

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
        return redirect(url_for("charlist"))

    return render_template("create-char.html", name=current_user.username)


@app.route("/dice.html")
def dice():
    if current_user.is_authenticated:
        name = current_user.username
    else:
        name = None
    return render_template("dice.html", name = name)


@app.route("/character/<id_class_f>", methods=("POST", "GET"))
@login_required
def character(id_class_f):
    character_obj = Character.query.filter_by(id_character=id_class_f).first()

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
            return redirect(url_for('character', id_class_f=id_class_f))
        except Exception as e:
            db.session.rollback()
            print("Помилка оновлення в БД:", e)
        

    print(proficiencies_list)
    
    return render_template("character.html", character=character_dict, name=current_user.username, proficiencies_list=proficiencies_list)



@app.route('/auth.html', methods=("POST", "GET"))
def auth():
    if request.method == "POST":
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            flash('Логін або пароль введено невірно')
            return redirect(url_for('auth'))
        login_user(user)
        return redirect(url_for("charlist"))

    return render_template('auth.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth'))


@app.route("/registration.html", methods=("POST", "GET"))
def registration():
    if request.method == "POST":
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        if password != confirm_password:
            print("Паролі не збігаються")
        else:
            try:
                hash = generate_password_hash(password)
                new_user = User(username=request.form['username'], email=request.form['email'],
                                password=hash, id_user_type=1)
                db.session.add(new_user)
                db.session.flush()
                db.session.commit()
                return redirect(url_for("auth"))
            except Exception as e:
                db.session.rollback()
                print("Помилка додавання в БД:", e)
    return render_template("registration.html")





#------------DB---------
class UserType(db.Model):
    id_user_type = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_type = db.Column(db.String(50), nullable=False)


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


class User(UserMixin, db.Model):
    id_user = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    id_user_type = db.Column(db.Integer, db.ForeignKey(
        'user_type.id_user_type'), nullable=False)
    user_type = db.relationship('UserType', backref='users')

    def get_id(self):
        return (self.id_user)


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



if __name__ == "__main__":
    app.run(debug=True)

