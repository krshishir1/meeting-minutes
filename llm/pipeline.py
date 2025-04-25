import asyncio
from datetime import timedelta
from deepgram import DeepgramClient, PrerecordedOptions, FileSource
from setup_logging import setup_logging

logger = setup_logging(__name__)    

def process_audio(audio_path, deepgram_api_key):
    """
    Process audio file using Deepgram for both transcription and speaker diarization
    
    Args:
        audio_path: Path to the audio file
        deepgram_api_key: Deepgram API key
    
    Returns:
        List of transcribed segments with speaker labels
    """
    # Run Deepgram transcription and diarization asynchronously
    deepgram_response = transcribe_with_deepgram(audio_path, deepgram_api_key)
    logger.debug(f"This is deepgram_response: {deepgram_response}")

    # Format the response
    transcribed_segments = format_deepgram_response(deepgram_response)
    logger.debug(f"This is transcribed_segments: {transcribed_segments}")

    # Consolidate segments from the same speaker
    consolidated_segments = consolidate_speaker_segments(transcribed_segments)
    logger.debug(f"This is consolidated_segments: {consolidated_segments}")
    
    return consolidated_segments

def transcribe_with_deepgram(audio_path, api_key):
    """Use Deepgram to transcribe the audio file with diarization"""
    try:
        # Create a Deepgram client
        deepgram = DeepgramClient(api_key)
        
        # Open the audio file
        with open(audio_path, "rb") as file:
            audio_data = file.read()

        payload = {
            "buffer": audio_data,
        }

        # Create options with PrerecordedOptions
        options = PrerecordedOptions(
            model="nova-2",  # Using their most advanced model
            language="en",
            smart_format=True,
            diarize=True,    # Enable speaker diarization
            utterances=True, # Group by utterances for better segmentation
            punctuate=True,
            detect_language=True
        )
        
        # Send the audio to Deepgram
        response = deepgram.listen.rest.v("1").transcribe_file(payload, options)
        
        # Access the results directly as a dict
        return response.to_dict()
    
    except Exception as e:
        print(f"Error with Deepgram transcription: {str(e)}")
        return None

def format_deepgram_response(response):
    """Format Deepgram response into a consistent format"""
    transcribed_segments = []
    
    if not response:
        logger.debug(f"No response")
        return transcribed_segments
    
    # try:
        # Extract utterances with speaker labels
    for utterance in response["results"].get("utterances", []):
        # Get the speaker label
        logger.debug(f"This is word: {utterance["words"][0]}")
        speaker_id = utterance["words"][0].get("speaker", 0)
        logger.debug(f"This is speaker_id: {speaker_id}")
        
        speaker_label = f"Speaker {speaker_id}"
        
        # Get start and end times
        start_time = utterance.get("start", 0)
        end_time = utterance.get("end", 0)
        
        # Get the transcribed text
        text = utterance.get("transcript", "")
        
        # Get speaker confidence if available
        speaker_confidence = utterance["words"][0].get("speaker_confidence", 0)
        
        # Format times as HH:MM:SS
        start_formatted = str(timedelta(seconds=start_time))
        end_formatted = str(timedelta(seconds=end_time))
        
        # Add to results - only the essential fields
        if text.strip():
            transcribed_segments.append({
                "start": start_formatted,
                "end": end_formatted,
                "speaker": speaker_label,
                "text": text,
                "speaker_confidence": speaker_confidence
            })
    # except Exception as e:
    #     print(f"Error formatting Deepgram response: {str(e)}")
    
    return transcribed_segments

def consolidate_speaker_segments(segments):
    """
    Consolidate consecutive segments from the same speaker into larger chunks,
    focusing solely on speaker continuity rather than time gaps.
    
    Args:
        segments: List of transcribed segments
    
    Returns:
        List of consolidated segments
    """
    if not segments:
        return []
    
    # Sort segments by start time to ensure proper sequence
    sorted_segments = sorted(segments, key=lambda x: str(x["start"]))
    
    consolidated = []
    current_speaker = None
    current_segment = None
    
    for segment in sorted_segments:
        # If this is the first segment or a new speaker
        if current_speaker is None or segment["speaker"] != current_speaker:
            # Add previous segment to results if it exists
            if current_segment is not None:
                consolidated.append(current_segment)
            
            # Start a new segment with this speaker
            current_speaker = segment["speaker"]
            current_segment = segment.copy()
        else:
            # Same speaker, extend the current segment
            # Update the end time
            current_segment["end"] = segment["end"]
            
            # Combine the text with proper spacing and punctuation
            current_text = current_segment["text"].rstrip()
            
            # Check if current text ends with sentence-ending punctuation
            if current_text and current_text[-1] in ['.', '!', '?']:
                # Start a new sentence
                current_segment["text"] = f"{current_text} {segment['text']}"
            else:
                # Continue the sentence - check if we need comma or just space
                if len(current_text) > 20:  # For longer phrases, add comma
                    if current_text[-1] not in [',', ';', ':']:
                        current_segment["text"] = f"{current_text}, {segment['text']}"
                    else:
                        current_segment["text"] = f"{current_text} {segment['text']}"
                else:
                    current_segment["text"] = f"{current_text} {segment['text']}"
            
            # Update speaker confidence (average of the two confidences)
            if "speaker_confidence" in segment:
                current_confidence = current_segment.get("speaker_confidence", 0)
                new_confidence = segment.get("speaker_confidence", 0)
                current_segment["speaker_confidence"] = (current_confidence + new_confidence) / 2
    
    # Add the final segment
    if current_segment is not None:
        consolidated.append(current_segment)
    
    return consolidated

def main():
    from dotenv import load_dotenv
    import os
    
    load_dotenv()
    
    # Get API key from environment
    DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
    
    # Replace with your audio file path
    AUDIO_PATH = "sound.mp3"
    
    results = process_audio(AUDIO_PATH, DEEPGRAM_API_KEY)
    
    # Print results
    for segment in results:
        print(f"[{segment['start']} -> {segment['end']}] {segment['speaker']} (Confidence: {segment['speaker_confidence']:.2f}): {segment['text']}")

if __name__ == "__main__":
    main()