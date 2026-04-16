import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export interface LieuPoissy {
  titre: string;
  sousTitre: string;
  photo: string;
  categorie: string;
  catIcon: string;
  catCouleur: string;
  adresse: string;
  horaires?: string;
  tarif?: string;
  telephone?: string;
  siteWeb?: string;
  texteAudio: string; // texte complet pour TTS + affichage
  tags: string[];
}

export const LIEUX_POISSY: LieuPoissy[] = [
  {
    titre: 'Hôtel de Ville',
    sousTitre: 'Joyau Art Déco inscrit aux Monuments Historiques — cœur administratif de Poissy',
    photo: 'assets/photos/Hotel-de-ville.jpg',
    categorie: 'Patrimoine',
    catIcon: 'account_balance',
    catCouleur: '#1565C0',
    adresse: 'Place de la République, 78300 Poissy',
    horaires: 'Lun-Ven 8h30-12h · 13h30-17h',
    telephone: '01 39 22 31 00',
    siteWeb: 'https://www.ville-poissy.fr',
    texteAudio: `L'Hôtel de Ville de Poissy est situé Place de la République et constitue le bâtiment administratif central de la commune, siège de la mairie et de ses services. Construit entre 1936 et 1937 dans un remarquable style Art Déco, il a été inscrit au titre des Monuments Historiques le 20 août 1996. Sa construction fut décidée par le maire René Tainon pour remplacer l'ancienne mairie devenue trop exiguë. Le projet fut confié aux architectes Pierre Mathé, Prix de Rome 1926, et Henri-Jean Calsat, avec le concours du sculpteur Ossip Zadkine et du peintre Théodore Brenson. L'inauguration eut lieu le 12 décembre 1937. L'ensemble est construit en béton armé, avec un socle de façades en pierre et des briques émaillées couleur sable dans les courettes intérieures. À l'intérieur, on admire la salle des mariages voûtée en plein cintre, le grand hall d'entrée à éclairage zénithal, la salle du conseil avec son parquet aux motifs géométriques, et l'escalier à balustrade en fer forgé aux motifs ondés. Le bâtiment intègre dès l'origine un théâtre municipal d'environ 1 500 places, inauguré le 12 décembre 1937 avec une représentation de Faust de Gounod par l'Opéra de Paris.`,
    tags: ['patrimoine', 'mairie', 'administration', 'Art Déco', 'monument historique', '1937', 'théâtre'],
  },
  {
    titre: 'Collégiale Notre-Dame',
    sousTitre: 'Monument historique du XIIe siècle — lieu de baptême de Saint Louis',
    photo: 'assets/photos/Collegiale_poissy.jpg',
    categorie: 'Patrimoine religieux',
    catIcon: 'church',
    catCouleur: '#795548',
    adresse: 'Rue Saint-Louis, 78300 Poissy',
    horaires: 'Tous les jours 9h-18h',
    texteAudio: `La Collégiale Notre-Dame de Poissy est un joyau du patrimoine médiéval classé Monument Historique. Érigée aux XIIe et XIIIe siècles, cette église gothique est indissociable de l'histoire royale de France : c'est ici que le roi Louis IX, connu sous le nom de Saint Louis, fut baptisé en 1214. Ce baptême royal a conféré à Poissy un prestige et une notoriété qui perdurent jusqu'à nos jours. La collégiale abrite de remarquables vitraux du XVIe siècle, une belle statuaire médiévale et une Vierge à l'Enfant du XVe siècle particulièrement vénérée. Des concerts de musique classique et sacrée y sont organisés régulièrement, profitant de son acoustique exceptionnelle. C'est un incontournable de toute visite à Poissy.`,
    tags: ['monument historique', 'gothique', 'Saint Louis', 'XIIe siècle', 'vitraux'],
  },
  {
    titre: 'Villa Savoye',
    sousTitre: 'Chef-d\'œuvre de Le Corbusier — classée au Patrimoine mondial de l\'UNESCO',
    photo: 'assets/photos/villa-savoye-poissy.jpg',
    categorie: 'Architecture',
    catIcon: 'villa',
    catCouleur: '#4A148C',
    adresse: '82 rue de Villiers, 78300 Poissy',
    horaires: 'Mar-Dim 10h-18h (mai-oct) · 10h-17h (nov-avr) · Fermé lundi',
    tarif: '9€ / 7€ réduit / Gratuit -18 ans',
    telephone: '01 39 65 01 06',
    siteWeb: 'https://www.villa-savoye.fr',
    texteAudio: `La Villa Savoye est sans doute le monument le plus célèbre de Poissy à l'échelle internationale. Construite entre 1929 et 1931 par l'architecte suisse Le Corbusier et son cousin Pierre Jeanneret, elle est considérée comme l'un des chefs-d'œuvre de l'architecture moderne mondiale. Classée au Patrimoine mondial de l'UNESCO depuis 2016 dans le cadre de l'œuvre de Le Corbusier, elle illustre parfaitement les cinq points de l'architecture moderne définis par le maître : les pilotis, le toit-terrasse, le plan libre, la fenêtre en bandeau et la façade libre. La villa a été commandée par Pierre et Eugénie Savoye comme résidence de week-end. Aujourd'hui propriété de l'État français, elle est gérée par le Centre des monuments nationaux et accueille chaque année près de 100 000 visiteurs. La visite vous plonge dans l'univers de l'avant-garde architecturale du XXe siècle.`,
    tags: ['UNESCO', 'Le Corbusier', 'architecture moderne', 'monument national', 'XXe siècle'],
  },
  {
    titre: 'Musée du Jouet',
    sousTitre: 'Plus de 12 000 jouets et jeux à travers les siècles',
    photo: 'assets/photos/musée-du-jouet-poissy.jpg',
    categorie: 'Musée',
    catIcon: 'museum',
    catCouleur: '#E65100',
    adresse: 'Enclos de l\'Abbaye, 78300 Poissy',
    horaires: 'Mar-Ven 9h30-12h · 14h-17h30 · Sam-Dim 14h-18h · Fermé lundi',
    tarif: '4€ adulte / 2€ enfant / Gratuit 1er dim. du mois',
    telephone: '01 39 65 06 06',
    texteAudio: `Le Musée du Jouet de Poissy est une institution culturelle unique en France. Installé dans l'Enclos de l'Abbaye, un bâtiment chargé d'histoire, il conserve et expose une collection exceptionnelle de plus de 12 000 jouets et jeux qui couvrent deux siècles d'histoire du jeu, de la fin du XVIIIe siècle à nos jours. On y découvre des poupées en porcelaine, des soldats de plomb, des trains mécaniques, des peluches, des jeux de société, des jouets en fer-blanc et les premiers jeux vidéo. La collection retrace l'évolution des jouets en miroir de l'histoire sociale, industrielle et culturelle de la France. Des expositions temporaires viennent régulièrement enrichir la programmation. Le musée est particulièrement apprécié des familles et des nostalgiques. Le premier dimanche de chaque mois, l'entrée est gratuite pour tous.`,
    tags: ['musée', 'jouets', 'histoire', 'famille', 'culture', 'enfants'],
  },
  {
    titre: 'Parc Meissonier',
    sousTitre: 'Écrin de verdure au cœur de la ville — jeux, promenades et détente',
    photo: 'assets/photos/parc-meissonnier-poissy.jpg',
    categorie: 'Espace naturel',
    catIcon: 'park',
    catCouleur: '#2E7D32',
    adresse: 'Rue du Gal Leclerc, 78300 Poissy',
    horaires: 'Tous les jours 8h - coucher du soleil',
    tarif: 'Gratuit',
    texteAudio: `Le Parc Meissonier est le poumon vert de Poissy et l'un des lieux de détente préférés des Poissynois. Ce beau parc paysager s'étend sur plusieurs hectares au cœur de la ville et doit son nom au célèbre peintre Ernest Meissonier, qui vécut et travailla à Poissy au XIXe siècle. On y trouve de superbes espaces boisés, des pelouses où il fait bon pique-niquer, des aires de jeux pour les enfants, des terrains de sport et des allées idéales pour la promenade et le jogging. Le parc accueille de nombreuses manifestations culturelles et sportives tout au long de l'année : festivals, fêtes de quartier, tournois sportifs, marchés de créateurs. Une fontaine centrale et de magnifiques parterres de fleurs agrémentent l'espace aux beaux jours. Un lieu de vie essentiel pour toute la famille.`,
    tags: ['parc', 'nature', 'famille', 'sport', 'promenade', 'détente'],
  },
  {
    titre: 'Bords de Seine',
    sousTitre: 'Promenades, sports nautiques et nature préservée aux portes de Paris',
    photo: 'assets/photos/bords-de-seine.jpg',
    categorie: 'Espace naturel',
    catIcon: 'water',
    catCouleur: '#1565C0',
    adresse: 'Quai du Bord de Seine, 78300 Poissy',
    horaires: 'Accès libre',
    tarif: 'Gratuit',
    texteAudio: `Les bords de Seine de Poissy constituent l'un des atouts naturels majeurs de la ville. La Seine traverse Poissy sur plusieurs kilomètres, offrant des paysages remarquables et une biodiversité riche. Les berges aménagées accueillent promeneurs, cyclistes et joggeurs dans un cadre verdoyant et préservé. On peut y pratiquer la pêche, l'aviron, le kayak et d'autres sports nautiques. Le club d'aviron de Poissy, l'un des plus anciens d'Île-de-France, est installé sur ces rives depuis plus d'un siècle. En été, les bords de Seine deviennent un lieu de rendez-vous festif avec des animations et des concerts en plein air. La vue sur la Seine avec ses péniches et les collines en arrière-plan offre des panoramas qui ont inspiré de nombreux peintres. Une belle promenade en vélo depuis Poissy jusqu'à Conflans-Sainte-Honorine est particulièrement appréciée.`,
    tags: ['Seine', 'nature', 'sport nautique', 'promenade', 'pêche', 'vélo'],
  },
  {
    titre: 'Maison de Fer',
    sousTitre: 'Architecture industrielle unique des années 1890',
    photo: 'assets/photos/maison-de-fer-poissy.jpg',
    categorie: 'Patrimoine',
    catIcon: 'home',
    catCouleur: '#455A64',
    adresse: 'Rue du Maréchal Joffre, 78300 Poissy',
    texteAudio: `La Maison de Fer est une curiosité architecturale unique à Poissy et l'une des rares maisons entièrement construites en métal préfabriqué en France. Édifiée à la fin du XIXe siècle, vers 1896, elle est le témoignage fascinant des expérimentations industrielles et architecturales de l'époque. Construite en modules de tôle ondulée galvanisée assemblés sur une charpente métallique, elle préfigure les techniques de construction préfabriquée du XXe siècle. Ce bâtiment atypique illustre l'enthousiasme de la Belle Époque pour les nouveaux matériaux industriels, dans le sillage de la Tour Eiffel construite quelques années plus tôt. La Maison de Fer est classée au titre des Monuments Historiques depuis 2014. C'est un témoignage précieux du patrimoine industriel français, et un exemple remarquable de l'architecture de fer en milieu résidentiel.`,
    tags: ['monument historique', 'architecture métallique', 'Belle Époque', 'patrimoine industriel'],
  },
  {
    titre: 'Marché de Poissy',
    sousTitre: 'Un des marchés les plus animés des Yvelines',
    photo: 'assets/photos/marché-poissy.jpg',
    categorie: 'Commerce',
    catIcon: 'storefront',
    catCouleur: '#E65100',
    adresse: 'Place du Maréchal Foch & Place de la République, 78300 Poissy',
    horaires: 'Mar & Ven : 8h-13h30 · Sam : 8h-14h',
    tarif: 'Accès libre',
    texteAudio: `Le marché de Poissy est l'un des marchés en plein air les plus animés et les plus appréciés des Yvelines. Il se tient trois fois par semaine : le mardi et le vendredi matin place du Maréchal Foch, et le samedi matin place de la République. Ce marché traditionnel rassemble plusieurs dizaines de commerçants proposant des produits frais de saison : fruits et légumes, viandes et charcuteries, poissons, fromages, épices, fleurs et plants de jardins. On y trouve également des maraîchers locaux, des artisans et des producteurs régionaux. C'est un lieu de vie par excellence, où les Poissynois se retrouvent pour faire leurs courses dans une ambiance conviviale et authentique. Le marché du samedi est le plus important et le plus fréquenté, attirant des visiteurs de toute la communauté urbaine du Grand Paris Seine et Oise. Un incontournable de la vie quotidienne poissynoise depuis des décennies.`,
    tags: ['marché', 'produits frais', 'local', 'alimentation', 'artisanat', 'convivial'],
  },
  {
    titre: 'Centre-ville',
    sousTitre: 'Artère commerçante et cœur battant de Poissy',
    photo: 'assets/photos/centre-ville-poissy.jpg',
    categorie: 'Centre-ville',
    catIcon: 'location_city',
    catCouleur: '#1565C0',
    adresse: 'Place de la République, 78300 Poissy',
    texteAudio: `Le centre-ville de Poissy et la place du Maréchal Foch sont le cœur vibrant de la vie poissynoise. Cette place centrale, bordée par l'Hôtel de Ville d'un côté et les commerces de l'autre, est le lieu de toutes les animations : marché, fêtes, concerts, foires. Le centre-ville de Poissy offre une palette complète de commerces de proximité : boulangeries artisanales, boucheries, épiceries fines, restaurants, cafés et boutiques de mode. La rue Maréchal Foch et les rues adjacentes constituent la principale rue piétonne commerçante. Le marché bi-hebdomadaire, le mardi et le vendredi matin, ainsi que le marché du samedi matin, animent les places et rues du centre. En dehors du commerce, le centre-ville abrite également des équipements culturels, des services publics et plusieurs lieux de culte. La gare de Poissy, desservie par le RER A et la ligne J du Transilien, se trouve à quelques minutes à pied du centre.`,
    tags: ['commerce', 'marché', 'animations', 'gare', 'piéton', 'vie locale'],
  },
  {
    titre: 'Technoparc de Poissy',
    sousTitre: 'Pôle économique et zone d\'activités de Poissy',
    photo: 'assets/photos/technoparc-poissy.jpg',
    categorie: 'Économie',
    catIcon: 'business',
    catCouleur: '#37474F',
    adresse: 'Rue Le Corbusier, 78300 Poissy',
    texteAudio: `Le Technoparc de Poissy est le principal pôle économique de la ville. Cette zone d'activités moderne accueille une grande diversité d'entreprises : PME industrielles, bureaux d'études, services aux entreprises, centres logistiques et établissements de formation. Le Technoparc bénéficie d'une situation géographique stratégique, à proximité immédiate des axes autoroutiers A13 et A14, et à seulement 30 minutes de Paris. Il constitue un moteur essentiel de l'emploi local, accueillant plusieurs milliers de salariés. La CCI des Yvelines accompagne les entreprises implantées sur ce site. Le Technoparc illustre la vocation économique de Poissy, ville qui a connu une forte industrialisation au XXe siècle, notamment avec les usines Talbot-Chrysler qui ont marqué l'histoire sociale de la région.`,
    tags: ['économie', 'entreprise', 'emploi', 'industrie', 'zone d\'activité'],
  },
  {
    titre: 'Prieuré Royal de Poissy',
    sousTitre: 'Fondé par Saint Louis, vestige de l\'abbaye dominicaine royale',
    photo: 'assets/photos/prieuré-poissy.png',
    categorie: 'Patrimoine religieux',
    catIcon: 'church',
    catCouleur: '#6D4C41',
    adresse: 'Enclos de l\'Abbaye, 78300 Poissy',
    texteAudio: `Le Prieuré Royal de Poissy est un lieu chargé d'histoire et de spiritualité. Fondé en 1304 par le roi Philippe le Bel en l'honneur de son grand-père Saint Louis, ce prieuré dominicain royal fut l'un des plus importants couvents de femmes du royaume de France au Moyen Âge. Il accueillit notamment Christine de Pizan, pionnière des lettres féminines du XVe siècle, qui y reçut son éducation. En 1561, le fameux Colloque de Poissy s'y tint, tentant de rapprocher catholiques et protestants. Des bâtiments médiévaux subsistent encore aujourd'hui, notamment la salle capitulaire et une partie du cloître. Le site abrite désormais le Musée du Jouet mais aussi les vestiges archéologiques du prieuré. C'est un lieu de mémoire exceptionnel qui témoigne du rôle central de Poissy dans l'histoire royale et religieuse de la France médiévale.`,
    tags: ['médiéval', 'prieuré', 'Saint Louis', 'dominicaines', 'histoire royale'],
  },
];

@Component({
  selector: 'app-decouvrir',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf],
  templateUrl: './decouvrir.component.html',
  styleUrl: './decouvrir.component.scss',
})
export class DecouvrirComponent implements OnDestroy {

  lieux = LIEUX_POISSY;
  selectedLieu: LieuPoissy | null = null;
  isPlaying = false;

  constructor(private router: Router) {
    // Scroll to lieu if navigated with state
    const state = (window.history.state as any);
    if (state?.titre) {
      const found = this.lieux.find(l => l.titre === state.titre);
      if (found) {
        setTimeout(() => this.ouvrirLieu(found), 200);
      }
    }
  }

  ouvrirLieu(lieu: LieuPoissy): void {
    this.stopAudio();
    this.selectedLieu = lieu;
  }

  fermerDetail(): void {
    this.stopAudio();
    this.selectedLieu = null;
  }

  toggleAudio(): void {
    if (this.isPlaying) {
      this.stopAudio();
    } else {
      this.playAudio();
    }
  }

  private playAudio(): void {
    if (!this.selectedLieu) return;
    this.isPlaying = true;

    TextToSpeech.speak({
      text: this.selectedLieu.texteAudio,
      lang: 'fr-FR',
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
    }).then(() => {
      this.isPlaying = false;
    }).catch(() => {
      this.isPlaying = false;
    });
  }

  stopAudio(): void {
    TextToSpeech.stop().catch(() => {});
    this.isPlaying = false;
  }

  ouvrirSite(lieu: LieuPoissy): void {
    if (lieu.siteWeb) window.open(lieu.siteWeb, '_blank');
    else window.open(`https://www.ville-poissy.fr`, '_blank');
  }

  ouvrirMaps(lieu: LieuPoissy): void {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(lieu.adresse)}`, '_blank');
  }

  appeler(tel: string): void {
    window.location.href = `tel:${tel}`;
  }

  goBack(): void {
    if (this.selectedLieu) { this.fermerDetail(); }
    else { this.router.navigate(['/home']); }
  }

  ngOnDestroy(): void {
    this.stopAudio();
  }
}
