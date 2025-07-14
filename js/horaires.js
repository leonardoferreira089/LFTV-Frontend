const API_URL = "https://localhost:7279/api/CalendarEntry";

async function chargerHoraires() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erreur lors du chargement des horaires");
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function afficherHoraires() {
    const container = document.getElementById("calendar-table-container");
    container.innerHTML = '<p class="horaires-loading">Chargement des horaires...</p>';

    const horaires = await chargerHoraires();

    if (!horaires || horaires.length === 0) {
        container.innerHTML = '<p class="horaires-loading">Aucun horaire disponible.</p>';
        return;
    }

    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const horairesParJour = {};

    // Regrouper les horaires par jour
    jours.forEach(j => horairesParJour[j] = []);
    horaires.forEach(horaire => {
        const jour = jours[horaire.day - 1]; // day est basé sur 1 (Lundi=1, etc.)
        if (jour) {
            horairesParJour[jour].push({
                heure: horaire.startTime,
                titre: horaire.title
            });
        }
    });

    // Créer le tableau HTML
    let html = '<table class="horaires-table"><thead><tr><th>Heure</th>';
    jours.forEach(j => html += `<th>${j}</th>`);
    html += '</tr></thead><tbody>';

    // Trouver toutes les heures uniques
    const toutesLesHeures = [...new Set(horaires.map(h => h.startTime))].sort();

    toutesLesHeures.forEach(heure => {
        html += `<tr><td>${heure}</td>`;
        jours.forEach(jour => {
            const programme = horairesParJour[jour].find(p => p.heure === heure);
            html += `<td>${programme ? programme.titre : ''}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", afficherHoraires);