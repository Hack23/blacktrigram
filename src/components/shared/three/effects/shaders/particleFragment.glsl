/**
 * GPU Particle Fragment Shader
 * Renders circular particles with smooth edges and glow
 * Korean cyberpunk aesthetic with HDR-ready output
 */

uniform vec3 color;
uniform float opacity;
uniform float edgeStart;    // Configurable edge start threshold
uniform float edgeEnd;      // Configurable edge end threshold
uniform float glowPower;    // Configurable glow intensity

varying float vAlpha;

void main() {
  // Calculate distance from center for circular shape
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  // Discard pixels outside circle
  if (dist > 0.5) {
    discard;
  }
  
  // Smooth edge falloff for anti-aliasing (configurable thresholds)
  float edge = 1.0 - smoothstep(edgeStart, edgeEnd, dist);
  
  // Add glow effect for Korean aesthetic (configurable power)
  float glow = 1.0 - dist * 2.0;
  glow = pow(glow, glowPower);
  
  // Combine effects
  float finalAlpha = opacity * vAlpha * edge;
  vec3 finalColor = color * (1.0 + glow * 0.5); // HDR boost for bloom
  
  gl_FragColor = vec4(finalColor, finalAlpha);
}
