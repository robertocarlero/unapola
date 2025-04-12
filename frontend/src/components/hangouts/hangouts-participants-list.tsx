import { Hangout } from '@/lib/types/hangouts';
import { UserList } from '../users/user-list';
import { UserSearch } from '../users/user-search';

type HangoutsParticipantsListProps = {
  hangout: Hangout | null;
  onAddParticipant?: (userId: string) => void;
  isReadOnly?: boolean;
};

export const HangoutsParticipantsList = ({
  hangout,
  onAddParticipant,
  isReadOnly,
}: HangoutsParticipantsListProps) => {
  const { participants = [] } = hangout || {};

  return (
    <div className="flex flex-col gap-4">
      {onAddParticipant && !isReadOnly && (
        <UserSearch onUserSelect={onAddParticipant} />
      )}
      <UserList users={participants} />
    </div>
  );
};
