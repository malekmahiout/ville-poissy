import { Component, OnInit, OnDestroy, NgZone, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SignalementService } from '../../services/signalement.service';
import { GroqService } from '../../services/groq.service';
import { CATEGORIES_SIGNALEMENT, MODULE_PM_SOUS_CATEGORIES } from '../../models/signalement.model';
import { Geolocation } from '@capacitor/geolocation';
import { switchMap } from 'rxjs/operators';
import * as L from 'leaflet';

@Component({
  selector: 'app-signalement-create',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatRippleModule, MatSnackBarModule, NgFor, NgIf, DecimalPipe, HttpClientModule],
  templateUrl: './signalement-create.component.html',
  styleUrl: './signalement-create.component.scss'
})
export class SignalementCreateComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  categories = CATEGORIES_SIGNALEMENT;
  modulePMSousCategories = MODULE_PM_SOUS_CATEGORIES;

  selectedCategory: string | null = null;
  selectedCategoryIcon = 'report_problem';
  selectedPMSousCategorie: string | null = null;
  description = '';
  photo: string | null = null;
  lat: number | null = null;
  lng: number | null = null;
  adresse = '';

  isLocating = false;
  isSubmitting = false;
  locationError = '';

  // Voice
  isRecording = false;
  isProcessingVoice = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  get showPMSubcategories(): boolean {
    return this.selectedCategory === 'module-pm';
  }

  constructor(
    private signalementService: SignalementService,
    private groqService: GroqService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Map initialised after GPS
  }

  ngOnDestroy(): void {
    if (this.map) { this.map.remove(); this.map = null; }
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream?.getTracks().forEach(t => t.stop());
    }
  }

  selectCategory(cat: typeof CATEGORIES_SIGNALEMENT[0]): void {
    this.selectedCategory = cat.id;
    this.selectedCategoryIcon = cat.icon;
    if (cat.id !== 'module-pm') this.selectedPMSousCategorie = null;
  }

  async getLocation(): Promise<void> {
    this.isLocating = true;
    this.locationError = '';
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'denied') {
        this.ngZone.run(() => {
          this.locationError = 'Permission refusée. Activez la géolocalisation dans les paramètres.';
          this.isLocating = false;
        });
        return;
      }
      const position = await Geolocation.getCurrentPosition({ timeout: 15000, enableHighAccuracy: true });
      this.ngZone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.adresse = `${this.lat.toFixed(5)}, ${this.lng.toFixed(5)}`;
        this.isLocating = false;
        setTimeout(() => this.initMap(), 200);
      });
    } catch {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.ngZone.run(() => {
              this.lat = pos.coords.latitude;
              this.lng = pos.coords.longitude;
              this.adresse = `${this.lat.toFixed(5)}, ${this.lng.toFixed(5)}`;
              this.isLocating = false;
              setTimeout(() => this.initMap(), 200);
            });
          },
          () => {
            this.ngZone.run(() => {
              this.locationError = 'Impossible d\'obtenir la position. Vérifiez les permissions GPS.';
              this.isLocating = false;
            });
          },
          { timeout: 15000, enableHighAccuracy: true }
        );
      } else {
        this.ngZone.run(() => {
          this.locationError = 'Géolocalisation non disponible.';
          this.isLocating = false;
        });
      }
    }
  }

  private initMap(): void {
    if (!this.lat || !this.lng || !this.mapContainer) return;
    if (this.map) { this.map.remove(); this.map = null; }

    // Fix Leaflet icon paths
    const iconDefault = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    this.map = L.map(this.mapContainer.nativeElement, { zoomControl: true, attributionControl: false }).setView([this.lat, this.lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([this.lat, this.lng], { icon: iconDefault, draggable: true }).addTo(this.map);
    this.marker.on('dragend', (e: any) => {
      const pos = e.target.getLatLng();
      this.ngZone.run(() => {
        this.lat = pos.lat;
        this.lng = pos.lng;
        this.adresse = `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`;
      });
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.ngZone.run(() => {
        this.lat = lat;
        this.lng = lng;
        this.adresse = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        this.marker?.setLatLng([lat, lng]);
      });
    });
  }

  // ─── VOICE ───
  async demarrerVoice(): Promise<void> {
    if (!this.groqService.hasApiKey()) {
      this.snackBar.open('Configurez votre clé API Groq dans les paramètres', 'Fermer', { duration: 3000 });
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.snackBar.open('Microphone non supporté. Vérifiez que l\'appli est bien en HTTPS/contexte sécurisé.', 'Fermer', { duration: 4000 });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
            ? 'audio/mp4'
            : '';
      this.mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (err: any) {
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        this.snackBar.open('Permission microphone refusée. Autorisez l\'accès dans les paramètres de l\'appli.', 'Fermer', { duration: 5000 });
      } else if (err?.name === 'NotFoundError') {
        this.snackBar.open('Aucun microphone détecté sur cet appareil.', 'Fermer', { duration: 3000 });
      } else {
        this.snackBar.open('Microphone non disponible : ' + (err?.message || err?.name || 'erreur inconnue'), 'Fermer', { duration: 4000 });
      }
    }
  }

  arreterVoice(): void {
    if (!this.mediaRecorder) return;
    this.mediaRecorder.onstop = () => {
      this.ngZone.run(() => {
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.transcrire(blob);
      });
    };
    this.mediaRecorder.stop();
    this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
    this.isRecording = false;
  }

  transcrire(blob: Blob): void {
    this.isProcessingVoice = true;
    const file = new File([blob], 'signalement.webm', { type: 'audio/webm' });
    this.groqService.transcribeAudio(file).pipe(
      switchMap(text => this.groqService.reformulerSignalement(text))
    ).subscribe({
      next: (texte) => {
        this.ngZone.run(() => {
          this.description = texte;
          this.isProcessingVoice = false;
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.isProcessingVoice = false;
          this.snackBar.open('Erreur lors de la transcription', 'Fermer', { duration: 3000 });
        });
      }
    });
  }

  async takePhoto(): Promise<void> {
    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      this.photo = image.dataUrl || null;
    } catch {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => { this.ngZone.run(() => { this.photo = reader.result as string; }); };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  }

  removePhoto(): void { this.photo = null; }

  isFormValid(): boolean {
    if (!this.selectedCategory) return false;
    if (this.selectedCategory === 'module-pm' && !this.selectedPMSousCategorie) return false;
    return !!this.description.trim();
  }

  submit(): void {
    if (!this.isFormValid()) {
      this.snackBar.open('Veuillez remplir la catégorie et la description.', 'Fermer', { duration: 3000 });
      return;
    }
    this.isSubmitting = true;
    const cat = this.categories.find(c => c.id === this.selectedCategory);
    const categorieLabel = this.selectedCategory === 'module-pm' && this.selectedPMSousCategorie
      ? `Module PM – ${this.selectedPMSousCategorie}` : cat?.label || '';

    this.signalementService.create({
      categorie: categorieLabel,
      categorieIcon: this.selectedCategoryIcon,
      description: this.description,
      photo: this.photo || undefined,
      lat: this.lat || undefined,
      lng: this.lng || undefined,
      adresse: this.adresse || undefined,
    });

    this.snackBar.open('Signalement envoyé !', 'OK', { duration: 2500 });
    this.router.navigate(['/signalements']);
  }

  goBack(): void { this.router.navigate(['/signalements']); }
}
