-- Code size: 66
-- Cycles/voxel: 8.167

if y==0 or x==0 or z==0 then
	return 1
elseif z>1 then
	return x>1 and y>1 and 10 or x<-1 and y<-1 and 9
elseif z<-1 then
	return x<-1 and y>1 and 7 or x>1 and y<-1 and 13
end
