import * as twgl from './twgl-full.module.js';
    function main() {
      const m4 = twgl.m4;
      const gl = document.getElementById("c").getContext("webgl");
      twgl.addExtensionsToContext(gl);
      if (!gl.drawArraysInstanced || !gl.createVertexArray) {
        alert("need drawArraysInstanced and createVertexArray"); // eslint-disable-line
        return;
      }
      const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

      function rand(min, max) {
        if (max === undefined) {
          max = min;
          min = 0;
        }
        return min + Math.random() * (max - min);
      }

      const numInstances = 100000;
      const instanceWorlds = new Float32Array(numInstances * 16);
      const instanceColors = [];
      const r = 70;
      for (let i = 0; i < numInstances; ++i) {
        const mat = new Float32Array(instanceWorlds.buffer, i * 16 * 4, 16);
        m4.translation([rand(-r, r), rand(-r, r), rand(-r, r)], mat);
        m4.rotateZ(mat, rand(0, Math.PI * 2), mat);
        m4.rotateX(mat, rand(0, Math.PI * 2), mat);
        instanceColors.push(rand(1), rand(1), rand(1));
      }
      const arrays = twgl.primitives.createCubeVertices();
      Object.assign(arrays, {
        instanceWorld: {
          numComponents: 16,
          data: instanceWorlds,
          divisor: 1,
        },
        instanceColor: {
          numComponents: 3,
          data: instanceColors,
          divisor: 1,
        },
      });
      const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
      const vertexArrayInfo = twgl.createVertexArrayInfo(gl, programInfo, bufferInfo);

      const uniforms = {
        u_lightWorldPos: [1, 8, -30],
        u_lightColor: [0.8, 0.5, 0.2, 0.8],
        u_ambient: [0, 0, 0, 1],
        u_specular: [1, 1, 1, 1],
        u_shininess: 20,
        u_specularFactor: 1,
      };

      function render(time) {
        time *= 0.001;
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fov = 30 * Math.PI / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.5;
        const zFar = 500;
        const projection = m4.perspective(fov, aspect, zNear, zFar);
        const radius = 25;
        const speed = time * .1;
        const eye = [Math.sin(speed) * radius, Math.sin(speed * .7) * 10, Math.cos(speed) * radius];
        const target = [0, 0, 0];
        const up = [0, 1, 0];

        const camera = m4.lookAt(eye, target, up);
        const view = m4.inverse(camera);
        uniforms.u_viewProjection = m4.multiply(projection, view);
        uniforms.u_viewInverse = camera;

        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, vertexArrayInfo);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, vertexArrayInfo, gl.TRIANGLES, vertexArrayInfo.numelements, 0, numInstances);

        // do it with drawObjectList (not you'd probably make/update the list outside the render loop
        // twgl.drawObjectList(gl, [
        //   {
        //     programInfo: programInfo,
        //     vertexArrayInfo: vertexArrayInfo,
        //     uniforms: uniforms,
        //     instanceCount: numInstances,
        //   },
        // ]);

        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    }
    main();



