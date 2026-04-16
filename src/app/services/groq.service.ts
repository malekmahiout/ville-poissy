import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const DEFAULT_KEY = environment.groqApiKey;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class GroqService {
  private WHISPER_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
  private CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(private http: HttpClient) {}

  getApiKey(): string { return localStorage.getItem('groq_api_key') || DEFAULT_KEY; }
  setApiKey(key: string): void { localStorage.setItem('groq_api_key', key); }
  hasApiKey(): boolean { return !!this.getApiKey(); }

  transcribeAudio(audioFile: File): Observable<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) return throwError(() => new Error('Clé API Groq manquante.'));
    const formData = new FormData();
    formData.append('file', audioFile, audioFile.name);
    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'fr');
    const headers = new HttpHeaders({ Authorization: `Bearer ${apiKey}` });
    return this.http.post<any>(this.WHISPER_URL, formData, { headers }).pipe(map(res => res.text));
  }

  reformulerSignalement(transcription: string): Observable<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) return throwError(() => new Error('Clé API Groq manquante.'));
    const systemPrompt = `Tu es un assistant pour l'application mobile de la ville de Poissy.
Tu reformules la description vocale d'un signalement de voirie en texte clair et professionnel.
Retourne UNIQUEMENT la description reformulée (1 à 3 phrases), sans titre ni liste.
Sois précis, factuel et concis.`;
    const body = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcription }
      ],
      temperature: 0.3
    };
    const headers = new HttpHeaders({ Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' });
    return this.http.post<any>(this.CHAT_URL, body, { headers }).pipe(map(res => res.choices[0].message.content));
  }

  chatPoissy(messages: ChatMessage[], contextWeb?: string): Observable<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) return throwError(() => new Error('Clé API Groq manquante.'));

    const systemPrompt = `Tu es Poissy AI, l'assistant intelligent officiel de la ville de Poissy (78300, Yvelines, Île-de-France).
Tu réponds exclusivement en français, de façon claire, chaleureuse et utile.
Tu es spécialisé sur tout ce qui concerne Poissy : histoire, culture, services municipaux, démarches, agenda, vie pratique.

=== CONNAISSANCES SUR POISSY ===

**Identité de la ville**
- Poissy est une commune de ~40 000 habitants en bord de Seine, dans les Yvelines (78300).
- Maire actuel : Karl Olive (depuis 2014)
- Hôtel de Ville : Place du Maréchal Foch, 78300 Poissy — Tél. 01 39 22 31 00
- Site officiel : www.ville-poissy.fr

**Histoire et patrimoine**
- Poissy est célèbre pour être le lieu de naissance du roi Saint Louis (1214).
- La Collégiale Notre-Dame (XIIe siècle) est un joyau de l'architecture romane et gothique, classée Monument Historique.
- La Villa Savoye (1931), chef-d'œuvre de Le Corbusier, est classée au Patrimoine mondial de l'UNESCO.
- La Maison de Fer (années 1890) témoigne de l'architecture industrielle de la fin du XIXe siècle.
- L'usine Talbot (ex-Simca) a marqué l'histoire industrielle de la ville au XXe siècle.

**Cadre de vie**
- La ville est traversée par la Seine avec des berges aménagées pour la promenade et les sports nautiques.
- Le Parc Meissonier est le principal espace vert en cœur de ville.
- La forêt de Saint-Germain est accessible à proximité.

**Culture et loisirs**
- Musée du Jouet : plus de 12 000 jouets à travers les siècles, ouvert toute l'année.
- Palais des Congrès de Poissy : salle de spectacles, séminaires et événements.
- Salle des fêtes, médiathèque, conservatoire municipal.
- Orchestre de Poissy : ensemble musical renommé d'Île-de-France.

**Services municipaux**
- État civil, urbanisme, permis de construire : Hôtel de Ville
- Police Municipale : 01 39 22 31 80 (accès 24h/24)
- SAMU : 15 | Pompiers : 18 | Police Nationale : 17 | Urgences européen : 112
- Déchèterie de Poissy : Route de Chanteloup
- Collecte des ordures ménagères : consultable sur www.ville-poissy.fr
- Signalement de problèmes (voirie, propreté) : via l'appli Ville de Poissy

**Transports**
- RER A : gare de Poissy (ligne A, zone 4)
- Transilien ligne J : Paris Saint-Lazare → Poissy
- Bus : réseau Albatrans + lignes CIF
- Autoroute A13 / A14 à proximité

**Écoles et enseignement**
- Nombreuses écoles maternelles et primaires municipales
- Collèges : collège Meissonier, collège de la Coudraie, etc.
- Lycées : lycée Simone Weil (général), lycée Evariste Galois (technologique et professionnel)

**Sports**
- AS Poissy (football) : club historique de la ville
- Piscine municipale de Poissy
- Tennis, rugby, natation, arts martiaux, etc.
- Stade Municipal, gymnases couverts

**Démarches administratives fréquentes**
- Actes d'état civil (naissance, mariage, décès) : Hôtel de Ville
- Inscription sur les listes électorales : Hôtel de Ville
- Permis de construire / déclaration de travaux : service urbanisme
- Restauration scolaire et activités périscolaires : service enfance
- Carte de stationnement résidentiel : service voirie

${contextWeb ? `=== ACTUALITÉS ET CONTENUS RÉCENTS DU SITE OFFICIEL ===\n${contextWeb}\n` : ''}

**Instructions**
- Si la question ne concerne pas Poissy ou ses environs immédiats, réponds brièvement que tu es spécialisé sur Poissy.
- Pour les urgences médicales ou sécuritaires, indique toujours les numéros d'urgence.
- Si tu ne sais pas quelques chose de précis, dirige l'utilisateur vers www.ville-poissy.fr ou le 01 39 22 31 00.
- Sois concis et pratique. Utilise des listes à puces quand c'est plus lisible.`;

    const body = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.5,
      max_tokens: 1024
    };
    const headers = new HttpHeaders({ Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' });
    return this.http.post<any>(this.CHAT_URL, body, { headers }).pipe(
      map(res => res.choices[0].message.content as string)
    );
  }
}
