import Recommendations from "./Recommendations";
import Suggestions from "./Suggestions";

export default function RightSidebar() {
  return (
    <div className="w-64 p-4 w-80">
      <Suggestions />
      <div className="my-4"></div>
      <Recommendations />
    </div>
  );
}
