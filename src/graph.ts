//@ts-nocheck
interface Graphs {
  points: [any, any][];
  speed: [any.any][];
}
let graphs: Graphs = {
  points: [],
  speed: [],
};
function graph(data: Stats[]) {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  graphs.points = [["Tick", "Points"]];

  graphs.speed = [["Tick", "Speed"]];

  for (const d of data) {
    graphs.points.push([d.tick, d.num_points]);

    graphs.speed.push([d.tick, d.speed]);
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

    let speed = google.visualization.arrayToDataTable(graphs.speed);
    var options = {
      title: "Average Speed",
      legend: { position: "bottom" },
    };
    var chart = new google.visualization.LineChart(
      document.getElementById("speed_chart")
    );
    chart.draw(speed, options);
  }
}
