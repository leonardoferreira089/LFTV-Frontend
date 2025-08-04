// URL de base de l'API
const API_BASE_URL = "https://localhost:7279/api/Emission";

// === Fonction pour récupérer toutes les émissions ===
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

// === Fonction pour ajouter une nouvelle émission ===
async function createEmission(emissionData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emissionData),
        });

        if (!response.ok) throw new Error("Erreur lors de l'ajout de l'émission.");

        const newEmission = await response.json();
        afficherEmission(newEmission); // Ajout dynamique
        document.getElementById("create-emission-form").reset(); // Réinitialiser le formulaire
    } catch (error) {
        console.error(error.message);
        alert("Impossible d'ajouter l'émission.");
    }
}

// === Fonction pour mettre à jour la liste des émissions dans l'UI ===
function updateEmissionsList(emissions) {
    const emissionsList = document.getElementById("emissions-list");
    emissionsList.innerHTML = ""; // Vidage de la liste existante

    emissions.forEach((emission) => {
        afficherEmission(emission);
    });
}

// === Fonction pour afficher une émission dans la liste ===
function afficherEmission(emission) {
    const emissionsList = document.getElementById("emissions-list");
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <h3>${emission.name}</h3>
        <p>Jour : ${getDayName(emission.jour)}</p>
        <p>Horaire : ${emission.startTime} - ${emission.endTime}</p>
        <img src="${emission.imageUrl || 'https://via.placeholder.com/150'}" alt="Image de l'émission" width="150">
    `;
    emissionsList.appendChild(listItem);
}

// === Fonction pour convertir l'index du jour en nom (français) ===
function getDayName(index) {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    return days[index];
}

// === Fonction pour afficher un message d'erreur ===
function displayErrorMessage(message) {
    const emissionsList = document.getElementById("emissions-list");
    emissionsList.innerHTML = `<li class="error">${message}</li>`;
}

// === Gérer le formulaire de création d'émission ===
document.getElementById("create-emission-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const emissionData = {
        name: event.target.name.value,
        jour: parseInt(event.target.jour.value), // Correspond à l'index de DayOfWeekEnum
        startTime: event.target.startTime.value,
        endTime: event.target.endTime.value,
        imageUrl: event.target.imageUrl.value,
    };

    createEmission(emissionData);
});

// Charger les émissions au démarrage
document.addEventListener("DOMContentLoaded", fetchEmissions);
