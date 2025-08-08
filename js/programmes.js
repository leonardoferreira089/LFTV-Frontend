// URL de base de l'API
const API_BASE_URL = "https://localhost:7279/api";
const programmesEndpoint = `${API_BASE_URL}/ProgramContent`;

let editMode = false;
let currentEditId = null;
let currentDeleteId = null;
let emissionsCache = [];

// 1. Charger toutes les émissions pour le select
async function fetchEmissionsForForm(selectedId = null) {
    try {
        const response = await fetch(`${API_BASE_URL}/Emission`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des émissions.");
        const emissions = await response.json();
        emissionsCache = emissions;
        const select = document.getElementById("programmeEmission");
        select.innerHTML = ""; // vide le select
        emissions.forEach(emission => {
            const option = document.createElement("option");
            option.value = emission.id;
            option.textContent = emission.name;
            if (selectedId && emission.id === selectedId) option.selected = true;
            select.appendChild(option);
        });
    } catch (error) {
        alert("Impossible de charger les émissions.");
    }
}

// 2. Charger tous les programmes
async function fetchProgrammes() {
    try {
        const response = await fetch(programmesEndpoint);
        if (!response.ok) throw new Error("Erreur lors du chargement des programmes.");
        const programmes = await response.json();
        updateProgrammesTable(programmes);
    } catch (error) {
        updateProgrammesTable([], "Impossible de charger les programmes.");
    }
}

// 3. Créer un nouveau programme
async function createProgramme(programmeData) {
    try {
        const response = await fetch(programmesEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(programmeData)
        });
        if (!response.ok) throw new Error("Erreur lors de l'ajout du programme.");
        closeProgrammeModal();
        fetchProgrammes();
    } catch {
        alert("Impossible d'ajouter le programme.");
    }
}

// 4. Modifier un programme existant
async function updateProgramme(id, programmeData) {
    try {
        const response = await fetch(`${programmesEndpoint}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(programmeData)
        });
        if (!response.ok) throw new Error("Erreur lors de la modification.");
        closeProgrammeModal();
        fetchProgrammes();
    } catch {
        alert("Impossible de modifier le programme.");
    }
}

// 5. Supprimer un programme
async function deleteProgramme(programmeId) {
    try {
        const response = await fetch(`${programmesEndpoint}/${programmeId}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erreur lors de la suppression du programme.");
        closeDeleteModal();
        fetchProgrammes();
    } catch {
        alert("Impossible de supprimer le programme.");
    }
}

// 6. Remplir le tableau des programmes
function updateProgrammesTable(programmes, errorMsg = null) {
    const tbody = document.getElementById("programmesTbody");
    tbody.innerHTML = "";
    if (errorMsg) {
        tbody.innerHTML = `<tr><td colspan="7" class="error">${errorMsg}</td></tr>`;
        return;
    }
    programmes.forEach(prg => {
        tbody.innerHTML += `
        <tr>
            <td>${prg.name}</td>
            <td>${prg.type}</td>
            <td>${prg.category}</td>
            <td>${prg.emissionName || emissionNameById(prg.emissionId) || "-"}</td>
            <td>
                ${prg.episodeUrl ? `<a href="${prg.episodeUrl}" target="_blank" class="link-episode">Lien</a>` : "-"}
            </td>
            <td>
                <img src="${prg.imageUrl || "https://via.placeholder.com/40?text=No+Img"}" class="thumbnail" alt="img">
            </td>
            <td>
                <button class="action-btn edit" onclick="openEditProgrammeModal(${prg.id})">Modifier</button>
                <button class="action-btn delete" onclick="openDeleteProgrammeModal(${prg.id})">Supprimer</button>
            </td>
        </tr>
        `;
    });
}
function emissionNameById(id) {
    const em = emissionsCache.find(e => e.id === id);
    return em ? em.name : "";
}

// 7. Modals logique
function openCreateProgrammeModal() {
    editMode = false;
    currentEditId = null;
    document.getElementById("programmeModalTitle").textContent = "Nouveau Programme";
    document.getElementById("programmeForm").reset();
    fetchEmissionsForForm();
    document.getElementById("programmeModal").style.display = "block";
}
async function openEditProgrammeModal(id) {
    editMode = true;
    currentEditId = id;
    document.getElementById("programmeModalTitle").textContent = "Modifier Programme";
    // Fetch le programme pour pré-remplir
    const res = await fetch(`${programmesEndpoint}/${id}`);
    const prg = await res.json();
    document.getElementById("programmeId").value = prg.id;
    document.getElementById("programmeName").value = prg.name;
    document.getElementById("programmeType").value = prg.type;
    document.getElementById("programmeCategorie").value = prg.category;
    await fetchEmissionsForForm(prg.emissionId); // Sélectionne bonne émission
    document.getElementById("programmeLien").value = prg.episodeUrl || "";
    document.getElementById("programmeImageUrl").value = prg.imageUrl || "";
    document.getElementById("programmeModal").style.display = "block";
}
function closeProgrammeModal() {
    document.getElementById("programmeModal").style.display = "none";
}
function openDeleteProgrammeModal(id) {
    currentDeleteId = id;
    document.getElementById("deleteProgrammeModal").style.display = "block";
}
function closeDeleteModal() {
    currentDeleteId = null;
    document.getElementById("deleteProgrammeModal").style.display = "none";
}

// 8. Gestion du formulaire
document.getElementById("addProgrammeBtn").onclick = openCreateProgrammeModal;
document.getElementById("closeProgrammeModal").onclick = closeProgrammeModal;
document.getElementById("cancelDeleteProgrammeBtn").onclick = closeDeleteModal;
window.openEditProgrammeModal = openEditProgrammeModal; // pour inline onclick
window.openDeleteProgrammeModal = openDeleteProgrammeModal;

document.getElementById("programmeForm").onsubmit = async function(event) {
    event.preventDefault();
    const programmeData = {
        name: document.getElementById("programmeName").value,
        type: document.getElementById("programmeType").value,
        category: document.getElementById("programmeCategorie").value,
        emissionId: parseInt(document.getElementById("programmeEmission").value),
        episodeUrl: document.getElementById("programmeLien").value,
        imageUrl: document.getElementById("programmeImageUrl").value,
    };
    if (editMode && currentEditId) {
        await updateProgramme(currentEditId, programmeData);
    } else {
        await createProgramme(programmeData);
    }
};
document.getElementById("confirmDeleteProgrammeBtn").onclick = function() {
    if (currentDeleteId) {
        deleteProgramme(currentDeleteId);
    }
};

// Fermer modal si clic sur fond noir
window.onclick = function(event) {
    if (event.target === document.getElementById("programmeModal")) closeProgrammeModal();
    if (event.target === document.getElementById("deleteProgrammeModal")) closeDeleteModal();
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    fetchEmissionsForForm();
    fetchProgrammes();
});