#!/usr/bin/env node

/**
 * Thumbnail Generator for Video Files
 * 
 * Automatically generates PNG thumbnails from video files (.webm, .mp4)
 * Captures a frame at a specified time (default: 1 second)
 * 
 * Requirements: FFmpeg must be installed
 * Install: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)
 * 
 * Usage:
 *   node generate-thumbnails.js                              # Process all videos in all subdirectories
 *   node generate-thumbnails.js <directory>                  # Process videos in specific directory
 *   node generate-thumbnails.js <video-file>                 # Process single video file
 *   node generate-thumbnails.js --time 2.5                   # Capture at 2.5 seconds
 *   node generate-thumbnails.js --force                      # Force regenerate existing thumbnails
 *   node generate-thumbnails.js --exclude _11                # Exclude files containing "_11"
 *   node generate-thumbnails.js --force --exclude _11        # Combine flags
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_CAPTURE_TIME = '00:00:03.000'; // Capture at 1 second
const VIDEO_EXTENSIONS = ['.webm', '.mp4', '.mov'];

function checkFFmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('❌ FFmpeg is not installed or not in PATH');
    console.error('Install with: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)');
    process.exit(1);
  }
}

function generateThumbnail(videoPath, outputPath, captureTime = DEFAULT_CAPTURE_TIME) {
  try {
    console.log(`📹 Processing: ${videoPath}`);
    
    // FFmpeg command to extract a frame
    // -ss: seek to timestamp
    // -i: input file
    // -vframes 1: extract one frame
    // -q:v 2: quality (2 is high quality)
    const command = `ffmpeg -ss ${captureTime} -i "${videoPath}" -vframes 1 -q:v 2 "${outputPath}" -y`;
    
    execSync(command, { stdio: 'ignore' });
    console.log(`✅ Generated: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to generate thumbnail for ${videoPath}`);
    console.error(error.message);
    return false;
  }
}

function processVideo(videoPath, captureTime, forceRegenerate = false, excludePattern = null) {
  const ext = path.extname(videoPath);
  const dir = path.dirname(videoPath);
  const basename = path.basename(videoPath, ext);
  
  // Check if file should be excluded based on pattern
  if (excludePattern && basename.includes(excludePattern)) {
    console.log(`⏭️  Skipping (excluded): ${videoPath}`);
    return true;
  }
  
  // Determine output path
  // If video is in a 'videos' directory, put thumbnail in sibling 'images' directory
  const parentDir = path.basename(dir);
  let outputDir;
  
  if (parentDir === 'videos') {
    outputDir = path.join(path.dirname(dir), 'images');
  } else {
    outputDir = dir;
  }
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }
  
  const outputPath = path.join(outputDir, `${basename}.png`);
  
  // Skip if thumbnail already exists (unless --force flag is used or forceRegenerate is true)
  if (fs.existsSync(outputPath) && !process.argv.includes('--force') && !forceRegenerate) {
    console.log(`⏭️  Skipping (exists): ${outputPath}`);
    return true;
  }
  
  return generateThumbnail(videoPath, outputPath, captureTime);
}

function processDirectory(dirPath, captureTime, excludePattern = null) {
  console.log(`\n📂 Processing directory: ${dirPath}\n`);
  
  let processedCount = 0;
  let successCount = 0;
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (VIDEO_EXTENSIONS.includes(ext)) {
          processedCount++;
          if (processVideo(filePath, captureTime, false, excludePattern)) {
            successCount++;
          }
        }
      }
    }
  }
  
  walkDir(dirPath);
  
  console.log(`\n📊 Summary: ${successCount}/${processedCount} thumbnails generated`);
}

function main() {
  console.log('🎬 Video Thumbnail Generator\n');
  
  // Check if FFmpeg is installed
  checkFFmpeg();
  
  // Parse arguments
  const args = process.argv.slice(2);
  let targetPath = 'deployments'; // Default to deployments directory
  let captureTime = DEFAULT_CAPTURE_TIME;
  let excludePattern = null;
  
  // Parse --time argument
  const timeIndex = args.indexOf('--time');
  if (timeIndex !== -1 && args[timeIndex + 1]) {
    const seconds = parseFloat(args[timeIndex + 1]);
    if (!isNaN(seconds)) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = (seconds % 60).toFixed(3);
      captureTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(6, '0')}`;
    }
  }
  
  // Parse --exclude argument
  const excludeIndex = args.indexOf('--exclude');
  if (excludeIndex !== -1 && args[excludeIndex + 1]) {
    excludePattern = args[excludeIndex + 1];
    console.log(`🚫 Excluding files containing: "${excludePattern}"\n`);
  }
  
  // Get target path (filter out flag arguments)
  const pathArgs = args.filter(arg => !arg.startsWith('--') && arg !== args[timeIndex + 1] && arg !== args[excludeIndex + 1]);
  if (pathArgs.length > 0) {
    targetPath = pathArgs[0];
  }
  
  // Check if target exists
  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Path not found: ${targetPath}`);
    process.exit(1);
  }
  
  const stat = fs.statSync(targetPath);
  
  if (stat.isDirectory()) {
    processDirectory(targetPath, captureTime, excludePattern);
  } else if (stat.isFile()) {
    const ext = path.extname(targetPath).toLowerCase();
    if (VIDEO_EXTENSIONS.includes(ext)) {
      // When a specific file is provided, always regenerate (force=true)
      if (processVideo(targetPath, captureTime, true, excludePattern)) {
        console.log('\n✅ Thumbnail generated successfully');
      } else {
        console.log('\n❌ Failed to generate thumbnail');
        process.exit(1);
      }
    } else {
      console.error(`❌ Not a video file: ${targetPath}`);
      console.error(`Supported formats: ${VIDEO_EXTENSIONS.join(', ')}`);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateThumbnail, processVideo, processDirectory };
