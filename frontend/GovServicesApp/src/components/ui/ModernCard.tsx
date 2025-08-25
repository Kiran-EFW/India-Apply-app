import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import theme from '../../theme/theme';

interface ModernCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  onPress?: () => void;
  style?: ViewStyle;
  loading?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

const ModernCard: React.FC<ModernCardProps> = ({
  title,
  subtitle,
  description,
  image,
  onPress,
  style,
  loading = false,
  variant = 'default',
  size = 'medium',
  children,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...theme.shadows.lg,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.gray200,
        };
      case 'gradient':
        return {
          ...baseStyle,
          ...theme.shadows.md,
        };
      default:
        return {
          ...baseStyle,
          ...theme.shadows.sm,
        };
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return theme.spacing.md;
      case 'large':
        return theme.spacing.xl;
      default:
        return theme.spacing.lg;
    }
  };

  const CardContent = () => (
    <View style={[getCardStyle(), { padding: getPadding() }, style]}>
      {image && (
        <View style={styles.imageContainer}>
          {loading ? (
            <ShimmerPlaceholder
              style={styles.imageShimmer}
              shimmerColors={[theme.colors.gray200, theme.colors.gray100, theme.colors.gray200]}
            />
          ) : (
            <Image source={{ uri: image }} style={styles.image} />
          )}
        </View>
      )}

      {title && (
        <View style={styles.header}>
          {loading ? (
            <ShimmerPlaceholder
              style={styles.titleShimmer}
              shimmerColors={[theme.colors.gray200, theme.colors.gray100, theme.colors.gray200]}
            />
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}
          
          {subtitle && (
            loading ? (
              <ShimmerPlaceholder
                style={styles.subtitleShimmer}
                shimmerColors={[theme.colors.gray200, theme.colors.gray100, theme.colors.gray200]}
              />
            ) : (
              <Text style={styles.subtitle}>{subtitle}</Text>
            )
          )}
        </View>
      )}

      {description && (
        loading ? (
          <ShimmerPlaceholder
            style={styles.descriptionShimmer}
            shimmerColors={[theme.colors.gray200, theme.colors.gray100, theme.colors.gray200]}
          />
        ) : (
          <Text style={styles.description}>{description}</Text>
        )
      )}

      {children}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={loading}
        activeOpacity={0.8}
        style={styles.gradientContainer}
      >
        <LinearGradient
          colors={theme.colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <CardContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={loading}
        activeOpacity={0.8}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  gradientBorder: {
    padding: 2,
  },
  imageContainer: {
    marginBottom: theme.spacing.md,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: theme.borderRadius.md,
  },
  imageShimmer: {
    width: '100%',
    height: 120,
    borderRadius: theme.borderRadius.md,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  titleShimmer: {
    height: 20,
    borderRadius: theme.borderRadius.xs,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  subtitleShimmer: {
    height: 16,
    borderRadius: theme.borderRadius.xs,
  },
  description: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  descriptionShimmer: {
    height: 16,
    borderRadius: theme.borderRadius.xs,
    marginTop: theme.spacing.xs,
  },
});

export default ModernCard;
