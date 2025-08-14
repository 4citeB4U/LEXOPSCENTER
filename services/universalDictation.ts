// Universal Dictation Service - Works with any input field across all views
export class UniversalDictation {
  private recognition: SpeechRecognition | null = null;
  private currentInput: HTMLInputElement | HTMLTextAreaElement | null = null;
  private autoSendTimer: NodeJS.Timeout | null = null;
  private isListening = false;

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateInputDictatingState(true);
        console.log('Universal dictation started');
      };

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (this.currentInput) {
          // Show interim results
          this.currentInput.value = finalTranscript + interimTranscript;
          
          // If we have final results, start auto-send timer
          if (finalTranscript && !this.autoSendTimer) {
            this.startAutoSendTimer();
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.stopDictation();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateInputDictatingState(false);
        console.log('Universal dictation ended');
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private updateInputDictatingState(isDictating: boolean) {
    if (this.currentInput) {
      this.currentInput.setAttribute('data-dictating', isDictating.toString());
    }
  }

  private startAutoSendTimer() {
    // Clear any existing timer
    if (this.autoSendTimer) {
      clearTimeout(this.autoSendTimer);
    }

    // Start 5-second countdown
    this.autoSendTimer = setTimeout(() => {
      this.autoSend();
    }, 5000);
  }

  private autoSend() {
    if (this.currentInput) {
      // Trigger appropriate action based on input type
      this.triggerAutoSend(this.currentInput);
      this.stopDictation();
    }
  }

  private triggerAutoSend(input: HTMLInputElement | HTMLTextAreaElement) {
    // Find the closest form or search button
    const form = input.closest('form');
    const searchButton = input.closest('.search-container')?.querySelector('button[type="submit"], button:contains("Search")');
    const parentContainer = input.parentElement;
    
    if (form) {
      // Submit the form
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    } else if (searchButton) {
      // Click the search button
      searchButton.click();
    } else if (parentContainer) {
      // Look for a search button in the parent container
      const searchBtn = parentContainer.querySelector('button:contains("Search"), button[onclick*="search"], button[onclick*="Search"]');
      if (searchBtn) {
        searchBtn.click();
      } else {
        // Trigger Enter key event as fallback
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
      }
    } else {
      // Trigger Enter key event as final fallback
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
    }
  }

  public startDictation(input: HTMLInputElement | HTMLTextAreaElement) {
    if (!this.recognition) {
      console.warn('Speech recognition not available');
      return false;
    }

    // Stop any existing dictation
    this.stopDictation();

    // Set current input
    this.currentInput = input;
    
    // Focus the input
    input.focus();
    
    // Start recognition
    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start dictation:', error);
      return false;
    }
  }

  public stopDictation() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    
    if (this.autoSendTimer) {
      clearTimeout(this.autoSendTimer);
      this.autoSendTimer = null;
    }
    
    this.updateInputDictatingState(false);
    this.currentInput = null;
    this.isListening = false;
  }

  public isActive(): boolean {
    return this.isListening;
  }

  public getCurrentInput(): HTMLInputElement | HTMLTextAreaElement | null {
    return this.currentInput;
  }

  public getRemainingTime(): number {
    if (!this.autoSendTimer) return 0;
    // This is a simplified version - in a real implementation you'd track the actual remaining time
    return 5;
  }
}

// Global instance
export const universalDictation = new UniversalDictation();

// Helper function to make any input dictation-enabled
export function makeInputDictationEnabled(input: HTMLInputElement | HTMLTextAreaElement) {
  // Add click handler to start dictation
  input.addEventListener('click', () => {
    // Only start dictation if mic button is active
    const micButton = document.querySelector('[data-mic-active="true"]');
    if (micButton) {
      universalDictation.startDictation(input);
    }
  });

  // Add visual indicator
  input.setAttribute('data-dictation-enabled', 'true');
  input.classList.add('dictation-enabled');
}

// Helper function to check if input supports dictation
export function supportsDictation(input: HTMLInputElement | HTMLTextAreaElement): boolean {
  return input.hasAttribute('data-dictation-enabled') || 
         input.classList.contains('dictation-enabled');
}

// Helper function to enable dictation on all inputs in a container
export function enableDictationOnContainer(container: HTMLElement) {
  const inputs = container.querySelectorAll('input[type="text"], input[type="search"], textarea');
  inputs.forEach(input => {
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      makeInputDictationEnabled(input);
    }
  });
}
