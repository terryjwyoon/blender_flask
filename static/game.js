class Game{

    constructor(){
        this.scene;
        this.player = { };
        this.renderer;
        this.camera;
        this.orbCtrl;
        this.clock = new THREE.Clock();  // 시간추적(여기서는 애니메이션 프레임 작동에 필요)

        // #26: 그림자 효과
        this.container;
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        
        // #27
        this.animations = {};

        const game = this;  // 자기자신을 game에 넣어둠
        this.aniInit();
    }
    
    aniInit(){

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#D5D5D5");  // #26: 배경 색상

        // PerspectiveCamera(화각, 화면비율, near(얼마나 가까이서 렌더링), far(카메라에서 볼수있는 최대거리))
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 3000)
        this.renderer = new THREE.WebGLRenderer();  // 색상이나 재질을 넣을 때 사용
        this.renderer.setSize(window.innerWidth, window.innerHeight);  // size of a canvas
        document.body.appendChild(this.renderer.domElement);  // index.html의 body부분에 추가, domElement(renderer를 화면에 그려주는 역할)
        
        const geometry = new THREE.BoxGeometry(1, 1, 1);  // (Example) Box object
        const light = new THREE.DirectionalLight("#FFFFFF");  // 조명
        light.position.set(0, 20, 10);  // location of the light

        // #26: 조명 shadow
        light.castShadow = true;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        light.shadow.camera.left = -100;
        light.shadow.camera.right = 100;
        this.shadow = light;

        // #26: 렌더러 사이즈 지정
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        const ambient = new THREE.AmbientLight("#FFFFFF");  // ambient light: 모든 객체를 균일하게 비춤
        const material = new THREE.MeshPhongMaterial( {color: "#FFFFFF"});  // 재질, 빛을 반사하는 효과를 낼 수 있는 mesh form
        
        this.cube = new THREE.Mesh(geometry, material);  // 만들어진 객체를 cube에 넣어줌

        // #26: 바닥 추가
        var mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(5000,5000),
            new THREE.MeshPhongMaterial({color: 0x999999, depthWrite: false})
        );
        mesh.rotation.x = - Math.PI / 2;  // 평면이 눕혀저서 나오도록 함
        mesh.position.y = -30;  // 마이가 바닥에 붙게 하기 위해서, 마이를 불러올때 지정한 포지션과 동일한 값으로
        mesh.receiveShadow = true;
        this.scene.add(mesh);

        // #26: 그리드 추가
        var grid = new THREE.GridHelper(5000, 50, 0x000000, 0x000000);  // (그리드 사이즈, 분할될 그리드 수, 그리드 선색상, 그리드 색상)
        grid.position.y = -30;  // 바닥과 같은 위치
        grid.material.transparent = true;
        grid.material.opacity = 0.3;
        this.scene.add(grid);

        // this.camera.position.z = 50;  // 카메라의 깊이값 조절, 객체가 가까이 혹은 멀리 보이도록 함(x, y, z 다 조절 가능), 작을수록 가깝게 보임

        /* 
         * Load Blender FBX objects
         * - Texture files must be in the same location with the .fbx file
         */

        const fbxloader = new THREE.FBXLoader();
        // const game = this;

        // mai 불러오기
        fbxloader.load(`static/assets/mai_three.fbx`, function(object){
            
            // @TY: #25
            object.mixer = new THREE.AnimationMixer(object);  // animation player
            object.name = "Mai";
            game.player.mixer = object.mixer;
            game.player.root = object.mixer.getRoot();
            console.log(object.mixer.getRoot());

            game.scene.add(object);
            object.position.y = -40;
            object.position.z = -50;
            object.scale.x = 0.02;
            object.scale.y = 0.02;
            object.scale.z = 0.02;
            
            // #26: 그림자 실행
            object.traverse(function(child) {  // 객체의 모든 하위항목에 대한 콜백 실행
                if(child.isMesh){
                    child.castShadow = true;
                }
            });

            // #27
            game.player.object = new THREE.Object3D();  // 카메라가 플레이어를 따라다니도록 함
            
            game.scene.add(game.player.object);
            game.player.object.add(object);

            console.log(object.animations);
            console.log(object.animations[0].name);
            console.log(object.animations[1]);
            
            object.animations.forEach(element => {

                if(element.name.includes('Idle')){

                    game.animations.Idle = element;
                }
                else if(element.name.includes('Walk')){

                    game.animations.Walk = element;
                }
                else if(element.name.includes('Run')){

                    game.animations.Run = element;
                }
                else if(element.name.includes('Kick')){

                    game.animations.Kick = element;
                }
                else if(element.name.includes('BackWard')){

                    game.animations.BackWard = element;
                }
            });

            game.nextAni(fbxloader);
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

        // #26
        this.orbCtrl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbCtrl.target.set(0,0,0);  // 카메라가 비추고 있는 부분 조절
        this.orbCtrl.update();

        // this.animate();
    }

    //=========================================================================
    //
    //=========================================================================
    nextAni(fbxLoader) {
        
        const game = this;
        fbxLoader.load(`static/assets/MaiAction.fbx`, function( object ){
            
            // #27
            game.selAction = "Idle";
            game.Cameras();
            
            // #26: 게임스틱 추가
            game.GamePad = new GamePad({
                pc: game.playerCtrl,  // #27
                game: game
            });

            game.animate();
        });
    }

    set selAction(name) {

        const action = this.player.mixer.clipAction( this.animations[name] );
        this.player.mixer.stopAllAction();  // 기존 동작 정지

        // #27
        this.player.action = name;
        this.player.actionTime = Date.now();

        action.fadeIn(0.1);
        action.play();
    }

    changeAction() {

        game.selAction = document.getElementById("changeAction").value;
    }

    //=========================================================================
    //
    //=========================================================================
    animate() {
        /* 애니메이션이 반복적으로 실행되도록 함 */
        const game = this;
        const dt = this.clock.getDelta();  // 경과된 시간을 초단위로 가져옴
        requestAnimationFrame(function(){ game.animate(); });  // frame마다 반복적으로 시행
        
        // cube 회전
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.cube.rotation.z += 0.01;

        // cube 좌우 움직임
        // this.cube.position.x += 0.01;

        if(this.player.mixer!==undefined){
            this.player.mixer.update(dt);
        }

        // #26: 그림자 위치조정
        if(this.shadow != undefined){
            this.shadow.position.x = this.player.object.position.x + 50;  // 그림자가 개체의 근처에 있도록
            this.shadow.position.y = this.player.object.position.y + 100;
            this.shadow.position.z = this.player.object.position.z - 200;
            this.shadow.target = this.player.object;
        }

        //---------------------------------------------------------------------
        // #27
        //---------------------------------------------------------------------
        if(this.player.action=='Walk'){

            const walkTime = Date.now() - this.player.actionTime;
            if(walkTime>2000 && this.player.move.moveF>0){
                this.selAction = 'Run';
            }
        }

        if(this.player.move !== undefined) this.move(dt);

        // 플레이어의 카메라는 장면을 비추기 위한 것이 아니고, 실제 카메라가 따라 다닐 수 있도록 카메라 위치값을 가지고 있음
        if(this.player.camera != undefined && this.player.camera.active != undefined){

            // 카메라의 방향: [0,1]: 1이면 머리 위에서 카메라가 비춤
            this.camera.position.lerp(this.player.camera.active.getWorldPosition(new THREE.Vector3()), 1);
            const cameraPosition = this.player.object.position.clone();

            cameraPosition.y += 200;
            cameraPosition.x += 50;
            this.camera.lookAt(cameraPosition);
        }

        //---------------------------------------------------------------------
        //
        //---------------------------------------------------------------------
        this.renderer.render(this.scene, this.camera);  // 실행된 내용을 렌더링해서 화면에 보여줌
    }

    //=========================================================================
    // #27: move
    //=========================================================================
    move(dt){

        if(this.player.move.moveF>0){  // 이동중일 때
            
            const speed = (this.player.action=='Run') ? 500 : 200;
            this.player.object.translateZ(dt*speed);
        }
        else{

            this.player.object.translateZ(-dt*100);
        }
        this.player.object.rotateY(this.player.move.moveTurn*dt);  // 좌우이동
    }

    //=========================================================================
    // #27: playerCtrl
    //=========================================================================
    playerCtrl(moveF, moveTurn){

        if(moveF>0.1){

            if(this.player.action!='Walk' && this.player.action!='Run') this.selAction = 'Walk';
        }
        else if(moveF<-0.3){
            
            if(this.player.action!='BackWard') this.selAction = 'BackWard';
        }
        else {

            moveF = 0;
            if(this.player.action!='Idle'){
                this.selAction = 'Idle';
            }
        }

        if(moveF==0 && moveTurn==0){
            
            delete this.player.move;
        }
        else{

            this.player.move = { moveF, moveTurn };
        }
    }

    //=========================================================================
    // #27
    //=========================================================================
    set activeCamera(object){

        this.player.camera.active = object;
    }

    //=========================================================================
    // #27
    //=========================================================================
    Cameras(){

        const back = new THREE.Object3D();
        back.position.set(0, 500, -700);  // 카메라 위치
        back.parent = this.player.object;
        this.player.camera = { back };  // 캐릭터 액션마다 카메라 위치를 변경할 경우를 대비해 객체형식으로 값을 할당함
        game.activeCamera = this.player.camera.back;
    }
}