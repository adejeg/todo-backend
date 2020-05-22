const express = require("express")
require('./db/mongoose')
const todoRoute = require('./route/todo')
const userRoute = require('./route/user')
const app = express()
const cors = require('cors')

const port= process.env.PORT || 3000
app.use(cors());

app.use(express.json())
app.use(userRoute);
app.use(todoRoute);

app.listen(port, () => {
    console.log("App is listened to on port:" + port);
})