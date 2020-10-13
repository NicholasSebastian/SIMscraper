# SIMscraper
An alternative interface to the SIMconnect website.  
Still a work in progress... The UI is still practically non-existent and more data is to be fetched and presented.  
This is still more of a working prototype and proof of concept.  
The to-do-list includes:  
- UI
- Viewing past class attendance
- SIMconnect News
<br/><br/>

## Technical Details
Uses Node.js and Express.js for the backend, running puppeteer to scrape the SIMconnect website as it doesn't have a public API 😒.  
Uses React.js on the frontend to display the UI and make my life easier.  
The whole project was written in TypeScript since I find it to apparently be way better than JavaScript.
<br/><br/>

## Instructions to run on local machine
### 1. Host BOTH client and server
```
cd client
npm start
```
```
cd server
npm start
```
### 2. Ready to access on Local Host
Go to localhost:3000/
<br/><br/>

## Disclaimer
This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with SIM and the SIMconnect website, 
or any of its subsidiaries or its affiliates. The official SIMconnect website can be found at https://simconnect.simge.edu.sg/.
<br/><br/>
The names SIM and Singapore Institute of Management as well as related names, marks, emblems and images are registered trademarks of their respective owners.
<br/><br/>