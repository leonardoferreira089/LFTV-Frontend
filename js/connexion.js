const API_URL = "https://localhost:7279/api/User";

document.addEventListener('DOMContentLoaded', function() {
    const formConnexion = document.getElementById("form-connexion");
    
    if (formConnexion) {
        formConnexion.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || "Erreur de connexion");
                }
                
                const result = await response.json();
                
                // Sauvegarder le token
                sessionStorage.setItem("token", result.token);
                sessionStorage.setItem("user", JSON.stringify(result.user));
                
                alert("Connexion réussie !");
                window.location.href = "../index.html";
                
            } catch (err) {
                console.error("Erreur:", err);
                alert(`Erreur : ${err.message}`);
            }
        });
    }
    
    // Inscription
    const formInscription = document.getElementById("form-inscription");
    if (formInscription) {
        formInscription.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password')
            };
            
            try {
                const response = await fetch(`${API_URL}/User`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || "Erreur d'inscription");
                }
                
                const result = await response.json();
                alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
                window.location.href = "connexion.html";
                
            } catch (err) {
                console.error("Erreur:", err);
                alert(`Erreur : ${err.message}`);
            }
        });
    }
});