import { useEffect, useMemo } from "react";
import * as THREE from "three";

/** Provides ground contact without an extra shadow map or lighting pass. */
export function FighterContactShadow(): React.JSX.Element {
  const shadow = useMemo(() => ({
    geometry: new THREE.PlaneGeometry(1.34, 1.15),
    material: new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          float opacity = 0.52 * (1.0 - smoothstep(0.13, 0.5, distance(vUv, vec2(0.5))));
          gl_FragColor = vec4(vec3(0.0), opacity);
        }
      `,
    }),
  }), []);
  useEffect(() => () => {
    shadow.geometry.dispose();
    shadow.material.dispose();
  }, [shadow]);
  return <mesh position-y={0.012} rotation-x={-Math.PI / 2} {...shadow} />;
}
