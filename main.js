var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.
var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

var container, stats;

var camera, scene, renderer, manager, controls;

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

  $('#asteroid').change(function() {
    scene.remove(window.obj);
    loadModel($(this).val());
  });
}


function loadModel(name) {
  var loader = new THREE.OBJLoader( manager );
  loader.load('obj/' + name + '.txt', function ( object ) {

    object.traverse( function ( child ) {

      if ( child instanceof THREE.Mesh ) {
        console.log('oh hey');

        //child.material.map = ast_map;

/*
        child.material.map = THREE.ImageUtils.loadTexture( 'asteroid_texture.jpg');
        child.material.needsUpdate = true;
        var material = new THREE.MeshBasicMaterial({ color: 0xcccccc, shading:THREE.FlatShading, wireframe: false});
*/
        /*
        material = new THREE.MeshBasicMaterial({map: ast_map});
        console.log(material);
        material.needsUpdate = true;
        child.material = material;
         */
        var material = new THREE.MeshLambertMaterial({ color: 0xcccccc, shading:THREE.NoShading, wireframe: true, wireframeLinewidth: 10.0, vertexColors: THREE.NoColors});
        child.material = material;

      }

    } );

/*
    var geom = object.children[0].geometry;

    geometry.faceVertexUvs[0] = [];
           for(var i = 0; i < geometry.faces.length; i++){


               geometry.faceVertexUvs[0].push([
        new THREE.Vector2( 0,0 ),
        new THREE.Vector2( 0,1 ),
        new THREE.Vector2( 1,1),

      ]);


               geometry.faces[i].materialIndex = i;
               materials.push(new THREE.MeshBasicMaterial({map:ast_map}));

           }
  geometry.computeFaceNormals();

          geometry.dynamic = true;
          geometry.uvsNeedUpdate = true;
*/


              object.rotation.x = 20* Math.PI / 180;
              object.rotation.z = 20* Math.PI / 180;
              window.obj = object
                console.log(obj);
    scene.add( obj );

  } );
}


function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 1300;

  // scene

  scene = new THREE.Scene();

  var ambient = new THREE.AmbientLight(0xaaaaaa);
  scene.add( ambient );

  var directionalLight = new THREE.DirectionalLight(0xfdb813);
  directionalLight.position.set( 0, 0, 3000 );
  scene.add( directionalLight );

  // texture

  manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total );

  };

  // texture
  var texture = new THREE.Texture();
  var loader = new THREE.ImageLoader( manager );
  var ast_map = THREE.ImageUtils.loadTexture('asteroid_texture.jpg');
    loader.load( 'asteroid_texture.jpg', function ( image ) {
      texture.image = image;
      texture.needsUpdate = true;
    } );

  // model
  loadModel('pallas');

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.dynamicDampingFactor = 0.5;

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  controls.update(camera);
  render();
}

function render() {
  if (typeof obj !== 'undefined') {
    obj.rotation.x += (0.1*(Math.PI / 180));
    obj.rotation.x %=360;
  }

  camera.lookAt( scene.position );

  renderer.render( scene, camera );
}
