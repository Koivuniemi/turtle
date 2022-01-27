local programs = shell.programs()
local has_main = false
local has_json = false
local has_act  = false

for _, program in ipairs(programs) do
    if program == "main" then
        has_main = true
    elseif program == "json" then
        has_json = true
    elseif program == "act" then
        has_act  = true
    end
end

if not has_main then
    shell.run("pastebin", "get", "9PiNGUUX", "main")
end
if not has_json then
    shell.run("pastebin", "get", "4nRg9CHU", "json")
end
if not has_act then
    shell.run("pastebin", "get", "bKF4GTEd", "act")
end