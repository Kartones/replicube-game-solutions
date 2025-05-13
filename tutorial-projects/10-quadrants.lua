-- Code size: 23
-- Cycles/voxel: 5.429

if y > 0 then
  return x > 0 and 11 or 8
else
	return z > 0 and 13 or 7
end
