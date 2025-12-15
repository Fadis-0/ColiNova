import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const WelcomeMessage = ({ onFadeOut, title, subtitle }) => {
  const [visible, setVisible] = useState(true);
  const welcomeRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500); // Show message for 1 second

    const welcomeElement = welcomeRef.current;
    const handleAnimationEnd = () => {
      if (!visible) {
        onFadeOut();
      }
    };

    welcomeElement?.addEventListener('animationend', handleAnimationEnd);

    return () => {
      clearTimeout(timer);
      welcomeElement?.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [onFadeOut, visible]);

  return (
    <div
      ref={welcomeRef}
      className={`welcome-message ${visible ? 'fade-in' : 'fade-out'}`}
    >
      <div>
        <h1 className="text-5xl font-bold">{t(title)}</h1>
        <p className="text-3xl mt-4">{t(subtitle)}</p>
      </div>
    </div>
  );
};

export default WelcomeMessage;
