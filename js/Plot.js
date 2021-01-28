var chart;

function plotChart() {
  var context = document.getElementById("chart").getContext("2d");

  chart = new Chart(context, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Deaths",
          backgroundColor: "rgb(99, 132, 255)",
          borderColor: "rgb(99, 132, 255)",
          data: [],
        },
        {
          label: "Recovered",
          backgroundColor: "rgb(99, 255, 132)",
          borderColor: "rgb(99, 255, 132)",
          data: [],
        },

        {
          label: "Infected",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: [],
        },
      ],
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

  chart.data.datasets[2].data.push(latestInfectionCount);
  chart.data.datasets[1].data.push(latestRecoveredCount);
  chart.data.datasets[0].data.push(latestDeathCount);
  preserveRightOrder();
  chart.update();
}

function preserveRightOrder() {
  // Do any good sorting algorithm PLEASE I'm too tired
  return;
}

function clearChart() {
  if (chart != null) {
    chart.clear();
  }
}
