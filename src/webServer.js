import express from 'express';
import ngrok from '@ngrok/ngrok';
import utils from './utils.js';
import emailSender from './emailSender.js';
import detectTEE from './detectTEE.js';


async function start() {
    const app = express();
    const startTime = new Date();
    const port = await utils.findAvailablePort();
    const config = utils.getServiceConfig() ;

    // Asynchronous function that returns the greeting
    async function getHelloMessage(name) {
        const teeHello = await detectTEE.getInfo()
        const elapsed = new Date() - startTime
        let msg = name ? `HELLO ${name}` : 'HELLO';
        msg += `\n ${teeHello}.\n Service is up. (uptime: ${utils.formatElapsedTime(elapsed)})`;
        return msg;
    }

    app.get('/hello', async (req, res) => {
        try {
            const name = req.query.name;
            const message = await getHelloMessage(name);
            res.send(message);
        } catch (error) {
            console.error('Error in /hello route:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.listen(port, async () => {
        console.log(`API server listening at http://localhost:${port}`);

        const listener = await ngrok.connect({
            addr: port,
            authtoken: config.ngrokAuthToken
        });

        const teeMsg = await detectTEE.getInfo();
        emailSender.sendMail("Web server started", `Ingress established at ${listener.url()}\n${teeMsg}`);

        // Output ngrok url to console
        console.log(`Ingress established at ${listener.url()}`);

    });
}

export default  {
    start: start
}