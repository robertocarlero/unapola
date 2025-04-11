import { Hangout } from '@/lib/types/hangouts';
import { UserList } from '../users/user-list';
import { UserSearch } from '../users/user-search';

type HangoutsParticipantsListProps = {
  hangout: Hangout | null;
  onAddParticipant?: (userId: string) => void;
};

export const HangoutsParticipantsList = ({
  hangout,
  onAddParticipant,
}: HangoutsParticipantsListProps) => {
  const { participants = [] } = hangout || {};

  return (
    <div className="flex flex-col gap-4">
      {onAddParticipant && <UserSearch onUserSelect={onAddParticipant} />}
      <UserList users={participants} />
    </div>
  );
};
