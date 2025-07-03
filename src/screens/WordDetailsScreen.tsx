import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WordsStackParamList } from '../navigation/AppNavigator';
import { getWord } from '../api/verbs';
import { Verb, TensesE, Sentence } from '../api/types/verbs.type';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '../context/userContext';
import MatchWords, { MatchingWords } from '../components/MatchWords';

// Placeholder for quiz components
// import MultipleChoiceQuiz from '../components/MultipleChoiceQuiz';
// import MatchingWordQuiz from '../components/MatchingWordQuiz';
// import DragDropQuiz from '../components/DragDropQuiz';
// import WritingQuiz from '../components/WritingQuiz';

const tenseLabels = {
  [TensesE.presens]: 'Präsens',
  [TensesE.pastTense]: 'Präteritum',
  [TensesE.perfect]: 'Perfekt',
};

// Learn mode configuration
const learnMode = [
  { quizOpt: 'MatchWords', QuestionType: 'conjugation', tense: TensesE.presens },
  { quizOpt: 'DragDrop', QuestionType: 'conjugation', tense: TensesE.presens },
  { quizOpt: 'FillTheBlanks', QuestionType: 'conjugation', tense: TensesE.presens },
  { quizOpt: 'MultipleChoice', QuestionType: 'conjugation', tense: TensesE.presens },
  { quizOpt: 'DragDrop', QuestionType: 'sentences', tense: TensesE.presens },
  { quizOpt: 'MultipleChoice', QuestionType: 'sentences', tense: TensesE.presens },
  { quizOpt: 'MatchWords', QuestionType: 'conjugation', tense: TensesE.perfect },
  { quizOpt: 'DragDrop', QuestionType: 'conjugation', tense: TensesE.perfect },
  { quizOpt: 'FillTheBlanks', QuestionType: 'conjugation', tense: TensesE.perfect },
  { quizOpt: 'MultipleChoice', QuestionType: 'conjugation', tense: TensesE.perfect },
  { quizOpt: 'DragDrop', QuestionType: 'sentences', tense: TensesE.perfect },
  { quizOpt: 'MultipleChoice', QuestionType: 'sentences', tense: TensesE.perfect }
];

const WordDetailsScreen = () => {
  const route = useRoute<RouteProp<{ params: { word: string } }, 'params'>>();
  const navigation = useNavigation<StackNavigationProp<WordsStackParamList>>();
  const { userData } = useUser();
  const { word } = route.params;
  const [verb, setVerb] = useState<Verb | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  
  // Learn mode states
  const [isLearnModeActive, setIsLearnModeActive] = useState(false);
  const [learnModeQnumber, setLearnModeQnumber] = useState(0);
  const [showLearnModal, setShowLearnModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: word });
    setLoading(true);
    getWord({ word })
      .then(setVerb)
      .catch(() => setError('Not found'))
      .finally(() => setLoading(false));
  }, [word]);

  // Check if verb is learned
  const isVerbLearned = userData?.progress?.find(p => p.word === word);
  const learnProgress = isVerbLearned?.progress || 0;

  const handleLearnModeClick = () => {
    setIsLearnModeActive(true);
    setLearnModeQnumber(0);
    setShowLearnModal(true);
  };

  const handleQuizFinish = () => {
    if (isLearnModeActive && learnMode[learnModeQnumber + 1]) {
      setLearnModeQnumber(prev => prev + 1);
      // Continue to next quiz in learn mode
    } else {
      // Learn mode finished
      setIsLearnModeActive(false);
      setShowLearnModal(false);
      setLearnModeQnumber(0);
    }
  };

  const generateMatchingWords = (): MatchingWords[] => {
    const currentQuiz = learnMode[learnModeQnumber];
    if (!currentQuiz || !verb) return [];
    
    const conjugations = verb.conjugation[currentQuiz.tense];
    if (!conjugations || !Array.isArray(conjugations)) return [];
    
    return conjugations.map((c, idx) => {
      const [word, def, def2] = c.split(' ');
      return {
        word,
        def: `${def ?? ''} ${def2 ?? ''}`.trim(),
        id: idx.toString()
      };
    });
  };

  const renderActiveQuiz = () => {
    const currentQuiz = learnMode[learnModeQnumber];
    if (!currentQuiz) return null;

    switch (currentQuiz.quizOpt) {
      case 'MatchWords':
        return (
          <MatchWords
            tense={currentQuiz.tense}
            matchingWords={generateMatchingWords()}
            onQuizFinish={handleQuizFinish}
          />
        );
      case 'DragDrop':
      case 'FillTheBlanks':
      case 'MultipleChoice':
        return (
          <View style={styles.quizPlaceholder}>
            <MaterialCommunityIcons name="puzzle" size={64} color="#ccc" />
            <Text style={styles.quizPlaceholderText}>{currentQuiz.quizOpt} Component</Text>
            <Text style={styles.quizPlaceholderSubtext}>Will be implemented next</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={handleQuizFinish}>
              <Text style={styles.nextBtnText}>Weiter</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#f4631e" /></View>
    );
  }
  if (error || !verb) {
    return (
      <View style={styles.centered}><Text>{error || 'Not found'}</Text></View>
    );
  }

  return (
    <LinearGradient colors={['#f6f7fb', '#e3e9ff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <View style={styles.wordCard}>
          <MaterialCommunityIcons name="book-open-variant" size={36} color="#f4631e" style={{ marginBottom: 8 }} />
          <Text style={styles.word}>{verb.word}</Text>
          <Text style={styles.translation}>{verb.def.tr}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <FontAwesome5 name="exchange-alt" size={20} color="#2651ff" style={{ marginRight: 8 }} />
            <Text style={styles.sectionHeader}>Konjugation</Text>
          </View>
          {Object.values(TensesE).map((tense) =>
            Array.isArray(verb.conjugation[tense]) && verb.conjugation[tense].length > 0 ? (
              <View key={tense} style={styles.tenseBlock}>
                <Text style={styles.tenseHeader}>{tenseLabels[tense] || tense}</Text>
                <View style={styles.conjugationList}>
                  {verb.conjugation[tense].map((c, i) => (
                    <Text key={i} style={styles.conjugation}>{c}</Text>
                  ))}
                </View>
              </View>
            ) : null
          )}
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons name="comment-text-multiple-outline" size={20} color="#27ae60" style={{ marginRight: 8 }} />
            <Text style={styles.sectionHeader}>Beispielsätze</Text>
          </View>
          {Object.values(TensesE).map((tense) => {
            const sentences = Array.isArray(verb.sentences[tense]) ? verb.sentences[tense] : [];
            if (!sentences.length) return null;
            const showScroll = sentences.length > 3;
            return (
              <View key={tense} style={styles.tenseBlock}>
                <Text style={styles.tenseHeader}>{tenseLabels[tense] || tense}</Text>
                {showScroll ? (
                  <ScrollView 
                    style={styles.sentenceVerticalScroll} 
                    contentContainerStyle={styles.sentenceList} 
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    {sentences.map((s: Sentence, i: number) => (
                      <View key={i} style={styles.sentenceCard}>
                        <Text style={styles.sentence}>{s.sentence}</Text>
                        <Text style={styles.sentenceTr}>{s.def.tr}</Text>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.sentenceList}>
                    {sentences.map((s: Sentence, i: number) => (
                      <View key={i} style={styles.sentenceCard}>
                        <Text style={styles.sentence}>{s.sentence}</Text>
                        <Text style={styles.sentenceTr}>{s.def.tr}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons name="gamepad-variant-outline" size={20} color="#ff9f00" style={{ marginRight: 8 }} />
            <Text style={styles.sectionHeader}>Quiz</Text>
          </View>
          {isVerbLearned ? (
            // Show quiz types if verb is learned
            <>
              <View style={styles.quizBtnRow}>
                <TouchableOpacity style={[styles.quizBtn, { backgroundColor: '#2651ff' }]} onPress={() => setActiveQuiz('multiple')}><Text style={styles.quizBtnText}>Multiple Choice</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.quizBtn, { backgroundColor: '#27ae60' }]} onPress={() => setActiveQuiz('matching')}><Text style={styles.quizBtnText}>Matching Words</Text></TouchableOpacity>
              </View>
              <View style={styles.quizBtnRow}>
                <TouchableOpacity style={[styles.quizBtn, { backgroundColor: '#ff9f00' }]} onPress={() => setActiveQuiz('dragdrop')}><Text style={styles.quizBtnText}>Drag & Drop</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.quizBtn, { backgroundColor: '#f4631e' }]} onPress={() => setActiveQuiz('writing')}><Text style={styles.quizBtnText}>Fill the Blanks</Text></TouchableOpacity>
              </View>
            </>
          ) : (
            // Show learn mode button if verb is not learned
            <TouchableOpacity style={styles.learnModeBtn} onPress={handleLearnModeClick}>
              <MaterialCommunityIcons name="school" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.learnModeBtnText}>Lernen Modus</Text>
            </TouchableOpacity>
          )}
        </View>
        {activeQuiz && (
          <View style={styles.quizSection}>
            <Text style={styles.quizHeader}>Quiz: {activeQuiz}</Text>
            {renderActiveQuiz()}
          </View>
        )}
      </ScrollView>

      {/* Learn Mode Modal */}
      <Modal
        visible={showLearnModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLearnModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowLearnModal(false)} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.modalTitle}>Lernen Modus</Text>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>{learnModeQnumber + 1} / {learnMode.length}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${((learnModeQnumber + 1) / learnMode.length) * 100}%` }]} />
                </View>
              </View>
            </View>
            <View style={styles.closeBtn} />
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.quizTitle}>
              {learnMode[learnModeQnumber]?.quizOpt} - {tenseLabels[learnMode[learnModeQnumber]?.tense]} - {learnMode[learnModeQnumber]?.QuestionType}
            </Text>
            {renderActiveQuiz()}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  contentContainer: { padding: 18, paddingBottom: 32 },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 28,
    marginBottom: 28,
    alignItems: 'center',
    shadowColor: '#2651ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 10,
    transform: [{ scale: 1 }],
  },
  word: { fontSize: 36, fontWeight: 'bold', color: '#f4631e', marginBottom: 6, letterSpacing: 1.2, textShadowColor: '#ffe0d2', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 4 },
  translation: { fontSize: 22, color: '#2651ff', fontWeight: '600', marginBottom: 2, letterSpacing: 0.5 },
  section: { marginBottom: 32 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionHeader: { fontSize: 22, fontWeight: 'bold', color: '#222', letterSpacing: 0.5, borderLeftWidth: 5, borderLeftColor: '#f4631e', paddingLeft: 10 },
  tenseBlock: { marginBottom: 16, backgroundColor: '#fff', borderRadius: 14, padding: 14, shadowColor: '#27ae60', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  tenseHeader: { fontSize: 18, fontWeight: '600', color: '#2651ff', marginBottom: 6 },
  conjugationList: { flexDirection: 'column', gap: 2 },
  conjugation: { fontSize: 16, color: '#444', marginLeft: 8, marginBottom: 2 },
  sentenceList: { flexDirection: 'column', gap: 4 },
  sentenceCard: { backgroundColor: '#e3e9ff', borderRadius: 10, padding: 12, marginBottom: 8 },
  sentence: { fontSize: 16, color: '#222', marginBottom: 2 },
  sentenceTr: { color: '#888', fontSize: 14, fontStyle: 'italic' },
  quizBtnRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  quizBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, marginHorizontal: 4, alignItems: 'center', elevation: 2 },
  quizBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
  learnModeBtn: { 
    backgroundColor: '#f4631e', 
    borderRadius: 12, 
    paddingVertical: 16, 
    paddingHorizontal: 24, 
    alignItems: 'center', 
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#f4631e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  learnModeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 0.5 },
  quizSection: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginTop: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  quizHeader: { fontSize: 20, fontWeight: 'bold', color: '#f4631e', marginBottom: 8, textAlign: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sentenceVerticalScroll: {
    height: 180,
    marginBottom: 2,
  },
  // Modal styles
  modalContainer: { flex: 1, backgroundColor: '#f6f7fb' },
  modalHeader: { 
    backgroundColor: '#fff', 
    paddingTop: 40, 
    paddingBottom: 12, 
    paddingHorizontal: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  closeBtn: { padding: 6, width: 36 },
  headerContent: { flex: 1, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  progressContainer: { alignItems: 'center' },
  progressText: { fontSize: 12, color: '#666', marginBottom: 3 },
  progressBar: { 
    width: 150, 
    height: 4, 
    backgroundColor: '#e0e0e0', 
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: '#f4631e', 
    borderRadius: 2 
  },
  modalContent: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  quizTitle: { fontSize: 16, fontWeight: '600', color: '#222', marginBottom: 20, textAlign: 'center' },
  quizPlaceholder: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  quizPlaceholderText: { fontSize: 18, fontWeight: 'bold', color: '#ccc', marginTop: 16 },
  quizPlaceholderSubtext: { fontSize: 14, color: '#999', marginTop: 8, marginBottom: 30 },
  nextBtn: { 
    backgroundColor: '#f4631e', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 6 
  },
  nextBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});

export default WordDetailsScreen; 