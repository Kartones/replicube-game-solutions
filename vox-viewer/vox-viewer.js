class VoxViewer {
  constructor(container) {
    this.container = container;
    this.voxelSize = 1.0;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.voxelGroup = null;

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x222222);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.setupLights();

    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    window.addEventListener("resize", () => this.onWindowResize());

    this.animate();
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.5);
    fillLight.position.set(-5, 0, -5);
    this.scene.add(fillLight);
  }

  loadVoxelData(voxData) {
    if (this.voxelGroup) {
      this.voxelGroup.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        }
      });
      this.scene.remove(this.voxelGroup);
    }

    this.voxelGroup = new THREE.Group();

    if (!voxData.models || voxData.models.length === 0) {
      console.warn("No models found in vox data");
      return;
    }

    // Process first model (can be extended for multiple models)
    const model = voxData.models[0];
    this.createVoxelMesh(model, voxData.palette);

    this.scene.add(this.voxelGroup);
    this.centerCamera(model.size);
  }

  createVoxelMesh(model, palette) {
    // Group voxels by color for batching
    const voxelsByColor = new Map();

    model.voxels.forEach((voxel) => {
      if (voxel.colorIndex === 0) return; // Skip transparent voxels

      if (!voxelsByColor.has(voxel.colorIndex)) {
        voxelsByColor.set(voxel.colorIndex, []);
      }
      voxelsByColor.get(voxel.colorIndex).push(voxel);
    });

    // Create instanced meshes for each color
    voxelsByColor.forEach((voxels, colorIndex) => {
      // Create fresh geometry for each color group
      const geometry = new THREE.BoxGeometry(
        this.voxelSize,
        this.voxelSize,
        this.voxelSize
      );

      const color = this.paletteIndexToColor(palette[colorIndex]);
      const material = new THREE.MeshLambertMaterial({ color });

      const instancedMesh = new THREE.InstancedMesh(
        geometry,
        material,
        voxels.length
      );
      instancedMesh.castShadow = true;
      instancedMesh.receiveShadow = true;

      const matrix = new THREE.Matrix4();

      voxels.forEach((voxel, index) => {
        // Position voxel (center the model) - using current voxelSize
        const x = (voxel.x - model.size.x / 2) * this.voxelSize;
        const y = (voxel.z - model.size.z / 2) * this.voxelSize; // Z becomes Y (up)
        const z = -(voxel.y - model.size.y / 2) * this.voxelSize; // Y becomes -Z (forward)

        matrix.setPosition(x, y, z);
        instancedMesh.setMatrixAt(index, matrix);
      });

      instancedMesh.instanceMatrix.needsUpdate = true;
      this.voxelGroup.add(instancedMesh);
    });
  }

  paletteIndexToColor(paletteColor) {
    // Convert ARGB to RGB hex
    const r = (paletteColor >> 16) & 0xff;
    const g = (paletteColor >> 8) & 0xff;
    const b = paletteColor & 0xff;

    return (r << 16) | (g << 8) | b;
  }

  centerCamera(modelSize) {
    // Calculate bounding box using unit voxel size (1.0) for consistent camera positioning
    const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z) * 1.0; // Always use 1.0 for camera calc
    const distance = maxDim * 2;

    this.camera.position.set(distance, distance, distance);
    this.camera.lookAt(0, 0, 0);

    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  setVoxelSize(size) {
    this.voxelSize = size;
    if (this.currentVoxData) {
      this.loadVoxelData(this.currentVoxData);
    }
  }

  onWindowResize() {
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  setCurrentVoxData(voxData) {
    this.currentVoxData = voxData;
  }
}
