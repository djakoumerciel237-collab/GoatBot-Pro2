/** * @author NTKhang * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2 */
const { spawn } = require("child_process");
const log = require("./logger/log.js");
const http = require("http");
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// 1. Anti-sleep server pour Railway + UptimeRobot
app.get('/', (req, res) => {
  res.status(200).send(`GoatBot-Pro is alive - ${new Date().toISOString()}`);
});
app.get('/ping', (req, res) => res.send('pong'));

app.listen(PORT, () => {
  console.log(`[UPTIME] Server running on port ${PORT}`);
});

// 2. Self-ping toutes 4min 30 pour éviter sleep Railway
setInterval(() => {
  http.get(`http://localhost:${PORT}/ping`, (res) => {
    console.log(`[UPTIME] Self-ping OK - Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.log('[UPTIME] Self-ping error:', err.message);
  });
}, 270000); // 4min 30 = 270000ms

// 3. Auto-restart si Goat.js crash
function startProject() {
  const child = spawn("node", ["Goat.js"], { 
    cwd: __dirname, 
    stdio: "inherit", 
    shell: true 
  });
  
  child.on("close", (code) => {
    console.log(`[RESTART] Goat.js exited with code ${code}`);
    if (code == 2 || code != 0) {
      log.info("Restarting Project in 5s...");
      setTimeout(startProject, 5000);
    }
  });
  
  child.on("error", (err) => {
    log.error("Failed to start Goat.js:", err);
    setTimeout(startProject, 5000);
  });
}

startProject();

console.log('[BOOT] GoatBot-Pro started with 30-day uptime system');
