export function speakSentence(
    sentence: string,
    options?: { lang?: string; rate?: number; pitch?: number; volume?: number }
): SpeechSynthesisUtterance {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = options?.lang ?? 'de-DE';
    utterance.rate = options?.rate ?? 0.5; // Speech rate (default is 1.0, higher values are faster)
    utterance.pitch = options?.pitch ?? 1.0; // Speech pitch (default is 1.0, higher values are higher pitch)
    utterance.volume = options?.volume ?? 1.0; // Speech volume (default is 1.0, range is 0.0 to 1.0)

    function startSpeech(utterance: SpeechSynthesisUtterance) {
        window.speechSynthesis.speak(utterance);
    }

    function pauseSpeech() {
        window.speechSynthesis.pause();
    }

    function resumeSpeech() {
        window.speechSynthesis.resume();
    }

    function stopSpeech() {
        window.speechSynthesis.cancel();
    }

    utterance.onpause = pauseSpeech;
    utterance.onresume = resumeSpeech;

    synth.speak(utterance);
    return utterance;
}
