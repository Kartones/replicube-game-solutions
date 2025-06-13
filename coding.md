# Coding Optimization Techniques

Reading optimized LUA code can be hard. I sometimes think about keeping my non-optimized soloution, but the more I play the more I tend to directly write the shortened code. And so, this guide will record what I do. And I might in the future use AI to, using them, generate a pleasingly readable version.

I am optimizing for both **low instructions count** and **low cycles count** (cycles to calculate each voxel). When I need to choose between both, **I often prioritize instructions count**, unless the cycles increase too much.

## Replicube

- Using constants for the colors is the same as using color numbers, but I prefer to see the numbers in case I can take advantage of their values.
- You can define your variables with or without `local` scope. The scope adds 1 to the instruction count, meanwhile ommiting it adds to the cycles count. Here I prefer readability.
- Color `0` is transparent/no color. `return 0` is equivalent to not returning anything. The code by default will implicitly `return 0`.

## LUA/Coding

- `if-elseif-end` consumes one less instruction than `if-end` + `if-end`. It is better to chain multiple `elseif` than to do multiple separate statements. 
- Adding a new condition to an existing `if` consumes one less instruction than adding an `elseif` with the same condition.
- Adding a set of parenthesis `()` costs one instruction, even if it wouldn't alter the logic at all.
- You can abuse LUA's lazy evaluation and early returns to avoid adding `if` statements:
```lua
if x == y and y == z then
  return 11
end
return 0
```
is the same as:
```lua
return x == y and y == z and 11 or 0
```
- The default return is `0` (transparent color), so you can do:
```lua
return x == y and y == z and 11
```
instead of:
```lua
return x == y and y == z and 11 or 0
```
- A single occurrence of `x*x` is not worth a variable. Two beings to pay out, 3 or more are worth it.

## Maths

- `abs(x) == y` is equivalent to `x*x == y*y`, also solving the sign question, as `-x * -x = x^2` (any number to the square has always positive sign).


## Debugging snippets

- Print statements are useful:
```lua
print("t: " .. t)
print("extent: " .. extent)
print("frames: " .. frames)
```
- Helper function to display the bits of a variable/number:
```lua
local function toBits(num, bits)
    bits = bits or 8
    local t = {}
    for i = bits, 1, -1 do
        t[i] = num & 1
        num = num >> 1
    end
    return concat(t)
end

-- print(toBits(x))
```
