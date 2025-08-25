import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../theme/theme';

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  gradient?: string[];
  style?: ViewStyle;
  showStatusBar?: boolean;
  variant?: 'default' | 'transparent' | 'gradient';
}

const ModernHeader: React.FC<ModernHeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  gradient,
  style,
  showStatusBar = true,
  variant = 'default',
}) => {
  const getGradientColors = () => {
    if (gradient) return gradient;
    
    switch (variant) {
      case 'gradient':
        return theme.colors.gradientSunset;
      case 'transparent':
        return ['transparent', 'transparent'];
      default:
        return theme.colors.gradientPrimary;
    }
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingTop: showStatusBar ? StatusBar.currentHeight || 0 : 0,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      minHeight: theme.dimensions.headerHeight + (showStatusBar ? StatusBar.currentHeight || 0 : 0),
      justifyContent: 'center',
    };

    if (variant === 'transparent') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
      };
    }

    return baseStyle;
  };

  const HeaderContent = () => (
    <View style={[getContainerStyle(), style]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {leftIcon && (
            <TouchableOpacity
              onPress={onLeftPress}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              {leftIcon}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.rightSection}>
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightPress}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (variant === 'transparent') {
    return <HeaderContent />;
  }

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <HeaderContent />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    ...theme.shadows.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    ...theme.typography.h4,
    color: theme.colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    ...theme.typography.body2,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});

export default ModernHeader;
