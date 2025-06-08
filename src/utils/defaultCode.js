export const defaultCode = `import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState('#007AFF');

  const handlePress = () => {
    setCount(count + 1);
    setColor(count % 2 === 0 ? '#FF6B6B' : '#4ECDC4');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 React Native Web View</Text>
      <Text style={styles.subtitle}>
        Edit this code and see changes live in the mobile preview!
      </Text>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Tap Count: {count}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: color }]}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>Tap Me! 👆</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.instructions}>
        Try editing the code on the left to see real-time updates!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
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
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  counterText: {
    fontSize: 20,
    color: '#34495e',
    marginBottom: 15,
    fontWeight: '600',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});`;
