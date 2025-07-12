// URL de base de l'API
const API_BASE_URL = "https://localhost:7279/api";

// Fonction pour charger une émission spécifique
async function fetchEmissionById(emissionId) {
  try {
    // Appel à l'API pour récupérer les données de l'émission
    const response = await fetch(`${API_BASE_URL}/Emission/${emissionId}`);

    // Vérification du statut de la réponse
    if (!response.ok) {
      throw new Error("Erreur lors du chargement de l'émission.");
    }

    // Conversion de la réponse en JSON
    const emission = await response.json();

    // Mise à jour de l'interface utilisateur
    updateCurrentBroadcastUI(emission);
  } catch (error) {
    console.error(error.message);
    displayErrorMessage("Impossible de charger les informations de l'émission.");
  }
}

// Fonction pour mettre à jour l'interface utilisateur avec l'émission récupérée
function updateCurrentBroadcastUI(emission) {
  const currentBroadcastBox = document.querySelector(".broadcast-box");
  currentBroadcastBox.innerHTML = `
    <img src="${emission.imageUrl || "images/default-image.jpg"}" alt="${emission.name}">
    <h2>${emission.name}</h2>
    <p>Horaire : ${emission.startTime} - ${emission.endTime}</p>
    <a href="#" class="watch-now-btn">Regarder maintenant</a>
  `;
}

// Fonction pour afficher un message d'erreur
function displayErrorMessage(message) {
  const currentBroadcastBox = document.querySelector(".broadcast-box");
  currentBroadcastBox.innerHTML = `<p class="error">${message}</p>`;
}

// Charger l'émission lorsque la page s'affiche
document.addEventListener("DOMContentLoaded", () => {
  const emissionId = 43; // ID de l'émission à charger
  fetchEmissionById(emissionId);
});