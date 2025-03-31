
class AudioService {
  private audioElement: HTMLAudioElement | null = null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio('/meditation-sound.mp3');
      this.audioElement.loop = true;
    }
  }
  
  play() {
    if (this.audioElement) {
      this.audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }
  
  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }
  
  isPlaying() {
    return this.audioElement ? !this.audioElement.paused : false;
  }
  
  setVolume(volume: number) {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

export const audioService = new AudioService();
