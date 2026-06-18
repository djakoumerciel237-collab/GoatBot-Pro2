const { spawn } = require("child_process");
const log = require("./logger/log.js");
const http = require("http");
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.status(200).send(`GoatBot-Pro alive - ${new Date().toISOString()}`));
app.get('/ping', (req, res) => res.status(200).send('pong'));
app.get('/logs', (req, res) => res.status(200).send(`GoatBot-Pro logs OK - ${new Date().toISOString()}`));

app.listen(PORT, () => console.log(`[UPTIME] Server on port ${PORT}`));

setInterval(() => {
  http.get(`http://localhost:${PORT}/ping`, (res) => {
    console.log(`[UPTIME] Self-ping OK - ${res.statusCode}`);
  }).on('error', () => {});
}, 270000);

console.log(' GoatBot-Pro started - Delay 5s before Goat.js...');

// DELAY DE 5 SECONDES - Fix GoatBot-V2
setTimeout(() => {
  function startProject() {
    const child = spawn("node", ["Goat.js"], { 
      cwd: __dirname, 
      stdio: "inherit", 
      shell: true 
    });
    
    child.on("close", (code) => {
      console.log(`[RESTART] Goat.js exited ${code}`);
      if (code != 0) {
        log.info("Restarting in 5s...");
        setTimeout(startProject, 5000);
      }
    });
  }
  startProject();
}, 5000);
