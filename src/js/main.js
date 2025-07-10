// ===========================
// LFTV - main.js
// Gestionnaire de navigation & affichage dynamique
// ===========================

// ------ Données statiques pour la grille TV hebdomadaire ------
const grilleTV = {
    "Lundi": [
      { heure: "20:00", titre: "Journal TV" },
      { heure: "21:00", titre: "Film du soir" },
      { heure: "23:00", titre: "Talk Show" }
    ],
    "Mardi": [
      { heure: "20:00", titre: "Série A" },
      { heure: "21:00", titre: "Documentaire" },
      { heure: "23:00", titre: "Talk Show" }
    ],
    "Mercredi": [
      { heure: "20:00", titre: "Jeu TV" },
      { heure: "21:00", titre: "Film d'action" },
      { heure: "23:00", titre: "Talk Show" }
    ],
    "Jeudi": [
      { heure: "20:00", titre: "Magazine" },
      { heure: "21:00", titre: "Téléfilm" },
      { heure: "23:00", titre: "Talk Show" }
    ],
    "Vendredi": [
      { heure: "20:00", titre: "Série B" },
      { heure: "21:00", titre: "Film comédie" },
      { heure: "23:00", titre: "Talk Show" }
    ],
    "Samedi": [
      { heure: "20:00", titre: "Divertissement" },
      { heure: "21:00", titre: "Blockbuster" },
      { heure: "23:00", titre: "Talk Show" }
    ],
    "Dimanche": [
      { heure: "20:00", titre: "Documentaire nature" },
      { heure: "21:00", titre: "Film classique" },
      { heure: "23:00", titre: "Talk Show" }
    ]
  };
  
  const horaires = ["20:00", "21:00", "23:00"];
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  
  // ------ API endpoints (à adapter selon ton backend) ------
  const API_URL = "http://localhost:5000/api"; // Modifie selon ton backend
  
  // ========================
  // === Fonctions API ====
  // ========================
  
  async function chargerEmissions() {
    try {
      const response = await fetch(`${API_URL}/emissions`);
      if (!response.ok) throw new Error("Erreur lors du chargement des émissions");
      return await response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  
  async function chargerProgrammes() {
    try {
      const response = await fetch(`${API_URL}/programmes`);
      if (!response.ok) throw new Error("Erreur lors du chargement des programmes");
      return await response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  
  // ========================
  // == Affichage Accueil ==
  // ========================
  
  async function afficherAccueil() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <section>
        <h2>Vous regardez en ce moment</h2>
        <div id="emission-en-cours" class="now-playing-card"></div>
        <h3>Émissions du jour</h3>
        <ul id="liste-emissions" class="liste-jour"></ul>
      </section>
    `;
  
    // Récupérer les émissions du jour depuis l'API
    const emissions = await chargerEmissions();
    const aujourdHui = new Date();
    const jourSemaine = jours[aujourdHui.getDay() - 1] || "Lundi"; // JS: 0=Dimanche, 1=Lundi...
  
    // Trouver l'émission en cours selon l'heure
    const maintenant = aujourdHui.getHours().toString().padStart(2, "0") + ":"
      + aujourdHui.getMinutes().toString().padStart(2, "0");
    let emissionEnCours = null;
    if (emissions && emissions.length > 0) {
      emissionEnCours = emissions.find(e => e.isLive); // si backend gère le live
      if (!emissionEnCours) {
        // Sinon, chercher par horaire
        emissionEnCours = emissions.find(e => {
          return e.jour === jourSemaine &&
            maintenant >= e.startTime &&
            maintenant <= e.endTime;
        });
      }
    }
  
    document.getElementById("emission-en-cours").innerHTML = emissionEnCours ? `
      <img src="${emissionEnCours.imageUrl || 'assets/nowplaying.jpg'}" alt="En cours" class="now-img" />
      <div>
        <h3>${emissionEnCours.titre}</h3>
        <p>Horaire : ${emissionEnCours.startTime} - ${emissionEnCours.endTime}</p>
        <a href="#" class="btn">Voir le direct</a>
      </div>
    ` : `<div>Aucune émission en cours</div>`;
  
    // Liste des émissions du jour
    const liste = document.getElementById("liste-emissions");
    let emissionsDuJour = emissions.filter(e => e.jour === jourSemaine);
    if (!emissionsDuJour.length) { // fallback si pas d'API
      emissionsDuJour = grilleTV[jourSemaine];
    }
    emissionsDuJour.forEach(e => {
      const li = document.createElement("li");
      li.textContent = `${e.heure || e.startTime} - ${e.titre}`;
      liste.appendChild(li);
    });
  }
  
  // =========================
  // == Affichage Horaires ==
  // =========================
  
  function afficherGrilleTV() {
    let html = `<table class="grille-tv"><thead><tr><th>Heure</th>`;
    jours.forEach(j => html += `<th>${j}</th>`);
    html += `</tr></thead><tbody>`;
  
    horaires.forEach(h => {
      html += `<tr><td>${h}</td>`;
      jours.forEach(jour => {
        const prog = grilleTV[jour].find(e => e.heure === h);
        html += `<td>${prog ? prog.titre : ''}</td>`;
      });
      html += `</tr>`;
    });
  
    html += `</tbody></table>`;
    document.getElementById("calendrier-hebdo").innerHTML = html;
  }
  
  function afficherHoraires() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <section>
        <h2>Grille TV de la semaine</h2>
        <div id="calendrier-hebdo"></div>
      </section>
    `;
    afficherGrilleTV();
  }
  
  // ========================
  // == Emissions (CRUD) ====
  // ========================
  
  async function afficherEmissions() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <section>
        <h2>Catalogue des émissions</h2>
        <button class="btn" id="btn-ajouter-emission">Ajouter une émission</button>
        <ul id="liste-emissions-crud" class="liste-jour"></ul>
        <div id="form-emission" class="modal-form"></div>
      </section>
    `;
  
    const emissions = await chargerEmissions();
    const ul = document.getElementById("liste-emissions-crud");
    ul.innerHTML = "";
    emissions.forEach(e => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${e.titre}</strong> (${e.jour} ${e.startTime} - ${e.endTime})
        <button class="btn" data-id="${e.id}" data-action="edit">✏️</button>
        <button class="btn" data-id="${e.id}" data-action="delete">🗑️</button>
      `;
      ul.appendChild(li);
    });
  
    // Gestion Ajout
    document.getElementById('btn-ajouter-emission').onclick = () => afficherFormEmission();
  
    // Gestion Edit/Suppression
    ul.onclick = async function(e) {
      if (e.target.dataset.action === "edit") {
        const id = e.target.dataset.id;
        const emission = emissions.find(em => em.id == id);
        afficherFormEmission(emission);
      }
      if (e.target.dataset.action === "delete") {
        const id = e.target.dataset.id;
        if (confirm("Supprimer cette émission ?")) {
          await fetch(`${API_URL}/emissions/${id}`, { method: "DELETE" });
          afficherEmissions();
        }
      }
    };
  }
  
  // Formulaire d'ajout/modification
  function afficherFormEmission(emission = null) {
    const formDiv = document.getElementById("form-emission");
    formDiv.innerHTML = `
      <form id="form-ajout-emission">
        <h3>${emission ? 'Modifier' : 'Ajouter'} une émission</h3>
        <label>Jour :
          <select name="jour" required>
            ${jours.map(j => `<option value="${j}"${emission && emission.jour === j ? ' selected' : ''}>${j}</option>`).join("")}
          </select>
        </label>
        <label>Titre :
          <input type="text" name="titre" value="${emission ? emission.titre : ''}" required>
        </label>
        <label>Heure de début :
          <input type="time" name="startTime" value="${emission ? emission.startTime : ''}" required>
        </label>
        <label>Heure de fin :
          <input type="time" name="endTime" value="${emission ? emission.endTime : ''}" required>
        </label>
        <label>Image (URL) :
          <input type="text" name="imageUrl" value="${emission ? emission.imageUrl : ''}">
        </label>
        <button class="btn" type="submit">${emission ? 'Modifier' : 'Ajouter'}</button>
        <button class="btn" type="button" id="btn-cancel-emission">Annuler</button>
      </form>
    `;
    formDiv.style.display = 'block';
  
    document.getElementById('btn-cancel-emission').onclick = () => {
      formDiv.innerHTML = '';
      formDiv.style.display = 'none';
    };
  
    document.getElementById('form-ajout-emission').onsubmit = async function(e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(this));
      if (emission) {
        await fetch(`${API_URL}/emissions/${emission.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } else {
        await fetch(`${API_URL}/emissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      }
      formDiv.innerHTML = '';
      formDiv.style.display = 'none';
      afficherEmissions();
    };
  }
  
  // ========================
  // == Programmes (CRUD) ===
  // ========================
  
  async function afficherProgrammes() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <section>
        <h2>Catalogue des programmes</h2>
        <button class="btn" id="btn-ajouter-programme">Ajouter un programme</button>
        <ul id="liste-programmes-crud" class="liste-jour"></ul>
        <div id="form-programme" class="modal-form"></div>
      </section>
    `;
  
    const programmes = await chargerProgrammes();
    const ul = document.getElementById("liste-programmes-crud");
    ul.innerHTML = "";
    programmes.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${p.titre}</strong> (${p.categorie || ''})
        <button class="btn" data-id="${p.id}" data-action="edit">✏️</button>
        <button class="btn" data-id="${p.id}" data-action="delete">🗑️</button>
      `;
      ul.appendChild(li);
    });
  
    document.getElementById('btn-ajouter-programme').onclick = () => afficherFormProgramme();
  
    ul.onclick = async function(e) {
      if (e.target.dataset.action === "edit") {
        const id = e.target.dataset.id;
        const programme = programmes.find(pr => pr.id == id);
        afficherFormProgramme(programme);
      }
      if (e.target.dataset.action === "delete") {
        const id = e.target.dataset.id;
        if (confirm("Supprimer ce programme ?")) {
          await fetch(`${API_URL}/programmes/${id}`, { method: "DELETE" });
          afficherProgrammes();
        }
      }
    };
  }
  
  function afficherFormProgramme(programme = null) {
    const formDiv = document.getElementById("form-programme");
    formDiv.innerHTML = `
      <form id="form-ajout-programme">
        <h3>${programme ? 'Modifier' : 'Ajouter'} un programme</h3>
        <label>Titre :
          <input type="text" name="titre" value="${programme ? programme.titre : ''}" required>
        </label>
        <label>Catégorie :
          <input type="text" name="categorie" value="${programme ? programme.categorie : ''}">
        </label>
        <label>Description :
          <textarea name="description" rows="3">${programme ? programme.description : ''}</textarea>
        </label>
        <button class="btn" type="submit">${programme ? 'Modifier' : 'Ajouter'}</button>
        <button class="btn" type="button" id="btn-cancel-programme">Annuler</button>
      </form>
    `;
    formDiv.style.display = 'block';
  
    document.getElementById('btn-cancel-programme').onclick = () => {
      formDiv.innerHTML = '';
      formDiv.style.display = 'none';
    };
  
    document.getElementById('form-ajout-programme').onsubmit = async function(e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(this));
      if (programme) {
        await fetch(`${API_URL}/programmes/${programme.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } else {
        await fetch(`${API_URL}/programmes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      }
      formDiv.innerHTML = '';
      formDiv.style.display = 'none';
      afficherProgrammes();
    };
  }
  
  // ========================
  // == Authentification ====
  // ========================
  
  function afficherConnexion() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <section>
        <h2>Connexion</h2>
        <form id="form-connexion">
          <label>Email :
            <input type="email" name="email" required>
          </label>
          <label>Mot de passe :
            <input type="password" name="password" required>
          </label>
          <button type="submit" class="btn">Se connecter</button>
        </form>
        <p>Pas de compte ? <a href="#" id="lien-inscription">S’inscrire</a></p>
        <div id="message-auth"></div>
      </section>
    `;
  
    document.getElementById("form-connexion").onsubmit = async function(e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(this));
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Connexion échouée");
        const result = await response.json();
        sessionStorage.setItem("token", result.token);
        document.getElementById("message-auth").textContent = "Connexion réussie !";
        setTimeout(afficherAccueil, 1000);
      } catch (err) {
        document.getElementById("message-auth").textContent = "Erreur de connexion.";
      }
    };
  
    document.getElementById("lien-inscription").onclick = afficherInscription;
  }
  
  function afficherInscription() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <section>
        <h2>Inscription</h2>
        <form id="form-inscription">
          <label>Email :
            <input type="email" name="email" required>
          </label>
          <label>Mot de passe :
            <input type="password" name="password" required>
          </label>
          <label>Nom d'utilisateur :
            <input type="text" name="username" required>
          </label>
          <button type="submit" class="btn">S’inscrire</button>
        </form>
        <div id="message-auth"></div>
      </section>
    `;
  
    document.getElementById("form-inscription").onsubmit = async function(e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(this));
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erreur d’inscription");
        document.getElementById("message-auth").textContent = "Inscription réussie, vous pouvez vous connecter.";
        setTimeout(afficherConnexion, 2000);
      } catch (err) {
        document.getElementById("message-auth").textContent = "Erreur lors de l’inscription.";
      }
    };
  }
  
  // ========================
  // == Gestion Navigation ==
  // ========================
  
  function initialiserNavigation() {
    document.getElementById('nav-accueil').onclick = (e) => { e.preventDefault(); afficherAccueil(); };
    document.getElementById('nav-horaires').onclick = (e) => { e.preventDefault(); afficherHoraires(); };
    document.getElementById('nav-emissions').onclick = (e) => { e.preventDefault(); afficherEmissions(); };
    document.getElementById('nav-programmes').onclick = (e) => { e.preventDefault(); afficherProgrammes(); };
    document.getElementById('nav-connexion').onclick = (e) => { e.preventDefault(); afficherConnexion(); };
  }
  
  // ========================
  // == Initialisation ====
  // ========================
  
  document.addEventListener('DOMContentLoaded', () => {
    initialiserNavigation();
    afficherAccueil();
  });