let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");

startBtn.onclick = async () => {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                sampleRate: 48000
            }
        });

        const audioTracks = screenStream.getAudioTracks();
        if (audioTracks.length === 0) {
            status.textContent = "No audio track found!";
            return;
        }

        const audioStream = new MediaStream([audioTracks[0]]);

        mediaRecorder = new MediaRecorder(audioStream, {
            mimeType: 'audio/webm;codecs=opus',
            audioBitsPerSecond: 192000
        });

        audioChunks = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const a = document.createElement('a');
            a.href = audioUrl;
            a.download = 'recording.webm';
            a.click();
            status.textContent = "Recording saved.";
        };

        mediaRecorder.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;
        status.textContent = "Recording...";
    } catch (err) {
        console.error(err);
        status.textContent = "Error: " + err.message;
    }
};

stopBtn.onclick = () => {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    status.textContent = "Stopping...";
};
