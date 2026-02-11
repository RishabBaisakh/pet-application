export default function Recommendations() {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Recommendations</h2>
      <ul className="grid grid-cols-2 gap-y-8">
        <li className="flex items-center">
          <div className="w-25 h-25 bg-gray-300 rounded-full"></div>
        </li>
        <li className="flex items-center">
          <div className="w-25 h-25 bg-orange-300 rounded-full"></div>
        </li>
        <li className="flex items-center">
          <div className="w-25 h-25 bg-green-300 rounded-full"></div>
        </li>
        <li className="flex items-center">
          <div className="w-25 h-25 bg-gray-300 rounded-full"></div>
        </li>
      </ul>
    </>
  );
}
