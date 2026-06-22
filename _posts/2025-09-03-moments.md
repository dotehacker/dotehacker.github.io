---
title: Capture Your Moment
date: 2020-01-17
category: "Reflections"
---
# 📸 Capture Your Moment

A digital space where memories are made, one selfie at a time. In this age of fleeting moments, sometimes we need to pause and capture the essence of now.

<div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 40px; border-radius: 20px; margin: 40px 0; text-align: center;">

# 💫 Your Digital Mirror

<div style="text-align: center; margin: 30px 0;">
  <div style="display: inline-flex; background: rgba(255,255,255,0.2); border-radius: 50px; padding: 5px; backdrop-filter: blur(10px);">
    <button id="startCameraBtn" onclick="startCamera()" style="padding: 12px 24px; border: none; border-radius: 50px; background: rgba(255,255,255,0.9); color: #333; font-weight: bold; cursor: pointer; margin-right: 5px; transition: all 0.3s ease;">📹 Start Camera</button>
    <button id="captureBtn" onclick="capturePhoto()" style="padding: 12px 24px; border: none; border-radius: 50px; background: transparent; color: white; font-weight: bold; cursor: pointer; transition: all 0.3s ease;" disabled>📸 Capture</button>
  </div>
</div>

<div id="cameraContainer" style="margin: 30px 0;">
  <video id="webcam" style="display: none; width: 480px; height: 480px; border-radius: 20px; object-fit: cover; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin: 20px auto;" autoplay></video>
  
  <canvas id="canvas" style="display: none;" width="480" height="480"></canvas>
  
  <div id="photoResult" style="display: none; margin: 20px auto;">
    <img id="capturedPhoto" style="width: 480px; height: 480px; border-radius: 20px; object-fit: cover; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" alt="Your Captured Moment">
    <div style="margin: 20px 0;">
      <button onclick="downloadPhoto()" style="padding: 12px 24px; border: none; border-radius: 50px; background: rgba(255,255,255,0.9); color: #333; font-weight: bold; cursor: pointer; margin: 0 10px; transition: all 0.3s ease;">💾 Download</button>
      <button onclick="retakePhoto()" style="padding: 12px 24px; border: none; border-radius: 50px; background: transparent; color: white; font-weight: bold; cursor: pointer; border: 2px solid white; transition: all 0.3s ease;">🔄 Retake</button>
    </div>
  </div>
</div>

<p style="font-style: italic; margin-top: 20px; opacity: 0.8; font-size: 18px; line-height: 1.6;">
  Every moment is unique, every smile tells a story.<br>
  Capture yours and keep it forever ✨
</p>

</div>

---

<div style="background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center;">

## 🌟 About This Moment

<p style="font-size: 16px; line-height: 1.8; margin: 20px 0;">
In a world that moves at lightning speed, taking a moment to capture yourself is an act of self-love. This digital mirror reflects not just your image, but your presence in this exact moment of time.
</p>

<ul style="list-style: none; padding: 0; font-size: 16px;">
  <li style="padding: 8px 0; opacity: 0.9;">📱 Uses your device's camera</li>
  <li style="padding: 8px 0; opacity: 0.9;">🎯 Perfect 480x480 square format</li>
  <li style="padding: 8px 0; opacity: 0.9;">💾 Download your selfie instantly</li>
  <li style="padding: 8px 0; opacity: 0.9;">🔒 All processing happens locally - your privacy is protected</li>
</ul>

</div>

---

<div style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center;">

## 💭 Reflection

<p style="font-size: 18px; line-height: 1.8; font-style: italic;">
"A photograph is a secret about a secret. The more it tells you, the less you know." - Diane Arbus
</p>

<p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
Sometimes we need to see ourselves to remember who we are. In the reflection of a camera lens, we find not just our image, but our essence - the spark that makes us uniquely human.
</p>

</div>

<script>
let webcamStream = null;
let webcamElement = document.getElementById('webcam');
let canvasElement = document.getElementById('canvas');
let capturedPhotoElement = document.getElementById('capturedPhoto');
let photoResultDiv = document.getElementById('photoResult');
let startCameraBtn = document.getElementById('startCameraBtn');
let captureBtn = document.getElementById('captureBtn');

async function startCamera() {
  try {
    // Request camera access with specific constraints
    webcamStream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 480 },
        height: { ideal: 480 },
        facingMode: 'user' // Front camera for selfies
      } 
    });
    
    webcamElement.srcObject = webcamStream;
    webcamElement.style.display = 'block';
    
    // Update button states
    startCameraBtn.textContent = '📹 Camera Active';
    startCameraBtn.style.background = 'rgba(46, 204, 113, 0.9)';
    captureBtn.disabled = false;
    captureBtn.style.background = 'rgba(255,255,255,0.9)';
    captureBtn.style.color = '#333';
    
    // Hide photo result if showing
    photoResultDiv.style.display = 'none';
    
  } catch (error) {
    alert('Error accessing camera: ' + error.message);
    console.error('Camera access error:', error);
  }
}

function capturePhoto() {
  if (!webcamStream) {
    alert('Please start the camera first!');
    return;
  }
  
  // Set canvas size to 480x480
  canvasElement.width = 480;
  canvasElement.height = 480;
  
  const context = canvasElement.getContext('2d');
  
  // Draw the video frame to canvas (480x480)
  context.drawImage(webcamElement, 0, 0, 480, 480);
  
  // Convert canvas to image
  const imageDataUrl = canvasElement.toDataURL('image/png');
  capturedPhotoElement.src = imageDataUrl;
  
  // Show the captured photo
  photoResultDiv.style.display = 'block';
  webcamElement.style.display = 'none';
  
  // Update button states
  startCameraBtn.textContent = '📹 Start Camera';
  startCameraBtn.style.background = 'rgba(255,255,255,0.9)';
  captureBtn.disabled = true;
  captureBtn.style.background = 'transparent';
  captureBtn.style.color = 'white';
  
  // Stop the camera stream
  stopCamera();
}

function downloadPhoto() {
  const link = document.createElement('a');
  link.download = `selfie-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
  link.href = capturedPhotoElement.src;
  link.click();
}

function retakePhoto() {
  photoResultDiv.style.display = 'none';
  startCamera();
}

function stopCamera() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
}

// Cleanup when page is unloaded
window.addEventListener('beforeunload', stopCamera);
</script>