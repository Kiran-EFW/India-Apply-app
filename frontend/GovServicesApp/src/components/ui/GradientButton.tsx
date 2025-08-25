import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../theme/theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  gradient?: string[];
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  gradient,
  style,
  textStyle,
  disabled = false,
  loading = false,
  size = 'medium',
  variant = 'primary',
}) => {
  const getGradientColors = () => {
    if (gradient) return gradient;
    
    switch (variant) {
      case 'primary':
        return theme.colors.gradientPrimary;
      case 'secondary':
        return theme.colors.gradientSecondary;
      case 'accent':
        return theme.colors.gradientAccent;
      case 'outline':
        return [theme.colors.white, theme.colors.white];
      default:
        return theme.colors.gradientPrimary;
    }
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      ...theme.shadows.md,
    };

    switch (size) {
      case 'small':
        return {
          ...baseStyle,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          minHeight: 36,
        };
      case 'large':
        return {
          ...baseStyle,
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.md,
          minHeight: 56,
        };
      default:
        return {
          ...baseStyle,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          minHeight: 48,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...theme.typography.button,
      textAlign: 'center',
      color: variant === 'outline' ? theme.colors.primary : theme.colors.white,
    };

    switch (size) {
      case 'small':
        return { ...baseStyle, fontSize: 14 };
      case 'large':
        return { ...baseStyle, fontSize: 18 };
      default:
        return baseStyle;
    }
  };

  const getBorderStyle = (): ViewStyle => {
    if (variant === 'outline') {
      return {
        borderWidth: 2,
        borderColor: theme.colors.primary,
      };
    }
    return {};
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), getBorderStyle(), style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? theme.colors.primary : theme.colors.white}
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default GradientButton;
