import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ClientDashboardModal = ({ show, onHide }) => {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cellPhone: '',
    relationship: '',
    privatePayAmount: '',
    hasAssessment: '',
    acceptedTerms: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_ENDPOINT}/sendConfirmationText`,
        {
          phone: formData.cellPhone,
        }
      );
      setStep(2);
      setError('');
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ENDPOINT}/verifyConfirmationCode`,
        {
          phoneNumber: formData.cellPhone,
          code: verificationCode,
        }
      );

      if (response.data === 'Confirmation code is valid') {
        onHide();
        setStep(1); // Reset step for next time
        setVerificationCode(''); // Clear verification code
        try {
          await axios.post(`${process.env.REACT_APP_ENDPOINT}/sendSurvey`, {
            userId: currentUser.uid,
            surveyResponses: formData,
          });
        } catch (err) {
          console.error('Error sending survey:', err);
        }
        setError('');
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Body className="p-4">
        {step === 1 ? (
          <>
            <div className="text-center mb-6 text-2xl font-bold text-orange-400">
              <p>Enter Information</p>
              <p>To Receive Matches!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-3 w-full">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  className="w-full p-2 border rounded-md"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name *"
                  className="w-full p-2 border rounded-md"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <input
                type="tel"
                name="cellPhone"
                placeholder="Cell phone *"
                className="w-full p-2 border rounded-md"
                value={formData.cellPhone}
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                name="relationship"
                placeholder="Relationship to senior"
                className="w-full p-2 border rounded-md"
                value={formData.relationship}
                onChange={handleInputChange}
              />

              <div className="flex w-full gap-3">
                {/* Private Pay: Yes/No */}
                <select
                  name="privatePayAmount"
                  className="w-full p-2 border rounded-md text-gray-800"
                  value={formData.privatePayAmount}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Private pay *</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>

                {/* Assessment: Active/Expired */}
                <select
                  name="hasAssessment"
                  className="w-full p-2 border rounded-md text-gray-800"
                  value={formData.hasAssessment}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Has assessment *</option>
                  <option value="active">
                    Yes, I have an active assessment
                  </option>
                  <option value="not active">
                    No, I do not have an active assessment
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  id="terms"
                  className="w-4 h-4"
                  checked={formData.acceptedTerms}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="terms" className="text-sm">
                  I have read and agree to the terms & conditions & privacy
                  policy.
                </label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors"
              >
                Next
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-6 text-2xl font-bold text-orange-400">
              <p>Enter SMS Code</p>
            </div>

            <form onSubmit={handleVerification} className="space-y-3">
              <input
                type="text"
                placeholder="Enter verification code"
                className="w-full p-2 border rounded-md"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors"
              >
                Verify
              </button>
            </form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ClientDashboardModal;
