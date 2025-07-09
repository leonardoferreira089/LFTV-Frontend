// Navigation simple entre les pages (SPA light)
document.addEventListener('DOMContentLoaded', () => {
    function afficherPage(page) {
        const app = document.getElementById('app');
        switch (page) {
            case 'accueil':
                app.innerHTML = `
                    <section class="now-watching">
                        <h2>Vous regardez en ce moment</h2>
                        <div class="now-playing-card">
                            <img src="assets/nowplaying.jpg" alt="En cours" class="now-img" />
                            <div>
                                <h3>Titre de l'émission</h3>
                                <p>Horaire : 21:00 - 23:00</p>
                                <a href="#" class="btn">Voir le direct</a>
                            </div>
                        </div>
                        <h3>Émissions du jour</h3>
                        <ul class="liste-jour">
                            <li>20:00 - Journal TV</li>
                            <li>21:00 - Film du soir</li>
                            <li>23:00 - Talk Show</li>
                        </ul>
                    </section>
                `;
                break;
            case 'horaires':
                app.innerHTML = `
                    <section>
                        <h2>Horaires de la semaine</h2>
                        <div id="calendar"></div>
                    </section>
                `;
                // Initialiser le calendrier si besoin
                if (window.FullCalendar) {
                    var calendarEl = document.getElementById('calendar');
                    var calendar = new FullCalendar.Calendar(calendarEl, {
                        initialView: 'timeGridWeek',
                        locale: 'fr',
                        height: 500,
                        // events: [] // À connecter à l'API plus tard
                    });
                    calendar.render();
                }
                break;
            case 'emissions':
                app.innerHTML = `
                    <section>
                        <h2>Catalogue des émissions</h2>
                        <p>CRUD des émissions à venir…</p>
                    </section>
                `;
                break;
            case 'programmes':
                app.innerHTML = `
                    <section>
                        <h2>Catalogue des programmes</h2>
                        <p>CRUD des programmes à venir…</p>
                    </section>
                `;
                break;
            case 'connexion':
                app.innerHTML = `
                    <section>
                        <h2>Connexion</h2>
                        <form>
                            <label>Email :
                                <input type="email" required>
                            </label>
                            <label>Mot de passe :
                                <input type="password" required>
                            </label>
                            <button type="submit" class="btn">Se connecter</button>
                        </form>
                        <p>Pas de compte ? <a href="#">S’inscrire</a></p>
                    </section>
                `;
                break;
            default:
                afficherPage('accueil');
        }
    }

    // Liens de navigation
    document.getElementById('nav-accueil').onclick = () => afficherPage('accueil');
    document.getElementById('nav-horaires').onclick = () => afficherPage('horaires');
    document.getElementById('nav-emissions').onclick = () => afficherPage('emissions');
    document.getElementById('nav-programmes').onclick = () => afficherPage('programmes');
    document.getElementById('nav-connexion').onclick = () => afficherPage('connexion');

    // Afficher la page d'accueil au chargement
    afficherPage('accueil');
});