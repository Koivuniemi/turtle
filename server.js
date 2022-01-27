const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 9999 });

function broadcast(msg) {
    console.log(`[BROADCAST] \t ${msg}`);
    wss.clients.forEach(client => {
        client.send(msg)
    });
}

wss.on("connection", (ws, req) => {
    console.log(`[CONNECTION] \t ${req.socket.remoteAddress}`);
    ws.on("message", msg => {
        console.log(`[CLIENT MSG] \t ${msg}`);
        let data = JSON.parse(msg);
        if (data["cmd"] || data["response"]) {
            broadcast(msg.toString());
        }
    });
    ws.on("close", () => {
        console.log(`[DISCONNECTION]\t ${req.socket.remoteAddress}`)
    });
});
