export default function OrgCard({ org, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-5 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
      <h3 className="font-bold text-black">{org.name}</h3>
      <p className="text-xs text-gray-600 font-bold capitalize mt-1">{org.type}</p>
      {org.contactPerson && <p className="text-sm text-gray-700 font-medium mt-2">Contact: {org.contactPerson}</p>}
      {org.contactEmail && <p className="text-xs text-gray-600 font-medium">{org.contactEmail}</p>}
      {org.address && <p className="text-xs text-gray-600 font-medium mt-1">{org.address}</p>}
    </div>
  );
}
