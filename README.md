# simple-webserver

EXPERIMENTAL!! 
Running a web server with Express and exposing the service local port over the internet using ngrok (https://ngrok.com)

Dev secret must be passed as a JSON string in IEXEC_APP_DEVELOPER_SECRET
{
"gmailUser":<Your gmail user>, 
"gmailPwd":<Your gmail pwd>, 
}

Request secrets must be passed as string in 
  IEXEC_REQUESTER_SECRET_1 ngrokAuthToken 
  IEXEC_REQUESTER_SECRET_2 notifyToEmail
