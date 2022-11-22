import { Renderer } from "./Renderer";

function main() {
	var gl: WebGL2RenderingContext;
	const canvas = document.getElementById("glCanvas") as HTMLCanvasElement;
	// Initialize the GL context
	if (canvas != null) {
		const gl = canvas.getContext("webgl2");

		// Only continue if WebGL is available and working
		if (gl === null) {
			alert(
				"Unable to initialize WebGL. Your browser or machine may not support it."
			);
			return;
		}

    let renderer=new Renderer(gl);
    
  setInterval(function(){tick(renderer)},1000/60);
	}

  return;
}

export function tick (renderer:Renderer){
  renderer.render();
}

window.onload = main;
