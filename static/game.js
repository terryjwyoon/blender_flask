class Game{

    constructor(){
        this.scene = new THREE.Scene();
        // PerspectiveCamera(화각, 화면비율, near(얼마나 가까이서 렌더링), far(카메라에서 볼수있는 최대거리))
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer();  // 색상이나 재질을 넣을 때 사용
        this.renderer.setSize(window.innerWidth, window.innerHeight);  // size of a canvas
        document.body.appendChild(this.renderer.domElement);  // index.html의 body부분에 추가, domElement(renderer를 화면에 그려주는 역할)
        
        const geometry = new THREE.BoxGeometry(1, 1, 1);  // (Example) Box object
        const light = new THREE.DirectionalLight("#FFFFFF");  // 조명
        light.position.set(0, 20, 10);  // location of the light
        const ambient = new THREE.AmbientLight("#FFFFFF");  // ambient light: 모든 객체를 균일하게 비춤
        const material = new THREE.MeshPhongMaterial( {color: "#FFFFFF"});  // 재질, 빛을 반사하는 효과를 낼 수 있는 mesh form
        
        this.cube = new THREE.Mesh(geometry, material);  // 만들어진 객체를 cube에 넣어줌
        this.camera.position.z = 15;  // 카메라의 깊이값 조절, 객체가 가까이 혹은 멀리 보이도록 함(x, y, z 다 조절 가능), 작을수록 가깝게 보임

        /* 
         * Load Blender FBX objects
         * - Texture files must be in the same location with the .fbx file
         */

        const fbxloader = new THREE.FBXLoader();
        const game = this;
        fbxloader.load(`static/assets/mai_three.fbx`, function(object){
            
            game.scene.add(object);
            object.position.y = -40;
            object.position.z = -50;
            object.scale.x = 0.01;
            object.scale.y = 0.01;
            object.scale.z = 0.01;
        });

        fbxloader.load(`static/assets/snow_three.fbx`, function(object){
            
            game.scene.add(object);
            object.position.y = -50;
            object.position.z = -50;
            object.scale.x = 0.01;
            object.scale.y = 0.01;
            object.scale.z = 0.01;
        });

        // 만든 객체를 scene에 추가 (카메라는 scene을 비추는 것이기 때문에 추가X)
        this.scene.add(this.cube);
        this.scene.add(light);
        this.scene.add(ambient);

        // 애니메이션이 반복적으로 움직이도록 함
        this.animate();
    }

    animate() {
        /* 애니메이션이 반복적으로 실행되도록 함 */
        const game = this;
        requestAnimationFrame(function(){ game.animate(); });  // frame마다 반복적으로 시행
        
        // cube 회전
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.cube.rotation.z += 0.01;

        // cube 좌우 움직임
        // this.cube.position.x += 0.01;

        this.renderer.render(this.scene, this.camera);  // 실행된 내용을 렌더링해서 화면에 보여줌
    }
}