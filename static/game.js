class Game{

    constructor(){
        this.scene;
        this.player = { };
        this.selPlayer;  // #31
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
    }
    
    //=========================================================================
    //
    //=========================================================================
    aniInit(){

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#D5D5D5");  // #26: 배경 색상

        // PerspectiveCamera(화각, 화면비율, near(얼마나 가까이서 렌더링), far(카메라에서 볼수있는 최대거리))
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.9, 50000)
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

        // 그리드 추가
        var grid = new THREE.GridHelper(8000, 4, 0x000000, 0x000000);  // (그리드 사이즈, 분할될 그리드 수, 그리드 선색상, 그리드 색상)
        grid.position.y = -30;  // 바닥과 같은 위치
        grid.material.transparent = true;
        grid.material.opacity = 0.3;
        this.scene.add(grid);
        
        /* 
         * Load Blender FBX objects
         * - Texture files must be in the same location with the .fbx file
         */
        const fbxloader = new THREE.FBXLoader();
        
        //---------------------------------------------------------------------
        // mai 불러오기
        //---------------------------------------------------------------------
        fbxloader.load(`static/assets/${game.selPlayer}.fbx`, function(object){
            
            // @TY: #25
            object.mixer = new THREE.AnimationMixer(object);  // animation player
            object.name = "Mai";
            game.player.mixer = object.mixer;
            game.player.root = object.mixer.getRoot();
            console.log(object.mixer.getRoot());

            game.scene.add(object);
            object.position.y = -40;
            object.position.z = -50;
            
            // #32 크기조정
            // if(game.selPlayer === "MaiAction"){
            if(game.selPlayer === "PinkRabbitAction"){
                object.scale.x = 1;
                object.scale.y = 1;
                object.scale.z = 1;    
            }
            else{
                object.scale.x = 30;
                object.scale.y = 30;
                object.scale.z = 30;    
            }
            
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

        // 만든 객체를 scene에 추가 (카메라는 scene을 비추는 것이기 때문에 추가X)
        this.scene.add(this.cube);
        this.scene.add(light);
        this.scene.add(ambient);

        // #26
        this.orbCtrl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbCtrl.target.set(0,0,0);  // 카메라가 비추고 있는 부분 조절
        this.orbCtrl.update();
    }

    //=========================================================================
    //
    //=========================================================================
    nextAni(fbxLoader) {
        
        const game = this;
        fbxLoader.load(`static/assets/${game.selPlayer}.fbx`, function( object ){
            
            // #27
            game.selAction = "Idle";
            game.Cameras();

            // #28, #31
            game.Colliders(fbxLoader);
            
            // #26: 게임스틱 추가
            game.GamePad = new GamePad({
                pc: game.playerCtrl,  // #27
                game: game
            });

            game.animate();
        });
    }

    //=========================================================================
    //
    //=========================================================================
    set selAction(name) {

        const action = this.player.mixer.clipAction( this.animations[name] );
        this.player.mixer.stopAllAction();  // 기존 동작 정지

        // #27
        this.player.action = name;
        this.player.actionTime = Date.now();

        action.fadeIn(0.1);
        action.play();
    }

    //=========================================================================
    //
    //=========================================================================
    changeAction() {

        game.selAction = document.getElementById("changeAction").value;
    }

    //=========================================================================
    //
    //=========================================================================
    changePlayer() {

        game.selPlayer = document.getElementById("changePlayer").value;
        this.aniInit();
    }

    //=========================================================================
    //
    //=========================================================================
    animate() {
        
        // 애니메이션이 반복적으로 실행되도록 함
        const game = this;
        const dt = this.clock.getDelta();  // 경과된 시간을 초단위로 가져옴
        
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
        // 플레이어 동작
        //---------------------------------------------------------------------
        
        // 달리기 설정
        if(this.player.action=='Walk'){

            const walkTime = Date.now() - this.player.actionTime;
            if(walkTime>2000 && this.player.move.moveF>0){
                this.selAction = 'Run';
            }
        }

        if(this.player.move !== undefined) this.move(dt);

        //---------------------------------------------------------------------
        // 카메라 설정
        //---------------------------------------------------------------------
        
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
        // 상어 설정
        //---------------------------------------------------------------------
        // 상어 움직이기
        const enemy = game.enemy;
        for(let x=0; x<enemy.length; x++){

            this.enemy[x].lookAt(this.player.object.position);  // 플레이어의 위치를 바라봄
            this.enemy[x].rotateY(Math.PI / 2);  // 상어 앞부분이 플레이어를 바라보도록 회전
            this.enemy[x].translateX(-5);  // 음수 -> 플레이어방향, 따라가기
        }

        //---------------------------------------------------------------------
        //  게임종료동작
        //---------------------------------------------------------------------
        let live = this.rule();

        if(live){

            requestAnimationFrame(function(){ game.animate(); });  // frame마다 반복적으로 시행
        }

        //---------------------------------------------------------------------
        //
        //---------------------------------------------------------------------
        this.renderer.render(this.scene, this.camera);  // 실행된 내용을 렌더링해서 화면에 보여줌
    }

    //=========================================================================
    // 게임종료조건
    //=========================================================================
    rule(){
        
        let live = true;
        const position = this.player.object.position.clone();
        
        // raycaster -> 다른 객체와의 거리 감지
        let raycast = new THREE.Raycaster(position);


        const ship = this.ship;

        if(ship !== undefined){
            const distance = raycast.intersectObjects(ship);

            if(distance.length > 0){
                if(distance[0].distance < 200){
                    alert("You've successfully escaped!");
                    live = false;
                    location.reload();  // 화면 다시 불러오기
                }
            }
        }
        
        //---------------------------------------------------------------------
        // 충돌시 파이썬 함수 실행
        //---------------------------------------------------------------------
        const collidingDistance = 300;

        // 영화제목 가져오기
        const TY_Interface_Crawling_Movie = this.TY_Interface_Crawling_Movie;

        if(TY_Interface_Crawling_Movie !== undefined){
            
            const distance = raycast.intersectObjects(TY_Interface_Crawling_Movie);

            if(distance.length > 0){
                if(distance[0].distance < collidingDistance){
                    TY_Python_Movie()
                    // live = false;
                    // location.reload();  // 화면 다시 불러오기
                    this.player.object.translateZ(0);
                }
            }
        }

        // 기사제목 가져오기
        const TY_Interface_Crawling_Article = this.TY_Interface_Crawling_Article;

        if(TY_Interface_Crawling_Article !== undefined){
            
            const distance = raycast.intersectObjects(TY_Interface_Crawling_Article);

            if(distance.length > 0){
                if(distance[0].distance < collidingDistance){
                    TY_Python_Article()
                    // live = false;
                    // location.reload();  // 화면 다시 불러오기
                    this.player.object.translateZ(0);
                }
            }
        }

        // 노래가사 가져오기
        const TY_Interface_Crawling_Song = this.TY_Interface_Crawling_Song;

        if(TY_Interface_Crawling_Song !== undefined){
            
            const distance = raycast.intersectObjects(TY_Interface_Crawling_Song);

            if(distance.length > 0){
                if(distance[0].distance < collidingDistance){
                    TY_Python_Song()
                    // live = false;
                    // location.reload();  // 화면 다시 불러오기
                    this.player.object.translateZ(0);
                }
            }
        }

        return live;
    }

    //=========================================================================
    // #28: Colliders
    //=========================================================================
    Colliders(fbxloader){  // #31

        this.colliders = [];  // 충돌할 객체들
        this.enemy = [];  // #35 상어
        this.ship = [];  // #36

        // 파이썬 함수를 실행시킬 객체들
        this.TY_Interface_Crawling_Movie = [];  
        this.TY_Interface_Crawling_Article = [];  
        this.TY_Interface_Crawling_Song = [];  

        // // Cube #1
        // let geometry = new THREE.BoxGeometry(300, 300, 300);
        // let material = new THREE.MeshBasicMaterial({color:0xFF8000});
        // const cube1 = new THREE.Mesh(geometry, material);
        // cube1.position.set(0, 150, 1000);
        // this.colliders.push(cube1);
        // this.scene.add(cube1);

        // fbxloader.load(`static/assets/snow_three.fbx`, function(object){
            
        //     game.scene.add(object);
        //     object.position.y = -50;
        //     object.position.z = -50;
        //     object.scale.x = 0.01;
        //     object.scale.y = 0.01;
        //     object.scale.z = 0.01;
        // });

        //---------------------------------------------------------------------
        // 바다 배경 load
        //---------------------------------------------------------------------
        // fbxloader.load(`static/assets/sea.fbx`, function(object){
        //     game.scene.add(object);
        //     object.position.y = -80;
        //     object.scale.x = 1;
        //     object.scale.y = 0.1;
        //     object.scale.z = 1;
        // })

        //---------------------------------------------------------------------
        // 방 load
        //---------------------------------------------------------------------
        fbxloader.load(`static/assets/room2.fbx`, function(object){
            game.scene.add(object);
            object.position.set(2000,-10,0);  // x, y, z
            object.scale.x = 2.5;
            object.scale.y = 2.5;
            object.scale.z = 2.5;
        })

        //---------------------------------------------------------------------
        // 생성빈도 설정
        //---------------------------------------------------------------------
        // for(let x=0; x<10; x++){  // 나무와 돌의 생성빈도

        //     if(x%2 === 0){
        //         this.rock(fbxloader, true)
        //         this.tree(fbxloader, true)
        //     }
        //     else{
        //         this.rock(fbxloader, false)
        //         this.tree(fbxloader, false)
        //     }
        // }

        //---------------------------------------------------------------------
        // 머핀 불러오기
        //---------------------------------------------------------------------
        this.TY_Object_Movie(fbxloader, 2500, -500);
        this.TY_Object_Article(fbxloader, 2500, 0);
        this.TY_Object_Song(fbxloader, 2500, 500);

        //---------------------------------------------------------------------
        // 배 불러오기
        //---------------------------------------------------------------------
        // fbxloader.load(`static/assets/ship.fbx`, function(object){

        //     let posx = 0;
        //     let posz = 0;
            
        //     // #36: 배의 위치 랜덤화
        //     if(Math.floor(Math.random() * 10)%2 === 0){

        //         posx = Math.floor(Math.random() * 10000)
        //         posz = Math.floor(Math.random() * 10000)
        //     }
        //     else{
        //         posx = Math.floor(Math.random() * -10000)
        //         posz = Math.floor(Math.random() * -10000)
        //     }

        //     game.scene.add(object);

        //     object.position.set(posx,-900,posz);
        //     object.scale.x = 1;
        //     object.scale.y = 1;
        //     object.scale.z = 1;

        //     object.traverse(function(child){
        //         if(child.isMesh){
        //             game.ship.push(child);
        //             child.castShadow = true;
        //             child.receiveShadow = true;
        //         }
        //     });
        // }) 
    }

    //=========================================================================
    // 돌
    //=========================================================================
    rock(fbxloader, t_f){
        
        fbxloader.load(`static/assets/rock.fbx`, function(object){

            let posx = 0;
            let posz = 0;
            
            // #34
            if(t_f){

                posx = Math.floor(Math.random() * 4000)
                posz = Math.floor(Math.random() * 4000)
            }
            else{
                posx = Math.floor(Math.random() * -4000)
                posz = Math.floor(Math.random() * -4000)
            }

            game.scene.add(object);
            object.position.set(posx,-150,posz);
            object.scale.x = 0.3;
            object.scale.y = 0.1;
            object.scale.z = 0.3;
            object.traverse(function(child){
                if(child.isMesh){
                    game.colliders.push(child);
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        })
    }

    //=========================================================================
    // 나무
    //=========================================================================
    tree(fbxloader, t_f){

        fbxloader.load(`static/assets/tree.fbx`, function(object){
            
            let posx = 0;
            let posz = 0;
            
            // #34
            if(t_f){

                posx = Math.floor(Math.random() * 3000)
                posz = Math.floor(Math.random() * 3000)
            }
            else{
                posx = Math.floor(Math.random() * -3000)
                posz = Math.floor(Math.random() * -3000)
            }

            game.scene.add(object);
            object.position.x = posx;
            object.position.y = -300;
            object.position.z = posz;
            object.scale.x = 0.2;
            object.scale.y = 0.21;
            object.scale.z = 0.2;
            object.traverse(function(child){
                if(child.isMesh){
                    game.colliders.push(child);
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        })
    }

    //=========================================================================
    // 상어
    //=========================================================================
    shark(fbxloader, t_f1, t_f2){
        
        fbxloader.load(`static/assets/shark.fbx`, function(object){

            let posx = 0;
            let posz = 0;
            
            // #34
            if(t_f1 && t_f2){

                posx = Math.floor(Math.random() * 8000)
                posz = Math.floor(Math.random() * 8000)
            }
            else if(!t_f1 && t_f2){
                posx = Math.floor(Math.random() * -8000)
                posz = Math.floor(Math.random() * 8000)
            }
            else if(!t_f1 && !t_f2){
                posx = Math.floor(Math.random() * 8000)
                posz = Math.floor(Math.random() * -8000)
            }
            else{
                posx = Math.floor(Math.random() * -8000)
                posz = Math.floor(Math.random() * -8000)
            }

            game.scene.add(object);
            object.position.set(posx,0,posz);
            object.scale.x = 1;
            object.scale.y = 1;
            object.scale.z = 1;
            
            object.traverse(function(child){
                if(child.isMesh){
                    game.enemy.push(child);
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }) 
    }

    //=========================================================================
    // TY: Interfacing Objects
    //=========================================================================
    TY_Object_Movie(fbxloader, x, y){
        
        fbxloader.load(`static/assets/BearMuffin.fbx`, function(object){

            //let posx = 1000;
            //let posz = 1000;
            let posx = x;
            let posz = y;
            
            game.scene.add(object);
            object.position.set(posx,0,posz);
            object.scale.x = 1;
            object.scale.y = 1;
            object.scale.z = 1;
            
            object.traverse(function(child){
                if(child.isMesh){
                    game.TY_Interface_Crawling_Movie.push(child);
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }) 
    }

    TY_Object_Article(fbxloader, x, y){
        
        fbxloader.load(`static/assets/Sofa.fbx`, function(object){

            //let posx = 1000;
            //let posz = 1000;
            let posx = x;
            let posz = y;
            
            game.scene.add(object);
            object.position.set(posx,0,posz);
            object.scale.x = 1;
            object.scale.y = 1;
            object.scale.z = 1;
            
            object.traverse(function(child){
                if(child.isMesh){
                    game.TY_Interface_Crawling_Article.push(child);
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }) 
    }

    TY_Object_Song(fbxloader, x, y){
        
        fbxloader.load(`static/assets/Piano.fbx`, function(object){

            //let posx = 1000;
            //let posz = 1000;
            let posx = x;
            let posz = y;
            
            game.scene.add(object);
            object.position.set(posx,0,posz);
            object.scale.x = 1;
            object.scale.y = 1;
            object.scale.z = 1;
            
            object.traverse(function(child){
                if(child.isMesh){
                    game.TY_Interface_Crawling_Song.push(child);
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }) 
    }
    //=========================================================================
    // #27: move
    //=========================================================================
    move(dt){

        //---------------------------------------------------------------------
        // #28 colliding
        //---------------------------------------------------------------------
        const position = this.player.object.position.clone();
        let direction = new THREE.Vector3();  // 플레이어의 방향

        this.player.object.getWorldDirection(direction);

        // raycaster -> 다른 객체와의 거리 감지
        let raycast = new THREE.Raycaster(position, direction);
        let T_F = false;  // 거리가 가까워지면 true
        const colliders = this.colliders;

        if(colliders !== undefined){
            const distance = raycast.intersectObjects(colliders);

            if(distance.length > 0){
                if(distance[0].distance < 100){
                    T_F = true;
                }
            }
            // else{
            //     console.log(distance);
            // }
        }

        //---------------------------------------------------------------------
        // 달리기 속도 설정
        //---------------------------------------------------------------------
        if(!T_F){  // 거리가 가깝지 않을때만

            if(this.player.move.moveF>0){  // 이동중일 때
            
                const speed = (this.player.action=='Run') ? 500 : 200;
                this.player.object.translateZ(dt*speed);
            }
            else{
    
                this.player.object.translateZ(-dt*100);
            }
    
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