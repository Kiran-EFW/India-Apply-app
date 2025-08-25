import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
}

const HelpScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  const [activeTab, setActiveTab] = useState('faq');
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'How do I apply for a passport?',
      answer: 'You can apply for a passport through the Service Hub. Select "Passport Services" and follow the step-by-step application process.',
      category: 'passport'
    },
    {
      id: '2',
      question: 'How do I track my application status?',
      answer: 'Go to the Tracking screen to view the status of all your applications. You can also enable notifications for real-time updates.',
      category: 'tracking'
    },
    {
      id: '3',
      question: 'How do I make a tax payment?',
      answer: 'Navigate to the Tax Payment screen from the Home screen. Enter the amount and follow the payment process using UPI or card.',
      category: 'tax'
    },
    {
      id: '4',
      question: 'How do I book an Aadhaar appointment?',
      answer: 'Go to the Aadhaar Appointment screen, select your preferred service, date, and time slot to book your appointment.',
      category: 'aadhaar'
    },
    {
      id: '5',
      question: 'How do I upload documents?',
      answer: 'Use the Document Vault screen to upload and manage your documents. You can scan documents using your camera or select from gallery.',
      category: 'documents'
    },
    {
      id: '6',
      question: 'How do I use voice commands?',
      answer: 'Tap the voice button on any screen and speak your command. The app supports natural language commands for navigation and actions.',
      category: 'voice'
    }
  ]);
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      subject: 'Passport application issue',
      description: 'Unable to submit passport application form',
      status: 'open',
      priority: 'high',
      category: 'passport',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      subject: 'Payment failed',
      description: 'Tax payment transaction failed',
      status: 'in_progress',
      priority: 'medium',
      category: 'payment',
      createdAt: '2024-01-14'
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FAQ[]>([]);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });

  const handleVoiceCommand = async () => {
    if (isListening) {
      stopListening();
      await processVoiceCommand(transcript);
    } else {
      startListening();
      await speak('Listening for help commands');
    }
  };

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('faq') || lowerCommand.includes('help')) {
      setActiveTab('faq');
      await speak('Showing frequently asked questions');
    } else if (lowerCommand.includes('ticket') || lowerCommand.includes('support')) {
      setActiveTab('tickets');
      await speak('Showing your support tickets');
    } else if (lowerCommand.includes('new ticket') || lowerCommand.includes('contact support')) {
      setShowNewTicketForm(true);
      await speak('Opening new support ticket form');
    } else if (lowerCommand.includes('search')) {
      const searchTerm = command.replace(/search/i, '').trim();
      setSearchQuery(searchTerm);
      handleSearch(searchTerm);
    } else if (lowerCommand.includes('back') || lowerCommand.includes('home')) {
      navigation.navigate('Home');
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = faqs.filter(faq => 
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSubmitTicket = async () => {
    if (!newTicket.subject || !newTicket.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await speak('Creating your support ticket');
      const ticket: SupportTicket = {
        id: Date.now().toString(),
        subject: newTicket.subject,
        description: newTicket.description,
        status: 'open',
        priority: newTicket.priority as 'low' | 'medium' | 'high',
        category: newTicket.category,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      setTickets([ticket, ...tickets]);
      await speak('Support ticket created successfully');
      Alert.alert('Success', 'Your support ticket has been created');
      setShowNewTicketForm(false);
      setNewTicket({
        subject: '',
        description: '',
        category: 'general',
        priority: 'medium',
      });
    } catch (error) {
      await speak('Failed to create support ticket');
      Alert.alert('Error', 'Failed to create support ticket');
    }
  };

  const renderFAQItem = ({ item }: { item: FAQ }) => (
    <View style={styles.faqItem}>
      <Text style={styles.faqQuestion}>{item.question}</Text>
      <Text style={styles.faqAnswer}>{item.answer}</Text>
    </View>
  );

  const renderTicketItem = ({ item }: { item: SupportTicket }) => (
    <TouchableOpacity 
      style={styles.ticketItem}
      onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}
    >
      <Text style={styles.ticketSubject}>{item.subject}</Text>
      <Text style={styles.ticketStatus}>{item.status}</Text>
      <Text style={styles.ticketDate}>{item.createdAt}</Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'in_progress': return '#F59E0B';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for help..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch(text);
          }}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(searchQuery)}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.searchResults}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <FlatList
            data={searchResults}
            renderItem={renderFAQItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'faq' && styles.activeTab]}
          onPress={() => setActiveTab('faq')}
        >
          <Text style={[styles.tabText, activeTab === 'faq' && styles.activeTabText]}>
            FAQs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tickets' && styles.activeTab]}
          onPress={() => setActiveTab('tickets')}
        >
          <Text style={[styles.tabText, activeTab === 'tickets' && styles.activeTabText]}>
            My Tickets
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'faq' && (
        <FlatList
          data={faqs}
          renderItem={renderFAQItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {activeTab === 'tickets' && (
        <View style={styles.ticketsContainer}>
          <TouchableOpacity
            style={styles.newTicketButton}
            onPress={() => setShowNewTicketForm(true)}
          >
            <Text style={styles.newTicketButtonText}>+ New Support Ticket</Text>
          </TouchableOpacity>
          
          <FlatList
            data={tickets}
            renderItem={renderTicketItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No support tickets found</Text>
            }
          />
        </View>
      )}

      {showNewTicketForm && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Support Ticket</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={newTicket.subject}
              onChangeText={(text) => setNewTicket({...newTicket, subject: text})}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={newTicket.description}
              onChangeText={(text) => setNewTicket({...newTicket, description: text})}
              multiline
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNewTicketForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitTicket}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  searchButtonText: {
    fontSize: 18,
  },
  searchResults: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  faqItem: {
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
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#4B5563',
  },
  ticketsContainer: {
    flex: 1,
  },
  newTicketButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  newTicketButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  ticketItem: {
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
  ticketSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  ticketStatus: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 5,
  },
  ticketDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  voiceButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
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

export default HelpScreen;
