-- actor: ship
start = function()
	print("Starting")
	mySprite = AssetsTable.healer
end


loop = function()
    if input:down(input.key.shift) then
        Move(Delta.v * 2, 0)
    end
end
