(() => {
  let yOffset = 0; //window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; //현재 활성화된(눈 앞에 보고잇는) 씬(scroll-section) index
  let enterNewScene = 0; //새로운 scene이 시작 되는 순간 true
  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      //   objs: 해당 아이디를 가진 dom을 불러와서 저장해둔다.
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      values: {
        messageA_opacity: [0, 1],
      },
    },
    {
      // 1
      type: "nomal",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];
  function setLayout() {
    //   각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      // 현재 사용자의 기기의 높이를 기준 5배(heightNum)
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      //  obj에서 불러온 dom의 height 값을 위에서 지정한 사용자 기기높이의 5배(heightNum)로 지정해줌
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    // ------------------------finding currentScene index----------------
    // 새로고침이나 처음 로딩시 currentScene의  index값이 세팅 안되는 것을 잡아주기 위해서

    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight = totalScrollHeight + sceneInfo[i].scrollHeight;
      //   상단컨텐츠의 총 합이 현재 스크롤의 위치보다 커지거나 같아졌을떄
      //   currentScene을 세팅하고 for문을 멈춤
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);
    // ------------------------end of finding currentScene index----------------
  }

  function calcValues(values, currentYOffset) {
    let result;
    const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
    result = scrollRatio * (values[1] - values[0]) + values[0];
    return result;
  }
  //   현재 위치하는 Scene에서 돌아가는 애니메이션 정하기
  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    // console.log(currentYOffset);

    switch (currentScene) {
      case 0:
        // console.log("0 play");
        // css제어
        // opacity를 비율에 맞춰 계산해준다
        let messageA_opacity_in = calcValues(
          values.messageA_opacity,
          currentYOffset
        );
        // 위에서 계산한 opacity값을 스타일에 적용해줌
        objs.messageA.style.opacity = messageA_opacity_in;
        console.log(messageA_opacity_in);
        break;
      case 1:
        // console.log("1 play");
        break;
      case 2:
        console.log("2 play");
        break;
      case 3:
        // console.log("3 play");
        break;
      default:
        break;
    }
  }
  // 스크롤 할때마다 작동하는 이벤트 내용들
  function scrollLoop() {
    enterNewScene = false;
    // ---------------currentScene controll --------------------------------
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
    }
    //   만약 yOffset(현재 스크롤 위치) 가  prevScrollHeight(상단영역의 총합)보다 커진다면  currentScene을 +1해줌
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene = currentScene + 1;
      //   documnet의 body의 속성을 추가하는데 어떤 속성이냐하면 id속성이다
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene > 0) {
        currentScene = currentScene - 1;
        document.body.setAttribute("id", `show-scene-${currentScene}`);
      } else {
        return;
      }
    }

    // ---------------end of currentScene controll --------------------------------
    //   console.log(
    //     "현재스크롤위치: ",
    //     yOffset,
    //     "//  상단 화면의 총합: ",
    //     prevScrollHeight,
    //     " // 현재 인덱스: ",
    //     currentScene
    //   );

    // currentScene의 값이 변하는 순간의 값이 이상하게 설정되니깐 변경되는 순간에는 값을 받지 말고 넘겨버리는 기능
    if (enterNewScene === true) {
      return;
    }

    playAnimation();
  }
  // 스크롤될때 이벤트 작동
  window.addEventListener("scroll", () => {
    // 현재 스크롤의 위치를 가져옴
    yOffset = window.pageYOffset;
    scrollLoop();
  });

  // window의 리소스가 전부 로드된다면 이벤트 실행
  // window.addEventListener("DOMContentLoaded", setLayout); //DOM만 다 로딩되면 실행됨
  window.addEventListener("load", setLayout); //이미지까지 싹다 로딩이 돼야 실행됨
  // window의 크기가 변하면(사용자 기기의 브라우저의 크기를 임의로 변경시) setLayout을 실행해준다(창의 높이를 재설정해준다)

  window.addEventListener("resize", setLayout);
})();
