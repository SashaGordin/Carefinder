import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClientDashboardSearchBar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleFindMatches,
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
      <div className="CFblackBackground">
        <div className="flex justify-center align-center p-3">
          <div className="flex flex-col relative w-full">
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
            id="findMatches"
            type="button"
            className="btn"
            onClick={() => handleFindMatches()}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#FFA500',
              color: 'white',
              marginRight: '10px',
            }}
          >
            Find a Match
          </button>
          <Link
            to="/survey"
            id="takeSurvey"
            type="button"
            className="btn"
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#FF69B4',
              color: 'white',
            }}
          >
            Contact us
          </Link>
        </div>
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
