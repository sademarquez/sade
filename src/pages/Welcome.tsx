
import React, { useState } from 'react';
import CameraPermissionScreen from '@/components/CameraPermissionScreen';

const Welcome = () => {
  const [cameraGranted, setCameraGranted] = useState(false);

  const handlePermissionGranted = () => {
    setCameraGranted(true);
  };

  return (
    <CameraPermissionScreen onPermissionGranted={handlePermissionGranted} />
  );
};

export default Welcome;
