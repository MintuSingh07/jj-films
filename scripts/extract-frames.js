/* eslint-disable */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const videoPath = path.join(__dirname, "../public/camera_final.mp4");
const outputDir = path.join(__dirname, "../public/frames");
const ffmpegPath = path.join(__dirname, "../node_modules/ffmpeg-static/ffmpeg");

// Ensure video file exists
if (!fs.existsSync(videoPath)) {
  console.error(`Error: Video not found at ${videoPath}`);
  process.exit(1);
}

// Ensure output directory exists and is empty
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
} else {
  // Clean existing files
  fs.readdirSync(outputDir).forEach((file) => {
    fs.unlinkSync(path.join(outputDir, file));
  });
}

console.log("Extracting frames from video using ffmpeg-static...");
// Scale the video to 1920x1080 and save as high-quality webp
const width = 1920;
const height = 1080;
const cmd = `"${ffmpegPath}" -i "${videoPath}" -vf "fps=24,scale=${width}:${height}" -q:v 85 -c:v libwebp "${outputDir}/frame-%03d.webp"`;

try {
  execSync(cmd, { stdio: "inherit" });
  const frames = fs.readdirSync(outputDir).filter((f) => f.endsWith(".webp"));
  console.log(`Successfully extracted ${frames.length} frames.`);
} catch (error) {
  console.error("Failed to extract frames:", error);
  process.exit(1);
}
