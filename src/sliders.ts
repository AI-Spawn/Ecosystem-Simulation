//@ts-nocheck
function sliders() {
  let gc: Map<string, number> = new Map();
  var x = document.getElementById("form").elements;
  for (const i of x) {
    gc.set(i.name, i.value);
  }
  //general
  num_ants = float(gc.get("num_ants"));
  num_food = float(gc.get("num_food"));

  //ants
  start_food = float(gc.get("start_food"));
  birth_food = float(gc.get("birth_food"));
  birth_energy = float(gc.get("birth_energy"));
  litter_size = float(gc.get("litter_size"));
  litter_varience = float(gc.get("litter_varience"));
  move_energy = float(gc.get("move_energy"));
  energy_rate = float(gc.get("energy_rate"));
  eat_rate = float(gc.get("eat_rate"));
  ant_speed = float(gc.get("ant_speed"));
  vision_range = float(gc.get("vision_range"));
  shout_range = float(gc.get("shout_range"));

  // food
  min_food_size = float(gc.get("min_food_size"));
  max_food_size = float(gc.get("max_food_size"));

  // evolution
  max_skill_points = float(gc.get("max_skill_points"));
  pos_mutation_chance = float(gc.get("pos_mutation_chance"));
  sec_pos_mutation_chance = float(gc.get("sec_pos_mutation_chance"));
  neg_mutation_chance = float(gc.get("neg_mutation_chance"));
  sec_neg_mutation_chance = float(gc.get("sec_neg_mutation_chance"));
  speed_effect = float(gc.get("speed_effect"));
  move_energy_effect = float(gc.get("move_energy_effect"));
  energy_rate_effect = float(gc.get("energy_rate_effect"));
  turn_speed_effect = float(gc.get("turn_speed_effect"));
  vision_range_effect = float(gc.get("vision_range_effect"));
  litter_size_effect = float(gc.get("litter_size_effect"));

  ants = [];
  depos = [];
  ant_tree = [];
  tick = 0;
  init_ants();
}
