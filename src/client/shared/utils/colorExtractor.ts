// src/client/shared/utils/colorExtractor.ts

/**
 * Calculates Euclidean distance between two multi-dimensional points
 * @param point1 First point as an array of coordinates
 * @param point2 Second point as an array of coordinates
 * @returns Distance between the two points
 */
function euclideanDistance(point1: number[], point2: number[]): number {
  return Math.sqrt(
    point1.reduce((sum, val, index) => sum + Math.pow(val - point2[index], 2), 0)
  );
}

/**
 * Implements K-means clustering algorithm
 * @param points Array of data points to cluster
 * @param k Number of clusters to create
 * @param maxIterations Maximum number of clustering iterations
 * @returns Clustered points
 */
function kmeans(points: number[][], k: number, maxIterations = 10) {
  let clusters: number[][][] = new Array(k).fill(null).map(() => []);

  let centroids = initializeCentroids(points, k);
  let iterations = 0;
  let moved = true;

  while (moved && iterations < maxIterations) {
    clusters = new Array(k).fill(null).map(() => []);

    points.forEach(point => {
      let minDistance = Infinity;
      let clusterIndex = 0;
      centroids.forEach((centroid: number[], index: number) => {
        let distance = euclideanDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = index;
        }
      });
      clusters[clusterIndex].push(point);
    });

    moved = false;
    centroids = centroids.map((centroid: number[], index: number) => {
      if (clusters[index].length) {
        const newCentroid = calculateCentroid(clusters[index]);
        if (!centroid.every((value, idx) => value === newCentroid[idx])) {
          moved = true;
          return newCentroid;
        }
      }
      return centroid;
    });

    iterations++;
  }

  return clusters;
}

/**
 * Randomly initializes centroids from input points
 * @param points Input data points
 * @param k Number of centroids to initialize
 * @returns Randomly selected initial centroids
 */
function initializeCentroids(points: number[][], k: number) {
  return points.slice(0).sort(() => 0.5 - Math.random()).slice(0, k);
}

/**
 * Creates clusters by assigning points to nearest centroids
 * @param k Number of clusters
 * @param centroids Cluster centroids
 * @param points Input data points
 * @returns Clustered points
 */
function createClusters(k: number, centroids: number[][], points: number[][]): number[][][] {
  let clusters: number[][][] = Array.from({ length: k }, () => []);
  points.forEach(point => {
    let minDistance = Infinity;
    let clusterIndex = 0;
    centroids.forEach((centroid, index) => {
      let distance = euclideanDistance(point, centroid);
      if (distance < minDistance) {
        minDistance = distance;
        clusterIndex = index;
      }
    });
    clusters[clusterIndex].push(point);
  });
  return clusters;
}

/**
 * Calculates the centroid (mean point) of a cluster
 * @param cluster Array of points in the cluster
 * @returns Centroid coordinates
 */
function calculateCentroid(cluster: number[][]): number[] {
  let sum = cluster.reduce((acc, val) => acc.map((num, idx) => num + val[idx]), Array(cluster[0].length).fill(0));
  return sum.map(num => num / cluster.length);
}

/**
 * Samples pixels from image data for color analysis
 * @param imageData Raw image pixel data
 * @param sampleSize Number of pixels to sample
 * @returns Array of RGB values
 */
function samplePixels(imageData: Uint8ClampedArray, sampleSize: number) {
  const pixels = [];
  for (let i = 0; i < sampleSize * 4; i += 4) {
    pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
  }
  return pixels;
}

/**
 * Converts RGB color to HSL color space
 * @param r Red color component (0-255)
 * @param g Green color component (0-255)
 * @param b Blue color component (0-255)
 * @returns HSL color representation [hue, saturation, lightness]
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = (max + min) / 2;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) % 6;
        break;
      case g:
        h = ((b - r) / d + 2) % 6;
        break;
      case b:
        h = ((r - g) / d + 4) % 6;
        break;
    }

    h *= 60;
  }

  return [h, s, l];
}

/**
 * Extracts a dominant color from an image
 * @param imageUrl URL of the image to analyze
 * @param k Number of color clusters to create (default 5)
 * @returns Promise resolving to a HSL color string
 */
export async function colorExtractor(imageUrl: string, k = 5): Promise<string> {
  return new Promise(resolve => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;

    const prefersLightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;

    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 50; // Further reduced for performance
      canvas.height = 50;
      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const sampleSize = 500; // Sample size for performance
        const rgbValues = samplePixels(imageData, sampleSize);

        const clusters = kmeans(rgbValues, k);
        const maxCluster = clusters.reduce((max, cluster) => cluster.length > max.length ? cluster : max, []);

        const averageColor = calculateCentroid(maxCluster);
        const hslColor = rgbToHsl(averageColor[0], averageColor[1], averageColor[2]);

        const brightness = prefersLightTheme ? 80 : 20; // Dynamically adjust based on theme

        resolve(`hsl(${Math.round(hslColor[0])}, ${Math.round(hslColor[1] * 300)}%, ${brightness}%)`);
      } else {
        resolve('Unable to extract color');
      }
    });
  });
}