import { BsArrowUpRight } from "react-icons/bs";

const CallToAction = ({ setIsRecordingWindowOn }) => {
  return (
    <div className="max-w-6xl  mx-10 bg-white rounded-[100px] shadow-2xl px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
        Record what matters the most.
      </h2>

      <div className="text-center sm:text-right">
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium text-lg px-6 py-3 rounded-full shadow-md transition duration-200"
          onClick={() => { setIsRecordingWindowOn(true); }}
        >
          Start recording for free
          <BsArrowUpRight className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
