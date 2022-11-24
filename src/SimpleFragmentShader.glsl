#version 300 es
precision mediump float;

out vec4 colorOut;
 
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float division=600.0;

void main()
{
    colorOut = vec4((abs(sin(u_time))*u_resolution/division)+ u_mouse/division, 0.0, 1.0);
}