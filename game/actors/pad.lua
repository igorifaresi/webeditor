
-- essa funcao e chamada no inicio do jogo
start = function()
	-- Seleciona o sprite do ator
	mySprite = AssetsTable.ball


	myPosition.y = -3.5 -- muda a posicao y do ator

	-- Muda o tamanho do ator
	mySize.x = 2
	mySize.y = 0.5

	-- passa a posicao desse ator para a bola atravez
	-- da variavel padPosition
	global.padPosition = myPosition
end

-- essa funcao e chamada uma vez por frame
loop = function()
	local delta = Delta.v -- essa variavel e 1 / (frames por segundo)
	-- delta serve para ter mudanca constante

	
	local inputForce = input:force(input.key.d) - input:force(input.key.a)

	Move(inputForce * delta * 6, 0) -- move o pad a 6 m/s

	-- isso previne que o ator saia da tela
	if myPosition.x < -5 then
    	myPosition.x = -5
	end
	
    if myPosition.x > 5 then
        myPosition.x = 5
    end

	-- atualiza o valor padPosition
    global.padPosition = myPosition
end
