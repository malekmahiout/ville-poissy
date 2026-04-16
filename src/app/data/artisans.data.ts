import { Commerce } from '../pages/commerce/commerce.component';

export const ARTISANS_DATA: Commerce[] = [

  // ── BÂTIMENT / GROS ŒUVRE ──
  { nom: 'Entreprise Lecomte BTP', categorie: 'Bâtiment', catIcon: 'construction', catCouleur: '#5D4037', adresse: '12, rue de la Maladrerie, 78300 Poissy', telephone: '01 30 65 11 22' },
  { nom: 'Maçonnerie Dubois', categorie: 'Bâtiment', catIcon: 'construction', catCouleur: '#5D4037', adresse: '34, avenue du Maréchal-Foch, 78300 Poissy', telephone: '01 30 06 44 55' },
  { nom: 'Constructions Moreau', categorie: 'Bâtiment', catIcon: 'construction', catCouleur: '#5D4037', adresse: '8, rue du Stade, 78300 Poissy', telephone: '01 39 65 77 88' },
  { nom: 'Rénovation Legrand', categorie: 'Bâtiment', catIcon: 'construction', catCouleur: '#5D4037', adresse: '55, boulevard Victor-Hugo, 78300 Poissy', telephone: '06 12 34 56 78' },
  { nom: 'ATB Travaux', categorie: 'Bâtiment', catIcon: 'construction', catCouleur: '#5D4037', adresse: '3, impasse des Artisans, 78300 Poissy', telephone: '01 30 74 22 33' },

  // ── CARRELAGE / SOLS ──
  { nom: 'Carrelage Fontaine', categorie: 'Carrelage / Sols', catIcon: 'grid_on', catCouleur: '#795548', adresse: '17, rue de la Gare, 78300 Poissy', telephone: '01 39 65 33 44' },
  { nom: 'Sols & Décors Poissy', categorie: 'Carrelage / Sols', catIcon: 'grid_on', catCouleur: '#795548', adresse: '29, avenue de la Maladrerie, 78300 Poissy', telephone: '06 23 45 67 89' },

  // ── CARROSSERIE ──
  { nom: 'Carrosserie Bertin', categorie: 'Carrosserie', catIcon: 'car_repair', catCouleur: '#37474F', adresse: '156, avenue du Maréchal-Foch, 78300 Poissy', telephone: '01 39 65 50 60' },
  { nom: 'Carrosserie du Val de Seine', categorie: 'Carrosserie', catIcon: 'car_repair', catCouleur: '#37474F', adresse: '44, boulevard Robespierre, 78300 Poissy', telephone: '01 30 06 70 80' },
  { nom: 'Peinture Auto Express', categorie: 'Carrosserie', catIcon: 'car_repair', catCouleur: '#37474F', adresse: '3, rue des Moutons, 78300 Poissy', telephone: '01 30 65 66 77' },

  // ── CHAUFFAGE / CLIMATISATION ──
  { nom: 'Thermique Service Poissy', categorie: 'Chauffage / Climatisation', catIcon: 'thermostat', catCouleur: '#E64A19', adresse: '22, rue du Général-de-Gaulle, 78300 Poissy', telephone: '01 30 74 55 66' },
  { nom: 'Isofroid', categorie: 'Chauffage / Climatisation', catIcon: 'thermostat', catCouleur: '#E64A19', adresse: '7, avenue Maurice-Berteaux, 78300 Poissy', telephone: '01 39 79 88 99' },
  { nom: 'Géo Énergie', categorie: 'Chauffage / Climatisation', catIcon: 'thermostat', catCouleur: '#E64A19', adresse: '14, boulevard Devaux, 78300 Poissy', telephone: '06 78 90 12 34' },

  // ── COUVERTURE / TOITURE ──
  { nom: 'Couverture Poissy Toitures', categorie: 'Couverture / Toiture', catIcon: 'roofing', catCouleur: '#4E342E', adresse: '68, avenue du Cep, 78300 Poissy', telephone: '01 30 06 55 66' },
  { nom: 'Toiture Seine & Oise', categorie: 'Couverture / Toiture', catIcon: 'roofing', catCouleur: '#4E342E', adresse: '9, rue de Villiers, 78300 Poissy', telephone: '01 39 65 88 99' },

  // ── ÉLECTRICITÉ ──
  { nom: 'Électricité Blanchard', categorie: 'Électricité', catIcon: 'electrical_services', catCouleur: '#F9A825', adresse: '31, rue Charles-Maréchal, 78300 Poissy', telephone: '01 39 65 12 34' },
  { nom: 'SEB Électrique', categorie: 'Électricité', catIcon: 'electrical_services', catCouleur: '#F9A825', adresse: '8, avenue de la Maladrerie, 78300 Poissy', telephone: '01 30 06 78 90' },
  { nom: 'Pro-Élec Poissy', categorie: 'Électricité', catIcon: 'electrical_services', catCouleur: '#F9A825', adresse: '45, boulevard Victor-Hugo, 78300 Poissy', telephone: '06 34 56 78 90' },
  { nom: 'Éclairage & Domotique 78', categorie: 'Électricité', catIcon: 'electrical_services', catCouleur: '#F9A825', adresse: '3, place de la République, 78300 Poissy', telephone: '01 39 11 23 34' },

  // ── ÉBÉNISTERIE / TAPISSERIE ──
  { nom: 'Ébénisterie Renard', categorie: 'Ébénisterie / Tapisserie', catIcon: 'chair', catCouleur: '#6D4C41', adresse: '7, rue des Demoiselles, 78300 Poissy', telephone: '01 30 74 44 55' },
  { nom: 'Tapisserie Carpentier', categorie: 'Ébénisterie / Tapisserie', catIcon: 'chair', catCouleur: '#6D4C41', adresse: '19, rue au Pain, 78300 Poissy', telephone: '01 39 65 66 77' },
  { nom: 'Atelier du Meuble', categorie: 'Ébénisterie / Tapisserie', catIcon: 'chair', catCouleur: '#6D4C41', adresse: '2, impasse des Artisans, 78300 Poissy', telephone: '06 56 78 90 12' },

  // ── MENUISERIE / CHARPENTE ──
  { nom: 'Menuiserie Petit', categorie: 'Menuiserie / Charpente', catIcon: 'door_sliding', catCouleur: '#558B2F', adresse: '27, avenue Maurice-Berteaux, 78300 Poissy', telephone: '01 39 65 22 33' },
  { nom: 'Atelier Bois Poissy', categorie: 'Menuiserie / Charpente', catIcon: 'door_sliding', catCouleur: '#558B2F', adresse: '11, rue du 11-Novembre-1918, 78300 Poissy', telephone: '01 30 06 33 44' },
  { nom: 'Menuiserie Aluminium Moderne', categorie: 'Menuiserie / Charpente', catIcon: 'door_sliding', catCouleur: '#558B2F', adresse: '57, boulevard Robespierre, 78300 Poissy', telephone: '01 39 79 44 55' },
  { nom: 'Charpente Ile-de-France', categorie: 'Menuiserie / Charpente', catIcon: 'door_sliding', catCouleur: '#558B2F', adresse: '4, rue Gustave-Eiffel, 78300 Poissy', telephone: '01 30 74 55 66' },

  // ── NETTOYAGE / ENTRETIEN ──
  { nom: 'Net Propreté 78', categorie: 'Nettoyage / Entretien', catIcon: 'cleaning_services', catCouleur: '#0288D1', adresse: '13, avenue du Cep, 78300 Poissy', telephone: '01 30 65 55 66' },
  { nom: 'Éclat Nettoyage', categorie: 'Nettoyage / Entretien', catIcon: 'cleaning_services', catCouleur: '#0288D1', adresse: '25, rue Maryse-Bastié, 78300 Poissy', telephone: '01 39 11 77 88' },
  { nom: 'Propre Service Poissy', categorie: 'Nettoyage / Entretien', catIcon: 'cleaning_services', catCouleur: '#0288D1', adresse: '6, boulevard Devaux, 78300 Poissy', telephone: '06 67 89 01 23' },

  // ── PAYSAGISTE / JARDINAGE ──
  { nom: 'Jardins du Val de Seine', categorie: 'Paysagiste / Jardinage', catIcon: 'yard', catCouleur: '#2E7D32', adresse: '3, avenue Fernand-Lefebvre, 78300 Poissy', telephone: '01 39 65 44 55' },
  { nom: 'Vert Jardin Poissy', categorie: 'Paysagiste / Jardinage', catIcon: 'yard', catCouleur: '#2E7D32', adresse: '78, rue Charles-Maréchal, 78300 Poissy', telephone: '01 30 06 66 77' },
  { nom: 'Espaces Verts 78', categorie: 'Paysagiste / Jardinage', catIcon: 'yard', catCouleur: '#2E7D32', adresse: '15, rue de l\'Eglise, 78300 Poissy', telephone: '06 45 67 89 01' },
  { nom: 'Arboriste Poissy', categorie: 'Paysagiste / Jardinage', catIcon: 'yard', catCouleur: '#2E7D32', adresse: '20, avenue du Maréchal-Foch, 78300 Poissy', telephone: '01 30 74 11 22' },

  // ── PEINTURE / DÉCORATION ──
  { nom: 'Peinture Simon', categorie: 'Peinture / Décoration', catIcon: 'format_paint', catCouleur: '#6A1B9A', adresse: '43, rue du Général-de-Gaulle, 78300 Poissy', telephone: '01 39 65 55 66' },
  { nom: 'Décors & Couleurs', categorie: 'Peinture / Décoration', catIcon: 'format_paint', catCouleur: '#6A1B9A', adresse: '15, avenue du Cep, 78300 Poissy', telephone: '01 30 06 88 99' },
  { nom: 'Laurent Peinture', categorie: 'Peinture / Décoration', catIcon: 'format_paint', catCouleur: '#6A1B9A', adresse: '88, boulevard Victor-Hugo, 78300 Poissy', telephone: '06 89 01 23 45' },
  { nom: 'Revêtements Muraux Poissy', categorie: 'Peinture / Décoration', catIcon: 'format_paint', catCouleur: '#6A1B9A', adresse: '5, rue des Moutons, 78300 Poissy', telephone: '01 39 11 44 55' },

  // ── PLOMBERIE / SANITAIRE ──
  { nom: 'Plomberie Martin', categorie: 'Plomberie / Sanitaire', catIcon: 'plumbing', catCouleur: '#0097A7', adresse: '16, rue de la Gare, 78300 Poissy', telephone: '01 39 65 33 44' },
  { nom: 'Sanitaire Express 78', categorie: 'Plomberie / Sanitaire', catIcon: 'plumbing', catCouleur: '#0097A7', adresse: '32, avenue de la Maladrerie, 78300 Poissy', telephone: '01 30 74 77 88' },
  { nom: 'Plomb & Co', categorie: 'Plomberie / Sanitaire', catIcon: 'plumbing', catCouleur: '#0097A7', adresse: '9, boulevard Robespierre, 78300 Poissy', telephone: '06 12 23 34 45' },
  { nom: 'Dépannage Eau Poissy', categorie: 'Plomberie / Sanitaire', catIcon: 'plumbing', catCouleur: '#0097A7', adresse: '67, rue Charles-Maréchal, 78300 Poissy', telephone: '01 39 79 55 66' },

  // ── SERRURERIE / FERRONNERIE ──
  { nom: 'Serrurerie Dumont', categorie: 'Serrurerie / Ferronnerie', catIcon: 'lock', catCouleur: '#455A64', adresse: '4, rue aux Moutons, 78300 Poissy', telephone: '01 30 06 44 55' },
  { nom: 'Ouverture Urgence 78', categorie: 'Serrurerie / Ferronnerie', catIcon: 'lock', catCouleur: '#455A64', adresse: '11, place Georges-Pompidou, 78300 Poissy', telephone: '01 39 65 99 00' },
  { nom: 'Ferronnerie Artistique Poissy', categorie: 'Serrurerie / Ferronnerie', catIcon: 'lock', catCouleur: '#455A64', adresse: '28, rue du 8-Mai-1945, 78300 Poissy', telephone: '01 30 74 88 99' },

];
