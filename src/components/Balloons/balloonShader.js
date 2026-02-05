export const vertexShader = `
  uniform vec3 poke_position;
  uniform float poke_strength;
  varying vec3 v_normal;

  void main() {
    v_normal = normal;
    vec3 new_position = position;
    float distance = length(position - poke_position);
    if (distance < 2.0) {
      new_position += normal * poke_strength * (2.0 - distance);
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position, 1.0);
  }
`;

export const fragmentShader = `
  uniform vec3 color;
  varying vec3 v_normal;

  void main() {
    float lighting = dot(v_normal, normalize(vec3(10.0, 10.0, 10.0)));
    gl_FragColor = vec4(color * (0.5 + lighting * 0.5), 1.0);
  }
`;
