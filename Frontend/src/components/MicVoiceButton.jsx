import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { IoMicSharp, IoMicOffSharp } from "react-icons/io5";

const VoiceMicButton = ({ onTranscriptChange }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  React.useEffect(() => {
      // Pass updated transcript live
    onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);

  const handleVoiceInput = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    //   resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleVoiceInput}
        className="p-2 rounded-full text-neutral-400 hover:bg-neutral-700 hover:text-white transition"
      >
        {listening ? (
          <IoMicSharp className="h-5 w-5 text-green-400 animate-pulse" />
        ) : (
          <IoMicOffSharp className="h-5 w-5" />
        )}
      </button>
      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-neutral-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
        {listening?"Stop Speaking":"Start Speaking"}
      </span>
    </div>
  );
};

export default VoiceMicButton;
