import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-async-storage/async-storage';

interface OfflineBannerProps {
  onConnectionChange?: (isOnline: boolean) => void;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ onConnectionChange }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [bannerHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online);
      onConnectionChange?.(online);

      if (!online) {
        // Show banner
        Animated.timing(bannerHeight, {
          toValue: 50,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        // Hide banner
        Animated.timing(bannerHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    });

    return () => unsubscribe();
  }, [bannerHeight, onConnectionChange]);

  if (isOnline) {
    return null;
  }

  return (
    <Animated.View style={[styles.banner, { height: bannerHeight }]}>
      <View style={styles.content}>
        <Text style={styles.icon}>📶</Text>
        <Text style={styles.text}>You are offline. Some features may be limited.</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#F59E0B',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OfflineBanner;
