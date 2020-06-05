local math = require "math"

ActorTable = {}

AssetsTable = {
	potato = 0,

	slime = 1,
	spiky_slime = 2,

	healer = 3,
	healer_hurt = 4,

	knight = 5,
	knight_hurt = 6,

	gost_tree = 7,
	geon = 8,

	ball = 9,
	pad = 10,
}

Delta = {v = 0}

Deepcopy = function(orig, copies)
	copies = copies or {}
	local orig_type = type(orig)
	local copy
	if orig_type == 'table' then
		if copies[orig] then
			copy = copies[orig]
		else
			copy = {}
			copies[orig] = copy
			for orig_key, orig_value in next, orig, nil do
				copy[Deepcopy(orig_key, copies)] = Deepcopy(orig_value, copies)
			end
			setmetatable(copy, Deepcopy(getmetatable(orig), copies))
		end
	else -- number, string, boolean, etc
		copy = orig
	end
	return copy
end

input = {
	down_mask = 0,
	up_mask = 0,
	pressed_mask = 0,

	key = {
		w = (1 << 0),
		a = (1 << 1),
		s = (1 << 2),
		d = (1 << 3),

		up = (1 << 4),
		down = (1 << 5),
		left = (1 << 6),
		right = (1 << 7),

		space = (1 << 8),
		shift = (1 << 9),
		ctrl = (1 << 10),

		e = (1 << 11),
		q = (1 << 12),
	},

	down = function(self, key)
		return ((self.down_mask & key) == key) 
	end,

	up = function(self, key)
		return ((self.up_mask & key) == key) 
	end,

	pressed = function(self, key)
		return ((self.pressed_mask & key) == key) 
	end,

	force = function(self, key)
		result = 0
		if((self.pressed_mask & key) == key) then
			result = 1
		end
		return result
	end
}

global = {}


LoadActor = function(actorname)
	local env = {}
	local chunk, err = loadfile("actors/"..actorname..".lua", 'bt', env)
	
	if err then print("error in" .. actorname) end 
	
	if not err then
		chunk()
	else
		return nil
	end

	env["math"] = math
	env["print"] = print
	env["input"] = input
	env["LoadActor"] = LoadActor
	env["DrawText"] = DrawText
	env["AssetsTable"] = AssetsTable
	env["Delta"] = Delta
	env["mySprite"] = 1
	env["global"] = global

	env["myPosition"] = {
		x = 0,
		y = 0,
	}
	env["myRotation"] = {
		v = 0
	}
	env["mySize"] = {
		x = 2,
		y = 2,
	}

	-- standard functions
	env["Move"] = function(pos_x, pos_y)
		env.myPosition.x = env.myPosition.x + pos_x
		env.myPosition.y = env.myPosition.y + pos_y
	end
	env["Rotate"] = function(step)
		env.myRotation.v = env.myRotation.v + step
	end

	if ActorTable[actorname] == nil then
		ActorTable[actorname] = {}
	end
	table.insert(ActorTable[actorname], env)

	env.start()

	return env
end

--UpdateActors = function(delta, input_down, input_up, input_pressed)
UpdateActors = function(delta, input_down, input_up, input_pressed)
	input.up_mask = tonumber(input_up)
	input.down_mask = tonumber(input_down)
	input.pressed_mask = tonumber(input_pressed)


	Delta.v = delta
	for actortype, table in pairs(ActorTable) do
		for key, value in pairs(ActorTable[actortype]) do
			value.loop()
			Render(value)
		end
	end
	-- DrawText(0,0,"yay")
end
-- tests

