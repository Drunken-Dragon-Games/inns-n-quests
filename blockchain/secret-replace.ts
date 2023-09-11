const server = await Deno.readTextFile("./src/server.ts")
const newServer = server.replace("9d8a1876f66da8b25753ef4b82cab693", Deno.env.get("ENCRYPTION_KEY") as string)
//const newServer = server.replace("9d8a1876f66da8b25753ef4b82cab693", "9d8a1876f66da8b25753ef4b82cab693")
await Deno.writeTextFile("./src/server.ts", newServer)
