import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';

interface TicketResponse {
  id: string;
  message: string;
  isAgent: boolean;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  responses?: TicketResponse[];
}

const TicketDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { ticketId } = route.params as { ticketId: string };
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [newResponse, setNewResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      // Mock ticket data - in real app, this would come from API
      const mockTicket: SupportTicket = {
        id: ticketId,
        subject: 'Passport application issue',
        description: 'Unable to submit passport application form. The form keeps showing validation errors even when all fields are filled correctly.',
        status: 'open',
        priority: 'high',
        category: 'passport',
        createdAt: '2024-01-15',
        responses: [
          {
            id: '1',
            message: 'Thank you for contacting us. We have received your ticket and will investigate the issue.',
            isAgent: true,
            createdAt: '2024-01-15T10:30:00Z',
          },
          {
            id: '2',
            message: 'I tried clearing the cache and restarting the app, but the issue persists.',
            isAgent: false,
            createdAt: '2024-01-15T14:20:00Z',
          },
        ],
      };
      setTicket(mockTicket);
    } catch (error) {
      Alert.alert('Error', 'Failed to load ticket');
    }
  };

  const handleVoiceCommand = async () => {
    if (isListening) {
      stopListening();
      await processVoiceCommand(transcript);
    } else {
      startListening();
      await speak('Listening for ticket commands');
    }
  };

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('respond') || lowerCommand.includes('reply')) {
      if (newResponse.trim()) {
        await handleSubmitResponse();
      } else {
        await speak('Please enter your response first');
      }
    } else if (lowerCommand.includes('close') || lowerCommand.includes('resolve')) {
      await handleCloseTicket();
    } else if (lowerCommand.includes('back') || lowerCommand.includes('home')) {
      navigation.goBack();
    }
  };

  const handleSubmitResponse = async () => {
    if (!newResponse.trim()) {
      Alert.alert('Error', 'Please enter a response');
      return;
    }

    setIsLoading(true);
    try {
      await speak('Submitting your response');
      const response: TicketResponse = {
        id: Date.now().toString(),
        message: newResponse,
        isAgent: false,
        createdAt: new Date().toISOString(),
      };
      
      if (ticket) {
        setTicket({
          ...ticket,
          responses: [...(ticket.responses || []), response],
        });
      }
      
      await speak('Response submitted successfully');
      setNewResponse('');
    } catch (error) {
      await speak('Failed to submit response');
      Alert.alert('Error', 'Failed to submit response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTicket = async () => {
    Alert.alert(
      'Close Ticket',
      'Are you sure you want to close this ticket?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Close', 
          onPress: async () => {
            try {
              if (ticket) {
                setTicket({
                  ...ticket,
                  status: 'closed',
                  responses: [
                    ...(ticket.responses || []),
                    {
                      id: Date.now().toString(),
                      message: 'Ticket closed by user',
                      isAgent: false,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                });
              }
              await speak('Ticket closed successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to close ticket');
            }
          }
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'in_progress': return '#F59E0B';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  if (!ticket) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading ticket...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subject}>{ticket.subject}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
            <Text style={styles.statusText}>{ticket.status}</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) }]}>
            <Text style={styles.priorityText}>{ticket.priority}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.ticketInfo}>
          <Text style={styles.infoLabel}>Category:</Text>
          <Text style={styles.infoValue}>{ticket.category}</Text>
          
          <Text style={styles.infoLabel}>Created:</Text>
          <Text style={styles.infoValue}>
            {new Date(ticket.createdAt).toLocaleString()}
          </Text>
          
          <Text style={styles.infoLabel}>Description:</Text>
          <Text style={styles.description}>{ticket.description}</Text>
        </View>

        <View style={styles.responsesContainer}>
          <Text style={styles.responsesTitle}>Responses</Text>
          
          {ticket.responses && ticket.responses.length > 0 ? (
            ticket.responses.map((response, index) => (
              <View 
                key={response.id} 
                style={[
                  styles.responseItem,
                  response.isAgent && styles.agentResponse
                ]}
              >
                <Text style={styles.responseAuthor}>
                  {response.isAgent ? 'Support Agent' : 'You'}
                </Text>
                <Text style={styles.responseMessage}>{response.message}</Text>
                <Text style={styles.responseTime}>
                  {new Date(response.createdAt).toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noResponses}>No responses yet</Text>
          )}
        </View>

        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
          <View style={styles.newResponseContainer}>
            <Text style={styles.newResponseTitle}>Add Response</Text>
            <TextInput
              style={styles.responseInput}
              placeholder="Type your response..."
              value={newResponse}
              onChangeText={setNewResponse}
              multiline
            />
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleSubmitResponse}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Submitting...' : 'Submit Response'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={[styles.voiceButton, isListening && styles.listeningButton]}
        onPress={handleVoiceCommand}
      >
        <Text style={styles.voiceButtonText}>
          {isListening ? 'Listening...' : 'Tap to Speak'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subject: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  ticketInfo: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  responsesContainer: {
    marginBottom: 20,
  },
  responsesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  responseItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  agentResponse: {
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  responseAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  responseMessage: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 10,
    lineHeight: 24,
  },
  responseTime: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  noResponses: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    padding: 20,
  },
  newResponseContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  newResponseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  responseInput: {
    height: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
  voiceButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: 'center',
    margin: 20,
  },
  listeningButton: {
    backgroundColor: '#10B981',
  },
  voiceButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TicketDetailScreen;
