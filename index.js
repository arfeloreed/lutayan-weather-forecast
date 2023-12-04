import express from "express";
import axios from "axios";
import morgan from "morgan";
import "dotenv/config";

// variables
const app = express();
const port = 3000;
const API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = process.env.API_KEY;

// middlewares
app.use(morgan("dev"));
app.use(express.static("public"));

// endpoints
app.get("/", async (req, res) => {
  try {
    const result = await axios.get(`${API_URL}`, {
      params: {
        lat: 6.584798,
        lon: 124.892217,
        appid: API_KEY,
      },
    });

    let weather_list = [];
    for (let i = 0; i < 5; i++) {
      let date = new Date(result.data.list[i].dt_txt);
      let hour = date.getHours();
      let time;

      if (hour === 0) {
        time = `12 AM`;
      } else if (hour < 12) {
        time = `${hour} AM`;
      } else if (hour === 12) {
        time = `${hour} PM`;
      } else {
        time = `${hour - 12} PM`;
      }

      weather_list.push({
        time: time,
        weather: result.data.list[i].weather[0].main,
        description: result.data.list[i].weather[0].description,
      });
    }

    // res.render("index.ejs", { content: JSON.stringify(weather_list) });
    res.render("index.ejs", { content: weather_list });
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(error.response.data);
      res.status(500).send("Internal server error.");
    } else {
      console.error("An error occured:", error.message);
      res.status(500).send("Internal server error.");
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
