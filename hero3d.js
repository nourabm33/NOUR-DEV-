/* ============================================================
   HERO 3D SCENE — Three.js WebGL
   Extruded slogan text + logo plane, cinematic lighting,
   mouse-driven parallax with smooth inertia.
   ============================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('hero3dCanvas');
  var wrap = document.getElementById('hero3dCanvasWrap');
  if (!canvas || !wrap || typeof THREE === 'undefined') return;

  /* ----------------------------------------------------------
     SCENE SETUP
     ---------------------------------------------------------- */
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 100);
  camera.position.set(0, 0, 6);

  /* ----------------------------------------------------------
     LIGHTING — cinematic 3-point setup
     ---------------------------------------------------------- */
  var ambientLight = new THREE.AmbientLight(0x1a2744, 0.6);
  scene.add(ambientLight);

  var keyLight = new THREE.DirectionalLight(0x4488ff, 1.2);
  keyLight.position.set(3, 4, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 20;
  keyLight.shadow.radius = 4;
  scene.add(keyLight);

  var fillLight = new THREE.DirectionalLight(0x00d4ff, 0.4);
  fillLight.position.set(-3, 2, 3);
  scene.add(fillLight);

  var rimLight = new THREE.PointLight(0x0066ff, 0.8, 15);
  rimLight.position.set(0, -2, 3);
  scene.add(rimLight);

  var topGlow = new THREE.PointLight(0x00d4ff, 0.3, 10);
  topGlow.position.set(0, 3, 2);
  scene.add(topGlow);

  /* ----------------------------------------------------------
     GROUP — everything pivots together for parallax
     ---------------------------------------------------------- */
  var sceneGroup = new THREE.Group();
  scene.add(sceneGroup);

  /* ----------------------------------------------------------
     LOGO — textured plane
     ---------------------------------------------------------- */
  var logoMesh = null;
  var textureLoader = new THREE.TextureLoader();
  textureLoader.load('assets/img/logo.png', function (tex) {
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    var aspect = tex.image.width / tex.image.height;
    var planeH = 2.4;
    var planeW = planeH * aspect;

    var geo = new THREE.PlaneGeometry(planeW, planeH);
    var mat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      roughness: 0.3,
      metalness: 0.1,
      emissive: new THREE.Color(0x1a3a6a),
      emissiveIntensity: 0.25,
      side: THREE.FrontSide,
      depthWrite: true
    });

    logoMesh = new THREE.Mesh(geo, mat);
    logoMesh.position.set(0, 0.2, -1.2);
    logoMesh.castShadow = true;
    logoMesh.receiveShadow = true;
    sceneGroup.add(logoMesh);
  });

  /* ----------------------------------------------------------
     SHADOW PLANE (under logo)
     ---------------------------------------------------------- */
  var shadowGeo = new THREE.PlaneGeometry(4, 4);
  var shadowMat = new THREE.ShadowMaterial({ opacity: 0.25 });
  var shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -1.5;
  shadowPlane.receiveShadow = true;
  sceneGroup.add(shadowPlane);

  /* ----------------------------------------------------------
     3D EXTRUDED TEXT — "Where Your Vision Becomes Reality"
     Uses built-in shapes since FontLoader is not in r128 core.
     We create text with a canvas texture on a shaped mesh for
     a premium 3D look with depth.
     ---------------------------------------------------------- */

  function createTextMesh() {
    var dpr = Math.min(window.devicePixelRatio, 2);
    var cw = 1024 * dpr;
    var ch = 128 * dpr;
    var c = document.createElement('canvas');
    c.width = cw;
    c.height = ch;
    var ctx = c.getContext('2d');

    var fontSize = Math.round(48 * dpr);
    ctx.font = '700 ' + fontSize + 'px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    var gradient = ctx.createLinearGradient(0, 0, cw, 0);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, '#88ccff');
    gradient.addColorStop(1, '#00d4ff');
    ctx.fillStyle = gradient;

    ctx.shadowColor = 'rgba(0, 102, 255, 0.6)';
    ctx.shadowBlur = 20 * dpr;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillText('Where Your Vision Becomes Reality', cw / 2, ch / 2);

    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'rgba(0, 102, 255, 0.15)';
    ctx.shadowColor = 'rgba(0, 212, 255, 0.4)';
    ctx.shadowBlur = 30 * dpr;
    ctx.fillText('Where Your Vision Becomes Reality', cw / 2, ch / 2);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    var boxW = 3.8;
    var boxH = 0.38;
    var boxD = 0.12;
    var geo = new THREE.BoxGeometry(boxW, boxH, boxD, 1, 1, 1);

    var frontMat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      roughness: 0.2,
      metalness: 0.5,
      emissive: new THREE.Color(0x003366),
      emissiveIntensity: 0.15
    });

    var sideMat = new THREE.MeshStandardMaterial({
      color: 0x0a1628,
      roughness: 0.4,
      metalness: 0.6,
      emissive: new THREE.Color(0x001133),
      emissiveIntensity: 0.1
    });

    var backMat = new THREE.MeshStandardMaterial({
      color: 0x060c18,
      roughness: 0.6,
      metalness: 0.3
    });

    var materials = [
      sideMat,  // +X
      sideMat,  // -X
      sideMat,  // +Y
      sideMat,  // -Y
      frontMat, // +Z (front face with text)
      backMat   // -Z
    ];

    var mesh = new THREE.Mesh(geo, materials);
    mesh.position.set(0, -0.65, 0.8);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  var textMesh = createTextMesh();
  sceneGroup.add(textMesh);

  /* ----------------------------------------------------------
     FLOATING PARTICLES (subtle depth cues)
     ---------------------------------------------------------- */
  var particleCount = 40;
  var particleGeo = new THREE.BufferGeometry();
  var positions = new Float32Array(particleCount * 3);
  var particleSpeeds = new Float32Array(particleCount);

  for (var i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    particleSpeeds[i] = 0.002 + Math.random() * 0.005;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  var particleMat = new THREE.PointsMaterial({
    color: 0x4488ff,
    size: 0.03,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  var particles = new THREE.Points(particleGeo, particleMat);
  sceneGroup.add(particles);

  /* ----------------------------------------------------------
     MOUSE PARALLAX — smooth inertia
     ---------------------------------------------------------- */
  var mouse = { x: 0, y: 0 };
  var target = { x: 0, y: 0 };
  var current = { x: 0, y: 0 };
  var INERTIA = 0.04;
  var MAX_ROT = 0.12; // radians (~7 degrees)

  wrap.addEventListener('mousemove', function (e) {
    var rect = wrap.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    target.x = mouse.x * MAX_ROT;
    target.y = -mouse.y * MAX_ROT;
  });

  wrap.addEventListener('mouseleave', function () {
    target.x = 0;
    target.y = 0;
  });

  wrap.addEventListener('touchmove', function (e) {
    var touch = e.touches[0];
    var rect = wrap.getBoundingClientRect();
    mouse.x = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
    mouse.y = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;
    target.x = mouse.x * MAX_ROT * 0.5;
    target.y = -mouse.y * MAX_ROT * 0.5;
  }, { passive: true });

  wrap.addEventListener('touchend', function () {
    target.x = 0;
    target.y = 0;
  });

  /* ----------------------------------------------------------
     RESIZE
     ---------------------------------------------------------- */
  function resize() {
    var w = wrap.clientWidth;
    var h = wrap.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', resize);
  resize();

  /* ----------------------------------------------------------
     ANIMATION LOOP
     ---------------------------------------------------------- */
  var clock = new THREE.Clock();
  var floatPhase = 0;

  function animate() {
    requestAnimationFrame(animate);

    var dt = clock.getDelta();
    var elapsed = clock.getElapsedTime();

    current.x += (target.x - current.x) * INERTIA;
    current.y += (target.y - current.y) * INERTIA;

    sceneGroup.rotation.y = current.x;
    sceneGroup.rotation.x = current.y;

    floatPhase = elapsed;
    if (logoMesh) {
      logoMesh.position.y = 0.2 + Math.sin(floatPhase * 0.8) * 0.06;
      logoMesh.position.z = -1.2 + Math.sin(floatPhase * 0.6) * 0.05;
    }

    textMesh.position.y = -0.65 + Math.sin(floatPhase * 0.8 + 0.5) * 0.03;
    textMesh.position.z = 0.8 + Math.sin(floatPhase * 0.6 + 0.5) * 0.03;

    var posArr = particles.geometry.attributes.position.array;
    for (var i = 0; i < particleCount; i++) {
      posArr[i * 3 + 1] += particleSpeeds[i];
      if (posArr[i * 3 + 1] > 3) {
        posArr[i * 3 + 1] = -3;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;

    rimLight.position.x = Math.sin(elapsed * 0.5) * 2;
    topGlow.position.x = Math.cos(elapsed * 0.3) * 1.5;

    renderer.render(scene, camera);
  }

  animate();
})();
