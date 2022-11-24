import simpleVertexShader from "./SimpleVertexShader.glsl";
import simpleFragmentShader from "./SimpleFragmentShader.glsl";
import { compileShader, setUniforms } from "./Util";
import { mat4, vec2 } from "gl-matrix";

export class Renderer {
	gl: WebGL2RenderingContext;
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	vertexAttrib: number;
	mouseUniform: WebGLUniformLocation | null;
	simpleProgram: WebGLProgram;
	MVP: mat4;
	mouseX:number;
	mouseY:number;
	startTime:number;

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

		this.mouseX=0;
		this.mouseY=0;

		// Time in miliseconds
		this.startTime=Date.now();

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
		this.simpleProgram = compileShader(
			this.gl,
			simpleVertexShader,
			simpleFragmentShader
		);
		// vertex data
		this.vertexAttrib = this.gl.getAttribLocation(this.simpleProgram, "a_position");
		this.gl.enableVertexAttribArray(this.vertexAttrib);

		// fragment data
		this.mouseUniform=this.gl.getUniformLocation(this.simpleProgram,"u_mouse");

		this.objects = [];
		this.MVP = mat4.create();
	}
	
	updateMouse(newX:number,newY:number){
		this.mouseX=newX;
		this.mouseY=newY;
	}

	resizeCanvasToDisplaySize(target:HTMLCanvasElement | OffscreenCanvas) {
		// Lookup the size the browser is displaying the canvas in CSS pixels.
		let canvas=target as HTMLCanvasElement;
		const displayWidth  = canvas.clientWidth;
		const displayHeight = canvas.clientHeight;
	   
		// Check if the canvas is not the same size.
		const needResize = canvas.width  !== displayWidth ||
						   canvas.height !== displayHeight;
	   
		if (needResize) {
		  // Make the canvas the same size
		  canvas.width  = displayWidth;
		  canvas.height = displayHeight;
		}
	   
		return needResize;
	}

	render():void {
		this.resizeCanvasToDisplaySize(this.gl.canvas);
		let currentWidth=this.gl.canvas.width;
		let currentHeight=this.gl.canvas.height;
		this.gl.viewport(0, 0, currentWidth, currentHeight);
		this.gl.useProgram(this.simpleProgram);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		this.gl.vertexAttribPointer(this.vertexAttrib, 3, this.gl.FLOAT, false, 0, 0);
		setUniforms(this.gl,this.simpleProgram, {
			u_resolution: [currentWidth,currentHeight],
			u_mouse: [this.mouseX,this.mouseY],
			u_time: (this.startTime-Date.now()),
			
		});
		this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
	}
}
