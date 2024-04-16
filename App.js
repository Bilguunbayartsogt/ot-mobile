import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	View,
	Button,
	TouchableOpacity,
	Pressable,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
// import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs-react-native";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

export default function App() {
	const [type, setType] = useState(CameraType.back);
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const [isCamera, setIsCamera] = useState(false);
	const [isTfReady, setIsTfReady] = useState(false);

	async function componentDidMount() {
		// Wait for tf to be ready.
		await tf.ready();
		// Signal to the app that tensorflow.js can now be used.
		setIsTfReady(true);
	}

	var model = undefined;
	cocoSsd.load().then((loadedModel) => {
		model = loadedModel;
	});

	if (!permission) {
		// Camera permissions are still loading
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet
		return (
			<View style={styles.container}>
				<Text style={{ textAlign: "center" }}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}

	function toggleCameraType() {
		setType((current) =>
			current === CameraType.back ? CameraType.front : CameraType.back
		);
	}

	function toggleCamera() {
		setIsCamera((prev) => !prev);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerText}>Camera</Text>
			</View>
			{isCamera ? (
				<Camera style={styles.camera} type={type}>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={toggleCameraType}>
							<Text style={styles.text}>Flip Camera</Text>
						</TouchableOpacity>
					</View>
				</Camera>
			) : (
				<View style={styles.home}>
					<Text>Enable camera</Text>
				</View>
			)}
			<View style={styles.toggleCamera}>
				<Pressable style={styles.toggleCamBtn} onPress={toggleCamera}>
					{isCamera ? (
						<Text style={styles.toggleCamText}>Close Camera</Text>
					) : (
						<Text style={styles.toggleCamText}>Open Camera</Text>
					)}
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	header: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30,
		padding: 5,
	},
	headerText: {
		fontSize: 30,
		fontWeight: "bold",
	},
	home: {
		flex: 10,
	},
	camera: {
		flex: 10,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 40,
	},
	button: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	toggleCamera: {
		flex: 1,
		backgroundColor: "white",
	},
	toggleCamBtn: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	toggleCamText: {
		fontSize: 30,
	},
});
