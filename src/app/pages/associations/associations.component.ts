import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Association {
  nom: string;
  adresse: string;
  codePostal: string;
  telephone?: string;
  email?: string;
  site?: string;
  categorie: string;
  catIcon: string;
  catCouleur: string;
  activites: string;
}

const ASSOCIATIONS: Association[] = [
  {
    nom: 'ADMR Poissy',
    adresse: '81 rue Saint-Sébastien',
    codePostal: '78300',
    telephone: '01 30 74 24 84',
    email: 'info.poissy.fede78@admr.org',
    categorie: 'Social',
    catIcon: 'volunteer_activism',
    catCouleur: '#1565C0',
    activites: 'Aide à domicile — ménage, repassage, jardinage, bricolage pour personnes âgées ou handicapées.',
  },
  {
    nom: 'ASCL La Coudraie',
    adresse: '52 rue Migneaux',
    codePostal: '78300',
    categorie: 'Social & Culture',
    catIcon: 'groups',
    catCouleur: '#1976D2',
    activites: 'Activités culturelles, loisirs et aide humanitaire dans le quartier de la Coudraie.',
  },
  {
    nom: 'Amisey',
    adresse: '44 Avenue Michel de l\'Hospital',
    codePostal: '78300',
    telephone: '01 30 65 70 49',
    categorie: 'Social',
    catIcon: 'favorite',
    catCouleur: '#C62828',
    activites: 'Aide aux personnes en difficulté, accompagnement social et soutien aux familles poissynoises.',
  },
  {
    nom: 'AGABC',
    adresse: '63 rue du Général de Gaulle',
    codePostal: '78300',
    telephone: '01 40 86 43 00',
    categorie: 'Social',
    catIcon: 'support_agent',
    catCouleur: '#1565C0',
    activites: 'Aide et accompagnement des personnes en situation de vulnérabilité.',
  },
  {
    nom: 'Jazz Réception',
    adresse: '19 Avenue Anatole France',
    codePostal: '78300',
    telephone: '06 85 41 42 67',
    site: 'www.jazzreception.com',
    categorie: 'Art & Culture',
    catIcon: 'music_note',
    catCouleur: '#7B1FA2',
    activites: 'Promotion du jazz et des musiques improvisées, concerts et événements musicaux à Poissy.',
  },
  {
    nom: 'ALMA – Loisirs Manuels & Artistiques',
    adresse: '62 rue de Villiers',
    codePostal: '78300',
    telephone: '01 30 74 68 85',
    site: 'www.alma-poissy.fr',
    categorie: 'Art & Culture',
    catIcon: 'palette',
    catCouleur: '#AD1457',
    activites: 'Ateliers de loisirs manuels et artistiques — peinture, sculpture, broderie, poterie.',
  },
  {
    nom: 'Poissy Triathlon',
    adresse: '51 boulevard Robespierre',
    codePostal: '78300',
    telephone: '01 30 88 43 66',
    categorie: 'Sport',
    catIcon: 'directions_run',
    catCouleur: '#2E7D32',
    activites: 'Club de triathlon — natation, cyclisme et course à pied pour tous niveaux.',
  },
  {
    nom: 'Judo et Ju-Jitsu Club de Poissy',
    adresse: '5 rue des Fauvettes',
    codePostal: '78300',
    categorie: 'Sport',
    catIcon: 'sports_martial_arts',
    catCouleur: '#2E7D32',
    activites: 'Arts martiaux japonais — judo et ju-jitsu pour enfants et adultes.',
  },
  {
    nom: 'Union Sportive et Culturelle Poissy',
    adresse: '10 rue Paul Codos',
    codePostal: '78300',
    categorie: 'Sport',
    catIcon: 'sports',
    catCouleur: '#1B5E20',
    activites: 'Association multisports et culturelle, encadrement de nombreuses disciplines sportives.',
  },
  {
    nom: 'CAAPY – Aventure Automobile Poissy',
    adresse: '45 rue Jean-Pierre Timbaud',
    codePostal: '78300',
    categorie: 'Loisirs',
    catIcon: 'directions_car',
    catCouleur: '#37474F',
    activites: 'Promotion de l\'histoire automobile de Poissy et des Yvelines, rallyes et expositions.',
  },
  {
    nom: 'EEUDF – Éclaireuses Éclaireurs',
    adresse: '78300 Poissy',
    codePostal: '78300',
    categorie: 'Jeunesse',
    catIcon: 'emoji_nature',
    catCouleur: '#E65100',
    activites: 'Scoutisme laïque — activités de plein air, camps, développement de l\'autonomie des jeunes.',
  },
  {
    nom: 'CIDFF 78 – Droits des Femmes',
    adresse: '3 rue Gustave Eiffel',
    codePostal: '78300',
    telephone: '01 30 74 21 01',
    categorie: 'Social',
    catIcon: 'balance',
    catCouleur: '#880E4F',
    activites: 'Accompagnement juridique, social et professionnel des femmes. Information sur les droits.',
  },
  {
    nom: 'Croix-Rouge Française – Délégation Poissy',
    adresse: '78300 Poissy',
    codePostal: '78300',
    site: 'www.croix-rouge.fr',
    categorie: 'Humanitaire',
    catIcon: 'local_hospital',
    catCouleur: '#C62828',
    activites: 'Aide d\'urgence, maraudes, distribution alimentaire, formation premiers secours.',
  },
  {
    nom: 'CCMP – Citoyens Musulmans de Poissy',
    adresse: '105 rue Saint-Sébastien',
    codePostal: '78300',
    telephone: '07 81 37 71 97',
    email: 'ccmp.poissy@orange.fr',
    categorie: 'Social & Culture',
    catIcon: 'handshake',
    catCouleur: '#00695C',
    activites: 'Entraide interculturelle, débats citoyens, lutte contre les discriminations.',
  },
  {
    nom: 'Verts de Terre',
    adresse: '27 rue Jean Bouin',
    codePostal: '78300',
    categorie: 'Environnement',
    catIcon: 'eco',
    catCouleur: '#2E7D32',
    activites: 'Sensibilisation à la gestion des déchets, préservation de la biodiversité, jardins partagés.',
  },
  {
    nom: 'Inclusion Handicap Yvelines',
    adresse: '6 boulevard Victor Hugo',
    codePostal: '78300',
    telephone: '01 34 01 30 00',
    categorie: 'Social',
    catIcon: 'accessible',
    catCouleur: '#1565C0',
    activites: 'Accompagnement et intégration des personnes en situation de handicap.',
  },
  {
    nom: 'Maison Polyvalente de Loisirs Péguy',
    adresse: '32 bis avenue Fernand Lefebvre',
    codePostal: '78300',
    categorie: 'Social & Culture',
    catIcon: 'home',
    catCouleur: '#F57C00',
    activites: 'Activités socio-culturelles de quartier, soutien scolaire, animation jeunesse.',
  },
  {
    nom: 'Mission Locale Intercommunale',
    adresse: '19 boulevard Devaux',
    codePostal: '78300',
    telephone: '01 30 65 43 40',
    categorie: 'Emploi',
    catIcon: 'work',
    catCouleur: '#37474F',
    activites: 'Accompagnement des jeunes de 16 à 25 ans vers l\'emploi, la formation et l\'autonomie.',
  },
  {
    nom: 'Association des Sapeurs-Pompiers',
    adresse: '160 Avenue de la Maladrerie',
    codePostal: '78300',
    categorie: 'Secours',
    catIcon: 'local_fire_department',
    catCouleur: '#E53935',
    activites: 'Amicale des sapeurs-pompiers, actions de prévention et de sensibilisation aux risques.',
  },
  {
    nom: 'Lions Club Poissy Blanche-de-Castille',
    adresse: '78300 Poissy',
    codePostal: '78300',
    categorie: 'Humanitaire',
    catIcon: 'star',
    catCouleur: '#F9A825',
    activites: 'Actions caritatives, collectes, soutien aux personnes défavorisées et aux projets locaux.',
  },
  {
    nom: 'Froggies',
    adresse: '64 rue Clos d\'Arcy',
    codePostal: '78300',
    categorie: 'Loisirs',
    catIcon: 'sports_esports',
    catCouleur: '#00695C',
    activites: 'Association de loisirs ludiques, jeux de société, rencontres conviviales.',
  },
  {
    nom: 'Ateliers Dibutade',
    adresse: '3 rue Gustave Eiffel',
    codePostal: '78300',
    categorie: 'Art & Culture',
    catIcon: 'brush',
    catCouleur: '#7B1FA2',
    activites: 'Ateliers artistiques — dessin, peinture, sculpture, expression créative pour tous.',
  },
  {
    nom: 'Cœur de Poissy',
    adresse: '78300 Poissy',
    codePostal: '78300',
    categorie: 'Citoyenneté',
    catIcon: 'location_city',
    catCouleur: '#1565C0',
    activites: 'Revitalisation du centre-ville, projets éducatifs et citoyens, animation locale.',
  },
  {
    nom: 'Humanitae Universalis (Humuni)',
    adresse: '96 rue Saint-Sébastien',
    codePostal: '78300',
    categorie: 'Humanitaire',
    catIcon: 'public',
    catCouleur: '#C62828',
    activites: 'Aide aux personnes en difficulté à Poissy et à l\'international.',
  },
  {
    nom: 'Association Poissy Triathlon (section compétition)',
    adresse: '42 rue Aigremont',
    codePostal: '78300',
    categorie: 'Sport',
    catIcon: 'directions_bike',
    catCouleur: '#1B5E20',
    activites: 'Section compétition du triathlon poissynois — entraînements intensifs et participations nationales.',
  },
];

@Component({
  selector: 'app-associations',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf, FormsModule],
  templateUrl: './associations.component.html',
  styleUrl: './associations.component.scss',
})
export class AssociationsComponent {

  searchQuery = '';
  activeFilter = 'Tous';

  categories = ['Tous', 'Sport', 'Social', 'Art & Culture', 'Humanitaire', 'Environnement', 'Jeunesse', 'Emploi', 'Loisirs'];

  allAssociations = ASSOCIATIONS;

  get filtered(): Association[] {
    return this.allAssociations.filter(a => {
      const matchCat = this.activeFilter === 'Tous' || a.categorie === this.activeFilter;
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || a.nom.toLowerCase().includes(q) || a.activites.toLowerCase().includes(q) || a.categorie.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }

  ouvrirDetail(a: Association): void {
    this.router.navigate(['/association-detail'], { state: { asso: a } });
  }

  constructor(private router: Router) {}

  goBack(): void { this.router.navigate(['/home']); }
}
