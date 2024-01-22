const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const openWeatherMapApiKey = "68dc35669b0ea5acde4229ddd1b4ddef";
const dogApiUrl = "https://dog.ceo/api/breeds/image/random";
const chuckNorrisApiUrl = "https://api.chucknorris.io/jokes/random";

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post("/", async (req, res) => {
    const city = req.body.city;

    // OpenWeatherMap API
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapApiKey}&units=metric`;

    try {
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        // Render HTML with weather information
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Weather Information</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        flex-direction: column;
                    }

                    h2 {
                        color: #333;
                        margin-bottom: 10px;
                    }

                    p {
                        color: #555;
                        margin-bottom: 20px;
                    }

                    img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                </style>
            </head>
            <body>
                <h2>Weather Information for ${city}</h2>
                <p>Temperature: ${temp} °C</p>
                <p>Weather: ${description}</p>
                <img src="${imageURL}" alt="Weather Icon">
            </body>
            </html>
        `);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.post("/random", async (req, res) => {
    try {
        const dogResponse = await axios.get(dogApiUrl);
        const dogImageURL = dogResponse.data.message;

        // Render HTML with image and styles
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Random Dog Image</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                    }

                    h2 {
                        color: #333;
                        text-align: center;
                        margin-bottom: 20px;
                    }

                    img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                </style>
            </head>
            <body>
                <h2>Random Dog Image</h2>
                <img src="${dogImageURL}" alt="Random Dog Image">
            </body>
            </html>
        `);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/chucknorris", async (req, res) => {
    try {
        const chuckNorrisResponse = await axios.get(chuckNorrisApiUrl);
        const chuckNorrisJoke = chuckNorrisResponse.data.value; // Retrieve the joke from the "value" key

        res.json({ chuckNorrisJoke }); // Send the joke in a JSON object
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log("Server is running on 3000");
});
