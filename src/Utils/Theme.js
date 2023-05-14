/* eslint-disable prettier/prettier */
import {MD3DarkTheme, configureFonts} from 'react-native-paper';

const baseFont = {
  fontFamily: 'Urbanist-Regular',
};

const baseVariants = configureFonts({config: baseFont});

const customVariants = {
  // Customize individual base variants:
  displayLarge: {
    ...baseVariants.displayMedium,
    fontFamily: 'DeathStar',
  },
  headlineSmall: {
    ...baseVariants.headlineSmall,
    fontFamily: 'Urbanist-Bold',
  },
  headlineMedium: {
    ...baseVariants.headlineMedium,
    fontFamily: 'Urbanist-Bold',
  },
  headlineLarge: {
    ...baseVariants.headlineLarge,
    fontFamily: 'Urbanist-Bold',
  },
  titleSmall: {
    ...baseVariants.titleSmall,
    fontFamily: 'Urbanist-Bold',
  },
  titleMedium: {
    ...baseVariants.titleMedium,
    fontFamily: 'Urbanist-Bold',
  },
  titleLarge: {
    // ...baseVariants.titleLarge,
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 26,
  },
  bodyExtraLarge: {
    // ...baseVariants.headlineSmall,
    fontSize: 20,
    letterSpacing: 0,
    lineHeight: 26,
    fontFamily: 'Urbanist-Regular',
  },
};

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FFC857',
    secondary: '#CEB1BE',
    tertiary: '#6DB1BF',
    background: '#0F0F1A',
    secondaryContainer: '#FFC857',
    // background: '#171727',
    onSurface: 'rgb(231, 225, 229)',
    backdrop: '#2F3137',
    under: '#545863',
    text: '#DDDADA',
    textDark: '#0F0F1A',
    card: '#252541',
    elevation: {
      level3: '#252541',
    },
  },
  fonts: configureFonts({
    config: customVariants,
    isV3: true,
  }),
  version: 3,
};
