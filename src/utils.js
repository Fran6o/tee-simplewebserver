import net from 'net';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function formatElapsedTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
}

// Dev secret must be passed as a JSON string in IEXEC_APP_DEVELOPER_SECRET
// {
//      "gmailUser":<Your gmail user>, 
//      "gmailPwd":<Your gmail pwd>, 
//}
// Request secrets must be passed as string in 
// IEXEC_REQUESTER_SECRET_1 ngrokAuthToken 
// IEXEC_REQUESTER_SECRET_2 notifyToEmail
function getServiceConfig() {
    const { IEXEC_REQUESTER_SECRET_1, IEXEC_REQUESTER_SECRET_2, IEXEC_APP_DEVELOPER_SECRET } = process.env;
    let config = JSON.parse(IEXEC_APP_DEVELOPER_SECRET);
    config.ngrokAuthToken = IEXEC_REQUESTER_SECRET_1 ;
    config.notifyToEmail = IEXEC_REQUESTER_SECRET_2;
    return config;
}

const MIN_PORT = 3000;
const MAX_PORT = 65535;
const MAX_ATTEMPTS = 1000;

async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();

    server.on('error', () => resolve(false));
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
  });
}

function getRandomPort(min = MIN_PORT, max = MAX_PORT) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function findAvailablePort(attempts = MAX_ATTEMPTS) {
  for (let i = 0; i < attempts; i++) {
    const port = getRandomPort();
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found after ${attempts} attempts.`);
}


export default {
    formatElapsedTime: formatElapsedTime,
    sleep: sleep,
    getServiceConfig: getServiceConfig, 
    findAvailablePort: findAvailablePort
}