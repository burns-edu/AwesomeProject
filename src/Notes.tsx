// Changes:
//	- Added input validations for title and equation inputs
//	  (see Validation Rules, validateTitle(), validateEquation(), and addNote() for changes)

import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Note from './components/Note';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRootStackParamList } from './App';

export interface INote {
	title: string;
	text: string;
}

interface IProps {
}

interface IState {
	notes: INote[];
	newNoteTitle: string;
	newNoteEquation: string;
}

type TProps = NativeStackScreenProps<TRootStackParamList, 'Notes'> & IProps;

// Validation rules (length and character restrictions)
const MAX_TITLE_LENGTH = 50;
const MAX_EQUATION_LENGTH = 200;

// Title: letters, numbers, spaces, and basic punctuation only
const TITLE_PATTERN = /^[a-zA-Z0-9 .,'!?-]+$/;

// Equation: digits, arithmetic operators, parentheses, decimal points, and spaces/tabs only
const EQUATION_PATTERN = /^[0-9+\-*/().\t ]+$/;

export default class Notes extends React.Component<TProps, IState> {
	constructor(props: Readonly<TProps>) {
		super(props);

		this.state = {
			notes: [],
			newNoteTitle: '',
			newNoteEquation: ''
		};

		this.onNoteTitleChange = this.onNoteTitleChange.bind(this);
		this.onNoteEquationChange = this.onNoteEquationChange.bind(this);
		this.addNote = this.addNote.bind(this);
	}

	public async componentDidMount() {
		const existing = await this.getStoredNotes();

		this.setState({ notes: existing });
	}

	public async componentWillUnmount() {
		this.storeNotes(this.state.notes);
	}

	private async getStoredNotes(): Promise<INote[]> {
		const username = this.props.route.params.user.username;
		const storageKey = 'notes-' + username;

		try {
			const encryptedValue = await EncryptedStorage.getItem(storageKey);
			
			if (encryptedValue !== null) {
				const parsed = JSON.parse(encryptedValue);
				return parsed.notes || [];
			}
			return [];
		} catch (error) {
			console.error('Error loading notes:', error);
			return [];
		}
	}

	private async storeNotes(notes: INote[]) {
		const username = this.props.route.params.user.username;
		const storageKey = 'notes-' + username;

		try {
			const dataToStore = {
				notes: notes,
				username: username,
				timestamp: new Date().toISOString()
			};
			
			const jsonValue = JSON.stringify(dataToStore);
			await EncryptedStorage.setItem(storageKey, jsonValue);
		} catch (error) {
			console.error('Error saving notes:', error);
		}
	}

	private onNoteTitleChange(value: string) {
		this.setState({ newNoteTitle: value });
	}

	private onNoteEquationChange(value: string) {
		this.setState({ newNoteEquation: value });
	}

	// Validate title input (length and character restrictions)
	private validateTitle(title: string): string | null {
		const trimmed = title.trim();

		if (trimmed.length === 0) {
			return 'Title cannot be empty.';
		}
		if (trimmed.length > MAX_TITLE_LENGTH) {
			return `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`;
		}
		if (!TITLE_PATTERN.test(trimmed)) {
			return 'Title can only contain letters, numbers, spaces, and basic punctuation.';
		}
		return null;
	}

	// Validate equation input (length and character restrictions)
	private validateEquation(equation: string): string | null {
		const trimmed = equation.trim();

		if (trimmed.length === 0) {
			return 'Equation cannot be empty.';
		}
		if (trimmed.length > MAX_EQUATION_LENGTH) {
			return `Equation cannot exceed ${MAX_EQUATION_LENGTH} characters.`;
		}
		if (!EQUATION_PATTERN.test(trimmed)) {
			return 'Equation can only contain numbers and + - * / ( ) symbols.';
		}
		return null;
	}

	private addNote() {
		const title = this.state.newNoteTitle.trim();
		const equation = this.state.newNoteEquation.trim();

		const titleError = this.validateTitle(title);
		if (titleError) {
			Alert.alert('Invalid Title', titleError);
			return;
		}

		const equationError = this.validateEquation(equation);
		if (equationError) {
			Alert.alert('Invalid Equation', equationError);
			return;
		}

		const note: INote = { title, text: equation };

		this.setState({ 
			notes: this.state.notes.concat(note),
			newNoteTitle: '',
			newNoteEquation: ''
		});
	}

	public render() {
		return (
			<SafeAreaView>
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					<View style={styles.container}>
						<Text style={styles.title}>
							{'Math Notes: ' + this.props.route.params.user.username}
						</Text>
						<TextInput
							style={styles.titleInput}
							value={this.state.newNoteTitle}
							onChangeText={this.onNoteTitleChange}
							placeholder="Enter your title"
						/>
						<TextInput
							style={styles.textInput}
							value={this.state.newNoteEquation}
							onChangeText={this.onNoteEquationChange}
							placeholder="Enter your math equation"
						/>
						<Button title="Add Note" onPress={this.addNote} />

						<View style={styles.notes}>
							{this.state.notes.map((note, index) => (
								<Note key={index} title={note.title} text={note.text} />
							))}
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

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
	titleInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		marginBottom: 10,
	},
	textInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		marginBottom: 10,
	},
	notes: {
		marginTop: 15
	},
});