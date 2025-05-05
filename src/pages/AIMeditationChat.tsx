import React from 'react';
import { useNavigate } from 'react-router-dom';
import MeditationChat from '@/components/MeditationChat';

const AIMeditationChat: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <MeditationChat isOpen={true} onClose={handleClose} />
  );
};

export default AIMeditationChat;
