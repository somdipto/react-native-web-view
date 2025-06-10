export const defaultCode = `import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert
} from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState('#667eea');
  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const handlePress = () => {
    setCount(count + 1);
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    setColor(colors[count % colors.length]);
  };

  const showAlert = () => {
    Alert.alert(
      'Snack SDK Demo',
      'This alert works thanks to Snack SDK! 🎉',
      [{ text: 'Amazing!', onPress: () => console.log('Alert closed') }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🚀 Snack SDK Demo</Text>
      <Text style={styles.subtitle}>
        This showcases comprehensive React Native components powered by Expo Snack SDK
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interactive Counter</Text>
        <Text style={styles.counterText}>Count: {count}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: color }]}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>Tap Me! ({count})</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Text Input</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type something here..."
          value={text}
          onChangeText={setText}
        />
        {text ? <Text style={styles.inputDisplay}>You typed: {text}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Switch Control</Text>
        <View style={styles.switchContainer}>
          <Text>Enable notifications: </Text>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{ false: '#767577', true: color }}
            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        <Text style={styles.switchStatus}>
          Notifications are {isEnabled ? 'enabled' : 'disabled'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Demo</Text>
        <TouchableOpacity style={styles.alertButton} onPress={showAlert}>
          <Text style={styles.buttonText}>Show Alert</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        ✨ All these components work seamlessly with Snack SDK!
        {'\n'}Try editing the code to see real-time updates.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
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
  section: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  counterText: {
    fontSize: 20,
    color: '#34495e',
    marginBottom: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  alertButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  inputDisplay: {
    fontSize: 14,
    color: '#667eea',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  switchStatus: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
    lineHeight: 20,
  },
});`;
