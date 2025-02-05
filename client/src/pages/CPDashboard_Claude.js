import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import TopNav from '../components/TopNav';
import {
  CalendarPlus,
  MessageCircle,
  DollarSign,
  Video,
  PartyPopper,
  Bell,
  Home,
  ArrowLeft,
} from 'lucide-react';

const DarkCard = ({ children, className = '' }) => (
  <Card
    className={`!bg-black border border-zinc-800 rounded-xl shadow-none ${className}`}
  >
    <div className="bg-black">{children}</div>
  </Card>
);

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
      ${
        active
          ? 'bg-zinc-900 text-white'
          : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'
      }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

const CPDashboard = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [slideDirection, setSlideDirection] = useState('right');
  const userName = 'Caroline';

  // Added more notifications to test scrolling
  const notifications = [
    {
      id: 1,
      message: 'Tour request from Sarah',
      details: '(Private Pay)',
      time: '10 minutes ago',
      icon: <CalendarPlus className="w-5 h-5 text-pink-500" />,
    },
    {
      id: 2,
      message: 'Quote requested from David',
      details: '(Medicaid)',
      time: '1 hour ago',
      icon: <DollarSign className="w-5 h-5 text-white" />,
    },
    {
      id: 3,
      message: 'Virtual Meeting requested by Thompson',
      details: '(Medicaid)',
      time: '2 hours ago',
      icon: <Video className="w-5 h-5 text-purple-500" />,
    },
    {
      id: 4,
      message: 'New message from Sarah',
      details: '(Private Pay)',
      time: '3 hours ago',
      icon: <MessageCircle className="w-5 h-5 text-orange-500" />,
    },
    {
      id: 5,
      message: 'You sent quote to Sarah',
      details: '(Private Pay)',
      time: '4 hours ago',
      icon: <DollarSign className="w-5 h-5 text-white" />,
    },
    {
      id: 6,
      message: 'Congratulations, you have a booking!',
      time: '5 hours ago',
      icon: <PartyPopper className="w-5 h-5 text-yellow-500" />,
    },
    // Duplicate notifications to test scrolling
    {
      id: 7,
      message: 'Tour request from Sarah',
      details: '(Private Pay)',
      time: '1 day ago',
      icon: <CalendarPlus className="w-5 h-5 text-pink-500" />,
    },
    {
      id: 8,
      message: 'Quote requested from David',
      details: '(Medicaid)',
      time: '1 day ago',
      icon: <DollarSign className="w-5 h-5 text-white" />,
    },
    {
      id: 9,
      message: 'Virtual Meeting requested by Thompson',
      details: '(Medicaid)',
      time: '2 days ago',
      icon: <Video className="w-5 h-5 text-purple-500" />,
    },
    {
      id: 10,
      message: 'New message from Sarah',
      details: '(Private Pay)',
      time: '2 days ago',
      icon: <MessageCircle className="w-5 h-5 text-orange-500" />,
    },
  ];

  const handleTabChange = (tab, direction) => {
    setSlideDirection(direction);
    setActiveTab(tab);
  };

  const NotificationsTab = () => (
    <div className="space-y-4 pb-8">
      {notifications.map((notification) => (
        <DarkCard key={notification.id}>
          <div className="p-6 hover:bg-zinc-900/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="mt-1">{notification.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white text-lg">{notification.message}</p>
                  {notification.details && (
                    <span className="text-sm text-gray-400">
                      {notification.details}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
        </DarkCard>
      ))}
    </div>
  );

  const MyAFHTab = () => (
    <div className="fixed inset-0 bg-black transition-transform duration-300 z-10">
      <div className="p-8">
        <button
          onClick={() => handleTabChange('notifications', 'left')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="space-y-4">{/* Content will be added here */}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed Header */}
      <TopNav userRole="provider" />
      <header className="bg-black z-10 border-b border-zinc-800">
        <div className="w-full max-w-5xl mx-auto p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold text-white">
                Welcome, {userName}
              </h1>
              <p className="text-gray-400 mt-2">
                Stay updated with your latest activities
              </p>
            </div>

            <div className="flex gap-2">
              <TabButton
                active={activeTab === 'notifications'}
                icon={Bell}
                label="Notifications"
                onClick={() => handleTabChange('notifications', 'left')}
              />
              <TabButton
                active={activeTab === 'myafh'}
                icon={Home}
                label="My AFH"
                onClick={() => handleTabChange('myafh', 'right')}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="pt-[120px] w-full max-w-5xl mx-auto px-8 overflow-y-auto h-[calc(100vh-120px)]">
        <div className="relative">
          <div
            className={`transition-transform duration-300 transform
            ${
              activeTab === 'notifications'
                ? slideDirection === 'right'
                  ? 'translate-x-0'
                  : 'translate-x-0'
                : '-translate-x-full'
            }`}
          >
            <NotificationsTab />
          </div>

          {activeTab === 'myafh' && <MyAFHTab />}
        </div>
      </main>
    </div>
  );
};

export default CPDashboard;
