document.addEventListener("DOMContentLoaded", () => {
    afficherNowWatching();
  });
  
  async function afficherNowWatching() {
    const nowWatchingSection = document.getElementById("now-watching");
    nowWatchingSection.innerHTML = ""; // Clear before render
  
    try {
      // Récupérer les émissions du jour depuis l'API
      const today = new Date().toISOString().slice(0, 10); // format AAAA-MM-JJ
      const response = await fetch(`${API_URL}/Emissions?date=${today}`);
      const emissions = await response.json();
  
      if (!emissions || emissions.length === 0) {
        nowWatchingSection.innerHTML = `<div class="now-box"><div class="now-title">Aucune émission en cours</div></div>`;
        return;
      }
  
      // Trouver l'émission en cours
      const now = new Date();
      const emissionNow = emissions.find(e => {
        const [sh, sm, ss] = e.startTime.split(':');
        const [eh, em, es] = e.endTime.split(':');
        const start = new Date(now);
        start.setHours(+sh, +sm, +ss);
        const end = new Date(now);
        end.setHours(+eh, +em, +es);
        return now >= start && now <= end;
      });
  
      if (emissionNow) {
        nowWatchingSection.innerHTML = creerBlocNowWatching(emissionNow);
      } else {
        nowWatchingSection.innerHTML = `<div class="now-box"><div class="now-title">Aucune émission en cours</div></div>`;
      }
  
    } catch (err) {
      nowWatchingSection.innerHTML = `<div class="now-box"><div class="now-title" style="color:var(--color-danger);">Erreur lors du chargement</div></div>`;
    }
  }
  
  function creerBlocNowWatching(emission) {
    return `
      <div class="now-box">
        <img src="${emission.imageUrl || 'https://via.placeholder.com/220x120?text=LFTV'}" alt="Image émission en cours">
        <div class="now-title">${emission.name}</div>
        <div class="now-time">${emission.startTime.slice(0,5)} - ${emission.endTime.slice(0,5)}</div>
        <a href="${emission.episodeUrl || '#'}" class="now-action" target="_blank">
          Regarder
        </a>
      </div>
    `;
  }