import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
}

interface StatusTimelineProps {
  steps: TimelineStep[];
  currentStep: number;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ steps, currentStep }) => {
  const getStepStyle = (index: number, status: string) => {
    if (status === 'completed') {
      return [styles.step, styles.completedStep];
    } else if (status === 'current') {
      return [styles.step, styles.currentStep];
    } else {
      return [styles.step, styles.pendingStep];
    }
  };

  const getLineStyle = (index: number) => {
    if (index < currentStep) {
      return [styles.line, styles.completedLine];
    } else {
      return [styles.line, styles.pendingLine];
    }
  };

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.timelineItem}>
          <View style={styles.stepContainer}>
            <View style={getStepStyle(index, step.status)}>
              {step.status === 'completed' && (
                <Text style={styles.checkmark}>✓</Text>
              )}
              {step.status === 'current' && (
                <View style={styles.currentIndicator} />
              )}
              {step.status === 'pending' && (
                <Text style={styles.stepNumber}>{index + 1}</Text>
              )}
            </View>
            {index < steps.length - 1 && (
              <View style={getLineStyle(index)} />
            )}
          </View>
          
          <View style={styles.content}>
            <Text style={[
              styles.title,
              step.status === 'completed' && styles.completedTitle,
              step.status === 'current' && styles.currentTitle,
            ]}>
              {step.title}
            </Text>
            <Text style={[
              styles.description,
              step.status === 'completed' && styles.completedDescription,
            ]}>
              {step.description}
            </Text>
            {step.date && (
              <Text style={styles.date}>{step.date}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  completedStep: {
    backgroundColor: '#10B981',
  },
  currentStep: {
    backgroundColor: '#4F46E5',
  },
  pendingStep: {
    backgroundColor: '#E5E7EB',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  stepNumber: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  line: {
    width: 2,
    height: 40,
  },
  completedLine: {
    backgroundColor: '#10B981',
  },
  pendingLine: {
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 5,
  },
  completedTitle: {
    color: '#10B981',
  },
  currentTitle: {
    color: '#4F46E5',
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 5,
  },
  completedDescription: {
    color: '#6B7280',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default StatusTimeline;
