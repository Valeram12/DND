import json

from flask import render_template
from flask_login import current_user

from app.bestiary import bp


@bp.route("/<monsters_name>")
def detail_bestiary(monsters_name):
    monster_properties = {}
    for key, value in monsters1.items():
        if monsters_name.lower() == value[1].lower():
            monster_properties = get_monster_details(value[1])
            break

    name = current_user.username if current_user.is_authenticated else None
    return render_template("bestiary.html", dict_monster_prop=monster_properties, monsters=monsters1, name=name)

def all_monsters():
    with open("app/static/json/monsters.json") as f:
        data = json.load(f)
    return {i['name']: [i['url'][13:], i['index']] for i in data.get('results', [])}


monsters1 = all_monsters()


def get_monster_details(monster_file):
    monster_properties = {}
    try:
        with open(f"app/static/json/all_types_details/monsters/{monster_file}.json") as f:
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
