require("dotenv").config();
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const API_ENDPOINT = "http://13.200.243.218/transcribe";

async function downloadFromS3(key, downloadPath) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  const response = await s3Client.send(command);

  // Pipe S3 object stream to local file
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(downloadPath);
    response.Body.pipe(writeStream);
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}

async function uploadToS3(key, filePath, contentType = "audio/mpeg") {
  const fileStream = fs.createReadStream(filePath);
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: contentType,
  });
  await s3Client.send(command);
}

function extractAudio(videoPath, audioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .format("mp3")
      .save(audioPath)
      .on("end", resolve)
      .on("error", reject);
  });
}

async function getPresignedUrl(key, contentType = "application/octet-stream") {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // 60 seconds
  return url;
}

async function processVideoToAudio(videoKey, audioKey) {
  const tmpDir = "/tmp"; // or any temp folder on your system
  const videoPath = path.join(tmpDir, "input-video");
  const audioPath = path.join(tmpDir, "output-audio.mp3");

  // Download video from S3
  await downloadFromS3(videoKey, videoPath);

  // Extract audio as MP3
  await extractAudio(videoPath, audioPath);

  // Upload audio back to S3
  await uploadToS3(audioKey, audioPath);

  // Clean up temp files
  fs.unlinkSync(videoPath);
  fs.unlinkSync(audioPath);
}

async function uploadJSON(dataKey, jsonObject) {
  try {
    const jsonString = JSON.stringify(jsonObject);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: dataKey,
      Body: jsonString,
      ContentType: "application/json",
    });

    const response = await s3Client.send(command);
    console.log("Successfully uploaded JSON to S3:", response);
  } catch (error) {
    console.error("Error uploading JSON to S3:", error);
  }
}

async function getTranscription(inputKey) {
  let projectName = inputKey.split("_")[0];
  let meetingId = inputKey.split("_")[1];

  let videoKey = `${inputKey}.webm`;
  let audioKey = `${inputKey}.mp3`;

  await processVideoToAudio(videoKey, audioKey);

  const params = {
    audio_s3_key: audioKey,
    video_s3_key: videoKey,
  };
  const { status, data } = await axios({
    method: "POST",
    url: API_ENDPOINT,
    data: params,
  });

  if (status === 200) {
    console.log("Data found: ", data);

    const obj = {
      segments: data.segments ? data.segments : [],
      visual_moments: data.visual_moments ? data.visual_moments : [],
      results: data.summary ? data.summary : "",
    };

    let dataPath = `${projectName}_${meetingId}.json`;
    await uploadJSON(dataPath, obj);

    let { data: patchResponse } = await axios({
      method: "PATCH",
      url: "http://localhost:4000/api/meetings",
      data: {
        projectName,
        meetingId,
        updatedData: {
          audioUrl: audioKey,
          videoUrl: videoKey,
          dataPath,
        },
      },
    });

    console.log(patchResponse);

    return patchResponse;
  }
}

async function getJsonFromS3(key) {
    const command = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key });
    const response = await s3Client.send(command);
  
    // Use transformToString() to get the file content as a string
    const jsonString = await response.Body.transformToString();
    return JSON.parse(jsonString);
  }


module.exports = {
  getPresignedUrl,
  getTranscription,
  getJsonFromS3,
};
