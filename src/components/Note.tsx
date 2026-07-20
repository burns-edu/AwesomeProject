// Changes:
//	- replaced eval() function with more secure mathjs.evaluate() function
//	- implemented validation checks for input field and evaluated result
//	- implemented error handling for mathjs.evaluate() function

import React from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import {evaluate} from 'mathjs';

interface IProps {
  title: string;
  text: string;
}

function Note(props: IProps) {
  function evaluateEquation() {
    const input = props.text.trim();

    // Whitelist: digits, operators, parentheses, decimal points, and whitespace only
    const safePattern = /^[0-9+\-*/().\s]+$/;

    // Check input for illegal characters (see whitelist above)
    if (!safePattern.test(input)) {
      Alert.alert('Invalid input', 'Only numbers and + - * / ( ) are allowed.');
      return;
    }

    try {
      const result = evaluate(input);

      // Check result for non-numeric content
      if (typeof result !== 'number' || !Number.isFinite(result)) {
        Alert.alert(
          'Invalid input',
          'That expression did not produce a valid number.',
        );
        return;
      }

      // Display result
      Alert.alert('Result', 'Result: ' + result);
    } catch (err) {
      Alert.alert('Invalid input', 'Could not evaluate that expression.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.text}>{props.text}</Text>

      <View style={styles.evaluateContainer}>
        <Button title="Evaluate" onPress={evaluateEquation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
  },
  evaluateContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Note;
