export const defaultCode = `import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState('#667eea');

  const handlePress = () => {
    setCount(count + 1);
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    setColor(colors[count % colors.length]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Snack SDK Test</Text>
      <Text style={styles.subtitle}>
        Testing React Native components with Expo Snack SDK
      </Text>

      <Text style={styles.counterText}>Count: {count}</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color }]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>Tap Me! ({count})</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        ✨ Powered by Snack SDK - Edit the code to see real-time updates!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  counterText: {
    fontSize: 20,
    color: '#34495e',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});`;
