const API_URL = "https://localhost:7279/api/Emission";

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

async function afficherHoraires() {
    const container = document.getElementById("horaires-table-container");
    const message = document.getElementById("horaires-message");

    // Affiche un message de chargement
    message.textContent = "Chargement des horaires...";
    container.innerHTML = "";

    const emissions = await chargerEmissions();

    if (emissions.length === 0) {
        message.textContent = "Aucun programme disponible pour le moment.";
        return;
    }

    message.textContent = ""; // Efface les messages

    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const horairesParJour = {};

    // Initialise les jours
    jours.forEach(jour => {
        horairesParJour[jour] = [];
    });

    // Regroupe les émissions par jour
    emissions.forEach(emission => {
        // Attention ici : Corrigez l'index pour l'adapter aux jours correctement
        const jour = jours[emission.jour - 0]; // Assurez-vous que `jour` dans l'API commence à 1
        if (jour) {
            horairesParJour[jour].push({
                nom: emission.name,
                heureDebut: emission.startTime,
                heureFin: emission.endTime
            });
        }
    });

    // Trie les émissions par ordre croissant des heures
    jours.forEach(jour => {
        horairesParJour[jour].sort((a, b) => a.heureDebut.localeCompare(b.heureDebut));
    });

    // Génère le tableau HTML
    let html = `
        <table class="horaires-table">
            <thead>
                <tr>
                    ${jours.map(jour => `<th>${jour}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
    `;

    // Ajoute les programmes par jour
    jours.forEach(jour => {
        const programmes = horairesParJour[jour];
        if (programmes.length === 0) {
            html += `<td class="empty-cell">Aucun programme</td>`;
        } else {
            html += `
                <td>
                    ${programmes
                        .map(programme => `
                            <div class="programme-cell">
                                <strong>${programme.nom}</strong><br>
                                ${programme.heureDebut} - ${programme.heureFin}
                            </div>
                        `)
                        .join("")}
                </td>
            `;
        }
    });

    html += `
                </tr>
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", afficherHoraires);