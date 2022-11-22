import simpleVertexShader from "./SimpleVertexShader.glsl";
import simpleFragmentShader from "./SimpleFragmentShader.glsl";
import { compileShader, setUniforms } from "./Util";
import { mat4 } from "gl-matrix";

export class Renderer {
	gl: WebGL2RenderingContext;
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	vertexAttrib: number;
	lineProgram: WebGLProgram;
	MVP: mat4;

	objects: any;

	vertices = [
		-1, -1, 0,
		1, -1, 0,
		-1, 1, 0, 
		1, 1, 0, 
		-1, -1, 1, 
		1, -1, 1, 
		-1, 1, 1, 
		1, 1, 1
	];

	indices = [
		0,1,2,1,3,2
	];

	constructor(glContext: WebGL2RenderingContext) {
		this.gl = glContext;

		// create vertex buffer
		this.vertexBuffer = this.gl.createBuffer() as WebGLBuffer;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(this.vertices),
			this.gl.STATIC_DRAW
		);

		// create index buffer
		this.indexBuffer = this.gl.createBuffer() as WebGLBuffer;
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		this.gl.bufferData(
			this.gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(this.indices),
			this.gl.STATIC_DRAW
		);

		// create simple shader
		this.lineProgram = compileShader(
			this.gl,
			simpleVertexShader,
			simpleFragmentShader
		);
		this.vertexAttrib = this.gl.getAttribLocation(this.lineProgram, "a_position");
		this.gl.enableVertexAttribArray(this.vertexAttrib);

		this.objects = [];
		this.MVP = mat4.create();
	}

	render() {
		this.gl.useProgram(this.lineProgram);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		this.gl.vertexAttribPointer(this.vertexAttrib, 3, this.gl.FLOAT, false, 0, 0);
		setUniforms(this.gl,this.lineProgram, {
			/* cubeMin: this.selectedObject.getMinCorner(),
			cubeMax: this.selectedObject.getMaxCorner(), */
			modelviewProjection: this.MVP
		});
		this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
	}
}
