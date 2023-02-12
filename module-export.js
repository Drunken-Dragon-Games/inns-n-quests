const fs = require('fs/promises')
const path = require('path')

async function extractCode(filePath, outFilePath, ignorePaths = [], maxDepth = 1) {

    const recursiveLoop = async (currentPath, currentDepth) => {
        if (ignorePaths.includes(currentPath) || currentDepth == maxDepth) return undefined
        console.log("Reading: " + currentPath)
        const absolutePath = path.join(__dirname, currentPath)
        const fstat = (await fs.stat(absolutePath))
        if (fstat.isDirectory()) {
            const files = await fs.readdir(path.join(__dirname, currentPath))
            const accumulatedCode = await Promise.all(files.map((file) =>
                recursiveLoop(path.join(currentPath, file), currentDepth + 1)))
            return accumulatedCode.join("\n\n")

        } else if (fstat.isFile()) {
            if (!(currentPath.endsWith(".ts") && !currentPath.includes("test") || currentPath.endsWith(".tsx"))) return undefined
            const fileContent = await fs.readFile(path.join(__dirname, currentPath), "utf-8")
            const header = `// Path: ${currentPath}`
            /*
            // extract file paths from imports
            const importPaths = (fileContent.match(/import\s+.*\s+from\s+["'](.*)["']/g) ?? [])
                .map((importLine) => importLine.match(/import\s+.*\s+from\s+["'](.*)["']/)[1])
            // filter out the paths that are outside
            const nextPaths = importPaths.filter((importPath) => importPath.startsWith("."))
            // filter out the paths that are already in the original path
            const filteredNextPaths = nextPaths.filter((nextPath) => !filePath.startsWith(nextPath))
            // filter out the paths that go up
            const filteredNextPaths2 = filteredNextPaths.filter((nextPath) => !nextPath.startsWith(".."))
            const header = `// Path: ${currentPath}`
            const accumulatedCode = await Promise.all(filteredNextPaths2.map((nextPath) =>
                recursiveLoop(path.join(currentPath, nextPath), currentDepth)))
            */
            const result = [header, fileContent].join("\n\n")
            return result

        } else
            return undefined
    }
    const result = await recursiveLoop(filePath, -1)
    // delete the output file if it exists
    try { await fs.rm(outFilePath) } catch (e) { }
    // write the result to the output file
    await fs.writeFile(outFilePath, result)
}

(async () => {
    const path = "backend/src/service-idle-quests/challenges"
    const output =  __dirname + "/out/code_" + path.replace(/\//g, "_")
    await extractCode(path, output, [], 5)
})()
