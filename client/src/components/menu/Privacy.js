// MenuComponent.js
import React, { useState, useEffect } from "react";
import {
	updateDoc,
	doc,
	getDoc,
} from "firebase/firestore";
import ToggleOption from "./ToggleOptions/ToggleOption";
import { firestore } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
// Assuming you have firebase.js setup

const PrivacyPage = () => {
	const { currentUser } = useAuth();

	const [privacyData, setPrivacyData] = useState(null);

	useEffect(() => {
		const fetchPrivacyData = async () => {
			try {
				const userDocRef = doc(firestore, "users", currentUser.uid);

				// Fetch the user document
				const userDocSnapshot = await getDoc(userDocRef);

				if (userDocSnapshot.exists()) {
					const userData = userDocSnapshot.data();

					// Check if the user document contains the privacy object
					if (userData.privacy) {
						// If privacy object exists, setPrivacyData with its data
						setPrivacyData(userData.privacy);
					}
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchPrivacyData();
	}, [currentUser]);

	const handleToggleChange = async (label, newValue) => {
		try {
			const userDocRef = doc(firestore, "users", currentUser.uid);

			// Get current user data
			const userDocSnapshot = await getDoc(userDocRef);
			const userData = userDocSnapshot.data();

			// Update privacy object with new value
			const updatedPrivacy = {
				...userData.privacy,
				[label]: newValue,
			};

			// Update database with the updated privacy object
			await updateDoc(userDocRef, {
				[`privacy.${label}`]: newValue,
			});

			// Update state with the fetched data
			setPrivacyData(updatedPrivacy);
		} catch (error) {
			console.error("Error updating privacy data:", error);
		}
	};

	if (!privacyData) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<ToggleOption
				name="Allow Anyone To Message"
				label="allowAnyoneToMessage"
				value={privacyData.allowAnyoneToMessage}
				setValue={(newValue) =>
					handleToggleChange("allowAnyoneToMessage", newValue)
				}
				iconOn="toggleon.png"
				iconOff="toggleoff.png"
			/>
			<ToggleOption
				name="Recieve Email Notifications"
				label="receiveEmailNotifications"
				value={privacyData.receiveEmailNotifications}
				setValue={(newValue) =>
					handleToggleChange("receiveEmailNotifications", newValue)
				}
				iconOn="toggleon.png"
				iconOff="toggleoff.png"
			/>
			<ToggleOption
				name="Recieve Text Notifications"
				label="receiveTextNotifications"
				value={privacyData.receiveTextNotifications}
				setValue={(newValue) =>
					handleToggleChange("receiveTextNotifications", newValue)
				}
				iconOn="toggleon.png"
				iconOff="toggleoff.png"
			/>
		</div>
	);
};

export default PrivacyPage;
