import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { CheckIcon } from '@heroicons/react/24/solid';

const SurveyInfo = ({
  onSelect,
  onNext,
  onBack,
  currentQuestionIndex,
  totalQuestions,
}) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      phoneNumber: '',
      email: '',
      isPOA: '',
    },
    seniorInfo: {
      seniorName: '',
      seniorAge: '',
      seniorSex: '',
    },
  });

  const [isChecked, setIsChecked] = useState(false);
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  //handle input validation
  const [inputErrors, setInputErrors] = useState({
    personalInfo: {
      name: '',
      phoneNumber: '',
      email: '',
      isPOA: '',
    },
    seniorInfo: {
      seniorName: '',
      seniorAge: '',
      seniorSex: '',
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
    let error = '';

    // Ignore dashes, spaces, open paren "(" and close paren ")" characters during input value for phone number validations -- will still show on screen, but will validate
    // works well, but what it people begin their ph with "1" or "+1"?
    let sanitizedValue = value;
    if (name === 'phoneNumber') {
      // eslint-disable-next-line no-useless-escape
      sanitizedValue = value.replace(/[-\s\(\)]/g, '');
    }

    switch (name) {
      case 'phoneNumber':
        // Regular expression to validate phone number format
        // eslint-disable-next-line no-case-declarations
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(sanitizedValue)) {
          error = 'Please enter a valid phone number';
        }
        break;
      case 'email':
        // Regular expression to validate email format
        // eslint-disable-next-line no-case-declarations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'seniorAge':
        // eslint-disable-next-line no-case-declarations
        const age = parseInt(value);
        if (isNaN(age) || age < 18) {
          error = 'Please enter a valid age';
        }
        break;
      default:
        // For other fields, just check if it's empty
        if (value.trim() === '') {
          error = 'This field is required';
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
        if (formData[section][field].trim() === '') {
          // If any field is empty, update inputErrors state and return
          setInputErrors((prevState) => ({
            ...prevState,
            [section]: {
              ...prevState[section],
              [field]: 'This field is required',
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

  const handleBack = () => {
    onBack();
  };

  const inputStyle = {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 justify-center pt-4">
        <div className="bg-[#1e1e1e] w-[30rem] py-8 px-10 rounded-lg">
          <div className="w-[20rem]">
            <h2>Personal Info</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <div>
                  <label htmlFor="name" className="text-white text-sm">
                    Your name (person doing the search)
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="enter name"
                    className="text-md"
                    value={formData.personalInfo.name}
                    onChange={(e) => handleChange(e, 'personalInfo')}
                  />
                  {inputErrors.personalInfo.name && (
                    <div className="text-danger">
                      {inputErrors.personalInfo.name}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="text-white text-sm">
                    Phone number
                  </label>
                  <div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="enter phone number"
                      className="text-md"
                      value={formData.personalInfo.phoneNumber}
                      onChange={(e) => handleChange(e, 'personalInfo')}
                    />
                    {inputErrors.personalInfo.phoneNumber && (
                      <div className="text-danger">
                        {inputErrors.personalInfo.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-white text-sm">
                    Email
                  </label>
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="enter email"
                      className="text-md"
                      value={formData.personalInfo.email}
                      onChange={(e) => handleChange(e, 'personalInfo')}
                    />
                    {inputErrors.personalInfo.email && (
                      <div className="text-danger">
                        {inputErrors.personalInfo.email}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="isPOA" className="text-white text-sm">
                    Do any of the following apply?
                  </label>
                  <div>
                    <select
                      className="text-md text-black"
                      id="isPOA"
                      name="isPOA"
                      placeholder="select option"
                      value={formData.personalInfo.isPOA}
                      onChange={(e) => handleChange(e, 'personalInfo')}
                      style={inputStyle}
                    >
                      <option value="">Select an option</option>
                      <option value="Not_POA">Not a Power of Attorney</option>
                      <optgroup label="Powers of Attorney (POA)">
                        <option value="general">
                          General Power of Attorney
                        </option>
                        <option value="limited">
                          Limited or Special Power of Attorney
                        </option>
                        <option value="durable">
                          Durable Power of Attorney
                        </option>
                        <option value="medical">
                          Medical or Healthcare Power of Attorney
                        </option>
                        <option value="financial">
                          Financial Power of Attorney
                        </option>
                        <option value="springing">
                          Springing Power of Attorney
                        </option>
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
                        <option value="healthcare-proxy">
                          Healthcare Proxy
                        </option>
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
                <h2 className="text-white mt-4">Senior Info</h2>
                <div>
                  <label htmlFor="seniorName" className="text-white text-sm">
                    Name & Last Name
                  </label>
                  <div>
                    <input
                      type="text"
                      id="seniorName"
                      name="seniorName"
                      placeholder="enter senior's name"
                      className="text-md"
                      value={formData.seniorInfo.seniorName}
                      onChange={(e) => handleChange(e, 'seniorInfo')}
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
                    <label htmlFor="seniorAge" className="text-white text-sm">
                      Age
                    </label>
                    <div>
                      <input
                        type="number"
                        id="seniorAge"
                        name="seniorAge"
                        value={formData.seniorInfo.seniorAge}
                        onChange={(e) => handleChange(e, 'seniorInfo')}
                      />
                      {inputErrors.seniorInfo.seniorAge && (
                        <div className="text-danger">
                          {inputErrors.seniorInfo.seniorAge}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="seniorSex" className="text-white text-sm">
                      Sex
                    </label>
                    <div>
                      <select
                        className="text-md text-black"
                        id="seniorSex"
                        name="seniorSex"
                        value={formData.seniorInfo.seniorSex}
                        onChange={(e) => handleChange(e, 'seniorInfo')}
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
            </form>
          </div>
        </div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="hidden"
          />
          <div
            className={`w-6 h-6 border rounded ${
              isChecked ? 'bg-pink-500' : 'bg-white'
            } flex items-center justify-center`}
          >
            {isChecked && <CheckIcon className="w-6 h-6 text-white" />}
          </div>
          <span className="ml-3 text-white">
            I have read and agree to the terms & conditions & privacy policy.
          </span>
        </label>
      </div>
      <div className="w-full h-2 bg-gray-200 fixed bottom-0 left-0 rounded mb-20">
        <div
          className="h-full bg-pink-500 transition-all duration-300 rounded"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div className="d-flex justify-content-between mx-20 my-4">
          <Button variant="secondary" className="px-2" onClick={handleBack}>
            Back
          </Button>
          <Button variant="primary" className="px-2" onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default SurveyInfo;
