// URL de base de l'API
const API_BASE_URL = "https://localhost:7279/api/ProgramContent";

// Fonction pour récupérer tous les programmes
async function fetchProgrammes() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Erreur lors du chargement des programmes.");
    const programmes = await response.json();
    updateProgrammesList(programmes);
  } catch (error) {
    console.error(error.message);
    displayErrorMessage("Impossible de charger les programmes.");
  }
}

// Fonction pour ajouter un nouveau programme
async function createProgramme(programmeData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(programmeData),
    });
    if (!response.ok) throw new Error("Erreur lors de l'ajout du programme.");
    fetchProgrammes(); // Recharger la liste après ajout
  } catch (error) {
    console.error(error.message);
    alert("Impossible d'ajouter le programme.");
  }
}

// Fonction pour supprimer un programme
async function deleteProgramme(programmeId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${programmeId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erreur lors de la suppression du programme.");
    fetchProgrammes(); // Recharger la liste après suppression
  } catch (error) {
    console.error(error.message);
    alert("Impossible de supprimer le programme.");
  }
}

// Fonction pour mettre à jour un programme
async function updateProgramme(programmeId, programmeData) {
  try {
    const response = await fetch(`${API_BASE_URL}/${programmeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(programmeData),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour du programme.");
    fetchProgrammes(); // Recharger la liste après mise à jour
  } catch (error) {
    console.error(error.message);
    alert("Impossible de mettre à jour le programme.");
  }
}

// Fonction pour mettre à jour la liste des programmes dans l'UI
function updateProgrammesList(programmes) {
  const programmesList = document.getElementById("programmes-list");
  programmesList.innerHTML = ""; // Vidage de la liste existante

  programmes.forEach((programme) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <h3>${programme.name}</h3>
      <p>Type : ${programme.type}</p>
      <p>Catégorie : ${programme.category}</p>
      <button onclick="deleteProgramme(${programme.id})">Supprimer</button>
      <button onclick="showUpdateForm(${programme.id})">Modifier</button>
    `;
    programmesList.appendChild(listItem);
  });
}

// Fonction pour afficher un message d'erreur
function displayErrorMessage(message) {
  const programmesList = document.getElementById("programmes-list");
  programmesList.innerHTML = `<li class="error">${message}</li>`;
}

// Gérer le formulaire de création de programme
document.getElementById("create-programme-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const programmeData = {
    name: event.target.name.value,
    type: event.target.type.value,
    category: event.target.category.value,
    imageUrl: event.target.imageUrl.value,
    episodeUrl: event.target.episodeUrl.value,
  };
  createProgramme(programmeData);
});

// Charger les programmes au démarrage
document.addEventListener("DOMContentLoaded", fetchProgrammes);