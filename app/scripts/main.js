

'use strict';
/*global THREE:false, requestAnimationFrame: false */

// -------------------------------------------------
//
// Globals
// 
// -------------------------------------------------

var container;
var camera, scene, renderer;
var mesh, geometry, material;


var quantity = 400;

var mouseX = 0;
var mouseY = 0;
var startTime = Date.now();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;




// ------------------------------------------------
// Mouse movements
//

function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) * 0.25;
	mouseY = ( event.clientY - windowHalfY ) * 0.15;
}

// ------------------------------------------------
// Resize
//

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


// ------------------------------------------------
// Animate
//

function animate() {

	requestAnimationFrame( animate );

	var position = Math.floor((( Date.now() - startTime ) * 0.1 ) % quantity);

	camera.position.x += ( mouseX - camera.position.x ) * 0.01;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	camera.position.z = -position + quantity;

	renderer.render( scene, camera );

}




function makeMesh(){

	geometry = new THREE.Geometry();

	var texture = THREE.ImageUtils.loadTexture( 'images/broken.png', null, animate );
	texture.magFilter = THREE.LinearMipMapLinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;

	var fog = new THREE.Fog( 0xececec, - 100, 6000 );

	material = new THREE.ShaderMaterial( {

		uniforms: {

			'map': { type: 't', value: texture },
			'fogColor' : { type: 'c', value: fog.color },
			'fogNear' : { type: 'f', value: fog.near },
			'fogFar' : { type: 'f', value: fog.far },

		},
		vertexShader: document.getElementById( 'vertex' ).textContent,
		fragmentShader: document.getElementById( 'fragment' ).textContent,
		transparent: true

	} );


	var bufferGeometry = new THREE.PlaneGeometry(32,32);
	var plane = new THREE.Mesh(bufferGeometry);

	for ( var i = 0; i < quantity; i+=20 ) {

		plane.position.x = Math.random() * 1000 - 500;
		plane.position.y = - Math.random() * Math.random() * 500 - 15;
		plane.position.z = i;
		plane.rotation.z = Math.random() * Math.PI;
		plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

		plane.updateMatrix();
		geometry.merge(plane.geometry, plane.matrix);

	}

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	mesh = new THREE.Mesh( geometry, material );
	mesh.position.z = -quantity;
	scene.add( mesh );

	mesh = new THREE.Mesh( geometry, material );
	mesh.position.z = -quantity * 2;
	scene.add( mesh );

}





function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );


	// ------------------------------------------------
	// Canvas positioning
	//
	
	container.style.zIndex = 9;
	container.style.width = window.innerWidth;
	container.style.height = window.innerHeight;
	container.style.top = 0;
	container.style.left = 0;
	container.style.position = 'absolute';

	


	// ------------------------------------------------
	// Audio
	//
	var sound = new Howl({
		urls: ['waiting.mp3', 'waiting.ogg'],
		loop: true,
		volume: 0.6,
		onend: function(){
			sound.play();
		}
	});

	sound.play();
	



	// ------------------------------------------------
	// Three stuff
	//
	
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 6000;

	scene = new THREE.Scene();


	makeMesh();

	

	// ------------------------------------------------
	// Set up renderer
	//
	
	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );


	// ------------------------------------------------
	// Add binds
	//
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );

}


init();