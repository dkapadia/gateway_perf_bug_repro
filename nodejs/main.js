const express = require('express')
const app = express()
const port = 3000

app.get("/kaprod", (req, res) =>
    res.send("OK")
)

app.listen(port, () => console.log(`Server started on port ${port}`))
