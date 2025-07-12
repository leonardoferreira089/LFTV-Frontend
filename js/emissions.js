// URL de base de l'API
const API_BASE_URL = "https://localhost:7279/api/Emission";

// Fonction pour récupérer toutes les émissions
async function fetchEmissions() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Erreur lors du chargement des émissions.");
    const emissions = await response.json();
    updateEmissionsList(emissions);
  } catch (error) {
    console.error(error.message);
    displayErrorMessage("Impossible de charger les émissions.");
  }
}

// Fonction pour ajouter une nouvelle émission
async function createEmission(emissionData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emissionData),
    });
    if (!response.ok) throw new Error("Erreur lors de l'ajout de l'émission.");
    fetchEmissions(); // Recharger la liste après ajout
  } catch (error) {
    console.error(error.message);
    alert("Impossible d'ajouter l'émission.");
  }
}

// Fonction pour supprimer une émission
async function deleteEmission(emissionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${emissionId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erreur lors de la suppression de l'émission.");
    fetchEmissions(); // Recharger la liste après suppression
  } catch (error) {
    console.error(error.message);
    alert("Impossible de supprimer l'émission.");
  }
}

// Fonction pour mettre à jour une émission
async function updateEmission(emissionId, emissionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/${emissionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emissionData),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'émission.");
    fetchEmissions(); // Recharger la liste après mise à jour
  } catch (error) {
    console.error(error.message);
    alert("Impossible de mettre à jour l'émission.");
  }
}

// Fonction pour mettre à jour la liste des émissions dans l'UI
function updateEmissionsList(emissions) {
  const emissionsList = document.getElementById("emissions-list");
  emissionsList.innerHTML = ""; // Vidage de la liste existante

  emissions.forEach((emission) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <h3>${emission.name}</h3>
      <p>Date : ${new Date(emission.date).toLocaleDateString()}</p>
      <p>Horaire : ${emission.startTime} - ${emission.endTime}</p>
      <button onclick="deleteEmission(${emission.id})">Supprimer</button>
      <button onclick="showUpdateForm(${emission.id})">Modifier</button>
    `;
    emissionsList.appendChild(listItem);
  });
}

// Fonction pour afficher un message d'erreur
function displayErrorMessage(message) {
  const emissionsList = document.getElementById("emissions-list");
  emissionsList.innerHTML = `<li class="error">${message}</li>`;
}

// Gérer le formulaire de création d'émission
document.getElementById("create-emission-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const emissionData = {
    name: event.target.name.value,
    date: event.target.date.value,
    startTime: event.target.startTime.value,
    endTime: event.target.endTime.value,
    imageUrl: event.target.imageUrl.value,
  };
  createEmission(emissionData);
});

// Charger les émissions au démarrage
document.addEventListener("DOMContentLoaded", fetchEmissions);