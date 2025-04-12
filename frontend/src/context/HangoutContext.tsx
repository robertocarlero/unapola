import { getHangout } from '@/lib/api/hangouts';
import { useSnapshot } from '@/lib/hooks/useSnapshot';
import { Hangout } from '@/lib/types/hangouts';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';

type HangoutContextType = {
  focusedHangout: string;
  setFocusedHangout: (hangoutId: string) => void;
  hangout: Hangout | null;
  loading: boolean;
  isOwn: boolean;
};

export const HangoutContext = createContext<HangoutContextType>({
  focusedHangout: '',
  setFocusedHangout: () => {},
  hangout: null,
  loading: false,
  isOwn: false,
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
  const { user } = useAuth();

  const getData = useCallback(
    () => getHangout({ id: focusedHangout }),
    [focusedHangout]
  );

  const { data: hangout, loading } = useSnapshot({
    fn: getData,
    active: !!focusedHangout,
  });

  const isOwn = useMemo(() => {
    if (!hangout) return false;
    return hangout.createdBy === user?.uid;
  }, [hangout, user]);

  return (
    <HangoutContext.Provider
      value={{ focusedHangout, setFocusedHangout, hangout, loading, isOwn }}
    >
      {children}
    </HangoutContext.Provider>
  );
};
