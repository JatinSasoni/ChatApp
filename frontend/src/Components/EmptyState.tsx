const EmptyState = () => {
  return (
    <div className="hidden sm:flex flex-col items-center justify-center w-full h-full bg-gray-100 p-6">
      <img
        src="/logo_big.svg"
        alt="Chat Logo"
        className="w-80 mb-4 drop-shadow-md"
      />
      <p className="text-gray-500 text-sm">
        Select a conversation to get started
      </p>
    </div>
  );
};

export default EmptyState;
