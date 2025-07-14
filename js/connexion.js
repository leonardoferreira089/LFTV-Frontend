const API_URL = "https://localhost:7279/api";

// Gestion connexion
document.getElementById("form-connexion").onsubmit = async function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    try {
        const response = await fetch(`${API_URL}/User`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erreur lors de la connexion");
        const result = await response.json();
        alert("Connexion réussie !");
        sessionStorage.setItem("token", result.token);
        window.location.href = "index.html";
    } catch (err) {
        alert("Erreur : Email ou mot de passe incorrect.");
    }
};

// Gestion inscription
document.getElementById("form-inscription")?.onsubmit = async function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erreur lors de l'inscription");
        alert("Inscription réussie !");
        window.location.href = "connexion.html";
    } catch (err) {
        alert("Erreur : Inscription échouée.");
    }
};

// Mot de passe oublié (redirection ou gestion interne)
document.getElementById("forgot-password").onclick = function(e) {
    e.preventDefault();
    alert("Fonctionnalité à venir : Réinitialisation du mot de passe.");
};