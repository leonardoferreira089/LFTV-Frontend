const API_URL = "https://localhost:7279/api/Emission";
const PROGRAMME_API_URL = "https://localhost:7279/api/ProgramContent";
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

let editMode = false;
let currentEditId = null;
let currentDeleteId = null;
let programmes = [];

// --- Chargement des Programmes ---
async function fetchProgrammes() {
    try {
        const res = await fetch(PROGRAMME_API_URL);
        if (!res.ok) throw new Error();
        return await res.json();
    } catch {
        alert("Erreur lors du chargement des programmes.");
        return [];
    }
}
function renderProgrammeOptions(selectedId) {
    const select = document.getElementById("programme");
    if (!select) return;
    select.innerHTML = "";
    programmes.forEach(prg => {
        const option = document.createElement("option");
        option.value = prg.id;
        option.textContent = prg.name;
        if (selectedId && String(prg.id) === String(selectedId)) option.selected = true;
        select.appendChild(option);
    });
}
function getProgrammeById(id) {
    return programmes.find(prg => String(prg.id) === String(id));
}

// --- Chargement et affichage des émissions ---
async function fetchEmissions() {
    try {
        const res = await fetch(API_URL);
        return await res.json();
    } catch {
        alert("Erreur lors du chargement des émissions.");
        return [];
    }
}
function jourToString(jour) {
    if (jour === 8 || jour === "8") return "Du lundi au vendredi";
    if (jour === 9 || jour === "9") return "Samedi et dimanche";
    if (jour === "weekdays") return "Du lundi au vendredi";
    if (jour === "weekend") return "Samedi et dimanche";
    return JOURS[(jour-1)] || "";
}
function renderTable(emissions) {
    const tbody = document.getElementById("emissionsTbody");
    tbody.innerHTML = "";
    emissions.forEach(em => {
        const prog = em.programmeId ? getProgrammeById(em.programmeId) : null;
        tbody.innerHTML += `
        <tr>
            <td>${em.name}</td>
            <td>${jourToString(em.jour)}</td>
            <td>${em.startTime ? em.startTime.slice(0,5) : ''}</td>
            <td>${em.endTime ? em.endTime.slice(0,5) : ''}</td>
            <td>
                ${prog ? `<a href="${prog.link}" target="_blank">${prog.name}</a>` : ''}
            </td>
            <td><img src="${em.imageUrl || 'images/default-show.jpg'}" class="thumbnail" alt="img"></td>
            <td>
                <button class="action-btn edit" onclick="openEditModal(${em.id})">Modifier</button>
                <button class="action-btn delete" onclick="openDeleteModal(${em.id})">Supprimer</button>
            </td>
        </tr>`;
    });
}

// --- Modals ---
function openCreateModal() {
    editMode = false;
    document.getElementById("modalTitle").textContent = "Nouvelle Émission";
    document.getElementById("emissionForm").reset();
    document.getElementById("emissionId").value = "";
    renderProgrammeOptions(); // Affiche tous les programmes à jour
    document.getElementById("emissionModal").style.display = "block";
}

async function openEditModal(id) {
    editMode = true;
    document.getElementById("modalTitle").textContent = "Modifier Émission";
    const res = await fetch(`${API_URL}/${id}`);
    const em = await res.json();
    document.getElementById("emissionId").value = em.id;
    document.getElementById("name").value = em.name;
    document.getElementById("jour").value = em.jour;
    document.getElementById("startTime").value = em.startTime ? em.startTime.slice(0,5) : '';
    document.getElementById("endTime").value = em.endTime ? em.endTime.slice(0,5) : '';
    document.getElementById("imageUrl").value = em.imageUrl || "";
    renderProgrammeOptions(em.programmeId);
    document.getElementById("emissionModal").style.display = "block";
}
function closeModal() {
    document.getElementById("emissionModal").style.display = "none";
}
function openDeleteModal(id) {
    currentDeleteId = id;
    document.getElementById("deleteModal").style.display = "block";
}
function closeDeleteModal() {
    currentDeleteId = null;
    document.getElementById("deleteModal").style.display = "none";
}

// --- CRUD API Calls ---
async function saveEmission(e) {
    e.preventDefault();
    const id = document.getElementById("emissionId").value;
    const name = document.getElementById("name").value.trim();
    const jourValue = document.getElementById("jour").value;
    let jour = isNaN(parseInt(jourValue)) ? jourValue : parseInt(jourValue);
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const imageUrl = document.getElementById("imageUrl").value.trim();
    const programmeId = document.getElementById("programme").value;

    const emission = { name, jour, startTime, endTime, programmeId, imageUrl };

    let method, url;
    if (editMode && id) {
        method = "PUT";
        url = `${API_URL}/${id}`;
        emission.id = parseInt(id);
    } else {
        method = "POST";
        url = API_URL;
    }
    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emission)
        });
        if (!res.ok) throw new Error();
        closeModal();
        loadAndRender();
    } catch {
        alert("Erreur lors de l'enregistrement.");
    }
}

async function deleteEmission() {
    if (!currentDeleteId) return;
    try {
        const res = await fetch(`${API_URL}/${currentDeleteId}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        closeDeleteModal();
        loadAndRender();
    } catch {
        alert("Erreur lors de la suppression.");
    }
}

// --- Events ---
document.getElementById("addEmissionBtn").onclick = openCreateModal;
document.getElementById("closeModal").onclick = closeModal;
document.getElementById("emissionForm").onsubmit = saveEmission;
document.getElementById("confirmDeleteBtn").onclick = deleteEmission;
document.getElementById("cancelDeleteBtn").onclick = closeDeleteModal;

window.onclick = function(event) {
    if (event.target === document.getElementById("emissionModal")) closeModal();
    if (event.target === document.getElementById("deleteModal")) closeDeleteModal();
};

// --- Main ---
async function loadAndRender() {
    programmes = await fetchProgrammes();
    const emissions = await fetchEmissions();
    renderTable(emissions);
}
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;

document.addEventListener("DOMContentLoaded", loadAndRender);