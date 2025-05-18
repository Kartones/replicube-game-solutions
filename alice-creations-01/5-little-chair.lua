-- Code size: 52
-- Cycles/voxel: 8.504

-- less code carving out (from last block) than drawing
return y > -1 and z > -1 and 0
	or x == 0 and y ~= -1 and y ~= 2 and 0
  or y < -1 and z == 0 and 0
  or x*x < 2 and y < 3 and z*z < 2 and 8
