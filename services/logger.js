const pino = require('pino');
const path = require('path');
const fs = require('fs');

// Define the log directory path
const logDir = path.join(__dirname, 'logs');
// Define the full log file path
const logFilePath = path.join(logDir, 'app.log');

// Check if the log directory exists, and create it if it doesn't
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: logFilePath }
});

const logger = pino({
 
  level: process.env.LOG_LEVEL || 'info'
}, fileTransport);

module.exports = {logger};