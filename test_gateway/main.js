const express = require('express')
const asyncHandler = require("express-async-handler")
const fetch = require("node-fetch");
const app = express()
const port = process.env.PORT || 3000

// Hit the test-backend service in our test project
app.get("/test-backend", asyncHandler(async (req, res) => {
    const httpResponse = await doRequest("https://test-backend-dot-dhruv-test-2019.appspot.com/ping")
    const actual = await httpResponse.text()

    if(actual !== "pong\n"){
        res.status(500);
        res.send(`ERROR! got: ${actual} expected: pong`);
        return
    }

    res.send("ok\n");
}))

// Hit the test-backend service in the ka project
app.get("/ka-test-backend", asyncHandler(async (req, res) => {
    const httpResponse = await doRequest("https://mobile-data-dot-khan-academy.appspot.com/backend-graphql/testDhruv")
    const actual = await httpResponse.json()
    const expected = JSON.stringify({isOnZeroRatedNetwork: false})

    if(JSON.stringify(actual.data) != expected){
        res.status(500);
        res.send("ERROR");
        return
    }

    res.send("ok\n");
}))

// Hit an actual khan academy service in the khan academy project
app.get("/ka-mobile-data", asyncHandler(async (req, res) => {
    const httpResponse = await doRequest("https://mobile-data-dot-khan-academy.appspot.com/backend-graphql/testDhruv")
    const actual = await httpResponse.json()
    const expected = JSON.stringify({isOnZeroRatedNetwork: false})

    if(JSON.stringify(actual.data) != expected){
        res.status(500);
        res.send("ERROR");
        return
    }

    res.send("ok\n");
}))



async function doRequest(url) {

    // To keep things consistent, we always do a post, even though only the
    // ka-mobile-data backend expects a request payload.
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

    return httpResponse
}

app.listen(port, () => console.log(`Server started on port ${port}`))
