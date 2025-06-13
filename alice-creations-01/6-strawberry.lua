-- Code size: 84
-- Cycles/voxel: 12.240

local x_2 = x*x
local z_2 = z*z

return (
-- interior
x_2 < 4 and y*y < 4 and z_2 < 4
-- dots in sides
or y == 0 and z == 0 or x_2 == 1 and y == x and z_2 == 4
-- dots below
or y == -2 and (x == 0 and z == -1 or x == 1 and z == 1)
) and 4
-- took me a while to realize the pattern abs(x) + abs(z) < 3
or y == 2 and x_2 + z_2 < 5 and 11
or 7
