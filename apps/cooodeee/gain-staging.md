# Prompt
Write a function in JavaScript that modifies a specified WAV file’s average audio level to -18dB RMS

# Response
Below is a practical Node.js example that:
	1.	Reads a WAV file
	2.	Computes its RMS level
	3.	Applies gain so the file ends up at –18 dB RMS
	4.	Writes out a new WAV file

This is intentionally low-level and explicit, aligned with your preference for fundamentals over abstractions.

⸻

Key concepts (brief)
	•	RMS → dBFS

dB = 20 * log10(RMS)


	•	Target RMS for –18 dBFS

targetRMS = 10^(-18 / 20)


	•	Gain factor

gain = targetRMS / currentRMS



⸻

Dependencies

npm install wav-decoder wav-encoder

No DSP libraries, no ffmpeg.

⸻

Implementation

```
import fs from "fs";
import decode from "wav-decoder";
import encode from "wav-encoder";

/**
 * Normalize a WAV file to -18 dB RMS
 *
 * @param {string} inputPath
 * @param {string} outputPath
 */
export async function normalizeWavToMinus18dBRMS(inputPath, outputPath) {
  const buffer = fs.readFileSync(inputPath);
  const audioData = await decode(buffer);

  const { sampleRate, getChannelData } = audioData;
  const channels = audioData.channelData.length;
  const length = audioData.channelData[0].length;

  // 1. Calculate RMS across all channels
  let sumSquares = 0;
  let totalSamples = 0;

  for (let ch = 0; ch < channels; ch++) {
    const data = audioData.channelData[ch];
    for (let i = 0; i < length; i++) {
      const sample = data[i];
      sumSquares += sample * sample;
      totalSamples++;
    }
  }

  const rms = Math.sqrt(sumSquares / totalSamples);

  // 2. Calculate gain for -18 dB RMS
  const targetRMS = Math.pow(10, -18 / 20);
  const gain = targetRMS / rms;

  // 3. Apply gain with hard clipping protection
  for (let ch = 0; ch < channels; ch++) {
    const data = audioData.channelData[ch];
    for (let i = 0; i < length; i++) {
      let sample = data[i] * gain;
      data[i] = Math.max(-1, Math.min(1, sample));
    }
  }

  // 4. Encode and write file
  const outputBuffer = await encode({
    sampleRate,
    channelData: audioData.channelData,
  });

  fs.writeFileSync(outputPath, Buffer.from(outputBuffer));
}
```

⸻

Usage

```
await normalizeWavToMinus18dBRMS(
  "input.wav",
  "output_-18dB.wav"
);
```

⸻

Important notes (audio-engineer mindset)
	•	This is RMS normalization, not LUFS
	•	No windowing → full-file RMS (good for gain staging, not mastering)
	•	Hard clipping is applied as safety — for production, you’d want:
	•	Peak pre-scan
	•	Optional limiter
	•	This works best on mono/stereo linear PCM WAVs

⸻

If you want, next we can:
	•	Convert this into an OO-style DSP object (Elegant Objects style)
	•	Add block-based RMS (like real meters)
	•	Compare this to hardware gain staging mental models (VU vs RMS vs LUFS)
	•	Turn this into a CLI tool for batch processing