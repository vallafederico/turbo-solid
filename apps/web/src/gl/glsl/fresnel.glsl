float calculateFresnel(vec3 viewDirection, vec3 normal, float refractionIndex) {
    float r0 = (1.0 - refractionIndex) / (1.0 + refractionIndex);
    r0 = r0 * r0;
    float cosTheta = clamp(dot(viewDirection, normal), 0.0, 1.0);
    float fresnel = r0 + (1.0 - r0) * pow(1.0 - cosTheta, 5.0);
    return fresnel;
}