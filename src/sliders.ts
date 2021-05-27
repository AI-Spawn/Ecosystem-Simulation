//@ts-nocheck
function sliders() {
  ants = [];
  depos = [];
  let gc: Map<string, number> = new Map();
  var x = document.getElementById("form").elements;
  for (const i of x) {
    gc.set(i.name, i.value);
  }
  num_ants = gc.get("num_ants");
  num_food = gc.get("num_food");

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

  min_food_size = gc.get("min_food_size");
  max_food_size = gc.get("max_food_size");

  setup();
}
