os.loadAPI("json")
os.loadAPI("act")

function StartUp()
    act.FullRefuel()
    act.CheckInv()
end

local has_ws_link = false
for _, program in ipairs(shell.programs()) do
    if program == "ws_link" then
        has_ws_link = true
        break
    end
end

if not has_ws_link then
    local ws_link = read()
    _G.ws, _G.err = http.websocket("ws://" .. ws_link)
    io.output("ws_link"):write(ws_link):close()
else
    local ws_link = io.input("ws_link"):read("a")
    _G.ws, _G.err = http.websocket("ws://" .. ws_link)
end

if ws then
    print("[CONNECTED]")
    StartUp()
    while true do
        local msg = json.decode(ws.receive())
        if msg["cmd"] then
            local func = load(msg["cmd"])
            func()
        end
    end
else
    print("[COULDN'T CONNECT]")
end