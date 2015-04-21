// -------------------------------------------------
//
// Graphics + Audio
// 
// -------------------------------------------------

/* global THREE:false, TWEEN:false, requestAnimationFrame:false */

'use strict';


var container;
var camera;
var scene;
var renderer;
var particle;
var mouseX = 0;
var mouseY = 0;
var totalParticles = 15;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


var images = ['broken.png', 'bad.png'];



// -------------------------------------------------
//
// Return Random Image To Use
// 
// -------------------------------------------------


function randomImage(){
	var image = 'images/' + images[Math.floor(Math.random() * images.length)];
	return THREE.ImageUtils.loadTexture(image);
}



// -------------------------------------------------
//
// Resize
// 
// -------------------------------------------------


function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}





// -------------------------------------------------
//
// Listeners
// 
// -------------------------------------------------
function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}


function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length === 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}







// -------------------------------------------------
//
// Particle Movements
// 
// -------------------------------------------------
function initParticle( particle, delay ) {

	var particle = this instanceof THREE.Sprite ? this : particle;
	var delay = delay !== undefined ? delay : 0;

	particle.position.set( 0, 0, 0 );
	particle.scale.x = particle.scale.y = Math.random() * 64 + 32;

	new TWEEN.Tween( particle )
		.delay( delay )
		.to( {}, 9000 )
		.onComplete( initParticle )
		.start();

	new TWEEN.Tween( particle.position )
		.delay( delay )
		.to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
		.start();


}



// -------------------------------------------------
//
// Animate
// 
// -------------------------------------------------
function render() {
	TWEEN.update();

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	camera.lookAt( scene.position );

	renderer.render( scene, camera );
}


function animate() {
	requestAnimationFrame( animate );
	render();
}




// -------------------------------------------------
//
// Audio
// 
// -------------------------------------------------
function initAudio(){
	var sound = new Howl({
		urls: ['waiting.mp3', 'waiting.ogg'],
		loop: true,
		volume: 0.5,
		onened: function(){
			sound.play();
		}
	});

	sound.play();
}





// -------------------------------------------------
//
// Init
// 
// -------------------------------------------------

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 1000;


	initAudio();

	
	scene = new THREE.Scene();

	

	for ( var i = 0; i < totalParticles; i++ ) {

		var material = new THREE.SpriteMaterial({
			map: randomImage()
		});

		particle = new THREE.Sprite( material );

		initParticle( particle, i * 10 );

		scene.add( particle );
	}

	renderer = new THREE.CanvasRenderer({alpha: true, antialias: true});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );


	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );


	window.addEventListener( 'resize', onWindowResize, false );

}



init();
animate();
