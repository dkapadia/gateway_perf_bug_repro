const express = require('express')
const asyncHandler = require("express-async-handler")
const fetch = require("node-fetch");
const app = express()
const port = process.env.PORT || 3000

function logResponseTime(req, res, next) {
  const startHrTime = process.hrtime();

  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    if(elapsedTimeInMs > 20000){
        console.log("%s : %fms", req.path, elapsedTimeInMs);
    }
  });

  next();
}

// We don't want this in prod
//app.use(logResponseTime)

app.get("/kaprod", asyncHandler(async (req, res) => {
    const url = "https://mobile-data-dot-khan-academy.appspot.com/backend-graphql/testDhruv"
    const expected = JSON.stringify({isOnZeroRatedNetwork: false})

    const body = JSON.stringify({
        query:"{isOnZeroRatedNetwork}"
    })

    const options = {
        body,
        method: "POST",
        headers:  {
         'accept-encoding': 'gzip, deflate, br',
         'content-type': 'application/json',
         accept: "application/json"
        }
    }
    const httpResponse = await fetch(url, options)

    const actual = await httpResponse.json()

    if(JSON.stringify(actual.data) != expected){
        res.status(500);
        res.send("ERROR");
        return
    }
    res.send("pong\n");
}))


app.listen(port, () => console.log(`Server started on port ${port}`))
