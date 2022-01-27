const ws = new WebSocket("ws://localhost:9999");
const buttons = document.getElementsByClassName("button");

for (const button of buttons) {
    button.addEventListener("click", e => {
        ws.send(`{"cmd":"return ${e.target["id"]}"}`);
    });
}
document.addEventListener("keydown", e => {
    if (e.key == "ArrowUp" || e.key == "w") {
        ws.send(`{"cmd":"return act.Front()"}`);
    } else if (e.key == "ArrowDown" || e.key == "s") {
        ws.send(`{"cmd":"return act.Back()"}`);
    } else if (e.key == "ArrowLeft" || e.key == "a") {
        ws.send(`{"cmd":"return act.TurnLeft()"}`);
    } else if (e.key == "ArrowRight" || e.key == "d") {
        ws.send(`{"cmd":"return act.TurnRight()"}`);
    }else if (e.key == "Shift") {
        ws.send(`{"cmd":"return act.Up()"}`);
    } else if (e.key == "Control") {
        ws.send(`{"cmd":"return act.Down()"}`);
    }
});
ws.addEventListener("message", msg => {
    console.log(JSON.parse(msg.data));
});