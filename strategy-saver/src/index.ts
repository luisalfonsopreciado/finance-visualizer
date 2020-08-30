import express, { Response, Request } from "express"

const app = express()

app.post("/api/strategy", (res: Response, req: Request) => {
    res.send(201)
})

app.listen(8000, () => {
console.log("App listening on port 8000")
})