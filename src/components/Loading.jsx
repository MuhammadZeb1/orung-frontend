import React from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';

const MyLoader = () => {
  return (
    <DotLottiePlayer
      src="/src/assets/Loading (1).lottie" // پاتھ چیک کر لیں
      autoplay
      loop
    />
  );
};

export default MyLoader;