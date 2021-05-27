//@ts-nocheck
function sliders() {
  ants = [];
  depos = [];
  let gc: Map<string, number> = new Map();
  var x = document.getElementById("form").elements;
  for (const i of x) {
    gc.set(i.name, i.value);
  }
  //general
  num_ants = gc.get("num_ants");
  num_food = gc.get("num_food");

  //ants
  birth_food = gc.get("birth_food");
  birth_energy = gc.get("birth_energy");
  litter_size = gc.get("litter_size");
  litter_varience = gc.get("litter_varience");
  move_energy = gc.get("move_energy");
  energy_rate = gc.get("energy_rate");
  eat_rate = gc.get("eat_rate");
  ant_speed = gc.get("ant_speed");
  vision_range = gc.get("vision_range");
  shout_range = gc.get("shout_range");

  //food
  min_food_size = gc.get("min_food_size");
  max_food_size = gc.get("max_food_size");

  //evolution
  max_skill_points = gc.get("max_skill_points");
  pos_mutation_chance = gc.get("pos_mutation_chance");
  sec_pos_mutation_chance = gc.get("sec_pos_mutation_chance");
  neg_mutation_chance = gc.get("neg_mutation_chance");
  sec_neg_mutation_chance = gc.get("sec_neg_mutation_chance");
  speed_effect = gc.get("speed_effect");
  move_energy_effect = gc.get("move_energy_effect");
  energy_rate_effect = gc.get("energy_rate_effect");
  turn_speed_effect = gc.get("turn_speed_effect");
  vision_range_effect = gc.get("vision_range_effect");
  litter_size_effect = gc.get("litter_size_effect");

  setup();
}
