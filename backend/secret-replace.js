const fs = require("fs")
const path = require("path")

const filePath = path.join(__dirname, "dist", "server.js")

let file = fs.readFileSync(filePath, "utf-8")
Object.keys(process.env).forEach((envvar) => {
    file = file.replace(`{{${envvar}}}`, process.env[envvar])
})
fs.writeFileSync(filePath, file)
