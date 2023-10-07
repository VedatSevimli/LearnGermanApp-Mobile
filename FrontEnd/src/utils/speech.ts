export function speakSentence(sentence: string) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'de-DE';
    utterance.rate = 0.5; // Speech rate (default is 1.0, higher values are faster)
    utterance.pitch = 1.0; // Speech pitch (default is 1.0, higher values are higher pitch)
    utterance.volume = 1.0; // Speech volume (default is 1.0, range is 0.0 to 1.0)
    synth.speak(utterance);
}
