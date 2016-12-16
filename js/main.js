    var initScene, render,
        renderer, scene, cameraL, cameraR, light, light2, controls,
        geometry, material, texture, loader, plane;
    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;
    function initScene() {

        scene = new THREE.Scene();

        // 左側のカメラ
        cameraL = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
        cameraL.position.set(0, 0, 70);
        controls = new THREE.OrbitControls(cameraL);
        scene.add(cameraL);

        // 右側のカメラ
        cameraR = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
        cameraR.position.set(45, 5, 0);
        cameraR.lookAt({x: 0, y: 0, z: 0});
        scene.add(cameraR);

        light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        light2 = new THREE.DirectionalLight(0xffffff, 1);
        light2.position.set(20, 20, 20);
        scene.add(light2);

        video = document.getElementById("video");  // 指定IDの要素を取得

        geometry = new THREE.PlaneGeometry(96, 54, 256, 256);
        texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;

        material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,    // 両面に映す
            map: texture,              // テクスチャ
            displacementMap: texture,  // displacementのテクスチャ
            displacementScale: -12     // displacementの大きさ
        });
        plane = new THREE.Mesh(geometry, material);
        plane.geometry.verticesNeedUpdate = true;
        scene.add(plane);

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.setClearColor(0xaaaaaa);
        renderer.autoClear = false;
        document.getElementById("displ").appendChild(renderer.domElement);

        document.addEventListener('keydown', onKeyDown, false);

        keydown = {};

        function onKeyDown(event) {
            switch (event.keyCode) {
                case 87:
                    /*W*/ video.load();
                    break;
                case 83:
                    /*S*/ video.play();
                    break;
                case 88:
                    /*X*/ video.pause();
                    break;
            }
        }
        render();
    }

    function render() {
        requestAnimationFrame(render);
        controls.update();
        plane.geometry.verticesNeedUpdate = true;

        cameraL.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;
        cameraR.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;
        cameraL.updateProjectionMatrix();
        cameraR.updateProjectionMatrix();

        renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.clear();

        renderer.setViewport(1, 1, 0.5 * SCREEN_WIDTH - 2, SCREEN_HEIGHT - 2);
        renderer.render(scene, cameraL);

        renderer.setViewport(0.5 * SCREEN_WIDTH + 1, 1, 0.5 * SCREEN_WIDTH - 2, SCREEN_HEIGHT - 2);
        renderer.render(scene, cameraR);
    }
    window.onload = initScene;
