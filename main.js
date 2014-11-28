var DEFAULT_OBJECT = 'pallas';

var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.
var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

var container, stats;

var camera, scene, renderer, manager, controls;
var directionalLight;
var astMap;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

initSelect();
init();
animate();

function initSelect() {
  for (var i=0; i < FILES.length; i++) {
    $('<option>').html(FILES[i].replace('.txt', '')).appendTo($('#asteroid'));
  }

  $('#asteroid').val(DEFAULT_OBJECT);
  $('#asteroid').change(function() {
    scene.remove(window.obj);
    loadModel($(this).val());
  });
}


function loadModel(name) {
  var loader = new THREE.OBJLoader(manager);
  loader.load('obj/' + name + '.txt', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        console.log('oh hey');
        var material = new THREE.MeshLambertMaterial({ color: 0xcccccc});
        child.material = material;
        child.geometry.computeFaceNormals();
        child.geometry.computeVertexNormals();
        child.geometry.computeBoundingBox();
      }
    });
    object.rotation.x = 20 * Math.PI / 180;
    object.rotation.z = 20 * Math.PI / 180;
    scene.add(object);
    window.obj = object; // TODO just make this a var

    var boundingBox = object.children[0].geometry.boundingBox;
    camera.position.x = boundingBox.max.x * 3;
    camera.position.y = boundingBox.max.y * 3;
    camera.position.z = boundingBox.max.z * 3;
  });
}


function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 1300;

  // scene
  scene = new THREE.Scene();

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  // directional lighting
  //var directionalLight = new THREE.DirectionalLight(0x855E42);
  directionalLight = new THREE.DirectionalLight(0xeeeec4);
  directionalLight.position.set(10000, 10000, 10000).normalize();
  scene.add(directionalLight);

  var directionalLight2 = new THREE.DirectionalLight(0x333333);
  directionalLight2.position.set(-10000, -10000, -10000).normalize();
  scene.add(directionalLight2);

  // texture
  manager = new THREE.LoadingManager();
  manager.onProgress = function(item, loaded, total) {
    console.log(item, loaded, total);
  };

  // texture
  var texture = new THREE.Texture();
  var loader = new THREE.ImageLoader(manager);
  astMap = THREE.ImageUtils.loadTexture('asteroid_texture.jpg');
    loader.load('asteroid_texture.jpg', function(image) {
      texture.image = image;
      texture.needsUpdate = true;
    } );

  // model
  loadModel(DEFAULT_OBJECT);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.dynamicDampingFactor = 0.5;

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update(camera);
  render();
}

function render() {
  if (typeof obj !== 'undefined') {
    obj.rotation.x += (0.2*(Math.PI / 180));
    obj.rotation.x %= 360;
  }
  //var timer = 0.0001 * Date.now();
  //directionalLight.position.x = 10000 + Math.sin(timer) * 75;
  //directionalLight.position.z = 10000 + Math.cos(timer) * 60;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
