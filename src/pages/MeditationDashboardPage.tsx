import React, { useState } from 'react';
import MeditationDashboard from '@/components/MeditationDashboard';
import MeditationChat from '@/components/MeditationChat';
import BottomNavigation from '@/components/BottomNavigation';

const MeditationDashboardPage: React.FC = () => {
  const [showMeditation, setShowMeditation] = useState(false);

  const handleStartMeditation = () => {
    setShowMeditation(true);
  };

  const handleCloseMeditation = () => {
    setShowMeditation(false);
  };

  return (
    <div className="h-screen">
      {showMeditation ? (
        <MeditationChat
          isOpen={showMeditation}
          onClose={handleCloseMeditation}
        />
      ) : (
        <>
          <MeditationDashboard onStartMeditation={handleStartMeditation} />
          <BottomNavigation />
        </>
      )}
    </div>
  );
};

export default MeditationDashboardPage;
