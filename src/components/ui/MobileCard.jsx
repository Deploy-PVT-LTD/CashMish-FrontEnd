const MobileCard = ({ name, image, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white border-2 border-gray-100 rounded-2xl p-4 hover:border-green-800 transition-all cursor-pointer group flex flex-col items-center h-64"
    >
      <div className="w-full h-40 mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
        {image ? (
          <img 
            src={image} // Direct Base64 string yahan aayegi
            alt={name} 
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            // Browser console mein agar 404 aaye toh ye error check karega
            onError={(e) => console.log("Image Load Error for:", name)}
          />
        ) : (
          <div className="text-gray-300 italic text-xs">No Image Available</div>
        )}
      </div>
      <h3 className="text-sm font-bold text-gray-800 text-center line-clamp-2">{name}</h3>
    </div>
  );
};

export default MobileCard;