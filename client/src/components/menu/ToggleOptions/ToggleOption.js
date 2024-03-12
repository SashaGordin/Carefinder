import React from "react";
import "./ToggleOption.css";


const ToggleOption = ({ name, label, value, setValue, iconOn, iconOff }) => {
	const toggleValue = async () => {
		const newValue = !value;
		setValue(newValue);

		// Update database
		// Assuming you have a reference to Firestore and the current user's document
	};

	return (
		<div className="toggle-option">
			<img src={value ? iconOn : iconOff} alt={name} onClick={toggleValue} />
      <h2>{name}</h2>
		</div>
	);
};

export default ToggleOption;