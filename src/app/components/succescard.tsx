export default function SuccessCard({ message }: { message: string }) {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 opacity-80 text-white p-4 rounded-md shadow-lg z-10">
      {message}
    </div>
  );
}
