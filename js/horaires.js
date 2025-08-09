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

    emissions.forEach(emission => {
    // Cas "Du lundi au vendredi" (ex: emission.jour == 8)
    if (emission.jour == 8 || emission.jour === "8" || emission.jour === "weekdays") {
        // Pour Lundi à Vendredi (index 0 à 4)
        for (let i = 0; i < 5; i++) {
            horairesParJour[jours[i]].push({
                nom: emission.name,
                heureDebut: emission.startTime,
                heureFin: emission.endTime
            });
        }
    }
    // Cas "Samedi et dimanche" (ex: emission.jour == 9)
    else if (emission.jour == 9 || emission.jour === "9" || emission.jour === "weekend") {
        // Samedi (index 5) et Dimanche (index 6)
        for (let i = 5; i < 7; i++) {
            horairesParJour[jours[i]].push({
                nom: emission.name,
                heureDebut: emission.startTime,
                heureFin: emission.endTime
            });
        }
    }
    // Cas normal : un seul jour
    else {
        const jourIndex = parseInt(emission.jour, 10) - 1;
        const jour = jours[jourIndex];
        if (jour) {
            horairesParJour[jour].push({
                nom: emission.name,
                heureDebut: emission.startTime,
                heureFin: emission.endTime
            });
        }
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