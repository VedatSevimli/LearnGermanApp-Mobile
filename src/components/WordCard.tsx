import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import CircularProgress from './CircularProgress';
import { Ionicons } from '@expo/vector-icons';
import { geminiPrompt } from '../api/AI/gemini';
import { useUser } from '../context/userContext';

const BADGES = [
  { key: 'hasAkkObject', label: 'Akk', color: '#9d7ef5', info: 'Akkusativ' },
  { key: 'hasDativObject', label: 'Dativ', color: '#4a90e2', info: 'Dativ' },
  { key: 'isReflexiv', label: 'Reflexiv', color: '#5cd65c', info: 'Reflexiv' },
  { key: 'isSeparable', label: 'Separable', color: '#ffa726', info: 'Trennbare Verben' },
  { key: 'isModalVerb', label: 'Modal', color: '#2651ff', info: 'Modalverben' },
];

const fallbackImage = require('../assets/verbImageFallback.webp');

const WordCard = ({ wordData, onNavigate }: { wordData: any; onNavigate: (word: string) => void }) => {
  const { userData } = useUser();
  const [infoModal, setInfoModal] = useState<{ open: boolean; loading: boolean; info: string }>({ open: false, loading: false, info: '' });
  const [actionModal, setActionModal] = useState<{ open: boolean; infoMessage?: string }>({ open: false });
  const learnProgress = userData?.progress.find((p) => p.word === wordData.word)?.progress ?? 0;
  const status = learnProgress === 0 ? 'locked' : learnProgress >= 90 ? 'completed' : 'active';
  const isLocked = status === 'locked';
  const imageSource = wordData.imageUrl ? { uri: wordData.imageUrl } : fallbackImage;
  const exampleSentence = wordData.sentences?.presens?.[0]?.sentence;

  const handleSpeak = () => {
    Speech.speak(wordData.word, { language: 'de' });
  };

  const handleBadgeInfo = async (info: string) => {
    setInfoModal({ open: true, loading: true, info: '' });
    // Call Gemini API for explanation
    try {
      const prompt = `Erkläre mir bitte ${info} mit 5 einfachen deutschen Sätzen mit Verb ${wordData.word}. Du musst das auf Türkisch erklären.`;
      const res = await geminiPrompt(prompt);
      setInfoModal({ open: true, loading: false, info: res.output.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') });
    } catch (e) {
      setInfoModal({ open: true, loading: false, info: 'AI yanıtı alınamadı.' });
    }
  };

  const handleAction = () => {
    if (!userData) {
      setActionModal({ open: true });
    } else if (learnProgress >= 90) {
      setActionModal({ open: true, infoMessage: 'Congratulations! You have completed this word.' });
    } else {
      onNavigate(wordData.word);
    }
  };

  return (
    <View style={styles.outerCard}>
      <View style={styles.imageSection}>
        <Image source={imageSource} style={styles.verbImage} resizeMode="contain" />
      </View>
      <View style={styles.contentSection}>
        <View style={styles.wordSpeakerRow}>
          <Text style={styles.word}>{wordData.word}</Text>
          <TouchableOpacity style={styles.speakerBtn} onPress={handleSpeak} disabled={isLocked}>
            <Ionicons name="volume-high" size={28} color={isLocked ? '#b0b0b0' : '#007AFF'} />
          </TouchableOpacity>
        </View>
        <Text style={styles.translation}>{wordData.def.tr}</Text>
        <View style={styles.badgeProgressRow}>
          <View style={styles.badgeRow}>
            {BADGES.map(badge =>
              wordData[badge.key] ? (
                <TouchableOpacity key={badge.key} style={[styles.badge, { backgroundColor: badge.color }]} onPress={() => handleBadgeInfo(badge.info)}>
                  <Text style={styles.badgeText}>{badge.label}</Text>
                </TouchableOpacity>
              ) : null
            )}
          </View>
          <View style={styles.progressWrapper}>
            <CircularProgress percentage={learnProgress} size={38} color={status === 'completed' ? '#27ae60' : '#b0b0b0'} bgColor="#eee" label={learnProgress >= 90 ? '🏆' : undefined} />
            {isLocked && <Ionicons name="lock-closed" size={20} color="#b0b0b0" style={styles.lockIcon} />}
          </View>
        </View>
        {exampleSentence ? <Text style={styles.example}>{exampleSentence}</Text> : null}
        <Pressable style={styles.actionButton} android_ripple={{ color: '#fff' }} onPress={handleAction}>
          <Text style={styles.actionButtonText}>{learnProgress >= 90 ? '🏆' : 'lernen'}</Text>
        </Pressable>
      </View>
      {/* Info Modal */}
      <Modal visible={infoModal.open} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            {infoModal.loading ? <ActivityIndicator size="large" color="#f4631e" /> : <Text style={{ fontSize: 16 }}>{infoModal.info}</Text>}
            <Pressable style={styles.modalBtn} onPress={() => setInfoModal({ open: false, loading: false, info: '' })}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Action Modal */}
      <Modal visible={actionModal.open} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 16, marginBottom: 12 }}>{actionModal.infoMessage || 'You need to log in to continue.'}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Pressable style={[styles.modalBtn, { marginRight: 8 }]} onPress={() => setActionModal({ open: false })}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Exit</Text>
              </Pressable>
              <Pressable style={styles.modalBtn} onPress={() => { setActionModal({ open: false }); onNavigate(wordData.word); }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ff9f00',
    backgroundColor: '#fff',
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageSection: {
    backgroundColor: '#fff6ee',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 18,
    paddingBottom: 18,
    width: '100%',
  },
  verbImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  contentSection: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  wordSpeakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  word: { fontSize: 22, fontWeight: 'bold', color: '#222', textAlign: 'left' },
  speakerBtn: { padding: 4 },
  translation: { fontSize: 16, color: '#555', marginBottom: 4, textAlign: 'left' },
  badgeProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 8,
    marginBottom: 4,
  },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  progressWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    position: 'relative',
  },
  lockIcon: {
    position: 'absolute',
    top: 9,
    left: 9,
  },
  example: { fontSize: 15, color: '#666', fontStyle: 'italic', marginBottom: 8, textAlign: 'left' },
  actionButton: {
    backgroundColor: '#f4631e',
    borderRadius: 7,
    marginTop: 6,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    minWidth: 240,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  modalBtn: {
    backgroundColor: '#f4631e',
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 16,
    alignItems: 'center',
  },
});

export default WordCard; 