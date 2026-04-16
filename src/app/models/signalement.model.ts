export type StatutSignalement = 'nouveau' | 'en-cours' | 'traite';

export interface Signalement {
  id: string;
  categorie: string;
  categorieIcon: string;
  description: string;
  photo?: string;
  lat?: number;
  lng?: number;
  adresse?: string;
  statut: StatutSignalement;
  dateCreation: string;
  dateIntervention?: string;
}

export const CATEGORIES_SIGNALEMENT = [
  { id: 'proprete', label: 'Propreté', icon: 'delete_outline', color: '#4CAF50' },
  { id: 'depot-sauvage', label: 'Dépôt sauvage', icon: 'delete_forever', color: '#FF5722' },
  { id: 'eau-assainissement', label: 'Eau et assainissement', icon: 'water_drop', color: '#2196F3' },
  { id: 'desordre-technique', label: 'Désordre technique', icon: 'build', color: '#9C27B0' },
  { id: 'circulation', label: 'Circulation / Stationnement', icon: 'traffic', color: '#FF9800' },
  { id: 'risques-naturels', label: 'Risques naturels', icon: 'nature', color: '#795548' },
  { id: 'voiture-epave', label: 'Voiture épave / tampon', icon: 'directions_car', color: '#607D8B' },
  { id: 'module-pm', label: 'Module PM', icon: 'local_police', color: '#1565C0' },
];

export const MODULE_PM_SOUS_CATEGORIES = [
  'Stationnement gênant',
  'Véhicules ventouses / épaves',
  'Squats ou bivouacs',
  'Bruit',
  'Nuisances de commerces',
  'Problèmes de circulation',
];
