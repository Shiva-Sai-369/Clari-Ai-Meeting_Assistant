# Synch Echo Mind - Real-Time Meeting Assistant

A modern web application with advanced AI-powered meeting assistance, featuring real-time speech-to-text transcription with speaker diarization powered by OpenAI Whisper API.

## ✨ Key Features

### 🎤 Real-Time Speech Recognition

- **OpenAI Whisper Integration**: State-of-the-art AI speech recognition with exceptional accuracy
- **Multi-language Support**: Supports 99+ languages with automatic language detection
- **Speaker Diarization**: Intelligent speaker identification and conversation flow detection
- **Multiple Output Formats**: JSON, verbose JSON with timestamps, SRT, VTT, and plain text
- **High-Quality Transcription**: Robust to background noise and diverse accents

### 🎯 Advanced Features

- **Audio Level Monitoring**: Visual feedback for microphone input levels
- **Temperature Control**: Adjustable creativity vs. deterministic output
- **Automatic Punctuation**: Smart punctuation insertion for better readability
- **Export Functionality**: Export transcription results as JSON with metadata
- **Browser Compatibility Checking**: Automatic detection of required Web API support

### 🔧 Technical Capabilities

- **Optimized Audio Processing**: 16kHz sample rate, mono channel, noise suppression
- **Cost-Effective**: $0.006 per minute (significantly cheaper than alternatives)
- **Error Handling**: Comprehensive error handling and validation
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components
- **TypeScript**: Fully typed for better development experience

## Project info

**URL**: https://lovable.dev/projects/7f5620ae-ec2d-4477-a42e-91dd2c0718b6

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7f5620ae-ec2d-4477-a42e-91dd2c0718b6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Configure OpenAI Whisper API
# Copy .env file and add your OpenAI API key
cp .env.example .env
# Edit .env file with your OpenAI API key

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## 🔑 OpenAI Whisper API Setup

To use the speech-to-text functionality, you'll need to set up OpenAI Whisper API:

1. **Create an OpenAI Account**

   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account

2. **Get Your API Key**

   - Navigate to [API Keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy the generated API key

3. **Add Billing Information**

   - Go to [Billing](https://platform.openai.com/account/billing)
   - Add a payment method (required for API usage)

4. **Configure Environment Variables**
   ```env
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

**Cost**: $0.006 per minute (very affordable!)

For detailed setup instructions, see [OpenAI Whisper Setup Guide](./docs/OPENAI_WHISPER_SETUP.md).

## 🚀 Quick Start

1. **Demo the Speech Recognition**

   - Navigate to the Demo page
   - Click on the "Advanced Demo" tab
   - Allow microphone access when prompted
   - Click "Start Recording" and begin speaking

2. **Features to Try**
   - Multi-speaker conversations (speaker diarization)
   - Different languages
   - Export transcription results
   - Audio level monitoring

## 📁 Project Structure

```
src/
├── components/
│   ├── SpeechToText.tsx          # OpenAI Whisper speech-to-text component
│   ├── SpeechToTextDemo.tsx      # Advanced demo with full features
│   └── ui/                       # shadcn/ui components
├── hooks/
│   └── useSpeechToText.ts        # React hook for speech recognition
├── lib/
│   └── audioUtils.ts             # Audio processing utilities
├── pages/
│   └── Demo.tsx                  # Demo page with speech features
└── backend/
    └── services/
        └── speechToTextService.ts # OpenAI Whisper service
```

## 🔄 Migration from Google Cloud

We've migrated from Google Cloud Speech-to-Text to OpenAI Whisper for several advantages:

- **Cost-effective**: $0.006/minute vs Google's $1.44/hour
- **Higher accuracy**: State-of-the-art AI transcription
- **More languages**: 99+ vs 10+ languages
- **Better noise handling**: Robust to background noise
- **Simpler setup**: Single API key vs complex GCP setup

## 📝 Development

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7f5620ae-ec2d-4477-a42e-91dd2c0718b6) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
