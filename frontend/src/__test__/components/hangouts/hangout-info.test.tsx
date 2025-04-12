import { HangoutInfo } from '@/components/hangouts/hangout-info';
import { formatDate } from '@/lib/helpers/dates';
import { Hangout } from '@/lib/types/hangouts';
import { render } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';

const MOCK_HANGOUT: Hangout = {
  id: '1',
  name: 'Hangout 1',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  date: Timestamp.now(),
  address: 'Address 1',
  createdBy: '1',
  participants: ['1', '2'],
  image: {
    url: 'https://example.com/image.jpg',
    fileName: 'image.jpg',
    fullPath: 'images/image.jpg',
  },
};

const formattedDate = formatDate(MOCK_HANGOUT.date.toDate(), {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

describe('HangoutInfo', () => {
  it('should render with null hangout without crashing', () => {
    const { container } = render(<HangoutInfo hangout={null} />);

    expect(container).toBeDefined();
  });

  it('should render the hangout info', () => {
    const { container, getByText } = render(
      <HangoutInfo hangout={MOCK_HANGOUT} />
    );

    const avatar = container.querySelector('img');
    const name = getByText(MOCK_HANGOUT.name);
    const address = getByText(MOCK_HANGOUT.address);

    const date = getByText(formattedDate);

    expect(avatar).toBeDefined();
    expect(name).toBeDefined();
    expect(address).toBeDefined();
    expect(date).toBeDefined();
  });
});
