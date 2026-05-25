const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const MemberAvatars = ({ members = [], max = 4 }) => {
  if (!members.length) {
    return <span className="text-sm text-slate-400">No members</span>;
  }

  const visible = members.slice(0, max);
  const remaining = members.length - max;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visible.map((member) => (
          <div
            key={member._id}
            title={`${member.name} (${member.email})`}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-xs font-semibold text-primary-700"
          >
            {getInitials(member.name)}
          </div>
        ))}
      </div>
      {remaining > 0 && (
        <span className="ml-2 text-xs font-medium text-slate-500">+{remaining} more</span>
      )}
    </div>
  );
};

export default MemberAvatars;
