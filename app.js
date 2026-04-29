// load videos when the page opens
window.onload = () => {
  loadVideos();
  setupUploadBox();
};

// get list of videos
async function loadVideos() {
  const res = await fetch("http://localhost:3000/videos");
  const videos = await res.json();

  const list = document.getElementById("videoList");
  list.innerHTML = "";

  videos.forEach(v => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${v.name}</strong><br><br>
      <button onclick="playVideo('${v.name}')">Play</button>
    `;

    list.appendChild(div);
  });
}

// play a video
function playVideo(name) {
  const player = document.createElement("div");
  player.className = "card";

  player.innerHTML = `
    <video controls autoplay width="100%">
      <source src="http://localhost:3000/video/${name}">
    </video>
    <button onclick="this.parentElement.remove()">Close</button>
  `;

  document.body.appendChild(player);
}

// upload logic
function setupUploadBox() {
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");

  dropZone.onclick = () => fileInput.click();

  fileInput.onchange = () => uploadVideo(fileInput.files[0]);

  dropZone.ondragover = e => e.preventDefault();

  dropZone.ondrop = e => {
    e.preventDefault();
    uploadVideo(e.dataTransfer.files[0]);
  };
}

async function uploadVideo(file) {
  const form = new FormData();
  form.append("video", file);

  await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: form
  });

  loadVideos();
}
