var chart;

function plotChart() {
  document.getElementById("plot-heading").style.visibility = "visible";
  var context = document.getElementById("chart").getContext("2d");

  chart = new Chart(context, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Infected",
          backgroundColor: "rgba(255, 99, 132, 0.1)",
          borderColor: "rgb(255, 99, 132)",
          data: [],
        },
        {
          label: "Immune",
          backgroundColor: "rgba(99, 255, 132, 0.1)",
          borderColor: "rgb(99, 255, 132)",
          data: [],
        },
        {
          label: "Deaths",
          backgroundColor: "rgba(99, 132, 255, 0.1)",
          borderColor: "rgb(99, 132, 255)",
          data: [],
        }
      ]
    },

    options: {},
  });
}

function updateChart(
  latestInfectionCount,
  latestDeathCount,
  latestRecoveredCount,
  day
) {
  chart.data.labels.push(day);

  chart.data.datasets[0].data.push(latestInfectionCount);
  chart.data.datasets[1].data.push(latestRecoveredCount);
  chart.data.datasets[2].data.push(latestDeathCount);
  chart.update();
}


function clearChart() {
  if (chart != null) {
    chart.clear();
    chart.destroy();
  }
}
