-- Code size: 98
-- Cycles/voxel: 19.846

if x == 0 and y == 2 and z == 2 then
  return 9
elseif x == 0 and inrange(y, 0, 3) and z ==1 then
  return 11
elseif x*x == 1 and inrange(y, -2, -1) and z == -1 then
  	return 8
elseif inrange(z, -2, 1) then
	if x == 0 and y*y == 1 then
	  return y == 1 and 15 or 2
	elseif x*x <= 1 and y == 0 then
	  return 15
  end
end
