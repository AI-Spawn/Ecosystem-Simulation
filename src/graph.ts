//@ts-nocheck
interface Graphs {
  points: [any, any][];
  population_size: [any, any][];

  speed: [any.any][];
  turn: [any, any][];
  num_children: [any, any][];
  energy_consumption_rate: [any, any][];
  vision_range: [any, any][];
}
let graphs: Graphs = {
  points: [],
  population_size: [],

  speed: [],
  turn: [],
  num_children: [],
  energy_consumption_rate: [],
  vision_range: [],
};
function graph(data: Stats[]) {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  graphs.points = [["Tick", "Points"]];
  graphs.population_size = [["Tick", "Population Size"]];

  graphs.speed = [["Tick", "Speed"]];
  graphs.turn = [["Tick", "Turn Angle Rad"]];
  graphs.num_children = [["Tick", "Number of Children"]];
  graphs.energy_consumption_rate = [["Tick", "Energy Consumption Rate"]];
  graphs.vision_range = [["Tick", "Vision Range"]];

  for (const d of data) {
    graphs.points.push([d.tick, d.num_points]);
    graphs.population_size.push([d.tick, d.population_size]);

    graphs.speed.push([d.tick, d.speed]);
    graphs.turn.push([d.tick, d.turn_speed]);
    graphs.num_children.push([d.tick, d.litter_size]);
    graphs.energy_consumption_rate.push([d.tick, d.energy_rate]);
    graphs.vision_range.push([d.tick, d.vision_range]);
  }

  function drawChart() {
    let num_points = google.visualization.arrayToDataTable(graphs.points);
    var options = {
      title: "Average Points",
      legend: { position: "bottom" },
    };
    var chart = new google.visualization.LineChart(
      document.getElementById("points_chart")
    );
    chart.draw(num_points, options);

    let population = google.visualization.arrayToDataTable(
      graphs.population_size
    );
    options.title = "Population Size";
    chart = new google.visualization.LineChart(
      document.getElementById("population_chart")
    );
    chart.draw(population, options);

    let speed = google.visualization.arrayToDataTable(graphs.speed);
    options.title = "Average Speed";
    chart = new google.visualization.LineChart(
      document.getElementById("speed_chart")
    );
    chart.draw(speed, options);

    let turn = google.visualization.arrayToDataTable(graphs.turn);
    options.title = "Average Turn Angle (Rad)";
    chart = new google.visualization.LineChart(
      document.getElementById("turn_angle_chart")
    );
    chart.draw(turn, options);

    let children = google.visualization.arrayToDataTable(graphs.num_children);
    options.title = "Average Number of Children per Mitosis";
    chart = new google.visualization.LineChart(
      document.getElementById("num_children_chart")
    );
    chart.draw(children, options);

    let consumption = google.visualization.arrayToDataTable(
      graphs.energy_consumption_rate
    );
    options.title = "Average Energy Consumption Efficiency";
    chart = new google.visualization.LineChart(
      document.getElementById("energy_consumption_chart")
    );
    chart.draw(consumption, options);

    let vision = google.visualization.arrayToDataTable(graphs.vision_range);
    options.title = "Average Vision Range";
    chart = new google.visualization.LineChart(
      document.getElementById("vision_range_chart")
    );
    chart.draw(vision, options);
  }
}
