// Changes:
//	- Added input validations for username and password inputs
//	  (see Validation Rules, validateInput(), and Login() for changes)
//	- Attempted to add hashing for password storage and verification, but was unsuccessfull

import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRootStackParamList } from './App';

export interface IUser {
	username: string;
	password: string;
}

interface IProps {
	onLogin: (user: IUser) => void;
}

type TProps = NativeStackScreenProps<TRootStackParamList, 'Login'> & IProps;

// Validation rules (length and character restrictions)
const MAX_USERNAME_LENGTH = 30;
const MAX_PASSWORD_LENGTH = 64;

// Username: letters, numbers, underscores, and hyphens only
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

export default function Login(props: TProps) {
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');

	const users: IUser[] = [
		{ username: 'joe', password: 'secret' },
		{ username: 'bob', password: 'password' },
	];

	// Validate username and password inputs
	function validateInput(): string | null {
		const trimmedUsername = username.trim();

		if (trimmedUsername.length === 0) {
			return 'Username cannot be empty.';
		}
		if (trimmedUsername.length > MAX_USERNAME_LENGTH) {
			return `Username cannot exceed ${MAX_USERNAME_LENGTH} characters.`;
		}
		if (!USERNAME_PATTERN.test(trimmedUsername)) {
			return 'Username can only contain letters, numbers, underscores, and hyphens.';
		}
		if (password.length === 0) {
			return 'Password cannot be empty.';
		}
		if (password.length > MAX_PASSWORD_LENGTH) {
			return `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters.`;
		}
		return null;
	}

	function login() {
		const validationError = validateInput();
		if (validationError) {
			Alert.alert('Invalid Input', validationError);
			return;
		}

		const trimmedUsername = username.trim();
		let foundUser: IUser | false = false;

		for (const user of users) {
			if (trimmedUsername === user.username && password === user.password) {
				foundUser = user;

				break;
			}
		}

		if (foundUser) {
			props.onLogin(foundUser);
		} else {
			Alert.alert('Error', 'Username or password is invalid.');
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Login</Text>
			<TextInput
				style={styles.username}
				value={username}
				onChangeText={setUsername}
				placeholder="Username"
			/>
			<TextInput
				style={styles.password}
				value={password}
				onChangeText={setPassword}
				placeholder="Password"
			/>
			<Button title="Login" onPress={login} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	username: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		marginBottom: 10,
	},
	password: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		marginBottom: 10,
	}
});
