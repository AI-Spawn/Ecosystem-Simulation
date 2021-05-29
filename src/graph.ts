//@ts-nocheck
interface Graphs {
  speed: [any.any][];
}
let graphs: Graphs = {
  speed: [],
};
function graph(data: Stats[]) {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  graphs.speed = [
    ["Tick", "Speed"],
    [0, ant_speed],
  ];
  for (const d of data) {
    graphs.speed.push([d.tick, d.speed]);
  }

  function drawChart() {
    console.log(graphs.speed);
    var data = google.visualization.arrayToDataTable(graphs.speed);

    var options = {
      title: "Average Ant Speed",
      //   curveType: "function",
      legend: { position: "bottom" },
    };

    var chart = new google.visualization.LineChart(
      document.getElementById("curve_chart")
    );

    chart.draw(data, options);
  }
}
