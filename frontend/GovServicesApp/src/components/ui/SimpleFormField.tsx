import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface SimpleFormFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'number' | 'email' | 'phone';
  required?: boolean;
  helperText?: string;
  error?: string;
}

const SimpleFormField: React.FC<SimpleFormFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  required = false,
  helperText,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getKeyboardType = () => {
    switch (type) {
      case 'number':
        return 'numeric';
      case 'email':
        return 'email-address';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  const getAutoCapitalize = () => {
    switch (type) {
      case 'email':
        return 'none';
      default:
        return 'words';
    }
  };

  return (
    <View style={styles.container}>
      {/* Large, Clear Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>

      {/* Helper Text */}
      {helperText && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      {/* Input Field */}
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputFocused,
        error && styles.inputError
      ]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={getKeyboardType()}
          autoCapitalize={getAutoCapitalize()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          fontSize={18}
        />
      </View>

      {/* Error Message */}
      {error && (
        <Text style={styles.errorText}>⚠️ {error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  required: {
    fontSize: 20,
    color: '#EF4444',
    marginLeft: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  inputContainer: {
    borderWidth: 3,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputFocused: {
    borderColor: '#3B82F6',
    backgroundColor: '#F8FAFC',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  input: {
    fontSize: 18,
    color: '#1F2937',
    minHeight: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 8,
    fontWeight: '500',
  },
});

export default SimpleFormField;
