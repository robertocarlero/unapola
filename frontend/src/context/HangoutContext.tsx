import { createContext, useContext, useState } from 'react';

type HangoutContextType = {
  focusedHangout: string;
  setFocusedHangout: (hangoutId: string) => void;
};

export const HangoutContext = createContext<HangoutContextType>({
  focusedHangout: '',
  setFocusedHangout: () => {},
});

export const useHangoutContext = () => {
  const context = useContext(HangoutContext);
  if (!context) {
    throw new Error('useHangoutContext must be used within a HangoutContext');
  }

  return context;
};

export const HangoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [focusedHangout, setFocusedHangout] = useState('');

  return (
    <HangoutContext.Provider value={{ focusedHangout, setFocusedHangout }}>
      {children}
    </HangoutContext.Provider>
  );
};
