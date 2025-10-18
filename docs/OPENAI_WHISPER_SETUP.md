# OpenAI Whisper API Setup Guide

This guide will help you set up OpenAI Whisper API for real-time speech recognition in your React application.

## Prerequisites

1. OpenAI account with API access
2. Node.js application with React
3. Audio recording capabilities (microphone access)

## Step 1: OpenAI API Setup

### 1.1 Create an OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API section

### 1.2 Get API Key

1. Go to [API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give it a name (e.g., "Speech Recognition App")
4. Copy the generated API key
5. **Important**: Store this key securely - you won't be able to see it again

### 1.3 Add Billing Information

1. Go to [Billing](https://platform.openai.com/account/billing)
2. Add a payment method
3. Set up usage limits if desired

## Step 2: Environment Configuration

### 2.1 Update .env file

Add the following to your `.env` file:

```env
# OpenAI API credentials for Whisper speech-to-text
# Get your API key from https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=your-openai-api-key
```

### 2.2 Security Considerations

⚠️ **Important**: The current implementation uses `dangerouslyAllowBrowser: true` for demonstration purposes. In production:

1. **Never expose API keys in client-side code**
2. **Use a backend proxy service** to make API calls
3. **Implement proper authentication and rate limiting**

## Step 3: API Features and Capabilities

### 3.1 Whisper Model Features

- **High Accuracy**: State-of-the-art speech recognition
- **Multi-language Support**: 99+ languages supported
- **Robust to Noise**: Works well with background noise
- **Automatic Language Detection**: Can detect spoken language automatically
- **Multiple Output Formats**: JSON, text, SRT, VTT, etc.

### 3.2 Supported Languages

Whisper supports 99+ languages including:

- English, Spanish, French, German, Italian
- Portuguese, Russian, Arabic, Hindi, Chinese
- Japanese, Korean, Dutch, Polish, Turkish
- And many more...

### 3.3 Output Formats

- **JSON**: Basic transcription
- **Verbose JSON**: Includes timestamps and confidence scores
- **Text**: Plain text output
- **SRT**: Subtitle format
- **VTT**: WebVTT subtitle format

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
        languageCode: "en", // or 'auto' for automatic detection
        enableAutomaticPunctuation: true,
        responseFormat: "verbose_json",
        temperature: 0, // 0 = deterministic, 1 = creative
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

### Backend Proxy Example (Recommended for Production)

```javascript
// server.js (Node.js/Express)
const express = require("express");
const OpenAI = require("openai");
const multer = require("multer");

const app = express();
const upload = multer();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const { file } = req;
    const {
      language,
      responseFormat = "verbose_json",
      temperature = 0,
    } = req.body;

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: language || undefined, // Auto-detect if not specified
      response_format: responseFormat,
      temperature: parseFloat(temperature),
    });

    res.json(transcription);
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("Transcription server running on port 3001");
});
```

## Step 5: Production Considerations

### 5.1 Security Best Practices

- **Use backend proxy**: Never expose API keys in frontend
- **Implement authentication**: Secure your transcription endpoints
- **Rate limiting**: Prevent abuse of your API
- **Input validation**: Validate audio files before processing

### 5.2 Cost Management

- **File Size Optimization**: Compress audio before sending
- **Chunking Strategy**: Process longer audio in chunks
- **Caching**: Cache common transcriptions
- **Usage Monitoring**: Track API usage and costs

### 5.3 Performance Optimization

- **Audio Format**: Use efficient formats (WebM, MP3)
- **Sample Rate**: 16kHz is often sufficient for speech
- **Compression**: Balance quality vs. file size
- **Parallel Processing**: Process multiple chunks simultaneously

## Step 6: Pricing Information

### OpenAI Whisper API Pricing (as of 2025)

- **Whisper API**: $0.006 per minute (much cheaper than Google Cloud)
- **No free tier**: All usage is billed
- **Pay-per-use**: Only pay for what you transcribe
- **Volume discounts**: Available for enterprise customers

### Cost Comparison

- **OpenAI Whisper**: $0.006/minute = $0.36/hour
- **Google Cloud Speech**: $0.006/15 seconds = $1.44/hour
- **Azure Speech**: ~$1.00/hour
- **AWS Transcribe**: ~$0.72/hour

**OpenAI Whisper is significantly more cost-effective!**

## Step 7: Speaker Diarization

### Current Implementation

The current implementation includes basic speaker diarization using heuristics:

- Pattern-based speaker detection
- Question/answer flow analysis
- Simple speaker assignment

### Advanced Speaker Diarization

For production-grade speaker diarization, consider:

1. **pyannote-audio**: Advanced speaker diarization library
2. **Assembly AI**: Speaker diarization API
3. **Rev.ai**: Professional transcription with speakers
4. **Custom ML models**: Train your own speaker recognition

### Integration Example

```python
# Python backend with pyannote-audio
from pyannote.audio import Pipeline

pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization")
diarization = pipeline("audio.wav")

for turn, _, speaker in diarization.itertracks(yield_label=True):
    print(f"Speaker {speaker}: {turn.start:.1f}s - {turn.end:.1f}s")
```

## Step 8: Testing and Troubleshooting

### Common Issues

1. **CORS errors**: Use backend proxy
2. **Large file uploads**: Implement chunking
3. **Audio format issues**: Convert to supported formats
4. **API rate limits**: Implement retry logic

### Testing Checklist

- [ ] API key configured correctly
- [ ] Audio recording works
- [ ] File upload succeeds
- [ ] Transcription returns results
- [ ] Speaker diarization functions
- [ ] Error handling works
- [ ] Cost monitoring in place

## API Documentation

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference/audio)
- [Whisper Model Details](https://platform.openai.com/docs/models/whisper)
- [Audio API Guide](https://platform.openai.com/docs/guides/speech-to-text)
- [Pricing Information](https://openai.com/pricing)

## Support Resources

- [OpenAI Community Forum](https://community.openai.com/)
- [OpenAI Help Center](https://help.openai.com/)
- [API Status Page](https://status.openai.com/)
- [GitHub Examples](https://github.com/openai/openai-node)
