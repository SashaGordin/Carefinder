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

		// Ignore dashes, spaces, open paren "(" and close paren ")" characters during input value for phone number validations -- will still show on screen, but will validate
		// works well, but what it people begin their ph with "1" or "+1"?
		let sanitizedValue = value;
		if (name === "phoneNumber") {
			// eslint-disable-next-line no-useless-escape
			sanitizedValue = value.replace(/[-\s\(\)]/g, '');
		}

		switch (name) {
			case "phoneNumber":
				// Regular expression to validate phone number format
				const phoneRegex = /^\d{10}$/;
				if (!phoneRegex.test(sanitizedValue)) {
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
				if (isNaN(age) || age < 18) {
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
								<div className="text-danger">
									{inputErrors.personalInfo.phoneNumber}
								</div>
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
								<div className="text-danger">
									{inputErrors.personalInfo.email}
								</div>
							)}
						</div>
					</div>
					<div>
						<label htmlFor="isPOA">Do any of the following apply?</label>
						<div>
							<select
								className=""
								id="isPOA"
								name="isPOA"
								value={formData.personalInfo.isPOA}
								onChange={(e) => handleChange(e, "personalInfo")}
								style={inputStyle}
							>
								<option value="">Select an option</option>
								<optgroup label="Powers of Attorney (POA)">
									<option value="general">General Power of Attorney</option>
									<option value="limited">
										Limited or Special Power of Attorney
									</option>
									<option value="durable">Durable Power of Attorney</option>
									<option value="medical">
										Medical or Healthcare Power of Attorney
									</option>
									<option value="financial">Financial Power of Attorney</option>
									<option value="springing">Springing Power of Attorney</option>
									<option value="non-durable">
										Non-Durable Power of Attorney
									</option>
									<option value="special-real-estate">
										Special Power of Attorney for Real Estate
									</option>
								</optgroup>
								<optgroup label="Guardianship">
									<option value="guardianship-person">
										Guardianship of the Person
									</option>
									<option value="guardianship-estate">
										Guardianship of the Estate
									</option>
									<option value="limited-guardianship">
										Limited Guardianship
									</option>
									<option value="temporary-guardianship">
										Temporary Guardianship
									</option>
									<option value="voluntary-guardianship">
										Voluntary Guardianship
									</option>
									<option value="guardianship-minor-children">
										Guardianship of Minor Children
									</option>
								</optgroup>
								<optgroup label="Other Legal Arrangements or Roles">
									<option value="trustee">Trustee</option>
									<option value="executor">
										Executor or Personal Representative
									</option>
									<option value="healthcare-proxy">Healthcare Proxy</option>
									<option value="representative-payee">
										Representative Payee
									</option>
									<option value="conservatorship">Conservatorship</option>
									<option value="agent-living-will">
										Agent under a Living Will or Advance Directive
									</option>
									<option value="court-appointed-advocate">
										Court-Appointed Advocate or Guardian
									</option>
								</optgroup>
							</select>
							{inputErrors.personalInfo.isPOA && (
								<div className="text-danger">
									{inputErrors.personalInfo.isPOA}
								</div>
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
								placeholder="enter senior's name"
								value={formData.seniorInfo.seniorName}
								onChange={(e) => handleChange(e, "seniorInfo")}
							/>
							{inputErrors.seniorInfo.seniorName && (
								<div className="text-danger">
									{inputErrors.seniorInfo.seniorName}
								</div>
							)}
						</div>
					</div>
					<div class="flex justify-between gap-10">
						<div>
							<label htmlFor="seniorAge">Age</label>
							<div>
								<input
									type="number"
									id="seniorAge"
									name="seniorAge"
									placeholder="enter senior's age"
									value={formData.seniorInfo.seniorAge}
									onChange={(e) => handleChange(e, "seniorInfo")}
								/>
								{inputErrors.seniorInfo.seniorAge && (
									<div className="text-danger">
										{inputErrors.seniorInfo.seniorAge}
									</div>
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
									<div className="text-danger">
										{inputErrors.seniorInfo.seniorSex}
									</div>
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
