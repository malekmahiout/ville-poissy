import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';

export interface ActualiteItem {
  titre: string;
  resume: string;
  date: string;
  tag: string;
  couleur: string;
  icon: string;
  lien?: string;
}

const FALLBACK: ActualiteItem[] = [
  { titre: 'Rénovation du parc Meissonier', resume: 'Nouvelles allées et équipements sportifs. Les travaux démarreront le 1er avril pour une durée de 3 mois. Le parc restera partiellement accessible durant les travaux.', date: '20 mars 2026', tag: 'Travaux', couleur: '#F57C00', icon: 'construction', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Nouveau service de collecte des encombrants', resume: 'Réservez via l\'application pour une collecte à domicile. Service gratuit pour les résidents poissynois.', date: '18 mars 2026', tag: 'Services', couleur: '#2E7D32', icon: 'delete_sweep', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Conseil municipal — compte-rendu de mars', resume: 'Budget 2026 adopté et extension du réseau de pistes cyclables confirmée. Présentation du nouveau plan de mobilité douce.', date: '15 mars 2026', tag: 'Mairie', couleur: '#1565C0', icon: 'account_balance', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Pistes cyclables : extension du réseau', resume: '5 km de nouvelles pistes cyclables seront aménagées d\'ici fin 2026, reliant la gare au bord de Seine.', date: '14 mars 2026', tag: 'Transports', couleur: '#1565C0', icon: 'directions_bike', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Programme été 2026 : inscriptions ouvertes', resume: 'Colonies de vacances, séjours sportifs et culturels pour les 6-17 ans. Tarifs selon quotient familial.', date: '12 mars 2026', tag: 'Enfance', couleur: '#00838F', icon: 'child_care', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Villa Savoye : expositions du printemps', resume: 'Le Centre des monuments nationaux propose deux nouvelles expositions temporaires au sein de la Villa Savoye jusqu\'en juin 2026.', date: '10 mars 2026', tag: 'Culture', couleur: '#7B1FA2', icon: 'museum', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Travaux avenue du Général de Gaulle', resume: 'Réfection de la chaussée et des trottoirs. Circulation alternée du 1er au 30 avril. Déviation signalée.', date: '8 mars 2026', tag: 'Travaux', couleur: '#F57C00', icon: 'construction', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'AS Poissy Football : saison 2025-2026', resume: 'L\'AS Poissy dispute sa 3e saison consécutive en National. Résultats, calendrier et informations sur le club historique de la ville.', date: '6 mars 2026', tag: 'Sport', couleur: '#2E7D32', icon: 'sports_soccer', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Aide à la rénovation énergétique', resume: 'La ville propose un accompagnement pour les travaux d\'isolation et d\'énergie renouvelable. Subventions disponibles.', date: '4 mars 2026', tag: 'Environnement', couleur: '#388E3C', icon: 'eco', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Médiathèque : nouveautés de mars', resume: 'Roman, BD, documentaires : la médiathèque de Poissy accueille 200 nouvelles références. Adhésion gratuite pour les Poissynois.', date: '2 mars 2026', tag: 'Culture', couleur: '#7B1FA2', icon: 'library_books', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Plan local d\'urbanisme : réunion publique', resume: 'Réunion publique de présentation du futur PLU le 15 avril à 19h à la salle des fêtes. Ouvert à tous.', date: '28 fév. 2026', tag: 'Mairie', couleur: '#1565C0', icon: 'account_balance', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Semaine du commerce local', resume: 'Du 14 au 20 avril, les commerçants poissynois proposent des offres spéciales et animations dans le centre-ville.', date: '26 fév. 2026', tag: 'Services', couleur: '#2E7D32', icon: 'storefront', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Sécurité routière : bilan 2025', resume: 'La ville présente son bilan annuel de sécurité routière avec une baisse de 12% des accidents par rapport à 2024.', date: '24 fév. 2026', tag: 'Sécurité', couleur: '#C62828', icon: 'local_police', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Jardins partagés : nouvelles parcelles', resume: '20 nouvelles parcelles disponibles dans les jardins partagés de Poissy. Inscriptions à la mairie ou en ligne.', date: '22 fév. 2026', tag: 'Environnement', couleur: '#388E3C', icon: 'grass', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Musée du Jouet : nouvelle exposition', resume: 'Exposition "Jeux vidéo : 50 ans d\'histoire" au Musée du Jouet jusqu\'au 30 juin. Entrée gratuite le premier dimanche du mois.', date: '20 fév. 2026', tag: 'Culture', couleur: '#7B1FA2', icon: 'videogame_asset', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'RER A : travaux nocturnes en mars', resume: 'Des travaux de maintenance sur la ligne RER A entraîneront des interruptions nocturnes les vendredis et samedis de mars.', date: '18 fév. 2026', tag: 'Transports', couleur: '#1565C0', icon: 'train', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Forum emploi : 50 entreprises présentes', resume: 'Le forum de l\'emploi de Poissy accueille 50 entreprises et 300 offres d\'emploi le 25 mars au Palais des Congrès.', date: '16 fév. 2026', tag: 'Services', couleur: '#2E7D32', icon: 'work', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Nettoyage de printemps : appel aux bénévoles', resume: 'La ville organise son grand nettoyage de printemps le 29 mars. Inscrivez-vous pour participer à l\'embellissement de votre quartier.', date: '14 fév. 2026', tag: 'Environnement', couleur: '#388E3C', icon: 'cleaning_services', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Cours de natation adultes : inscriptions', resume: 'La piscine municipale ouvre les inscriptions pour les cours de natation adultes du 2e trimestre. Places limitées.', date: '12 fév. 2026', tag: 'Sport', couleur: '#2E7D32', icon: 'pool', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
  { titre: 'Accessibilité : travaux terminés rue Maréchal-Foch', resume: 'Les travaux d\'accessibilité PMR de la rue Maréchal-Foch sont terminés. Les trottoirs sont désormais conformes aux normes.', date: '10 fév. 2026', tag: 'Travaux', couleur: '#F57C00', icon: 'accessible', lien: 'https://www.ville-poissy.fr/index.php/actualites.html' },
];

const FALLBACK_AGENDA: AgendaItem[] = [
  { titre: 'Marché hebdomadaire — Centre-ville', date: 'Sam. 22 mars 2026', heure: '07h00 - 13h00', lieu: 'Place du Marché, Poissy', description: 'Marché en plein air avec producteurs locaux, fruits, légumes, fromages, fleurs et articles ménagers. Tous les samedis matin.', icon: 'storefront', couleur: '#2E7D32', categorie: 'Commerce', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Concert de l\'Orchestre de Poissy', date: 'Ven. 27 mars 2026', heure: '20h30', lieu: 'Palais des Congrès, Poissy', description: 'Concert du printemps de l\'Orchestre de Poissy. Programme : Mozart, Beethoven. Réservation obligatoire. Tarifs : 12€ / 8€ réduit.', icon: 'music_note', couleur: '#7B1FA2', categorie: 'Culture', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Marché nocturne du centre-ville', date: 'Ven. 28 mars 2026', heure: '18h00 - 22h00', lieu: 'Place du Maréchal-Foch, Poissy', description: 'Marché nocturne avec artisans, producteurs locaux et animations musicales. Restauration sur place.', icon: 'nights_stay', couleur: '#E65100', categorie: 'Commerce', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Tournoi de football U12 — AS Poissy', date: 'Dim. 30 mars 2026', heure: '09h00 - 18h00', lieu: 'Stade Municipal, Poissy', description: 'Tournoi inter-clubs pour les jeunes de 11-12 ans. 12 équipes participantes. Restauration et buvette sur place.', icon: 'sports_soccer', couleur: '#2E7D32', categorie: 'Sport', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Atelier numérique seniors', date: 'Mar. 1er avr. 2026', heure: '14h00 - 16h00', lieu: 'Médiathèque de Poissy', description: 'Initiation aux usages du numérique pour les personnes de 60 ans et plus. Thème : utiliser les applications mobile. Sur inscription.', icon: 'computer', couleur: '#1565C0', categorie: 'Social', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Forum des associations', date: 'Sam. 5 avr. 2026', heure: '10h00 - 18h00', lieu: 'Palais des Congrès, Poissy', description: '200 associations poissynoises présentent leurs activités. Rejoignez une association sportive, culturelle ou humanitaire !', icon: 'groups', couleur: '#880E4F', categorie: 'Social', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Conférence : histoire de Poissy', date: 'Mer. 8 avr. 2026', heure: '18h30', lieu: 'Hôtel de Ville, Salle du Conseil', description: 'Conférence sur l\'histoire de Poissy, de la naissance de Saint Louis à l\'usine Talbot. Par M. Jean-Pierre Martin, historien local.', icon: 'history_edu', couleur: '#4A148C', categorie: 'Culture', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Conseil municipal', date: 'Jeu. 9 avr. 2026', heure: '19h00', lieu: 'Hôtel de Ville, Salle du Conseil', description: 'Séance ordinaire du conseil municipal de Poissy. Séance publique ouverte à tous les citoyens. Ordre du jour disponible en mairie.', icon: 'account_balance', couleur: '#1565C0', categorie: 'Institutionnel', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Journée découverte Villa Savoye', date: 'Dim. 12 avr. 2026', heure: '10h00 - 17h00', lieu: 'Villa Savoye, 82 rue de Villiers', description: 'Visite guidée gratuite de la Villa Savoye, chef-d\'œuvre de Le Corbusier classé UNESCO. Réservation recommandée.', icon: 'villa', couleur: '#795548', categorie: 'Patrimoine', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Tournoi de tennis printemps', date: 'Sam. 19 avr. 2026', heure: '09h00', lieu: 'Tennis Club de Poissy', description: 'Tournoi ouvert à tous les niveaux. Catégories : -18 ans, adultes. Inscription : 5€. Restauration sur place.', icon: 'sports_tennis', couleur: '#E65100', categorie: 'Sport', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Fête de Pâques au Parc Meissonier', date: 'Dim. 20 avr. 2026', heure: '14h00 - 18h00', lieu: 'Parc Meissonier, Poissy', description: 'Chasse aux œufs, jeux gonflables, spectacles de magie pour les enfants. Gratuit. Organisé par la ville de Poissy.', icon: 'celebration', couleur: '#F57C00', categorie: 'Enfance', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Exposition photo : Poissy en images', date: 'Lun. 21 avr. 2026', heure: '09h00 - 18h00', lieu: 'Médiathèque de Poissy', description: 'Exposition des photos primées du concours photo annuel "Poissy en images". 80 clichés sélectionnés parmi 500 participants.', icon: 'photo_camera', couleur: '#7B1FA2', categorie: 'Culture', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Journée sportive inter-quartiers', date: 'Sam. 26 avr. 2026', heure: '09h00 - 18h00', lieu: 'Stade Municipal, Poissy', description: 'Compétitions sportives entre les quartiers de Poissy : foot, basket, volleyball, athlétisme. Ouvert à tous.', icon: 'emoji_events', couleur: '#2E7D32', categorie: 'Sport', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Brocante du printemps', date: 'Dim. 27 avr. 2026', heure: '07h00 - 18h00', lieu: 'Avenue de Paris, Poissy', description: 'Grande brocante annuelle du printemps sur 2 km. Particuliers et professionnels. Inscription stand : 10€/ml.', icon: 'inventory', couleur: '#795548', categorie: 'Commerce', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Initiation à la pêche — Bords de Seine', date: 'Mer. 1er mai 2026', heure: '09h00 - 12h00', lieu: 'Bords de Seine, Poissy', description: 'Journée initiation à la pêche pour les enfants de 7 à 14 ans avec l\'AAPPMA de Poissy. Matériel fourni. Gratuit.', icon: 'set_meal', couleur: '#00695C', categorie: 'Loisirs', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Spectacle de fin d\'année : conservatoire', date: 'Ven. 8 mai 2026', heure: '19h00', lieu: 'Salle des Fêtes, Poissy', description: 'Spectacle annuel des élèves du Conservatoire municipal de Poissy : musique, danse, théâtre. Entrée libre.', icon: 'theater_comedy', couleur: '#880E4F', categorie: 'Culture', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Nuit des musées', date: 'Sam. 16 mai 2026', heure: '20h00 - 01h00', lieu: 'Musée du Jouet & Villa Savoye', description: 'Nocturnes exceptionnelles pour la Nuit des Musées : Musée du Jouet et Villa Savoye ouverts gratuitement jusqu\'à 1h du matin.', icon: 'museum', couleur: '#4A148C', categorie: 'Culture', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Cross de la ville de Poissy', date: 'Dim. 24 mai 2026', heure: '09h30', lieu: 'Parc Meissonier, Poissy', description: 'Course à pied annuelle ouverte à tous. Circuits 5 km, 10 km et 15 km. Inscription en ligne ou le jour même.', icon: 'directions_run', couleur: '#E65100', categorie: 'Sport', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Fête des voisins — Place Racine', date: 'Sam. 30 mai 2026', heure: '18h00 - 22h00', lieu: 'Place Racine, Poissy', description: 'Grande fête des voisins organisée par la mairie. Animations, concerts, barbecue partagé. Gratuit, ouvert à tous.', icon: 'people', couleur: '#00695C', categorie: 'Social', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Marché des créateurs locaux', date: 'Dim. 7 juin 2026', heure: '10h00 - 18h00', lieu: 'Cours du 14 Juillet, Poissy', description: 'Artisans, créateurs et artistes locaux présentent leurs œuvres et produits. Bijoux, céramiques, textiles, tableaux.', icon: 'palette', couleur: '#F57C00', categorie: 'Commerce', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
  { titre: 'Fête de la Musique', date: 'Dim. 21 juin 2026', heure: '18h00 - 00h00', lieu: 'Centre-ville, Poissy', description: 'La Fête de la Musique envahit les rues de Poissy ! 30 scènes, 100 groupes et artistes. Concert exceptionnel place du Maréchal-Foch.', icon: 'queue_music', couleur: '#7B1FA2', categorie: 'Culture', lien: 'https://www.ville-poissy.fr/index.php/agenda.html' },
];

const TAG_COLORS: Record<string, { couleur: string; icon: string; tag: string }> = {
  travaux:       { couleur: '#F57C00', icon: 'construction',          tag: 'Travaux' },
  securite:      { couleur: '#C62828', icon: 'local_police',           tag: 'Sécurité' },
  culture:       { couleur: '#7B1FA2', icon: 'museum',                 tag: 'Culture' },
  sport:         { couleur: '#2E7D32', icon: 'sports',                 tag: 'Sport' },
  enfance:       { couleur: '#00838F', icon: 'child_care',             tag: 'Enfance' },
  transport:     { couleur: '#1565C0', icon: 'directions_bus',         tag: 'Transports' },
  environnement: { couleur: '#388E3C', icon: 'eco',                    tag: 'Environnement' },
  services:      { couleur: '#2E7D32', icon: 'miscellaneous_services', tag: 'Services' },
  mairie:        { couleur: '#1565C0', icon: 'account_balance',        tag: 'Mairie' },
  default:       { couleur: '#455A64', icon: 'article',                tag: 'Actualité' },
};

function detectTag(titre: string, text: string): { couleur: string; icon: string; tag: string } {
  const t = (titre + ' ' + text).toLowerCase();
  if (/travaux|chantier|voirie|rénovation|réfection|construction/.test(t)) return TAG_COLORS['travaux'];
  if (/sécurité|police|délinquance|sûreté/.test(t)) return TAG_COLORS['securite'];
  if (/culture|spectacle|concert|exposition|musée|festival|bibliothèque|médiathèque/.test(t)) return TAG_COLORS['culture'];
  if (/sport|football|natation|tennis|stade|gymnase|course|vélo/.test(t)) return TAG_COLORS['sport'];
  if (/enfant|école|scolaire|périscolaire|crèche|jeunesse|famille/.test(t)) return TAG_COLORS['enfance'];
  if (/transport|bus|rer|train|mobilité|circulation|stationnement/.test(t)) return TAG_COLORS['transport'];
  if (/environnement|vert|déchets|collecte|tri|nature|jardin/.test(t)) return TAG_COLORS['environnement'];
  if (/service|démarche|administratif|mairie|conseil|budget|emploi/.test(t)) return TAG_COLORS['mairie'];
  return TAG_COLORS['default'];
}

function parseDate(raw: string): string {
  try {
    const d = new Date(raw.trim());
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  } catch {}
  return raw.trim().replace(/^\s*le\s*/i, '');
}

function parseHtml(html: string): ActualiteItem[] {
  const pattern1 = /<h[23][^>]*class="[^"]*article[^"]*"[^>]*>\s*<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi;
  const pattern2 = /<div[^>]*class="[^"]*catItemTitle[^"]*"[^>]*>\s*<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi;
  const pattern3 = /<h[23][^>]*>\s*<a[^>]*href="(\/[^"]+)"[^>]*>([^<]{10,120})<\/a>/gi;
  const datePattern = /<time[^>]*>([^<]+)<\/time>|<dd[^>]*class="[^"]*publish[^"]*"[^>]*>([^<]+)<\/dd>|<span[^>]*class="[^"]*date[^"]*"[^>]*>([^<]+)<\/span>/gi;
  const resumePattern = /<p[^>]*class="[^"]*introtext[^"]*"[^>]*>([\s\S]{10,400}?)<\/p>|<div[^>]*class="[^"]*introtext[^"]*"[^>]*>([\s\S]{10,400}?)<\/div>/gi;

  const titles: Array<{ titre: string; lien: string }> = [];
  let m: RegExpExecArray | null;
  for (const pat of [pattern1, pattern2, pattern3]) {
    while ((m = pat.exec(html)) !== null) {
      const titre = m[2].trim().replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
      if (titre.length > 5 && !titles.find(t => t.titre === titre)) {
        titles.push({ titre, lien: m[1] });
      }
    }
    if (titles.length >= 20) break;
  }

  const dates: string[] = [];
  while ((m = datePattern.exec(html)) !== null) {
    const d = (m[1] || m[2] || m[3] || '').trim();
    if (d) dates.push(parseDate(d));
  }

  const resumes: string[] = [];
  while ((m = resumePattern.exec(html)) !== null) {
    const r = (m[1] || m[2] || '').replace(/<[^>]+>/g, '').trim();
    if (r.length > 10) resumes.push(r.substring(0, 300));
  }

  const items: ActualiteItem[] = [];
  for (let i = 0; i < Math.min(titles.length, 20); i++) {
    const { titre, lien } = titles[i];
    const tag = detectTag(titre, resumes[i] || '');
    items.push({
      titre,
      resume: resumes[i] || 'Lire l\'article complet sur le site de la ville de Poissy.',
      date: dates[i] || '',
      tag: tag.tag,
      couleur: tag.couleur,
      icon: tag.icon,
      lien: lien.startsWith('http') ? lien : `https://www.ville-poissy.fr${lien}`,
    });
  }
  return items;
}

export interface AgendaItem {
  titre: string;
  date: string;
  dateRaw?: Date;
  heure: string;
  lieu: string;
  description: string;
  icon: string;
  couleur: string;
  categorie: string;
  lien?: string;
}

function parseAgendaHtml(html: string): AgendaItem[] {
  const titlePattern  = /<h[23][^>]*class="[^"]*(?:event|catItem)[^"]*"[^>]*>\s*<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi;
  const titlePattern2 = /<a[^>]*class="[^"]*event[^"]*"[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi;
  const titlePattern3 = /<h[23][^>]*>\s*<a[^>]*href="(\/[^"]+)"[^>]*>([^<]{5,120})<\/a>/gi;
  const datePattern   = /<time[^>]*datetime="([^"]*)"[^>]*>|<[^>]*class="[^"]*(?:event[-_]date|date)[^"]*"[^>]*>([^<]+)<\/[a-z]+>/gi;
  const lieuPattern   = /<[^>]*class="[^"]*(?:lieu|location|venue)[^"]*"[^>]*>([^<]+)<\/[a-z]+>/gi;
  const descPattern   = /<[^>]*class="[^"]*(?:introtext|description|event_desc)[^"]*"[^>]*>([\s\S]{10,300}?)<\/[a-z]+>/gi;

  const titles: Array<{ titre: string; lien: string }> = [];
  let m: RegExpExecArray | null;

  for (const pat of [titlePattern, titlePattern2, titlePattern3]) {
    while ((m = pat.exec(html)) !== null) {
      const titre = m[2].trim().replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
      if (titre.length > 3 && !titles.find(t => t.titre === titre)) {
        titles.push({ titre, lien: m[1] });
      }
    }
    if (titles.length >= 20) break;
  }

  const dates: string[] = [];
  while ((m = datePattern.exec(html)) !== null) {
    const d = (m[1] || m[2] || '').trim();
    if (d) dates.push(d.substring(0, 30));
  }

  const lieux: string[] = [];
  while ((m = lieuPattern.exec(html)) !== null) {
    const l = m[1].trim();
    if (l) lieux.push(l);
  }

  const descs: string[] = [];
  while ((m = descPattern.exec(html)) !== null) {
    const d = (m[1] || '').replace(/<[^>]+>/g, '').trim();
    if (d.length > 10) descs.push(d.substring(0, 300));
  }

  const STYLES = [
    { couleur: '#7B1FA2', icon: 'celebration',    categorie: 'Événement' },
    { couleur: '#1565C0', icon: 'event',           categorie: 'Agenda' },
    { couleur: '#E65100', icon: 'sports',          categorie: 'Sport' },
    { couleur: '#2E7D32', icon: 'storefront',      categorie: 'Commerce' },
    { couleur: '#4A148C', icon: 'museum',          categorie: 'Culture' },
    { couleur: '#00695C', icon: 'groups',          categorie: 'Social' },
    { couleur: '#880E4F', icon: 'music_note',      categorie: 'Concert' },
    { couleur: '#F57C00', icon: 'account_balance', categorie: 'Institutionnel' },
  ];

  const items: AgendaItem[] = [];
  for (let i = 0; i < Math.min(titles.length, 20); i++) {
    const { titre, lien } = titles[i];
    const style = STYLES[i % STYLES.length];
    items.push({
      titre,
      date: dates[i] || '',
      heure: '',
      lieu: lieux[i] || 'Poissy',
      description: descs[i] || 'Consulter l\'événement complet sur le site de la ville de Poissy.',
      icon: style.icon,
      couleur: style.couleur,
      categorie: style.categorie,
      lien: lien.startsWith('http') ? lien : `https://www.ville-poissy.fr${lien}`,
    });
  }
  return items;
}

const CACHE_KEY       = 'poissy_actualites_cache';
const AGENDA_CACHE_KEY = 'poissy_agenda_cache';
const CACHE_TTL       = 30 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class ActualitesService {
  private readonly PROXY        = 'https://api.allorigins.win/get?url=';
  private readonly TARGET       = encodeURIComponent('https://www.ville-poissy.fr/index.php/actualites.html');
  private readonly TARGET_P2    = encodeURIComponent('https://www.ville-poissy.fr/index.php/actualites.html?start=10');
  private readonly AGENDA_TARGET = encodeURIComponent('https://www.ville-poissy.fr/index.php/agenda.html');

  constructor(private http: HttpClient) {}

  getActualites(): Observable<ActualiteItem[]> {
    return this.getAllActualites().pipe(map(items => items.slice(0, 5)));
  }

  get5DernieresActualites(): Observable<ActualiteItem[]> {
    return this.getAllActualites().pipe(map(items => items.slice(0, 5)));
  }

  get5DerniersAgenda(): Observable<AgendaItem[]> {
    return this.getAgenda().pipe(map(items => items.slice(0, 5)));
  }

  getAllActualites(): Observable<ActualiteItem[]> {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && data?.length >= 10) return of(data);
      }
    } catch {}

    const p1$ = this.http.get<{ contents: string }>(`${this.PROXY}${this.TARGET}`).pipe(timeout(8000), catchError(() => of({ contents: '' })));
    const p2$ = this.http.get<{ contents: string }>(`${this.PROXY}${this.TARGET_P2}`).pipe(timeout(8000), catchError(() => of({ contents: '' })));

    return forkJoin([p1$, p2$]).pipe(
      map(([r1, r2]) => {
        const parsed1 = parseHtml(r1?.contents || '');
        const parsed2 = parseHtml(r2?.contents || '');
        const merged = [...parsed1];
        for (const item of parsed2) {
          if (!merged.find(m => m.titre === item.titre)) merged.push(item);
        }
        const result = merged.length >= 3 ? merged.slice(0, 20) : FALLBACK;
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, ts: Date.now() })); } catch {}
        return result;
      }),
      catchError(() => of(FALLBACK))
    );
  }

  getAgenda(): Observable<AgendaItem[]> {
    try {
      const cached = localStorage.getItem(AGENDA_CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && data?.length >= 6) return of(data);
      }
    } catch {}

    const p1$ = this.http.get<{ contents: string }>(`${this.PROXY}${this.AGENDA_TARGET}`).pipe(timeout(8000), catchError(() => of({ contents: '' })));
    const p2$ = this.http.get<{ contents: string }>(`${this.PROXY}${encodeURIComponent('https://www.ville-poissy.fr/index.php/agenda.html?start=10')}`).pipe(timeout(8000), catchError(() => of({ contents: '' })));

    return forkJoin([p1$, p2$]).pipe(
      map(([r1, r2]) => {
        const parsed1 = parseAgendaHtml(r1?.contents || '');
        const parsed2 = parseAgendaHtml(r2?.contents || '');
        const merged = [...parsed1];
        for (const item of parsed2) {
          if (!merged.find(m => m.titre === item.titre)) merged.push(item);
        }
        const result = merged.length >= 2 ? merged.slice(0, 20) : FALLBACK_AGENDA;
        try { localStorage.setItem(AGENDA_CACHE_KEY, JSON.stringify({ data: result, ts: Date.now() })); } catch {}
        return result;
      }),
      catchError(() => of(FALLBACK_AGENDA))
    );
  }

  getRawTextForAI(): Observable<string> {
    return this.http.get<{ contents: string }>(`${this.PROXY}${this.TARGET}`).pipe(
      map(res => {
        const html = res?.contents || '';
        return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 3000);
      }),
      catchError(() => of(''))
    );
  }
}
