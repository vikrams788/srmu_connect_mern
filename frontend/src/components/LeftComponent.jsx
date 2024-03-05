const LeftComponent = () => {
  const friends = [
    { id: 1, name: 'Friend 1' },
    { id: 2, name: 'Friend 2' },
    { id: 3, name: 'Friend 3' },
    { id: 4, name: 'Friend 4' },
    { id: 5, name: 'Friend 5' },
  ];

  return (
    <div className="bg-gray-200 shadow-md rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">Friends List</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} className="mb-2">{friend.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default LeftComponent;
