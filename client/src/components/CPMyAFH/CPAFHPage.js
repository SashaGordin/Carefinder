import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const AFHPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(new Set());

  const toggleOption = (option) => {
    setSelectedOptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(option)) {
        newSet.delete(option);
      } else {
        newSet.add(option);
      }
      return newSet;
    });
  };

  const staticInfo = {
    name: 'Above Woodinville AFH',
    licenseNumber: '753159',
    yearLicensed: '1998',
    address: '14907 201st ave ne Woodinville, WA',
    specialties: 'Mental Health, Dementia, Developmental Disabilities',
    contracts:
      'Specialized Behavior Support, Private Duty Nursing, HCS Meaningful Day, Expanded Community Services, DDA Meaningful Day',
  };

  const questions = [
    {
      id: 1,
      section: 'Resident Type',
      question:
        'What type of resident do you seek to care for? (Select care levels)',
      type: 'multiselect',
      options: ['Low', 'Medium', 'Heavy', 'Total'],
    },
    {
      id: 2,
      section: 'Resident Type',
      question: 'What type of residents are you comfortable taking?',
      type: 'multiselect',
      options: [
        'Two person transfers',
        'Wanderers',
        'Awake at night',
        'Mismanage medications',
        'Behavioral issues',
        'Homeless',
        'Adults under',
      ],
    },
    {
      id: 3,
      section: 'Resident Type',
      question: 'Care level',
      type: 'multiselect',
      options: ['Male', 'Female', 'Other'],
    },
    {
      id: 4,
      section: 'Resident Type',
      question: 'Size of person, must be',
      type: 'multiselect',
      options: ['Small', 'Medium', 'Large'],
    },
    {
      id: 5,
      section: 'Resident Type',
      question: 'Financials',
      type: 'multiselect',
      options: ['Private pay', 'Medicaid'],
    },
    {
      id: 6,
      section: 'Resident Type',
      question: 'If private, do you require a certain amount of funds?',
      type: 'multiselect',
      options: ['$50k', '$100k', '$250k', '$500k', '$750k', '$1 million'],
      dependsOn: {
        questionId: 5,
        value: 'Private pay',
      },
    },
    {
      id: 7,
      section: 'Resident Type',
      question: 'If private, do you require a spend down rate?',
      type: 'number',
      placeholder: 'Enter number of years at market rate',
      dependsOn: {
        questionId: 5,
        value: 'Private pay',
      },
    },
    {
      id: 8,
      section: 'Operations',
      question: 'How is the AFH operated?',
      type: 'multiselect',
      options: [
        'Provider lives in AFH',
        'Provider lives outside of AFH',
        'Provider is at AFH during day',
        'Provider has a manager in place',
      ],
    },
    {
      id: 9,
      section: 'Operations',
      question: 'What is the staffing ratio during the day?',
      type: 'multiselect',
      options: ['1:6', '1:8', '2:6', '2:8'],
    },
    {
      id: 10,
      section: 'Operations',
      question: 'What is the staffing ratio during the night?',
      type: 'multiselect',
      options: ['1:6', '1:8', '2:6', '2:8'],
    },
    {
      id: 12,
      section: 'Facility Features',
      question: 'What type of rooms do you offer?',
      type: 'multiselect',
      options: [
        'Private rooms',
        'Shared rooms',
        'Private bathrooms',
        'Shared bathrooms',
        'Furnished available',
        'Unfurnished only',
      ],
    },
    {
      id: 13,
      section: 'Facility Features',
      question: 'What security features does your facility have?',
      type: 'multiselect',
      options: [
        '24/7 surveillance',
        'Door alarms',
        'Window alarms',
        'Keypad entry',
        'Security staff',
        'Emergency response system',
      ],
    },
    {
      id: 14,
      section: 'Medical Care',
      question: 'What medical services are available on-site?',
      type: 'multiselect',
      options: [
        'Medication management',
        'Wound care',
        'Diabetes management',
        'Physical therapy',
        'Occupational therapy',
        'Speech therapy',
      ],
    },
    {
      id: 15,
      section: 'Medical Care',
      question: 'What level of nursing support do you provide?',
      type: 'multiselect',
      options: [
        'RN on staff',
        'LPN on staff',
        'CNA on staff',
        'On-call nursing',
        'Visiting nurse services',
      ],
    },
    {
      id: 16,
      section: 'Activities',
      question: 'What types of organized activities do you offer?',
      type: 'multiselect',
      options: [
        'Group exercises',
        'Arts and crafts',
        'Music therapy',
        'Religious services',
        'Community outings',
        'Garden activities',
      ],
    },
    {
      id: 17,
      section: 'Activities',
      question: 'How often do you organize family events?',
      type: 'multiselect',
      options: [
        'Weekly',
        'Monthly',
        'Quarterly',
        'Major holidays only',
        'By request',
      ],
    },
    {
      id: 18,
      section: 'Dietary Services',
      question: 'What special diets can you accommodate?',
      type: 'multiselect',
      options: [
        'Diabetic',
        'Low sodium',
        'Gluten-free',
        'Vegetarian',
        'Kosher',
        'Halal',
        'Pureed foods',
      ],
    },
    {
      id: 19,
      section: 'Transportation',
      question: 'What transportation services do you provide?',
      type: 'multiselect',
      options: [
        'Medical appointments',
        'Shopping trips',
        'Religious services',
        'Social events',
        'Family visits',
      ],
    },
    {
      id: 20,
      section: 'Policies',
      question: 'What are your visiting hours?',
      type: 'multiselect',
      options: [
        '24/7 access',
        'Daytime only',
        'By appointment',
        'Set visiting hours',
        'Flexible schedule',
      ],
    },
    {
      id: 21,
      section: 'Policies',
      question: 'What is your pet policy?',
      type: 'multiselect',
      options: [
        'Pets allowed to live-in',
        'Visiting pets allowed',
        'Service animals only',
        'No pets allowed',
        'Case by case basis',
      ],
    },
  ];

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Static Information Section */}
      <div className="mb-6 bg-zinc-900 rounded-lg p-4">
        <div className="space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-gray-400 text-sm">Adult Family Home Name</p>
              <p className="text-white font-semibold">{staticInfo.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">License Number</p>
              <p className="text-white font-semibold">
                {staticInfo.licenseNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Year Licensed</p>
              <p className="text-white font-semibold">
                {staticInfo.yearLicensed}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Home Address</p>
              <p className="text-white font-semibold">{staticInfo.address}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800"></div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Specialties</p>
              <p className="text-white mt-1">{staticInfo.specialties}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Contracts</p>
              <p className="text-white mt-1">{staticInfo.contracts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Section */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">AFH Survey</h2>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
          <div
            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <p className="text-pink-500 text-sm font-medium mb-1">
            Section {currentQuestion + 1} of {questions.length}
          </p>
          <h3 className="text-lg font-bold">
            {questions[currentQuestion].section}
          </h3>
        </div>

        {/* Question Display */}
        <div className="min-h-[160px] mb-4">
          <h3 className="text-lg font-semibold mb-4">
            {questions[currentQuestion].question}
          </h3>

          {questions[currentQuestion].type === 'boolean' && (
            <div className="flex space-x-4">
              <button className="flex-1 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 text-white font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                Yes
              </button>
              <button className="flex-1 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 text-white font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                No
              </button>
            </div>
          )}
          {questions[currentQuestion].type === 'text' && (
            <div className="relative">
              <input
                type="text"
                className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-400 border-2 border-transparent focus:border-pink-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter your answer..."
              />
            </div>
          )}
          {questions[currentQuestion].type === 'number' && (
            <div className="relative">
              <input
                type="number"
                className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-400 border-2 border-transparent focus:border-pink-500 focus:outline-none transition-colors duration-200"
                placeholder={
                  questions[currentQuestion].placeholder || 'Enter a number...'
                }
              />
            </div>
          )}
          {questions[currentQuestion].type === 'multiselect' && (
            <div className="flex flex-wrap gap-3">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`px-6 py-2 rounded-full transition-all duration-200 ${
                    selectedOptions.has(option)
                      ? 'bg-pink-500 text-white'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentQuestion === 0
                ? 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                : 'bg-zinc-800 hover:bg-zinc-700 text-white'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentQuestion === questions.length - 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentQuestion === questions.length - 1
                ? 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AFHPage;
