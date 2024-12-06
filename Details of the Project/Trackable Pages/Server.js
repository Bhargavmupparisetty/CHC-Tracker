const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const trackedPages = {};

app.get('/generate/:id', (req, res) => {
    const id = req.params.id;

    const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tracked Page - ${id}</title>
    <style>

    button {
        padding: 8px 17px;
        font-size: 15px;
        cursor: pointer;
        margin-bottom: 10px;
        border-radius: 3px;
    
    }
    
    #pageLink {
        margin-top: 20px;
    }
    
    #pageLink p {
        margin: 0;
    }
    
    #coordinatesDisplay {
        margin-top: 20px;
    }

    header{
        background-color: rgba(6, 206, 241, 0.964);
        padding-bottom:20px;
        padding-top:20px;
        top:0;
    }
    </style>
</head>
<body>
    <header>
    <h1><center>Tracked Page</center></h1>
    </header>
    <hr>
    <br><br><br>
    <p>This is a tracked page with ID: ${id}</p>

    <script>
        let intervalId;

        // Function to send location updates on button click
        function sendLocation(id) {
            intervalId = setInterval(() => {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        fetch('/location', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                pageID: id,
                                latitude: latitude,
                                longitude: longitude,
                            }),
                        })
                        .then(response => {
                            if (!response.ok) {
                                console.error('Error sending location:', response.statusText);
                            }
                        })
                        .catch(error => {
                            console.error('Error sending location:', error);
                        });
                    },
                    error => {
                        console.error('Error getting location:', error);
                    }
                );
            }, 2000); // Send coordinates every 2 seconds
        }

        // Function to stop sending location updates
        function stopSendingLocation() {
            clearInterval(intervalId);
        }

    </script>

    <!-- Buttons -->
    <center>
    <br>
    <button onclick="sendLocation('${id}')">Start Sending Location</button>
    <button onclick="stopSendingLocation()">Stop Sending Location</button>
    <br>
    </center>

</body>
</html>`;


    trackedPages[id] = { coordinates: { latitude: null, longitude: null } };

    res.send(htmlContent);
});



app.get('/track/:id', (req, res) => {
    const id = req.params.id;

    if (trackedPages[id] && trackedPages[id].coordinates) {
        console.log(`Page with ID ${id} was accessed. Coordinates:`, trackedPages[id].coordinates);
        res.json(trackedPages[id].coordinates);
    } else {
        res.status(404).send('Location not available for the specified page.');
    }
});



app.post('/location', (req, res) => {
    const { pageID, latitude, longitude } = req.body;
    console.log(`Location received for page ${pageID}: ${latitude}, ${longitude}`);

    if (trackedPages[pageID]) {
        trackedPages[pageID].coordinates = { latitude, longitude };
    }

    res.json({ message: 'Location received successfully.', latitude, longitude });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
