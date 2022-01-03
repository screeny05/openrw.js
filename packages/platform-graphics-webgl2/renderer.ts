import { IRenderer } from "@rws/platform/graphic";
import { Shader } from "./shader";
import { Texture } from "./texture";

export class Renderer implements IRenderer {
    $canvas: HTMLCanvasElement;
    gl: WebGL2RenderingContext;

    texture: Texture;

    constructor($canvas: HTMLCanvasElement){
        this.$canvas = $canvas;
        const gl = this.$canvas.getContext('webgl2');
        if(!gl){
            throw new Error('Webgl2 Context not retrievable');
        }
        this.gl = gl;
        this.setCanvasSize();
        window.addEventListener('resize', () => this.setCanvasSize());
    }

    render(delta: number): void {
        const vertexShaderSource = `#version 300 es
            in vec2 a_position;
            in vec2 a_texCoord;

            uniform vec2 u_resolution;
            uniform vec2 u_translation;

            out vec2 v_texCoord;

            void main() {
                u_resolution;
                vec2 pos = vec2(2, 2) * (a_position + u_translation) / u_resolution + vec2(-1, -1);
                pos = vec2(pos.x, pos.y * -1.0);

                gl_Position = vec4(pos, 0, 1);
                v_texCoord = a_texCoord;
            }
        `;

        const fragmentShaderSource = `#version 300 es
            precision mediump float;

            in vec2 v_texCoord;

            uniform sampler2D u_image;

            out vec4 outColor;

            void main() {
                u_image;
                outColor = texture(u_image, v_texCoord).bgra;
            }
        `;

        const shader = this.createShader(vertexShaderSource, fragmentShaderSource, ['u_resolution', 'u_translation', 'u_image'], ['a_position', 'a_texCoord']);

        const x = 100;
        const y = 20;
        const width = this.texture.width;
        const height = this.texture.height;

        const createBuffer = (data: ArrayBufferView): () => void => {
            const buffer = this.gl.createBuffer();
            if(!buffer){
                throw new Error('Cannot create buffer');
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
            return () => this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        }

        const positionBuffer = createBuffer(new Float32Array([
            0, 0,
            width, 0,
            0, height,
            0, height,
            width, 0,
            width, height,
        ]));

        const texCoordBuffer = createBuffer(new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1
        ]));

        positionBuffer();
        const vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);
        this.gl.enableVertexAttribArray(shader.attributes.a_position);
        this.gl.vertexAttribPointer(shader.attributes.a_position, 2, this.gl.FLOAT, false, 0, 0);

        texCoordBuffer();
        this.gl.enableVertexAttribArray(shader.attributes.a_texCoord);
        this.gl.vertexAttribPointer(shader.attributes.a_texCoord, 2, this.gl.FLOAT, false, 0, 0);

        this.texture.bind();
        this.gl.uniform1i(shader.uniforms.u_image, 0);
        this.gl.uniform2f(shader.uniforms.u_resolution, this.$canvas.width, this.$canvas.height);
        this.gl.uniform2f(shader.uniforms.u_translation, x, y);

        this.gl.viewport(0, 0, this.$canvas.clientWidth, this.$canvas.clientHeight);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.bindVertexArray(vao);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    createShader(vertexSrc: string, fragmentSrc: string, uniformDescriptors?: string[], attributeDescriptors?: string[]): Shader {
        return new Shader(this.gl, vertexSrc, fragmentSrc, uniformDescriptors, attributeDescriptors);
    }

    setCanvasSize(): void {
        this.$canvas.width = window.innerWidth;
        this.$canvas.height = window.innerHeight;
    }
}
