self.addEventListener("message", (event) => {
    // We expect to receive a transferable buffer (decoded channel data),
    // plus numBars and amplitude.
    const { channelDataBuffer, numBars, amplitude } = event.data;
    try {
      // Reconstruct the Float32Array from the transferred buffer.
      const channelData = new Float32Array(channelDataBuffer);
      const sampleSize = Math.floor(channelData.length / numBars);
      const waveformData = [];
      
      // For each bar, compute the RMS value
      for (let i = 0; i < numBars; i++) {
        let sumSquared = 0;
        for (let j = 0; j < sampleSize; j++) {
          const sample = channelData[i * sampleSize + j] || 0;
          sumSquared += sample * sample;
        }
        const rms = Math.sqrt(sumSquared / sampleSize);
        // Scale the RMS value to a bar height.
        // (Assuming a canvas height of 50 as in your drawing logic.)
        const barHeight = rms * amplitude * 50 * 6;
        waveformData.push(barHeight);
      }
      self.postMessage({ waveformData });
    } catch (error) {
      console.error("[Worker] Error:", error);
      self.postMessage({ error: error.message });
    }
  });
  