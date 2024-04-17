
const Book = ({ imageUrl, bookName, authorName, url }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img src={imageUrl} alt={bookName} className="w-full h-64 object-cover" />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">{bookName}</h3>
          <p className="text-sm text-gray-600">by {authorName}</p>
        </div>
      </a>
    </div>
  );
};

export default Book;