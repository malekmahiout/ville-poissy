import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgFor, NgIf } from '@angular/common';
import { GroqService, ChatMessage } from '../../services/groq.service';
import { ActualitesService } from '../../services/actualites.service';

interface UiMessage {
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
}

const SUGGESTIONS = [
  'Quels sont les horaires de l\'Hôtel de Ville ?',
  'Comment contacter la police municipale ?',
  'Que visiter à Poissy ?',
  'Comment faire une déclaration de naissance ?',
  'Où se trouve la Villa Savoye ?',
  'Quels sports peut-on pratiquer à Poissy ?',
];

@Component({
  selector: 'app-poissy-ai',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatRippleModule, MatSnackBarModule, NgFor, NgIf],
  templateUrl: './poissy-ai.component.html',
  styleUrl: './poissy-ai.component.scss',
})
export class PoissynAiComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;
  @ViewChild('inputRef') inputRef!: ElementRef;

  messages: UiMessage[] = [];
  inputText = '';
  isLoading = false;
  suggestions = SUGGESTIONS;
  showSuggestions = true;
  webContext = '';

  // Voice
  isRecording = false;
  isProcessingVoice = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  private history: ChatMessage[] = [];

  constructor(
    private groq: GroqService,
    private actualitesService: ActualitesService,
    private router: Router,
    private ngZone: NgZone,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Load web context silently
    this.actualitesService.getRawTextForAI().subscribe(text => {
      this.webContext = text;
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch {}
  }

  sendMessage(text?: string): void {
    const content = (text || this.inputText).trim();
    if (!content || this.isLoading) return;

    this.inputText = '';
    this.showSuggestions = false;

    this.messages.push({ role: 'user', content });
    this.history.push({ role: 'user', content });

    const loadingMsg: UiMessage = { role: 'assistant', content: '', loading: true };
    this.messages.push(loadingMsg);
    this.isLoading = true;

    this.groq.chatPoissy(this.history, this.webContext || undefined).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          const idx = this.messages.indexOf(loadingMsg);
          if (idx !== -1) this.messages[idx] = { role: 'assistant', content: response };
          this.history.push({ role: 'assistant', content: response });
          this.isLoading = false;
        });
      },
      error: () => {
        this.ngZone.run(() => {
          const idx = this.messages.indexOf(loadingMsg);
          if (idx !== -1) this.messages[idx] = { role: 'assistant', content: 'Désolé, une erreur est survenue. Vérifiez votre connexion internet.' };
          this.isLoading = false;
        });
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearConversation(): void {
    this.messages = [];
    this.history = [];
    this.showSuggestions = true;
  }

  // ─── VOICE DICTATION ───
  async toggleVoice(): Promise<void> {
    if (this.isRecording) {
      this.arreterVoice();
    } else {
      await this.demarrerVoice();
    }
  }

  async demarrerVoice(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.snackBar.open('Microphone non supporté par ce navigateur.', 'Fermer', { duration: 4000 });
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
        this.snackBar.open('Permission microphone refusée. Autorisez l\'accès dans les paramètres.', 'Fermer', { duration: 5000 });
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
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        this.transcrireEtEnvoyer(blob, mimeType);
      });
    };
    this.mediaRecorder.stop();
    this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
    this.isRecording = false;
  }

  transcrireEtEnvoyer(blob: Blob, mimeType: string): void {
    this.isProcessingVoice = true;
    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const file = new File([blob], `dictee.${ext}`, { type: mimeType });
    this.groq.transcribeAudio(file).subscribe({
      next: (texte) => {
        this.ngZone.run(() => {
          this.isProcessingVoice = false;
          if (texte.trim()) {
            this.sendMessage(texte.trim());
          }
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.isProcessingVoice = false;
          this.snackBar.open('Erreur lors de la transcription vocale.', 'Fermer', { duration: 3000 });
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream?.getTracks().forEach(t => t.stop());
    }
  }

  goBack(): void { this.router.navigate(['/home']); }
}
