# Manual rápido (para quem já conhece o básico de lógica de programação)

A plataforma é baseada em atores, cada ator, inicialmente, já possui a capacidade de emitir um som, de andar, e de ter sua representação visual na tela. É importante pensar nesse atores, assim como pensamos em atores no nosso contexto real, como atores que compõem o elenco de um filme, em que são eles que agem, que falam, etc.

O script, que representa a ação de cada ator é escrito em uma linguagem chamada `Lua`. Para, por exemplo, criar um espaço onde vai ser guardado um valor, que pode ou não ser alterado à medida que o ator age no jogo, também chamado de variável, é necessária seguir esta estrutura.

```
<nome da variável> = <valor>
```

E em `Lua`, estes espaços que guardam um valor, podem ser de 3 tipos, um espaço que guarda um `número`, um espaço que guarda uma `cadeia de caracteres`, ou seja um conjunto de letras, que pode possuir 0, 1 ou qualquer número (desde de que caiba na máquina) de caracteres, ou um espaço que guarda uma `tabela`, que assim como uma tabela real, possui uma coluna de chaves, e outra coluna de valores, e estes valores, que uma tabela suporta, podem ser um `número`, uma `cadeia de caracteres`, ou outra `tabela`.

Por exemplo, criando uma variável que guarda um número:

```lua
minha_variavel = 42
```

Por exemplo, criando uma variável que guarda uma cadeia de caracteres:

```lua
minha_variavel = "batatinha quando nasce espalha a rama pelo chao!"
```

Por exemplo, criando uma tabela:

```lua
minha_tabela = {
        rosa = "legal",
        preto = "chato",
        azul = "super legal",
        beje = "bem charo",
        vermelho = "minha cor preferida",
        quantos_lapis_de_cor_tenho = 12,
        cores_que_quero_ainda_opinar = {"fuxia","ciano","magenta"},
}
```

Nessa caso, `minha_tabela` e `minha_tabela.cores_que_quero_ainda_opinar` são tabelas. Podemos interpretar a tabela `minha_tabela` como: `minha_tabela na chave rosa é igual a "legal"`, `minha_tabela na chave quantos_lapis_de_cor_tenho é igual a 12`, ou ainda `minha_tabela na chave cores_que_quero_ainda_opinar é igual a uma tabela`. E é possível acessar estas chaves com os `[]`, deste modo: `minha_tabela["rosa"]`, `minha_tabela["vermelho"]` e assim por diante. A diferença da `minha_tabela` e da `minha_tabela.cores_que_quero_ainda_opinar` é que na segunda as chaves são definidas de maneira automática, começando do número 1, por exemplo se quisermos acessar o valor `"ciano"`, teremos que acessar `minha_tabela.cores_que_quero_ainda_opinar` na chave 2, deste modo: `minha_tabela.cores_que_quero_ainda_opinar[2]`.

Uma variável também pode receber o valor de outra variável, como:

```lua
x = 42
y = x + 1
```

A aritmética em `Lua`, possível somente com variáveis e valores do tipo `número`, dispõe dos seguintes operadores:

- `+` -> para efetuar somas
- `-` -> para efetuar subtrações
- `*` -> para efetuar multiplicações
- `/` -> para efetuar divisões

O modelo em `Lua` é `operando1 operador operando2`, exemplo:

```lua
y = x + 2
```

```lua
batatinha = x + y - z + 2
```

Assim como na matemática, os operadores `*` e `/` tem prioridade, e os parênteses indicam expressões que devem ser feitas antes das coisas fora dos parêntes na expressão, e pode haver ainda expressões dentro de parênteses, dentro expressões dentro de parênteses, indicando um nível de prioridade maior para esse expressão dentro de um parênteses dentro de outro parênteses. É possível possível pensar nesta questão do parênteses como uma montanha, que pode atingir uma tamnho infinito (desde que a máquina suporte), deste modo:

```
y = 2*(2/(4 + (x * (a + 4) + 2)))+4
```

Neste caso a expressão pode ser vista como:

```
                     a + 4                4
                    _______
               x * |       | + 2          3
               ___________________
          4 + |                   |       2
          _________________________
     2 / |                         |      1
     _______________________________ 
2 * |                               |+ 4  0
```

Pra conseguir operar com o "bloco de terra" é necessário resolver tudo que está encima dele.

Em `Lua` há um tipo especial de variável, chamado `função`, que também pode ser visto como um `procedimento`.
Pense que você tem que programar um robô para ir no shopping center e comprar e fazer uma porção de coisas. Agora vamos pensar no processo de retirar o dinheiro em um caixa eletrônico, para tal você necessitará fazer: ir no corredor 3, virar a direita, ir ao caixa, digitar a senha e inserir o cartão, digitar o valor desejado e retirar o dinheiro. Imaginando, de forma bem figurada, que o ato de ir ao shopping é o seu programa, logo para ir caixa eletrônico irá ter que dizer ao computador toda esta sequência de ações. Mas imagine que você terá que ir no caixa eletrônico diversas vezes, para isso vale a pena fazer algo como: `sacar_dinheiro_do_caixa_eletronico`, que quando executo a sequência de ações contida nessa variável do tipo função o robô saca dinheiro do caixa eletrônico. Agora pense que dependendo do andar onde o robô está atualmente ele irá ter que fazer algo diferente para sacar o dinheiro, por exemplo, se o caixa eletrônico fica no 1° andar, e o robô está no 2° andar, o robô irá ter que descer um andar para ir sacar o dinheiro, se está no estacionamento irá ter que subir, e etc.

Por exemplo:

```lua
atirar = function()
        local meuTiro = LoadActor("tiro")
        meuTiro.myPosition = myPosition
        meuTiro.myRotation = myRotation
        quantidadeDeBalas = quantidadeDeBalas - 1
end
```

Esta função, encapsula o ato de atirar, toda vez que eu executar esta função, irá executar o que está dentro da função. É possível executar a função que está dentro de `atirar`, deste modo: `atirar()`. Neste exemplo também é possível observar que `LoadActor(nome_do_ator)` também é uma função, entretanto, diferentemente da função que está dentro de `atirar`, esta retorna uma variável. Exemplo disso para a fórmula matemática de Baskara, em que `delta = b² - 4ac`:

```lua
baskara = function(a,b,c)
        return b*b - 4*a*c
end
```

Se fizermos:

```lua
x = baskara(1,2,3)
```

`x` será `-8` pois `2*2 - 4*1*3` é igual a `-8`. 

Logo, vimos que uma função pode receber valores e retornar valores, como por exemplo:

```lua
obterPosicaoX = function(nomeDoAtor)
        local actor = LoadAtor(nomeDoAtor)
        return ator.myPosition.x
end
```

O `local` indica uma variável que só pode vista de fora do escopo.

Imagine que dependendo do valor de uma variável ou dependendo do valor de uma função, um bloco é executado ou não, isso é feito com o operador `if then`, `elseif then`, `else` e `end`, exemplo:

```lua
if x == 1 then
        exibaNaTela("x é igual a 1")
elseif x == 2 then
        exibaNaTela("x é igual a 2")
elseif x == 3 then
        exibaNaTela("x é igual a 3")
else
        exibaNaTela("x não é igual a 1 nem igual a 2 nem igual a 3")
else
```

Também é possível colocar blocos dentro de blocos:

```lua
if x == 0 then
        if y == 0 then
                exibaNaTela("x é igual a 0 e y igual a 0")  
        elseif y == 1 then
                exibaNaTela("x é igual a 0 e y igual a 1")  
        else
                exibaNaTela("x é igual a 0 e y não é igual a 1 nem a 0")
        end
end
```

Também é possível fazer loops, do tipo: enquanto `x` faça tal bloco, por meio da estrutura `while do`, `end`:

```lua
while meu_dinheiro > 0 do
        comprar()
end
```

## Sobre os atores

Todo ator deve ter uma função `start` e `loop`, a `start` é executada assim que o ator é criado, e a `loop` a medida que a `engine` atualiza, que, idealmente, é 60 vezes por segundo. Há uma variável extremamente útil chamada `Delta.v` que contém o delta da atualização da `engine`, que é o quanto tempo, em segundos, que o quadro atual demorou para ser processado, ou o quadro anterior. Imagine que você que mover o personagem a 2 unidades por segundo no eixo x, ou seja na horizontal, o correto seria `Move(2 * Delta.v, 0)`, no final das contas o personagem vai andando aos poucos, e no final de um segundo terá andado 2 unidades.

### Funções úteis

- Move(x,y) - Movimenta o personagem.

- Rotate(x) - Rotaciona o personagem.

- LoadActor(nomeDoAtor) - Cria um novo ator e retorna o mesmo.

### Valores do ator

- mySprite - `número`, id do sprite.

- myPosition - `tabela`, contém x e y, que são as coordenadas do personagem no plano.

- myRotation - `tabela`, contém somente v, que é a rotação do personagem.

- mySize - `tabela`, contém x e y, que é o tamanho do personagem no plano.



