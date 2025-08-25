import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';

const DocumentVaultScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript } = useVoice();
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Aadhaar Card', type: 'ID Proof', date: '2023-05-15', size: '2.4 MB' },
    { id: '2', name: 'PAN Card', type: 'ID Proof', date: '2023-04-20', size: '1.2 MB' },
    { id: '3', name: 'Passport', type: 'Travel Document', date: '2023-03-10', size: '3.1 MB' },
    { id: '4', name: 'Driving License', type: 'License', date: '2023-02-05', size: '1.8 MB' },
  ]);

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
      processVoiceCommand(transcript);
    } else {
      startListening();
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('upload') || lowerCommand.includes('add')) {
      handleUploadDocument();
    } else if (lowerCommand.includes('view') || lowerCommand.includes('show')) {
      // In a real app, we'd implement document viewing
      Alert.alert('Document View', 'Document viewing feature would open here');
    } else if (lowerCommand.includes('delete') || lowerCommand.includes('remove')) {
      // In a real app, we'd implement document deletion
      Alert.alert('Delete Document', 'Document deletion would be confirmed here');
    } else if (lowerCommand.includes('back') || lowerCommand.includes('home')) {
      navigation.goBack();
    }
  };

  const handleUploadDocument = async () => {
    try {
      // In a real app, we would use DocumentPicker
      Alert.alert('Document Upload', 'Document upload feature would open here');
      
      // Add to the list (in a real app, this would come from the server)
      setDocuments([
        ...documents,
        {
          id: (documents.length + 1).toString(),
          name: 'New Document',
          type: 'User Document',
          date: new Date().toISOString().split('T')[0],
          size: '1.0 MB',
        },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const renderDocument = ({ item }: any) => (
    <TouchableOpacity style={styles.documentCard}>
      <View style={styles.documentIcon}>
        <Text style={styles.documentIconText}>📄</Text>
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentName}>{item.name}</Text>
        <Text style={styles.documentType}>{item.type}</Text>
        <Text style={styles.documentMeta}>{item.date} • {item.size}</Text>
      </View>
      <TouchableOpacity style={styles.documentMenu}>
        <Text style={styles.menuText}>⋮</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Document Vault</Text>
      
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadDocument}>
        <Text style={styles.uploadButtonText}>+ Upload Document</Text>
      </TouchableOpacity>
      
      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.documentsList}
      />
      
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
  uploadButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  documentsList: {
    paddingBottom: 20,
  },
  documentCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  documentIconText: {
    fontSize: 24,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  documentType: {
    fontSize: 14,
    color: '#4F46E5',
    marginBottom: 2,
  },
  documentMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  documentMenu: {
    padding: 10,
  },
  menuText: {
    fontSize: 20,
    color: '#6B7280',
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

export default DocumentVaultScreen;
