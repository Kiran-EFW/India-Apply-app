import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../theme/theme';

interface ModernInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
}

const ModernInput: React.FC<ModernInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  disabled = false,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isActive = isFocused || value.length > 0;

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 2,
      borderColor: error ? theme.colors.error : isActive ? theme.colors.primary : theme.colors.gray200,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: theme.dimensions.inputHeight,
      ...theme.shadows.sm,
    };

    if (isActive && !error) {
      return {
        ...baseStyle,
        ...theme.shadows.md,
      };
    }

    return baseStyle;
  };

  const getLabelStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      position: 'absolute',
      left: theme.spacing.md,
      top: isActive ? theme.spacing.xs : theme.spacing.md,
      fontSize: isActive ? 12 : 16,
      color: error ? theme.colors.error : isActive ? theme.colors.primary : theme.colors.textSecondary,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 4,
      zIndex: 1,
    };

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    return {
      ...theme.typography.body1,
      color: disabled ? theme.colors.textTertiary : theme.colors.textPrimary,
      paddingTop: isActive ? theme.spacing.md : 0,
      paddingBottom: theme.spacing.xs,
      textAlignVertical: multiline ? 'top' : 'center',
    };
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={getContainerStyle()}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <Text style={getLabelStyle()}>{label}</Text>
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={isActive ? placeholder : ''}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[
            getInputStyle(),
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress || (secureTextEntry ? togglePasswordVisibility : undefined)}
            disabled={!onRightIconPress && !secureTextEntry}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  leftIcon: {
    position: 'absolute',
    left: theme.spacing.md,
    top: theme.spacing.md,
    zIndex: 2,
  },
  rightIcon: {
    position: 'absolute',
    right: theme.spacing.md,
    top: theme.spacing.md,
    zIndex: 2,
  },
  inputWithLeftIcon: {
    paddingLeft: theme.spacing.xl + theme.spacing.md,
  },
  inputWithRightIcon: {
    paddingRight: theme.spacing.xl + theme.spacing.md,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});

export default ModernInput;
