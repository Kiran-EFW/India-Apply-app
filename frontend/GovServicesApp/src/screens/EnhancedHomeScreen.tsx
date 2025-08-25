import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import theme from '../theme/theme';
import ModernHeader from '../components/ui/ModernHeader';
import ModernCard from '../components/ui/ModernCard';
import GradientButton from '../components/ui/GradientButton';
import ModernInput from '../components/ui/ModernInput';

const { width } = Dimensions.get('window');

interface ServiceCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string[];
  route: string;
}

const EnhancedHomeScreen: React.FC = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const serviceCards: ServiceCard[] = [
    {
      id: '1',
      title: 'Passport Services',
      subtitle: 'Apply for new passport',
      description: 'Quick and easy passport application process with voice assistance',
      icon: '🛂',
      gradient: theme.colors.gradientPrimary,
      route: 'PassportServices',
    },
    {
      id: '2',
      title: 'PAN Card',
      subtitle: 'Get your PAN card',
      description: 'Apply for PAN card with instant verification',
      icon: '💳',
      gradient: theme.colors.gradientSecondary,
      route: 'PANCard',
    },
    {
      id: '3',
      title: 'Aadhaar Update',
      subtitle: 'Update your Aadhaar',
      description: 'Update address, photo, and other details',
      icon: '🆔',
      gradient: theme.colors.gradientAccent,
      route: 'AadhaarUpdate',
    },
    {
      id: '4',
      title: 'Tax Filing',
      subtitle: 'File your ITR',
      description: 'Easy income tax return filing with AI assistance',
      icon: '📊',
      gradient: theme.colors.gradientOcean,
      route: 'TaxFiling',
    },
    {
      id: '5',
      title: 'Document Vault',
      subtitle: 'Secure storage',
      description: 'Store and manage all your important documents',
      icon: '📁',
      gradient: theme.colors.gradientSunset,
      route: 'DocumentVault',
    },
    {
      id: '6',
      title: 'Payment Gateway',
      subtitle: 'Secure payments',
      description: 'Pay government fees and taxes securely',
      icon: '💳',
      gradient: theme.colors.gradientPrimary,
      route: 'PaymentGateway',
    },
  ];

  const handleServicePress = (service: ServiceCard) => {
    Alert.alert(
      'Service Selected',
      `You selected: ${service.title}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => navigation.navigate(service.route) },
      ]
    );
  };

  const handleVoiceCommand = () => {
    Alert.alert('Voice Command', 'Voice recognition feature coming soon!');
  };

  const handleQuickAction = (action: string) => {
    Alert.alert('Quick Action', `You selected: ${action}`);
  };

  return (
    <View style={styles.container}>
      <ModernHeader
        title="Apply AI India"
        subtitle="Your Digital Government Assistant"
        variant="gradient"
        rightIcon={
          <TouchableOpacity onPress={handleVoiceCommand}>
            <Text style={styles.voiceIcon}>🎤</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <LinearGradient
            colors={theme.colors.gradientSunset}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <Text style={styles.welcomeTitle}>Welcome back, {userName}! 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              How can I help you today? Use voice commands or browse services below.
            </Text>
          </LinearGradient>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <ModernInput
            label="Search Services"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Type to search government services..."
            leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <GradientButton
              title="Scan Document"
              onPress={() => handleQuickAction('Scan Document')}
              variant="primary"
              size="small"
              style={styles.quickActionButton}
            />
            <GradientButton
              title="Pay Tax"
              onPress={() => handleQuickAction('Pay Tax')}
              variant="secondary"
              size="small"
              style={styles.quickActionButton}
            />
            <GradientButton
              title="Track Status"
              onPress={() => handleQuickAction('Track Status')}
              variant="accent"
              size="small"
              style={styles.quickActionButton}
            />
            <GradientButton
              title="Help"
              onPress={() => handleQuickAction('Help')}
              variant="outline"
              size="small"
              style={styles.quickActionButton}
            />
          </View>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Government Services</Text>
          <View style={styles.servicesGrid}>
            {serviceCards.map((service) => (
              <ModernCard
                key={service.id}
                title={service.title}
                subtitle={service.subtitle}
                description={service.description}
                variant="elevated"
                size="medium"
                onPress={() => handleServicePress(service)}
                style={styles.serviceCard}
                loading={loading}
              >
                <View style={styles.serviceIconContainer}>
                  <Text style={styles.serviceIcon}>{service.icon}</Text>
                </View>
              </ModernCard>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <ModernCard
            title="Passport Application"
            subtitle="Status: In Progress"
            description="Your passport application is being processed. Expected completion: 15 days"
            variant="outlined"
            loading={loading}
          />
          <ModernCard
            title="PAN Card Update"
            subtitle="Status: Completed"
            description="Your PAN card details have been successfully updated"
            variant="outlined"
            loading={loading}
          />
        </View>

        {/* Voice Assistant Promo */}
        <View style={styles.voicePromoSection}>
          <LinearGradient
            colors={theme.colors.gradientOcean}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.voicePromoGradient}
          >
            <Text style={styles.voicePromoTitle}>🎤 Voice Assistant</Text>
            <Text style={styles.voicePromoSubtitle}>
              Use voice commands to navigate and complete tasks faster
            </Text>
            <GradientButton
              title="Try Voice Commands"
              onPress={handleVoiceCommand}
              variant="outline"
              style={styles.voiceButton}
            />
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  voiceIcon: {
    fontSize: 24,
  },
  welcomeSection: {
    margin: theme.spacing.lg,
  },
  welcomeGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  welcomeTitle: {
    ...theme.typography.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  welcomeSubtitle: {
    ...theme.typography.body1,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  searchSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  searchIcon: {
    fontSize: 20,
    color: theme.colors.textSecondary,
  },
  quickActionsSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    marginBottom: theme.spacing.md,
  },
  servicesSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    marginBottom: theme.spacing.md,
  },
  serviceIconContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  serviceIcon: {
    fontSize: 32,
  },
  recentActivitySection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  voicePromoSection: {
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  voicePromoGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  voicePromoTitle: {
    ...theme.typography.h4,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  voicePromoSubtitle: {
    ...theme.typography.body1,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  voiceButton: {
    borderColor: theme.colors.white,
  },
});

export default EnhancedHomeScreen;
