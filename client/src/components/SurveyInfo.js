import React, { useState } from "react";
import { Button } from "react-bootstrap";

const SurveyInfo = ({ onSelect, onNext, onBack }) => {
	const [formData, setFormData] = useState({
		personalInfo: {
			name: "",
			phoneNumber: "",
			email: "",
			isPOA: "",
		},
		seniorInfo: {
			seniorName: "",
			seniorAge: "",
			seniorSex: "",
		},
	});

	//handle input validation
	const [inputErrors, setInputErrors] = useState({
		personalInfo: {
			name: "",
			phoneNumber: "",
			email: "",
			isPOA: "",
		},
		seniorInfo: {
			seniorName: "",
			seniorAge: "",
			seniorSex: "",
		},
	});

	const handleChange = (e, section) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[section]: {
				...prevState[section],
				[name]: value,
			},
		}));
		onSelect(formData);

		validateInput(name, value, section);
	};

	const validateInput = (name, value, section) => {
    let error = "";

    switch (name) {
        case "phoneNumber":
            // Regular expression to validate phone number format
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(value)) {
                error = "Please enter a valid phone number";
            }
            break;
        case "email":
            // Regular expression to validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = "Please enter a valid email address";
            }
            break;
        case "seniorAge":
            const age = parseInt(value);
            if (isNaN(age) || age < 40 || age > 120) {
                error = "Please enter a valid age";
            }
            break;
        default:
            // For other fields, just check if it's empty
            if (value.trim() === "") {
                error = "This field is required";
            }
            break;
    }

    setInputErrors((prevState) => ({
        ...prevState,
        [section]: {
            ...prevState[section],
            [name]: error,
        },
    }));
};

	const handleSubmit = (e) => {
		e.preventDefault();

		for (const section in formData) {
			for (const field in formData[section]) {
				if (formData[section][field].trim() === "") {
					// If any field is empty, update inputErrors state and return
					setInputErrors((prevState) => ({
						...prevState,
						[section]: {
							...prevState[section],
							[field]: "This field is required",
						},
					}));
					return;
				}
			}
		}

		onNext();
	};

	const handleNext = (e) => {

		handleSubmit(e);
	};

	const inputStyle = {
		padding: "8px",
		fontSize: "16px",
		borderRadius: "4px",
		border: "1px solid #ccc",
		width: "100%",
		boxSizing: "border-box",
	};

	return (
		<div>
			<h2>We need some information</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<h3>Personal Info</h3>
					<div>
						<label htmlFor="name">Your name (person doing the search)</label>
						<input
							type="text"
							id="name"
							name="name"
							placeholder="enter name"
							value={formData.personalInfo.name}
							onChange={(e) => handleChange(e, "personalInfo")}
						/>
						{inputErrors.personalInfo.name && (
							<div className="text-danger">{inputErrors.personalInfo.name}</div>
						)}
					</div>
					<div>
						<label htmlFor="phoneNumber">Phone number</label>
						<div>
							<input
								type="tel"
								id="phoneNumber"
								name="phoneNumber"
								placeholder="enter phone number"
								value={formData.personalInfo.phoneNumber}
								onChange={(e) => handleChange(e, "personalInfo")}
							/>
							{inputErrors.personalInfo.phoneNumber && (
								<div className="text-danger">{inputErrors.personalInfo.phoneNumber}</div>
							)}
						</div>
					</div>
					<div>
						<label htmlFor="email">Email</label>
						<div>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="enter email"
								value={formData.personalInfo.email}
								onChange={(e) => handleChange(e, "personalInfo")}
							/>
							{inputErrors.personalInfo.email && (
								<div className="text-danger">{inputErrors.personalInfo.email}</div>
							)}
						</div>
					</div>
					<div>
						<label htmlFor="isPOA">Do any of the following apply?</label>
						<div>
							<select
								className="w-50"
								id="isPOA"
								name="isPOA"
								value={formData.personalInfo.isPOA}
								onChange={(e) => handleChange(e, "personalInfo")}
								style={inputStyle}
							>
								<option value="">Select an option</option>
								<option value="poa">I am POA</option>
								<option value="other">Other</option>
							</select>
							{inputErrors.personalInfo.isPOA && (
								<div className="text-danger">{inputErrors.personalInfo.isPOA}</div>
							)}
						</div>
					</div>
				</div>
				<div>
					<h3>Senior Info</h3>
					<div>
						<label htmlFor="seniorName">Name & Last Name</label>
						<div>
							<input
								type="text"
								id="seniorName"
								name="seniorName"
								placeholder="enter name"
								value={formData.seniorInfo.seniorName}
								onChange={(e) => handleChange(e, "seniorInfo")}
							/>
							{inputErrors.seniorInfo.seniorName && (
								<div className="text-danger">{inputErrors.seniorInfo.seniorName}</div>
							)}
						</div>
					</div>
					<div class="flex justify-between gap-10 w-50">
						<div>
							<label htmlFor="seniorAge">Age</label>
							<div>
								<input
									type="number"
									id="seniorAge"
									name="seniorAge"
									placeholder="enter your age"
									value={formData.seniorInfo.seniorAge}
									onChange={(e) => handleChange(e, "seniorInfo")}
								/>
								{inputErrors.seniorInfo.seniorAge && (
									<div className="text-danger">{inputErrors.seniorInfo.seniorAge}</div>
								)}
							</div>
						</div>
						<div>
							<label htmlFor="seniorSex">Sex</label>
							<div>
								<select
									id="seniorSex"
									name="seniorSex"
									value={formData.seniorInfo.seniorSex}
									onChange={(e) => handleChange(e, "seniorInfo")}
									style={inputStyle}
								>
									<option value="">Select an option</option>
									<option value="male">Male</option>
									<option value="female">Female</option>
								</select>
								{inputErrors.seniorInfo.seniorSex && (
									<div className="text-danger">{inputErrors.seniorInfo.seniorSex}</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="d-flex justify-content-between mt-4">
					<Button variant="primary" onClick={handleNext}>
						Next
					</Button>
				</div>
			</form>
		</div>
	);
};

export default SurveyInfo;
