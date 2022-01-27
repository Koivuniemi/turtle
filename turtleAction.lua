function Mforward()
    local bool, err = turtle.forward()
    ws.send('{"response":"front","result":"' .. tostring(bool) .. '"}')
    return bool
end

function Mback()
    local bool, err = turtle.back()
    ws.send('{"response":"back","result":"' .. tostring(bool) .. '"}')
    return bool
end

function Mup()
    local bool, err = turtle.up()
    ws.send('{"response":"up","result":"' .. tostring(bool) .. '"}')
    return bool
end

function Mdown()
    local bool, err = turtle.down()
    ws.send('{"response":"down","result":"' .. tostring(bool) .. '"}')
    return bool
end

function MturnLeft()
    local bool, err = turtle.turnLeft()
    ws.send('{"response":"turnLeft","result":"' .. tostring(bool) .. '"}')
    return bool
end

function MturnRight()
    local bool, err = turtle.turnRight()
    ws.send('{"response":"turnRight","result":"' .. tostring(bool) .. '"}')
    return bool
end

function Mdig()
    local bool, err = turtle.dig()
    ws.send('{"response":"dig","result":"' .. tostring(bool) .. '"}')
    return bool
end

function MdigUp()
    local bool, err = turtle.digUp()
    ws.send('{"response":"digUp","result":"' .. tostring(bool) .. '"}')
    return bool
end

function MdigDown()
    local bool, err = turtle.digDown()
    ws.send('{"response":"digDown","result":"' .. tostring(bool) .. '"}')
    return bool
end

function Mselect(slot)
    if not (slot == nil) then
        local bool = turtle.select(slot)
        print("select slost asnd stuff")
        if bool then
            ws.send('{"response":"select","slot":"' .. tostring(slot) .. '"}')
            return bool
        end
        return bool
    end
    return false
end

function MgetItemCount(slot)
    if slot then
        local amount = turtle.getItemCount(slot)
        ws.send('{"response":"getItemCount","slot":"' .. tostring(slot) .. '","amount":"' .. tostring(amount) .. '"}')
        return slot
    end
    local amount = turtle.getItemCount()
    slot = MgetSelectSlot()
    ws.send('{"response":"getItemCount","slot":"' .. tostring(slot) .. '","amount":"' .. tostring(amount) .. '"}')
    return slot
end

function MgetItemSpace(slot)
    if slot then
        local amount = turtle.getItemSpace(slot)
        ws.send('{"response":"getItemSpace","slot":"' .. tostring(slot) .. '","amount":"' .. tostring(amount) .. '"}')
        return slot
    end
    local amount = turtle.getItemSpace()
    slot = MgetSelectSlot()
    ws.send('{"response":"getItemSpace","slot":"' .. tostring(slot) .. '","amount":"' .. tostring(amount) .. '"}')
    return slot
end

function Mdetect()
    local bool, err = turtle.detect()
    ws.send('{"response":"detect","result":"' .. tostring(bool) .. '"}')
    return bool
end

function MdetectUp()
    local bool, err = turtle.detectUp()
    ws.send('{"response":"detectUp","result":"' .. tostring(bool) .. '"}')
    return bool
end

function MdetectDown()
    local bool, err = turtle.detectDown()
    ws.send('{"response":"detectDown","result":"' .. tostring(bool) .. '"}')
    return bool
end

function MgetFuelLevel()
    local amount = turtle.getFuelLevel()
    ws.send('{"response":"getFuelLevel","amount":"' .. tostring(amount) .. '"}')
    return amount
end

function Mrefuel(amount)
    local function foo(factor, item_data)
        local function bar(count)
            local bool = turtle.refuel(count)
            if bool then
                ws.send('{"response":"refuel","amount":"' .. tostring(count * factor) .. '"}')
                return item_data["count"] * factor
            end
            ws.send('{"response":"refuel","amount":"0"}')
            return false
        end

        if amount == nil then
            return bar(item_data["count"])
        end
        return bar(amount)
    end

    local item_data = MgetItemDetail()
    if turtle.refuel(0) and not (item_data == nil) then
        if item_data["name"] == "minecraft:coal" or item_data["name"] == "minecraft:charcoal" then
            return foo(80, item_data)
        elseif item_data["name"] == "minecraft:coal_block" then
            return foo(800, item_data)
        elseif item_data["name"] == "minecraft:lava_bucket" then
            return foo(1000, item_data)
        end
    end
end

function MgetSelectSlot()
    local slot = turtle.getSelectedSlot()
    ws.send('{"response":"getSelectedSlot","slot":"' .. tostring(slot) .. '"}')
    return slot
end

function MgetItemDetail(slot, detailed)
    local item_detail = turtle.getItemDetail(slot, detailed)
    if not (item_detail == nil) then
        ws.send('{"response":"getItemDetail","item_detail":' .. json.encode(item_detail) .. '}')
        return item_detail
    end
    ws.send('{"response":"getItemDetail","item_detail":"null"}')
    return item_detail
end

function Minspect()
    local bool, data = turtle.inspect()
    if bool then
        ws.send('{"response":"inspect","block":"' .. data["name"] .. '"}')
        return bool, data
    end
    ws.send('{"response":"inspect","block":"minecraft:air"}')
    return bool, data
end

function MinspectUp()
    local bool, data = turtle.inspectUp()
    if bool then
        ws.send('{"response":"inspectUp","block":"' .. data["name"] .. '"}')
        return bool, data
    end
    ws.send('{"response":"inspectUp","block":"minecraft:air"}')
    return bool, data
end

function MinspectDown()
    local bool, data = turtle.inspectDown()
    if bool then
        ws.send('{"response":"inspectDown","block":"' .. data["name"] .. '"}')
        return bool, data
    end
    ws.send('{"response":"inspectDown","block":"minecraft:air"}')
    return bool, data
end

-------------------------------------------------------------

function Front()
    if Mdetect() then
        Mdig()
    end
    Mforward()
    return SeeFront()
end

function Back()
    MturnRight()
    MturnRight()
    if Mdetect() then
        Mdig()
    end
    Mforward()
    return SeeFront()
end

function Up()
    if MdetectUp() then
        MdigUp()
    end
    Mup()
    return SeeUpDown()
end

function Down()
    if MdetectDown() then
        MdigDown()
    end
    Mdown()
    return SeeUpDown()
end

function Left()
    MturnLeft()
    return Front()
end

function Right()
    MturnRight()
    return Front()
end

function TurnLeft()
    MturnLeft()
end

function TurnRight()
    MturnRight()
end

function CheckInv()
    for i = 1, 16 do
        MgetItemDetail(i)
    end
end

function FullRefuel()
    local refuel_amount = 0
    for i = 1, 16 do
        Mselect(i)
        local result = Mrefuel()
        if result then
            refuel_amount = refuel_amount + result
        end
    end
    return refuel_amount
end

function Refuel(amount, slot)
    if not slot == nil then
        Mselect(slot)
    end
    return Mrefuel(amount)
end

function SeeFront()
    Minspect()
    MinspectUp()
    MinspectDown()
    MturnLeft()
    Minspect()
    MturnRight()
    MturnRight()
    Minspect()
    MturnLeft()
end

function SeeUpDown()
    Minspect()
    MinspectUp()
    MinspectDown()
    MturnRight()
    Minspect()
    MturnRight()
    Minspect()
    MturnRight()
    Minspect()
    MturnRight()
end