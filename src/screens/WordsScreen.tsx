import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, ScrollView, Pressable } from 'react-native';
import api from '../api/api';
import { getApiBasePath, sortVerbsOrderLerning } from '../utils/util';
import { Verb } from '../api/types/verbs.type';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from '../components/CircularProgress';
import SpeakerIcon from '../assets/SpeakerIcon';
import WordCard from '../components/WordCard';
import { useNavigation } from '@react-navigation/native';

const BADGES = [
  { key: 'hasAkkObject', label: 'Has Akk Object', color: '#9d7ef5' },
  { key: 'hasDativObject', label: 'Has Dativ Object', color: '#4a90e2' },
  { key: 'isReflexiv', label: 'Reflexiv', color: '#5cd65c' },
  { key: 'isSeparable', label: 'Separable', color: '#ffa726' },
  { key: 'isModalVerb', label: 'Modal', color: '#2651ff' },
];

const fallbackImage = require('../assets/verbImageFallback.webp');

const WordsScreen: React.FC = () => {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchVerbs = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = `${getApiBasePath()}/get-verbs-with-level?level=A1`;
        const res = await api<Verb[]>(endpoint);
        if (res.success) {
          setVerbs(sortVerbsOrderLerning(res.data));
        } else {
          setError(res.message || 'Failed to fetch verbs');
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchVerbs();
  }, []);

  const handleWordPress = (word: string) => {
    navigation.navigate('WordDetails', { word });
  };

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" /></View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}><Text>Error: {error}</Text></View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc', padding: 8 }}>
      <Text style={styles.header}>Verbs</Text>
      <FlatList
        data={verbs}
        keyExtractor={item => item._id.$oid}
        renderItem={({ item }) => (
          <WordCard wordData={item} onNavigate={handleWordPress} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 12, color: '#222', textAlign: 'center' },
  listContent: { paddingBottom: 24 },
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
});

export default WordsScreen; 