-- actor: batata
start = function()
	print("Starting")
	mySprite = AssetsTable.healer
end


loop = function()
	delta = Delta.v
	
	vel_x = input:force(input.key.d) - input:force(input.key.a)
	vel_y = input:force(input.key.w) - input:force(input.key.s)
	vel = 4 * delta

	vel_mag = math.sqrt(vel_x*vel_x + vel_y*vel_y)
	if vel_mag > 0 then
		vel_x = vel * vel_x / vel_mag
		vel_y = vel * vel_y / vel_mag
	else
		vel_x = 0
		vel_y = 0
	end
	
	sprite = mySprite
	if input:down(input.key.shift) then
		sprite = sprite + 1
	end
	if input:down(input.key.ctrl) then
		sprite = sprite - 1
	end

	mySprite = sprite

	Move(vel_x, vel_y)
end
