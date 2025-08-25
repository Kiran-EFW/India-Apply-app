import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';
import { ocrService } from '../services/ocrService';
import { documentService } from '../services/documentService';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

interface ScannedDocument {
  id: string;
  name: string;
  type: string;
  imageUri: string;
  extractedText: string;
  confidence: number;
  fields: Record<string, string>;
  timestamp: Date;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: string[];
  examples: string[];
}

const { width: screenWidth } = Dimensions.get('window');

const DocumentScannerScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  const cameraRef = useRef<Camera>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [showCamera, setShowCamera] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedDocuments, setScannedDocuments] = useState<ScannedDocument[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});

  const documentTemplates: DocumentTemplate[] = [
    {
      id: 'aadhaar',
      name: 'Aadhaar Card',
      description: 'Extract name, number, and address',
      icon: '🆔',
      fields: ['Name', 'Aadhaar Number', 'Address', 'Date of Birth'],
      examples: ['Aadhaar card front and back'],
    },
    {
      id: 'pan',
      name: 'PAN Card',
      description: 'Extract PAN number and name',
      icon: '💳',
      fields: ['Name', 'PAN Number', 'Father\'s Name', 'Date of Birth'],
      examples: ['PAN card front side'],
    },
    {
      id: 'passport',
      name: 'Passport',
      description: 'Extract passport details',
      icon: '📘',
      fields: ['Name', 'Passport Number', 'Date of Issue', 'Date of Expiry'],
      examples: ['Passport first page'],
    },
    {
      id: 'driving_license',
      name: 'Driving License',
      description: 'Extract license details',
      icon: '🚗',
      fields: ['Name', 'License Number', 'Date of Issue', 'Valid Until'],
      examples: ['Driving license front and back'],
    },
    {
      id: 'bank_statement',
      name: 'Bank Statement',
      description: 'Extract account details',
      icon: '🏦',
      fields: ['Account Number', 'Account Holder', 'Bank Name', 'Balance'],
      examples: ['Bank statement first page'],
    },
    {
      id: 'utility_bill',
      name: 'Utility Bill',
      description: 'Extract billing information',
      icon: '⚡',
      fields: ['Customer Name', 'Account Number', 'Address', 'Amount'],
      examples: ['Electricity, water, or gas bill'],
    },
  ];

  useEffect(() => {
    requestPermissions();
    loadScannedDocuments();
    speak('Welcome to Document Scanner. Choose a document type and scan or upload your document.');
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
  };

  const loadScannedDocuments = async () => {
    try {
      const documents = await documentService.getScannedDocuments();
      setScannedDocuments(documents);
    } catch (error) {
      console.error('Failed to load scanned documents:', error);
    }
  };

  const handleVoiceCommand = async () => {
    if (isListening) {
      stopListening();
      await processVoiceCommand(transcript);
    } else {
      startListening();
      await speak('Listening... Please say your command');
    }
  };

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('camera') || lowerCommand.includes('scan')) {
      setShowCamera(true);
      await speak('Opening camera for scanning');
    } else if (lowerCommand.includes('gallery') || lowerCommand.includes('upload')) {
      setShowGallery(true);
      await speak('Opening gallery for document selection');
    } else if (lowerCommand.includes('aadhaar')) {
      setSelectedTemplate(documentTemplates.find(t => t.id === 'aadhaar') || null);
      await speak('Selected Aadhaar card template');
    } else if (lowerCommand.includes('pan')) {
      setSelectedTemplate(documentTemplates.find(t => t.id === 'pan') || null);
      await speak('Selected PAN card template');
    } else if (lowerCommand.includes('passport')) {
      setSelectedTemplate(documentTemplates.find(t => t.id === 'passport') || null);
      await speak('Selected passport template');
    } else if (lowerCommand.includes('process') || lowerCommand.includes('extract')) {
      if (capturedImage) {
        await processDocument();
      } else {
        await speak('Please capture or select a document first');
      }
    } else if (lowerCommand.includes('back') || lowerCommand.includes('home')) {
      navigation.goBack();
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setCapturedImage(photo.uri);
        setShowCamera(false);
        await speak('Document captured successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to capture image');
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        setShowGallery(false);
        await speak('Document selected from gallery');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const processDocument = async () => {
    if (!capturedImage || !selectedTemplate) {
      Alert.alert('Error', 'Please capture an image and select a document template');
      return;
    }

    setIsProcessing(true);
    try {
      await speak('Processing document with OCR');
      
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(capturedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Process with OCR
      const ocrResult = await ocrService.processDocument({
        image: base64,
        template: selectedTemplate.id,
        fields: selectedTemplate.fields,
      });

      setExtractedData(ocrResult.fields);
      
      // Save scanned document
      const document: ScannedDocument = {
        id: Date.now().toString(),
        name: `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
        type: selectedTemplate.id,
        imageUri: capturedImage,
        extractedText: ocrResult.text,
        confidence: ocrResult.confidence,
        fields: ocrResult.fields,
        timestamp: new Date(),
      };

      await documentService.saveScannedDocument(document);
      setScannedDocuments([document, ...scannedDocuments]);
      
      await speak(`Document processed successfully. Confidence: ${ocrResult.confidence}%`);
      Alert.alert('Success', `Document processed with ${ocrResult.confidence}% confidence`);
    } catch (error) {
      await speak('Failed to process document');
      Alert.alert('Error', 'Failed to process document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderTemplateItem = (template: DocumentTemplate) => (
    <TouchableOpacity
      key={template.id}
      style={[
        styles.templateItem,
        selectedTemplate?.id === template.id && styles.selectedTemplate,
      ]}
      onPress={() => setSelectedTemplate(template)}
    >
      <Text style={styles.templateIcon}>{template.icon}</Text>
      <View style={styles.templateInfo}>
        <Text style={styles.templateName}>{template.name}</Text>
        <Text style={styles.templateDescription}>{template.description}</Text>
        <Text style={styles.templateFields}>
          Fields: {template.fields.join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderScannedDocument = (document: ScannedDocument) => (
    <TouchableOpacity
      key={document.id}
      style={styles.documentItem}
      onPress={() => {
        setCapturedImage(document.imageUri);
        setExtractedData(document.fields);
        setSelectedTemplate(documentTemplates.find(t => t.id === document.type) || null);
      }}
    >
      <Image source={{ uri: document.imageUri }} style={styles.documentThumbnail} />
      <View style={styles.documentInfo}>
        <Text style={styles.documentName}>{document.name}</Text>
        <Text style={styles.documentType}>{document.type}</Text>
        <Text style={styles.documentConfidence}>
          Confidence: {document.confidence}%
        </Text>
        <Text style={styles.documentDate}>
          {document.timestamp.toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderExtractedField = (key: string, value: string) => (
    <View key={key} style={styles.fieldItem}>
      <Text style={styles.fieldLabel}>{key}</Text>
      <Text style={styles.fieldValue}>{value || 'Not detected'}</Text>
    </View>
  );

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera and gallery permissions are required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Document Scanner</Text>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Document Type</Text>
          {documentTemplates.map(renderTemplateItem)}
        </View>

        {selectedTemplate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Capture Document</Text>
            <View style={styles.captureButtons}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={() => setShowCamera(true)}
              >
                <Text style={styles.captureButtonIcon}>📷</Text>
                <Text style={styles.captureButtonText}>Camera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.captureButton}
                onPress={() => setShowGallery(true)}
              >
                <Text style={styles.captureButtonIcon}>🖼️</Text>
                <Text style={styles.captureButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {capturedImage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Captured Document</Text>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            
            <TouchableOpacity
              style={[styles.processButton, isProcessing && styles.disabledButton]}
              onPress={processDocument}
              disabled={isProcessing}
            >
              <Text style={styles.processButtonText}>
                {isProcessing ? 'Processing...' : 'Process Document'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {Object.keys(extractedData).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extracted Data</Text>
            {Object.entries(extractedData).map(([key, value]) =>
              renderExtractedField(key, value)
            )}
          </View>
        )}

        {scannedDocuments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            {scannedDocuments.slice(0, 5).map(renderScannedDocument)}
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

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType="slide">
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={cameraType}
            flashMode={flashMode}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraHeader}>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => setShowCamera(false)}
                >
                  <Text style={styles.cameraButtonText}>✕</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => setFlashMode(
                    flashMode === Camera.Constants.FlashMode.off
                      ? Camera.Constants.FlashMode.on
                      : Camera.Constants.FlashMode.off
                  )}
                >
                  <Text style={styles.cameraButtonText}>⚡</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.scanFrame} />
              
              <View style={styles.cameraFooter}>
                <TouchableOpacity
                  style={styles.captureButtonLarge}
                  onPress={takePicture}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        </View>
      </Modal>

      {/* Gallery Modal */}
      <Modal visible={showGallery} animationType="slide">
        <View style={styles.galleryContainer}>
          <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>Select Document</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowGallery(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={pickImageFromGallery}
          >
            <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedTemplate: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  templateIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  templateFields: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  captureButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  captureButton: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    minWidth: 120,
  },
  captureButtonIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  processButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  processButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  fieldValue: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  documentThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  documentType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  documentConfidence: {
    fontSize: 12,
    color: '#10B981',
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  voiceButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    margin: 20,
  },
  listeningButton: {
    backgroundColor: '#10B981',
  },
  voiceButtonText: {
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
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 20,
  },
  permissionButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 18,
  },
  scanFrame: {
    width: screenWidth - 80,
    height: 200,
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: 10,
    alignSelf: 'center',
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButtonLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4F46E5',
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
  },
  galleryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  galleryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DocumentScannerScreen;
