// src/client/features/sounds/visualizer/workers/audioWorker.ts
self.onmessage = function (e: MessageEvent) {
  const { channelData, numBars } = e.data;
  
  if (!channelData || typeof numBars !== 'number') {
    self.postMessage({ error: "Invalid data provided to worker" });
    return;
  }

  // Convert the transferred buffer back into a Float32Array
  const data = new Float32Array(channelData);
  const sampleSize = Math.floor(data.length / numBars);
  const waveformData = new Array<number>(numBars);

  for (let i = 0; i < numBars; i++) {
    let sumSquared = 0;
    for (let j = 0; j < sampleSize; j++) {
      const sample = data[i * sampleSize + j] || 0;
      sumSquared += sample * sample;
    }
    waveformData[i] = Math.sqrt(sumSquared / sampleSize);
  }
  self.postMessage({ waveformData });
};
