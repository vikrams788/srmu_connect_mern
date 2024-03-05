const RightComponent = () => {
  const chats = [
    { id: 1, sender: 'John', message: 'Hey there!' },
    { id: 2, sender: 'Alice', message: 'Hi John!' },
    { id: 3, sender: 'John', message: 'How are you?' },
    { id: 4, sender: 'Alice', message: 'Im good, thanks!' },
  ];

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <div className="overflow-y-auto max-h-96">
        {chats.map(chat => (
          <div key={chat.id} className="mb-2">
            <span className="font-semibold">{chat.sender}: </span>
            <span>{chat.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightComponent;
