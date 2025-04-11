import { UserInfo } from './user-info';

type UserListProps = {
  users: string[];
};

export const UserList = ({ users }: UserListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <div
          key={user}
          className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2 shadow-md"
        >
          <UserInfo userId={user} />
        </div>
      ))}
    </div>
  );
};
