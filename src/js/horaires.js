// Initialisation du calendrier et récupération des émissions de la semaine

document.addEventListener("DOMContentLoaded", () => {
    // Localisation française TUI Calendar (labels jours, heures, etc.)
    const calendar = new tui.Calendar('#calendar', {
      defaultView: 'week',
      taskView: false,
      scheduleView: ['time'],
      useCreationPopup: false,
      useDetailPopup: false,
      isReadOnly: true,
      week: {
        startDayOfWeek: 1, // Commence lundi
        daynames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        hourStart: 6,  // Premier affiché
        hourEnd: 24,   // Dernier affiché
        showNowIndicator: true,
      },
      template: {
        time: function(schedule) {
          // Affichage dans le calendrier
          return `<b>${schedule.title}</b>`;
        }
      },
      theme: {
        week: {
          dayName: {
            color: 'var(--color-accent)'
          }
        }
      }
    });
  
    // Charger les émissions de la semaine
    chargerEmissionsSemaine(calendar);
  
    // Gestion du clic sur un événement
    calendar.on('clickSchedule', function(event) {
      const emission = event.schedule.raw;
      showDetailsModal(emission);
    });
  
    // Modal close
    document.getElementById("close-modal").onclick = () => {
      document.getElementById("modal-emission").style.display = "none";
    };
    window.onclick = (event) => {
      if(event.target === document.getElementById("modal-emission")) {
        document.getElementById("modal-emission").style.display = "none";
      }
    };
  });
  
  async function chargerEmissionsSemaine(calendar) {
    // Trouver le lundi de cette semaine
    let today = new Date();
    let monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    let dimanche = new Date(monday); dimanche.setDate(monday.getDate() + 6);
  
    // Format AAAA-MM-JJ
    const debut = monday.toISOString().slice(0,10);
    const fin = dimanche.toISOString().slice(0,10);
  
    // Appel API pour toute la semaine (adapte selon ton endpoint !)
    try {
      const response = await fetch(`${API_URL}/Emissions/Semaine?start=${debut}&end=${fin}`);
      const emissions = await response.json();
  
      // Nettoyer les events
      calendar.clear();
      // Pour chaque émission, créer un event calendrier
      for(const e of emissions) {
        const start = `${e.date.slice(0,10)}T${e.startTime}`;
        const end = `${e.date.slice(0,10)}T${e.endTime}`;
        calendar.createSchedules([{
          id: String(e.id),
          calendarId: '1',
          title: e.name,
          category: 'time',
          start,
          end,
          raw: e // Pour le détail au clic
        }]);
      }
    } catch (err) {
      alert("Erreur lors du chargement des émissions !");
    }
  }
  
  function showDetailsModal(emission) {
    const c = emission;
    document.getElementById("modal-details").innerHTML = `
      <img src="${c.imageUrl || 'https://via.placeholder.com/180x120?text=LFTV'}" alt="Image émission">
      <div class="titre">${c.name}</div>
      <div class="horaire">Le ${formatJour(c.date)}, ${c.startTime.slice(0,5)} - ${c.endTime.slice(0,5)}</div>
      ${c.type ? `<div class="type">Type : ${c.type}</div>` : ""}
      ${c.category ? `<div class="categorie">Catégorie : ${c.category}</div>` : ""}
      <a href="${c.episodeUrl || '#'}" class="now-action" target="_blank" style="margin-top:8px;display:inline-block;">Regarder</a>
    `;
    document.getElementById("modal-emission").style.display = "flex";
  }
  
  function formatJour(dateStr) {
    const jours = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    const d = new Date(dateStr);
    return `${jours[d.getDay()]} ${d.toLocaleDateString('fr-FR')}`;
  }