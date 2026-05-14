import { Alert } from 'react-native';

export interface NetworkStatus {
  isConnected: boolean;
  type: 'wifi' | 'cellular' | 'none';
}

export const checkNetworkStatus = (): NetworkStatus => {
  // This would typically use NetInfo from @react-native-community/netinfo
  // For now, return a basic implementation
  return {
    isConnected: true, // Assume connected for demo
    type: 'wifi',
  };
};

export const handleNetworkError = (error: any): void => {
  const message = error?.message || 'Network error occurred';
  
  Alert.alert(
    'Network Error',
    message,
    [
      {
        text: 'Retry',
        onPress: () => {
          // Retry logic would be implemented by caller
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]
  );
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
};

export const isOnline = (): boolean => {
  // Basic online check - in production, this would use more sophisticated detection
  return true;
};
