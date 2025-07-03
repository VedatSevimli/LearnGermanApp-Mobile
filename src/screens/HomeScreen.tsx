import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from '../navigation/AppNavigator';
import LoginIcon from '../assets/LoginIcon';
import QuizIcon from '../assets/QuizIcon';
import ReadingIcon from '../assets/ReadingIcon';
import Svg, { Path } from 'react-native-svg';
import quizImage from '../assets/quiz.webp';
import readingImage from '../assets/reading.jpg';
import listeningImage from '../assets/listening.webp';
import wordsImage from '../assets/words.jpg';

const windowWidth = Dimensions.get('window').width;

const icons = {
  login: LoginIcon,
  words: require('../assets/words.jpg'),
  dashboard: require('../assets/logo.png'),
  quiz: QuizIcon,
  reading: ReadingIcon,
};

const ArrowIcon = (props: any) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M8 5l7 7-7 7" stroke="#bbb" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

type Props = NativeStackScreenProps<RootTabParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const cardAnim = useRef(new Animated.Value(0.95)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, friction: 6 }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={["#f8fafc", "#e0e7ff", "#f8fafc"]}
      style={styles.background}
    >
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.banner}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>🇩🇪 Learn German App 🇩🇪</Text>
        </View>
        <Text style={styles.subtitle}>Mit unserer App kannst du schnell und interaktiv Deutsch lernen. Entdecke 1000+ Verben, spannende Quizze, Lese- und Hörübungen!</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuresRow}>
          <FeatureCard image={require('../assets/words.jpg')} title="Wörter" description="Erweitere deinen Wortschatz mit wichtigen deutschen Verben und Substantiven." />
          <FeatureCard image={require('../assets/quiz.webp')} title="Quiz" description="Teste dein Wissen mit abwechslungsreichen Quizzen und Übungen." />
          <FeatureCard image={require('../assets/reading.jpg')} title="Lesen" description="Verbessere dein Leseverständnis mit interessanten Texten." />
          <FeatureCard image={require('../assets/listening.webp')} title="Hören" description="Trainiere dein Hörverständnis mit authentischen Audioinhalten." />
        </ScrollView>
        <Text style={styles.footer}>© {new Date().getFullYear()} Learn German App</Text>
      </ScrollView>
    </LinearGradient>
  );
};

type HomeButtonProps = {
  icon: any;
  label: string;
  color: string;
  onPress: () => void;
  isSvg?: boolean;
};

const HomeButton: React.FC<HomeButtonProps> = ({ icon, label, color, onPress, isSvg }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, friction: 5 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
      <TouchableOpacity
        style={[styles.buttonWrapper, { borderColor: color }]}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.iconContainer}>
          {isSvg ? (
            React.createElement(icon, { width: 32, height: 32 })
          ) : (
            <Image source={icon} style={styles.buttonIcon} resizeMode="contain" />
          )}
        </View>
        <Text style={[styles.buttonLabel, { color }]}>{label}</Text>
        <View style={styles.arrowContainer}>
          <ArrowIcon />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const FeatureCard = ({ image, title, description }) => (
  <View style={styles.featureCard}>
    <Image source={image} style={styles.featureImage} resizeMode="cover" />
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDesc}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  pageContent: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 0,
    alignItems: 'center',
    minHeight: '100%',
    flexGrow: 1,
  },
  banner: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#f3f6fb',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
    marginBottom: 28,
    textAlign: 'center',
    paddingHorizontal: 18,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 8,
    paddingHorizontal: 2,
    marginBottom: 24,
  },
  featureCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  featureImage: {
    width: 120,
    height: 90,
    borderRadius: 12,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f4631e',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  footer: {
    marginTop: 32,
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 8,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    borderRadius: 14,
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 18,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 68,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  buttonIcon: {
    width: 34,
    height: 34,
  },
  buttonLabel: {
    fontSize: 21,
    fontWeight: '600',
    flexShrink: 1,
    flex: 1,
  },
  arrowContainer: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen; 