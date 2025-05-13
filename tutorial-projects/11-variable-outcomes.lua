-- Code size: 35
-- Cycles/voxel: 6.13

if z == 0 then
  return 3
elseif x == -y then
	return z < 0 and 10 or 9
elseif x == y then
	return z < 0 and 6 or 5
end
