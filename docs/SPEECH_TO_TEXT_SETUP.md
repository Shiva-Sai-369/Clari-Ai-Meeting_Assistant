# Google Cloud Speech-to-Text API Setup Guide

This guide will help you set up Google Cloud Speech-to-Text API for real-time speech recognition with speaker diarization in your React application.

## Prerequisites

1. Google Cloud Platform account
2. Node.js application with React
3. Audio recording capabilities (microphone access)

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "synch-echo-mind-speech")
4. Click "Create"

### 1.2 Enable Speech-to-Text API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Cloud Speech-to-Text API"
3. Click on the API and then click "Enable"

### 1.3 Create API Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API key"
3. Copy the generated API key
4. **Important**: Restrict the API key:
   - Click on the API key you just created
   - Under "API restrictions", select "Restrict key"
   - Choose "Cloud Speech-to-Text API"
   - Under "Application restrictions", you can:
     - Select "HTTP referrers" and add your domain
     - Or "IP addresses" for server-side usage

## Step 2: Environment Configuration

### 2.1 Update .env file

Add the following to your `.env` file:

```env
# Google Cloud Speech-to-Text API credentials
VITE_GOOGLE_CLOUD_PROJECT_ID=your-project-id
VITE_GOOGLE_CLOUD_API_KEY=your-api-key
```

### 2.2 Configure CORS (if needed)

If you encounter CORS issues, you may need to set up a proxy server or use Google Cloud Functions as an intermediary.

## Step 3: API Features Configuration

### 3.1 Speaker Diarization

The implementation supports:

- Automatic speaker identification
- Configurable min/max speaker count (2-10 speakers)
- Speaker labels with timestamps
- Confidence scores per speaker segment

### 3.2 Language Support

Supported languages include:

- English (US/UK)
- Spanish
- French
- German
- Italian
- Portuguese
- Japanese
- Korean
- Chinese (Simplified)

### 3.3 Enhanced Features

- Automatic punctuation
- Word-level timestamps
- Real-time streaming (via chunked audio)
- Profanity filtering
- Enhanced model for better accuracy

## Step 4: Usage Examples

### Basic Usage

```tsx
import SpeechToTextComponent from "@/components/SpeechToText";

function App() {
  const handleTranscription = (segments) => {
    console.log("New transcription segments:", segments);
  };

  return <SpeechToTextComponent onTranscriptionUpdate={handleTranscription} />;
}
```

### Advanced Configuration

```tsx
import { useSpeechToText } from "@/hooks/useSpeechToText";

function CustomSpeechComponent() {
  const { transcription, isRecording, startRecording, stopRecording, error } =
    useSpeechToText({
      config: {
        enableSpeakerDiarization: true,
        minSpeakerCount: 2,
        maxSpeakerCount: 4,
        languageCode: "en-US",
        enableAutomaticPunctuation: true,
        profanityFilter: false,
      },
      onTranscription: (segment) => {
        console.log(`${segment.speaker}: ${segment.text}`);
      },
      onError: (error) => {
        console.error("Speech recognition error:", error);
      },
    });

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop" : "Start"} Recording
      </button>
      {error && <div>Error: {error}</div>}
      <div>
        {transcription.map((segment, index) => (
          <div key={index}>
            <strong>{segment.speaker}:</strong> {segment.text}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Step 5: Production Considerations

### 5.1 Security

- Never expose API keys in client-side code for production
- Use a backend proxy service to make API calls
- Implement proper authentication and rate limiting

### 5.2 Cost Optimization

- Google Cloud Speech-to-Text pricing is based on:
  - Audio duration processed
  - Enhanced vs. standard models
  - Data logging preferences
- Monitor usage in Google Cloud Console

### 5.3 Performance

- Audio is processed in 1-second chunks for real-time experience
- Use appropriate audio encoding (WEBM_OPUS) for best results
- Implement error handling for network issues

### 5.4 Backend Proxy Example (Node.js/Express)

```javascript
// server.js
const express = require("express");
const speech = require("@google-cloud/speech");

const app = express();
const client = new speech.SpeechClient();

app.post("/api/speech-to-text", async (req, res) => {
  try {
    const { audioContent, config } = req.body;

    const request = {
      audio: { content: audioContent },
      config: {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 16000,
        languageCode: config.languageCode || "en-US",
        enableSpeakerDiarization: config.enableSpeakerDiarization || false,
        diarizationConfig: config.enableSpeakerDiarization
          ? {
              enableSpeakerDiarization: true,
              minSpeakerCount: config.minSpeakerCount || 2,
              maxSpeakerCount: config.maxSpeakerCount || 6,
            }
          : undefined,
      },
    };

    const [response] = await client.recognize(request);
    res.json(response);
  } catch (error) {
    console.error("Speech recognition error:", error);
    res.status(500).json({ error: error.message });
  }
});
```

## Step 6: Testing

### 6.1 Browser Compatibility

- Chrome: Full support
- Firefox: Full support
- Safari: Full support
- Edge: Full support
- Mobile browsers: May have limitations

### 6.2 Audio Quality Requirements

- Sample rate: 16kHz recommended
- Channels: Mono (1 channel)
- Format: WEBM, FLAC, or LINEAR16
- Clear audio with minimal background noise

### 6.3 Common Issues and Solutions

**Issue**: CORS errors
**Solution**: Use a backend proxy or configure Google Cloud CORS settings

**Issue**: Poor transcription accuracy
**Solution**:

- Ensure good audio quality
- Use enhanced models
- Choose the correct language code
- Minimize background noise

**Issue**: Speaker diarization not working
**Solution**:

- Ensure multiple speakers are speaking
- Check min/max speaker count settings
- Verify audio has clear speaker separation

**Issue**: High latency
**Solution**:

- Reduce audio chunk size
- Use streaming recognition
- Optimize network connection

## API Pricing

- Standard model: $0.006 per 15 seconds
- Enhanced model: $0.009 per 15 seconds
- First 60 minutes per month are free

## Support and Documentation

- [Google Cloud Speech-to-Text Documentation](https://cloud.google.com/speech-to-text/docs)
- [API Reference](https://cloud.google.com/speech-to-text/docs/reference/rest)
- [Pricing Information](https://cloud.google.com/speech-to-text/pricing)
