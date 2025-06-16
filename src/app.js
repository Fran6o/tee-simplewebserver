import fs from 'node:fs/promises';
import figlet from 'figlet';
import webServer from './webServer.js';
import utils from './utils.js';


const main = async () => {
  const { IEXEC_OUT, IEXEC_REQUESTER_SECRET_1 } = process.env;

  let computedJsonObj = {};

  try {

    const config = utils.getServiceConfig() ; 

    if (config && config.ngrokAuthToken) {

      webServer.start();

    } else {
      console.log(`Requester secret for ngrokAuthToken1 is not set`);
    }

    // Transform input text into an ASCII Art text
    const asciiArtText = figlet.textSync( `HelloWorld - REST API!`);
    
    // Write result to IEXEC_OUT
    await fs.writeFile(`${IEXEC_OUT}/result.txt`, asciiArtText);

    // Build the "computed.json" object
    computedJsonObj = {
      'deterministic-output-path': `${IEXEC_OUT}/result.txt`,
    };



  } catch (e) {
    // Handle errors
    console.log(e);

    // Build the "computed.json" object with an error message
    computedJsonObj = {
      'deterministic-output-path': IEXEC_OUT,
      'error-message': 'Oops something went wrong',
    };
  } finally {
    // Save the "computed.json" file
    await fs.writeFile(
      `${IEXEC_OUT}/computed.json`,
      JSON.stringify(computedJsonObj)
    );
  }
};

main();
