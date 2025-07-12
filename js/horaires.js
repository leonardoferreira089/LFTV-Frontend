// URL de base de l'API
const API_BASE_URL = "https://localhost:7279/api";

// Fonction pour charger les horaires des émissions
async function fetchWeeklySchedule() {
  try {
    // Appel à l'API pour récupérer toutes les émissions
    const response = await fetch(`${API_BASE_URL}/Emission`);

    // Vérification du statut de la réponse
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des horaires.");
    }

    // Conversion de la réponse en JSON
    const emissions = await response.json();

    // Mise à jour de l'interface utilisateur
    updateScheduleTable(emissions);
  } catch (error) {
    console.error(error.message);
    displayErrorMessage("Impossible de charger les horaires des émissions.");
  }
}

// Fonction pour mettre à jour le tableau des horaires
function updateScheduleTable(emissions) {
  const tableBody = document.querySelector("#schedule-table tbody");
  tableBody.innerHTML = ""; // Vidage du tableau existant

  // Grouper les émissions par jour
  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const groupedEmissions = groupByDay(emissions);

  // Générer les lignes du tableau pour chaque jour
  daysOfWeek.forEach((day) => {
    const dailyEmissions = groupedEmissions[day] || [];
    if (dailyEmissions.length === 0) {
      tableBody.innerHTML += `<tr><td>${day}</td><td colspan="3">Aucune émission</td></tr>`;
    } else {
      dailyEmissions.forEach((emission, index) => {
        tableBody.innerHTML += `
          <tr>
            ${index === 0 ? `<td rowspan="${dailyEmissions.length}">${day}</td>` : ""}
            <td>${emission.name}</td>
            <td>${emission.startTime}</td>
            <td>${emission.endTime}</td>
          </tr>
        `;
      });
    }
  });
}

// Fonction pour grouper les émissions par jour
function groupByDay(emissions) {
  const grouped = {};
  emissions.forEach((emission) => {
    const day = new Date(emission.date).toLocaleDateString("fr-FR", { weekday: "long" });
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(emission);
  });
  return grouped;
}

// Fonction pour afficher un message d'erreur
function displayErrorMessage(message) {
  const tableBody = document.querySelector("#schedule-table tbody");
  tableBody.innerHTML = `<tr><td colspan="4" class="error">${message}</td></tr>`;
}

// Charger les horaires lorsque la page s'affiche
document.addEventListener("DOMContentLoaded", () => {
  fetchWeeklySchedule();
});