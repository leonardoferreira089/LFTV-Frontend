const API_URL = "https://localhost:7279/api/Emission"; // URL de l'API pour récupérer les émissions

// Fonction pour récupérer les émissions depuis l'API
async function chargerEmissions() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const emissions = await response.json();
        return emissions;
    } catch (error) {
        console.error("Erreur lors du chargement des émissions :", error);
        return [];
    }
}

// Fonction pour obtenir le jour actuel en base 1 (1 = Lundi, ..., 7 = Dimanche)
function getJourActuel() {
    const now = new Date();
    const dayBase0 = now.getDay(); // getDay() retourne 0 (Dimanche) à 6 (Samedi)

    // Convertir en base 1 où 1 = Lundi, ..., 7 = Dimanche
    return dayBase0 === 1 ? 7 : dayBase0;
}

// Fonction pour vérifier si une émission est actuellement diffusée
function estEnCours(heureDebut, heureFin) {
    const now = new Date();
    const debut = new Date();
    const fin = new Date();

    // Convertir les heures de début et de fin en objets Date
    const [debutHeures, debutMinutes] = heureDebut.split(":").map(Number);
    const [finHeures, finMinutes] = heureFin.split(":").map(Number);

    debut.setHours(debutHeures, debutMinutes, 0, 0);
    fin.setHours(finHeures, finMinutes, 0, 0);

    // Vérifier si l'heure actuelle est entre l'heure de début et de fin
    return now >= debut && now <= fin;
}

// Fonction pour afficher l'émission actuellement diffusée
function afficherEmissionEnCours(emission) {
    const broadcastBox = document.querySelector(".broadcast-box");

    broadcastBox.innerHTML = `
        <img src="${emission.imageUrl || 'images/default-show.jpg'}" alt="${emission.name}">
        <div class="info-row">
            <h2>${emission.name}</h2>
            <a href="#" class="watch-now-btn">Regarder maintenant</a>
        </div>
    `;
}


// Fonction pour afficher le programme du jour
function afficherProgrammeDuJour(emissions) {
    const scheduleList = document.querySelector(".today-schedule");
    scheduleList.innerHTML = "";

    emissions.forEach(emission => {
        const listItem = document.createElement("li");
        listItem.textContent = `${emission.startTime} - ${emission.name}`;
        scheduleList.appendChild(listItem);
    });
}

// Fonction principale pour charger et afficher les données
async function afficherDonnees() {
    const emissions = await chargerEmissions();
    const jourActuel = getJourActuel(); // Obtenir le jour actuel (1 = Lundi, ..., 7 = Dimanche)

    console.log("Jour actuel (base 1) :", jourActuel); // Debug : Vérifiez que le jour actuel est correct

    // Filtrer les émissions du jour actuel
    const emissionsDuJour = emissions.filter(emission => emission.jour === jourActuel);

    // Trouver l'émission actuellement diffusée
    const emissionEnCours = emissionsDuJour.find(emission =>
        estEnCours(emission.startTime, emission.endTime)
    );

    // Afficher l'émission en cours
    if (emissionEnCours) {
        afficherEmissionEnCours(emissionEnCours);
    } else {
        const broadcastBox = document.querySelector(".broadcast-box");
        broadcastBox.innerHTML = `<p>Pas d'émission en cours pour le moment.</p>`;
    }

    // Afficher le programme du jour
    afficherProgrammeDuJour(emissionsDuJour);
}

// Charger les données au chargement de la page
document.addEventListener("DOMContentLoaded", afficherDonnees);