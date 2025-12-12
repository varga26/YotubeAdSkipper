const promt = `
You are given the transcript of a YouTube video. Your task is to identify all advertisement segments in the video.

Please return a strictly JSON array of objects in the following format:
[
  {
    "start_time": "HH:MM:SS.mmm",
    "end_time": "HH:MM:SS.mmm"
  }
]

Important requirements:
1. Only return JSON. Do NOT include any additional text, explanation, or comments.
2. Ensure the time format is exactly HH:MM:SS.mmm (hours, minutes, seconds, milliseconds). 
3. If there are no advertisement segments in the video, return an empty JSON array: [].
4. Base your analysis strictly on the transcript provided below.

`;


























































export {promt}