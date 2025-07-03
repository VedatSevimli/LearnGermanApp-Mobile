import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TensesE } from '../api/types/verbs.type';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type MatchingWords = {
  word: string;
  def: string;
  id: string;
};

export type MatchWordsProps = {
  tense: TensesE;
  matchingWords: MatchingWords[];
  onQuizFinish?: () => void;
};

const MatchWords: React.FC<MatchWordsProps> = ({
  onQuizFinish,
  matchingWords,
  tense
}) => {
  const [shuffledWords, setShuffledWords] = useState<MatchingWords[]>([]);
  const [shuffledDefs, setShuffledDefs] = useState<MatchingWords[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [selectedDefinition, setSelectedDefinition] = useState<string>('');
  const [matchedPairs, setMatchedPairs] = useState<{ wordId?: string; definitionId?: string }[]>([]);

  useEffect(() => {
    setMatchedPairs([]);
    setShuffledWords([]);
    setShuffledDefs([]);
  }, [matchingWords]);

  useEffect(() => {
    if (matchingWords.length > 0) {
      shuffleWords();
    }
  }, [matchingWords]);

  useEffect(() => {
    if (matchedPairs.length === matchingWords?.length) {
      onQuizFinish?.();
    }
  }, [matchedPairs, matchingWords?.length, onQuizFinish]);

  const shuffleWords = () => {
    const shuffledW = [...matchingWords].sort(() => Math.random() - 0.5);
    const shuffledD = [...matchingWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffledW);
    setShuffledDefs(shuffledD);
  };

  const handleWordClick = (word: MatchingWords) => {
    setSelectedWord(word.id);
    setSelectedDefinition('');
  };

  const handleDefinitionClick = (definition: MatchingWords) => {
    setSelectedDefinition(definition.id);
    if (selectedWord) {
      checkMatch(selectedWord, definition.id);
    }
  };

  const checkMatch = (wordId: string, definitionId: string) => {
    const matchingWord = shuffledWords.find(
      (word) => word.id === definitionId && word.id === wordId
    );
    if (matchingWord?.id === wordId) {
      setSelectedWord('');
      setSelectedDefinition('');
      setMatchedPairs((prev) => [...prev, { wordId, definitionId }]);
    } else {
      setTimeout(() => {
        setSelectedDefinition('');
      }, 500);
    }
  };

  const getCardStyle = (wordObj: MatchingWords, isWord: boolean): any => {
    const isSelected = isWord ? selectedWord === wordObj.id : selectedDefinition === wordObj.id;
    const isMatched = matchedPairs.some(
      (pair) => pair.definitionId === wordObj.id && pair.wordId === wordObj.id
    );
    const isNotMatched = selectedDefinition && selectedDefinition === wordObj.id && !isMatched;

    if (isMatched) {
      return [styles.card, styles.matchedCard];
    } else if (isNotMatched) {
      return [styles.card, styles.notMatchedCard];
    } else if (isSelected) {
      return [styles.card, styles.selectedCard];
    } else {
      return [styles.card, styles.defaultCard];
    }
  };

  const getTenseLabel = (tense: TensesE): string => {
    switch (tense) {
      case TensesE.presens: return 'Präsens';
      case TensesE.pastTense: return 'Präteritum';
      case TensesE.perfect: return 'Perfekt';
      default: return tense;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="puzzle" size={24} color="#2651ff" />
        <Text style={styles.title}>Match the Words</Text>
        <Text style={styles.subtitle}>{getTenseLabel(tense)}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {matchedPairs.length} / {matchingWords.length} matched
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(matchedPairs.length / matchingWords.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Words</Text>
          <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
            {shuffledWords.map((wordObj) => (
              <TouchableOpacity
                key={wordObj.id}
                style={getCardStyle(wordObj, true)}
                onPress={() => handleWordClick(wordObj)}
                disabled={matchedPairs.some(pair => pair.wordId === wordObj.id)}
              >
                <Text style={styles.cardText}>{wordObj.word}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.column}>
          <Text style={styles.columnTitle}>Definitions</Text>
          <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
            {shuffledDefs.map((wordObj, index) => (
              <TouchableOpacity
                key={`${wordObj.id}-${index}`}
                style={getCardStyle(wordObj, false)}
                onPress={() => handleDefinitionClick(wordObj)}
                disabled={matchedPairs.some(pair => pair.definitionId === wordObj.id)}
              >
                <Text style={styles.cardText}>{wordObj.def}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {matchedPairs.length === matchingWords.length && (
        <View style={styles.completionContainer}>
          <MaterialCommunityIcons name="check-circle" size={48} color="#27ae60" />
          <Text style={styles.completionText}>All words matched!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    padding: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
  },
  card: {
    padding: 10,
    marginBottom: 6,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  defaultCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCard: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  matchedCard: {
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
    borderColor: '#27ae60',
  },
  notMatchedCard: {
    backgroundColor: '#ffebee',
    borderWidth: 2,
    borderColor: '#f44336',
  },
  cardText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
    lineHeight: 16,
  },
  completionContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  completionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 6,
  },
});

export default MatchWords; 