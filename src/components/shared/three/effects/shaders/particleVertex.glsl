/**
 * GPU Particle Vertex Shader
 * Handles particle movement, gravity, and lifetime on GPU
 * Optimized for 1000+ particles at 60fps
 */

uniform float time;
uniform float speed;
uniform float gravity;
uniform float lifetime;
uniform float sizeScale; // Configurable perspective scale factor

attribute float startTime;
attribute vec3 velocity;
attribute float size;

varying float vAlpha;

void main() {
  // Calculate particle age
  float age = time - startTime;
  float progress = clamp(age / lifetime, 0.0, 1.0);
  
  // Calculate position with velocity and gravity
  vec3 pos = position + velocity * age * speed;
  pos.y += -0.5 * gravity * age * age; // Gravity acceleration
  
  // Apply transformation to world space
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // Calculate point size with perspective correction
  float distanceScale = 1.0 / -mvPosition.z;
  gl_PointSize = size * distanceScale * sizeScale;
  
  // Fade out over lifetime
  vAlpha = 1.0 - progress;
}
