start = function()
	-- configura o ator
	mySprite = AssetsTable.pad
	mySize.x = 0.5
	mySize.y = 0.5
end

-- variaveis globais
velx = 3
vely = 3

loop = function()
	local delta = Delta.v
	local padPosition = global.padPosition

	-- faz a bola quicar nas pareder
	if myPosition.x > 6 or myPosition.x < -6 then
    	velx = -velx
	end

	-- faz a bola quicar no teto no chao e no pad
	if myPosition.y > 4.5 or myPosition.y < -4.5 or
    	(myPosition.y < padPosition.y + 0.5 and
    	 myPosition.x > padPosition.x -1 and
    	 myPosition.x < padPosition.x + 1)
    then
    	vely = -vely
	end

	-- move a bola
	Move(velx * delta, vely * delta)

	-- desenha um texto mostrando a posicao da bola	
    DrawText(-4, 2.9, "x = " .. myPosition.x .. "\n" .. "y = " ..  myPosition.y)
end
