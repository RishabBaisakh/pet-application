import { Smile, Image as ImageIcon, Video } from "@deemlol/next-icons";

export default function PostActions() {
  const handleFeelingPost = (e: React.MouseEvent) => {
    e.preventDefault();
    // Logic to open a feeling selection modal or dropdown
    console.log("Feeling post clicked");
  };

  const handleImagePost = (e: React.MouseEvent) => {
    e.preventDefault();
    // Logic to open file picker for image upload
    console.log("Image post clicked");
  };

  const handleVideoPost = (e: React.MouseEvent) => {
    e.preventDefault();
    // Logic to open file picker for video upload
    console.log("Video post clicked");
  };
  return (
    <div className="flex items-center mt-3 gap-8">
      <div
        onClick={handleFeelingPost}
        className="flex items-center gap-2 hover:bg-gray-200 rounded-md px-4 py-2 cursor-pointer">
        <Smile className="text-gray-500" size={35} color="black" />
        <span className="text-lg">Feeling</span>
      </div>
      <div
        onClick={handleImagePost}
        className="flex items-center gap-2 hover:bg-gray-200 rounded-md px-4 py-2 cursor-pointer">
        <ImageIcon className="text-gray-500" size={35} color="black" />
        <span className="text-lg">Image</span>
      </div>
      <div
        onClick={handleVideoPost}
        className="flex items-center gap-2 hover:bg-gray-200 rounded-md px-4 py-2 cursor-pointer">
        <Video className="text-gray-500" size={35} color="black" />
        <span className="text-lg">Video</span>
      </div>
    </div>
  );
}
