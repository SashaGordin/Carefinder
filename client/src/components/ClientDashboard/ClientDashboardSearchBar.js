import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

const ClientDashboardSearchBar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  errorMessage,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const fetchPlacesAutocomplete = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_ENDPOINT}/getPlacesAutocomplete?searchQuery=${query}`
      );
      setSearchResults(response.data.places);
    } catch (err) {
      console.error('Error fetching location suggestions:', err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchPlacesAutocomplete(value);
  };

  return (
    <>
      {/* <div className="CFblackBackground">
        <div className="flex align-center p-3">
          <div className="flex flex-col relative">
            <input
              id="clientSearch"
              className="p-4 border-2 border-gray-300 rounded-lg mr-2 relative top-6 font-large"
              name="yyy"
              placeholder="Search city, zip code etc."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            {searchResults?.predictions?.length > 0 && (
              <ul className="absolute top-16 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchResults.predictions.map((result) => (
                  <li
                    key={result.place_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                    onClick={() => {
                      handleSearch(result.description);
                      setSearchResults([]);
                      setSearchQuery(result.description);
                    }}
                  >
                    {result.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            id="takeSurvey"
            className="btn"
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#FF69B4',
              color: 'white',
            }}
            onClick={() => setShowModal(true)}
          >
            Contact us
          </button>
        </div>
      </div> */}

      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="relative w-full items-center">
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
            name="search"
            placeholder="Search city, zip code etc."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />

          {searchResults?.predictions?.length > 0 && (
            <ul className="absolute w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.predictions.map((result) => (
                <li
                  key={result.place_id}
                  className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm transition-colors"
                  onClick={() => {
                    handleSearch(result.description);
                    setSearchResults([]);
                    setSearchQuery(result.description);
                  }}
                >
                  {result.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="px-6 py-3 flex-shrink-0 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 whitespace-nowrap">
          Contact us
        </button>
      </div>

      {errorMessage && (
        <div
          style={{
            color: 'red',
            marginTop: '10px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default ClientDashboardSearchBar;
