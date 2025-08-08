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

    // Regroupe les émissions par jour (ATTENTION: emission.jour = 0 pour Lundi, etc.)
    emissions.forEach(emission => {
        const jour = jours[emission.jour]; // emission.jour doit être 0 (Lundi) à 6 (Dimanche)
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

    // Trouver le nombre maximum de programmes dans une journée
    const maxProgrammes = Math.max(...jours.map(jour => horairesParJour[jour].length));

    // Génère le tableau HTML
    let html = `
        <table class="horaires-table">
            <thead>
                <tr>
                    ${jours.map(jour => `<th>${jour}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
    `;

    // Pour chaque ligne (horaire), affiche le i-ème programme de chaque jour
    for (let i = 0; i < maxProgrammes; i++) {
        html += "<tr>";
        jours.forEach(jour => {
            const programme = horairesParJour[jour][i];
            if (programme) {
                html += `
                    <td>
                        <div class="programme-cell">
                            <strong>${programme.nom}</strong><br>
                            ${programme.heureDebut} - ${programme.heureFin}
                        </div>
                    </td>
                `;
            } else {
                html += `<td class="empty-cell"></td>`;
            }
        });
        html += "</tr>";
    }

    html += `
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", afficherHoraires);