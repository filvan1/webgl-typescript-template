import simpleVertexShader from "./SimpleVertexShader.glsl";
import simpleFragmentShader from "./SimpleFragmentShader.glsl";
import { compileShader, setUniforms } from "./Util";
import { mat4 } from "gl-matrix";
export class Renderer {
    constructor(glContext) {
        this.vertices = [
            0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1
        ];
        this.indices = [
            0, 1, 1, 3, 3, 2, 2, 0, 4, 5, 5, 7, 7, 6, 6, 4, 0, 4, 1, 5, 2, 6, 3, 7
        ];
        this.gl = glContext;
        // create vertex buffer
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        // create index buffer
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
        // create simple shader
        this.lineProgram = compileShader(this.gl, simpleVertexShader, simpleFragmentShader);
        this.vertexAttrib = this.gl.getAttribLocation(this.lineProgram, "vertex");
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
        setUniforms(this.gl, this.lineProgram, {
            /* cubeMin: this.selectedObject.getMinCorner(),
            cubeMax: this.selectedObject.getMaxCorner(), */
            modelviewProjection: this.MVP
        });
        this.gl.drawElements(this.gl.LINES, 24, this.gl.UNSIGNED_SHORT, 0);
    }
}
