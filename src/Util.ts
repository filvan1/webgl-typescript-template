import { glMatrix, mat4, vec3 } from "gl-matrix";

export function compileShader(
	gl: WebGL2RenderingContext,
	vertex: string,
	fragment: string
) {
	let resultProgram = gl.createProgram() as WebGLProgram;
	gl.attachShader(resultProgram, compileSource(gl, vertex, gl.VERTEX_SHADER));
	gl.attachShader(
		resultProgram,
		compileSource(gl, fragment, gl.FRAGMENT_SHADER)
	);
	gl.linkProgram(resultProgram);
	if (!gl.getProgramParameter(resultProgram, gl.LINK_STATUS)) {
		throw "link error: " + gl.getProgramInfoLog(resultProgram);
	}
    return resultProgram;
}

function compileSource(
	gl: WebGL2RenderingContext,
	source: string,
	type: number
) {
	var shader = gl.createShader(type) as WebGLShader;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw "compile error: " + gl.getShaderInfoLog(shader);
	}
	return shader;
}

export function setUniforms(gl: WebGL2RenderingContext,program:WebGLProgram, uniforms:{[name:string]:vec3 | mat4 | number}) {
    for(var name in uniforms) {
        
      var value = uniforms[name];
      var location = gl.getUniformLocation(program, name);
      if(location == null) continue;
      if(value instanceof Array) {
        if(value.length==3){
            gl.uniform3fv(location, value);
        } else{
            gl.uniformMatrix4fv(location, false, value);
        }
      } else {
        gl.uniform1f(location, value as number);
      }
    }
  }