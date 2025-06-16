# simple-webserver

### ⚠️ EXPERIMENTAL!! 

This iApp (iExec Application) runs a web server built with Nodejs and Express in a TEE . The service local port is exposed over the internet using ngrok (https://ngrok.com)

This simple-webserver serves a REST API with 1 endpoint  `/hello?name=<your name>` and returns a hello message that looks like this:

HELLO vitalik ✅ Running inside a TEE (likely SGX/TDX). Service is up. (uptime: 33s)

### How to use 
A developer application secret must be passed as a JSON string in `IEXEC_APP_DEVELOPER_SECRET`
These credentials are use to send an notification email once the service is up and running. The email contains the public URL as established by ngrok service.
```
{"gmailUser":<Your gmail user>, "gmailPwd":<Your gmail pwd>}
```

ngrokAuthToken and notifyToEmail secrets must be passed as string in requester secret 1 and 2 
```
IEXEC_REQUESTER_SECRET_1 ngrokAuthToken  ngrok authentication token
IEXEC_REQUESTER_SECRET_2 notifyToEmail  Email of the person who will receive the web server info including its assigned address
```
