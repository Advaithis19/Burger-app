const PORT = 8000
import express from "express"
import cors from "cors"
import morgan from "morgan"
import fetch from "node-fetch"
import "dotenv/config"

const app = express()
app.use(morgan("tiny"))
app.use(cors())
app.use(express.json())

//get all the restaurant data
app.get("/burgers", (req, res) => {
  const url = process.env.ASTRA_BURGERS_GET_ENDPOINT

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Cassandra-Token": process.env.ASTRA_TOKEN,
    },
  }
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => res.json(response))
    .catch((err) => console.log("error: ", err))
})

function notFound(req, res, next) {
  res.status(404)
  const error = new Error("Not Found")
  next(error)
}

function errorHandler(error, req, res) {
  res.status(res.statusCode || 500)
  res.json({
    message: error.message,
  })
}

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
