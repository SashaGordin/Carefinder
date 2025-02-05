import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Assuming you have firebase.js setup
import { useAuth } from '../contexts/AuthContext';
import { getDoc, getDocs, doc, collection } from 'firebase/firestore';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';

import {
  Building,
  Home,
  ClipboardList,
  Video,
  MessageSquareQuote,
  HelpCircle,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  X,
  Plus,
} from 'lucide-react';
import ClaimProfileSurvey from '../components/ClaimProfile/ClaimProfileSurvey';
import AFHPage from '../components/CPMyAFH/CPAFHPage';

const PropertyCard = ({ property }) => (
  <div className="bg-zinc-900 rounded-lg p-6 w-4/5 h-48 mx-auto">
    <div className="flex items-center justify-between h-full">
      <div className="flex items-center space-x-6">
        <div className="relative w-24 h-24 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
          {property.homePhotos?.[0] ? (
            <img
              src={property.homePhotos[0]}
              alt={property.facilityName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">
            {property.facilityName}
          </h3>
          <p className="text-gray-400 text-sm mt-1">2 Available Rooms</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 text-sm px-4 py-1 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  </div>
);

const AddAFHModal = ({ isOpen, onClose, onAdd, userId }) => {
  const handleNewProperty = () => {
    onAdd();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
      style={{ marginTop: '10rem' }}
    >
      <div className="bg-zinc-900 rounded-lg w-full max-w-md max-h-3/4">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add AFH</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <ClaimProfileSurvey
          userId={userId}
          addAFH={true}
          handleNewProperty={handleNewProperty}
        />
        {/* 
        <form onSubmit={handleSubmit} className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search AFH name..."
              className="w-full bg-black rounded-lg pl-12 pr-4 py-2 text-white border border-zinc-800 focus:border-pink-500 focus:outline-none"
              autoFocus
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={!searchValue.trim()}
              className={`px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white transition-colors ${
                !searchValue.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Add AFH
            </button>
          </div>
        </form> */}
      </div>
    </div>
  );
};

const MyAFH = () => {
  const [activePage, setActivePage] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userData, setUserData] = useState({});
  const { currentUser } = useAuth();
  const [error, setError] = useState('');
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: 'Woodinville AFH',
      photoUrl: '/api/placeholder/400/400',
    },
    {
      id: 2,
      name: 'Gold Creek AFH',
      photoUrl: '/api/placeholder/400/400',
    },
    {
      id: 3,
      name: 'Loving Hearts AFH',
      photoUrl: '/api/placeholder/400/400',
    },
  ]);

  const categories = [
    {
      id: 1,
      title: 'AFH',
      icon: <Building className="w-6 h-6" />,
      description: 'Adult Family Home Details',
      content: <AFHPage />,
    },
    {
      id: 2,
      title: 'Meet the Provider',
      icon: <MessageSquareQuote className="w-6 h-6" />,
      description: 'Provider Information and Introduction',
    },
    {
      id: 3,
      title: 'Video Introduction',
      icon: <Video className="w-6 h-6" />,
      description: 'Add or Update Video Content',
    },
    {
      id: 4,
      title: 'Home & Listings',
      icon: <Home className="w-6 h-6" />,
      description: 'Map, Photos, and Testimonials',
    },
    {
      id: 5,
      title: 'Testimonials',
      icon: <MessageSquareQuote className="w-6 h-6" />,
      description: 'Customer Reviews and Feedback',
    },
    {
      id: 6,
      title: 'FAQ',
      icon: <HelpCircle className="w-6 h-6" />,
      description: 'Frequently Asked Questions',
    },
    {
      id: 7,
      title: 'Admissions & Enrollment',
      icon: <ClipboardList className="w-6 h-6" />,
      description: 'Admission Process and Documentation',
    },
    {
      id: 8,
      title: 'Cost of Care',
      icon: <DollarSign className="w-6 h-6" />,
      description: 'Pricing and Payment Information',
    },
  ];

  const fetchData = async () => {
    const userDocRef = doc(firestore, 'users', currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();

      const listings = [];
      const listingsPath = userDocSnapshot.ref.path + '/listings';
      console.log('getting docs from: ' + listingsPath);
      const listingsSnapshot = await getDocs(
        collection(firestore, listingsPath)
      );
      //get data for all listings for user

      listingsSnapshot.forEach((listing) => {
        const data = listing.data();
        console.log(data);
        listings.push(data);
      });
      if (listings.length === 0) {
        listings.push({
          facilityName: userData.FacilityName,
          licenseNumber: userData.LicenseNumber,
          listingAddress: `${userData.LocationAddress}, ${userData.LocationCity}, ${userData.LocationState} ${userData.LocationZipCode} `,
        });
      }
      console.log('listingsLength=' + listings.length);
      setProperties([...listings]);
      console.log(userData);
      setUserData(userData);
    } else {
      setError('User document not found');
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleNext = () => {
    setActiveCardIndex((prev) =>
      prev === properties.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevious = () => {
    setActiveCardIndex((prev) =>
      prev === 0 ? properties.length - 1 : prev - 1
    );
  };

  const handleAddProperty = (newProperty) => {
    const newPropertyCard = {
      licenseNumber: newProperty.LicenseNumber,
      facilityName: newProperty.facilityName,
    };
    setProperties((prev) => [...prev, newPropertyCard]);
    setActiveCardIndex(properties.length);
  };

  return (
    <div>
      <TopNav userRole="provider" />
      <div className="min-h-screen bg-black text-white p-6 relative overflow-x-hidden">
        <div className="mb-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add AFH</span>
            </button>
          </div>

          <div className="relative px-12">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeCardIndex * 100}%)` }}
              >
                {properties.map((property) => (
                  <div
                    key={property.licenseNumber}
                    className="w-full flex-shrink-0"
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            </div>

            {properties.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-pink-500 hover:bg-pink-600 rounded-full p-3 transform transition-all hover:scale-110 hover:-translate-x-1"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-pink-500 hover:bg-pink-600 rounded-full p-3 transform transition-all hover:scale-110 hover:translate-x-1"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {properties.length > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {properties.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeCardIndex ? 'bg-pink-500' : 'bg-zinc-700'
                  }`}
                  onClick={() => setActiveCardIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold">Manage Profile</h1>
        </header>

        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-zinc-900 rounded-lg overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer hover:bg-zinc-800 transition-colors duration-200"
                onClick={() => setActivePage(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <h2 className="text-lg font-semibold">{category.title}</h2>
                  </div>
                  <ChevronRight className="w-5 h-5 text-pink-500" />
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <AddAFHModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={fetchData}
          userId={currentUser.uid}
        />

        <div
          className={`fixed top-0 right-0 w-full h-full bg-black transform transition-transform duration-300 ease-in-out ${activePage ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {activePage && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {categories.find((c) => c.id === activePage)?.title}
                </h2>
                <button
                  className="text-white"
                  onClick={() => setActivePage(null)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4">
                {categories.find((c) => c.id === activePage)?.content}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAFH;
