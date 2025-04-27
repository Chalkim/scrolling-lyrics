import React, { useEffect, useRef, useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";

interface BackgroundProps {
  children: React.ReactNode;
  timeFactor?: number;
}

const Background: React.FC<BackgroundProps> = (props: BackgroundProps) => {
  const { children, timeFactor } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const { scene, camera, renderer, material } = useMemo(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        varying vec2 vUv;

        ${getColorMapFunctions()}

        ${getNoiseFunctions()}

        void main() {
          vec2 fragCoord = vUv * iResolution;
          vec2 uv = fragCoord / iResolution.x;
          float shade = pattern(uv);
          gl_FragColor = vec4(colormap(shade).rgb, shade);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    return { scene, camera, renderer, material };
  }, [width, height]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.appendChild(renderer.domElement);

    material.uniforms.iTime.value = (frame / fps) * (timeFactor ||  1.0);
    renderer.render(scene, camera);

    // 清理函数
    return () => {
      container.removeChild(renderer.domElement);
    };
  }, [frame, fps, scene, camera, renderer, material, timeFactor]);

  return (
    <div ref={containerRef} style={{background: 'black'}}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
};

const getColorMapFunctions = () => `
  float colormap_red(float x) {
    if (x < 0.0) {
      return 54.0 / 255.0;
    } else if (x < 20049.0 / 82979.0) {
      return (829.79 * x + 54.51) / 255.0;
    } else {
      return 1.0;
    }
  }

  float colormap_green(float x) {
    if (x < 20049.0 / 82979.0) {
      return 0.0;
    } else if (x < 327013.0 / 810990.0) {
      return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
    } else if (x <= 1.0) {
      return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
    } else {
      return 1.0;
    }
  }

  float colormap_blue(float x) {
    if (x < 0.0) {
      return 54.0 / 255.0;
    } else if (x < 7249.0 / 82979.0) {
      return (829.79 * x + 54.51) / 255.0;
    } else if (x < 20049.0 / 82979.0) {
      return 127.0 / 255.0;
    } else if (x < 327013.0 / 810990.0) {
      return (792.02249341361393720147485376583 * x - 64.364790735602331034989206222672) / 255.0;
    } else {
      return 1.0;
    }
  }

  vec4 colormap(float x) {
    return vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);
  }
`;

const getNoiseFunctions = () => `
  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
  }

  const mat2 mtx = mat2(0.80, 0.60, -0.60, 0.80);

  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.500000 * noise(p + iTime); p = mtx * p * 2.02;
    f += 0.031250 * noise(p); p = mtx * p * 2.01;
    f += 0.250000 * noise(p); p = mtx * p * 2.03;
    f += 0.125000 * noise(p); p = mtx * p * 2.01;
    f += 0.062500 * noise(p); p = mtx * p * 2.04;
    f += 0.015625 * noise(p + sin(iTime));
    return f / 0.96875;
  }

  float pattern(vec2 p) {
    return fbm(p + fbm(p + fbm(p)));
  }
`;

export default Background;
