import { useAuth } from '../../contexts/AuthContext';

export default function ProfileCard({ mouCount }) {
  const { currentUser } = useAuth();

  return (
    <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-6">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-full bg-brutal-primary flex items-center justify-center text-black text-2xl font-black border-2 border-black">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-bold text-black">{currentUser.name}</h2>
          <p className="text-sm text-gray-600 font-medium">{currentUser.designation}</p>
          <p className="text-sm text-gray-600 font-medium">{currentUser.department}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t-2 border-black grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600 font-bold">Email</span>
          <p className="font-medium text-black truncate">{currentUser.email}</p>
        </div>
        <div>
          <span className="text-gray-600 font-bold">Total MoUs</span>
          <p className="font-medium text-black">{mouCount ?? '...'}</p>
        </div>
        {currentUser.phone && (
          <div>
            <span className="text-gray-600 font-bold">Phone</span>
            <p className="font-medium text-black">{currentUser.phone}</p>
          </div>
        )}
        <div>
          <span className="text-gray-600 font-bold">Role</span>
          <p className="font-medium text-black capitalize">{currentUser.role}</p>
        </div>
      </div>
    </div>
  );
}
