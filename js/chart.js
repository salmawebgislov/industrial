// Chart.js for dashboard (masukkan di bawah peta)
new Chart(document.getElementById("produksiChart"), {
  type: "bar",
  data: {
    labels: ["Kecamatan A", "Kecamatan B"],
    datasets: [
      {
        label: "Produksi (ton)",
        data: [3000, 2500],
        backgroundColor: "green"
      },
      {
        label: "Kebutuhan (ton)",
        data: [3200, 2700],
        backgroundColor: "red"
      }
    ]
  }
});
