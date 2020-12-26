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
        messageA_opacity_in: [
          0,
          1,
          {
            start: 0.1,
            end: 0.2,
          },
        ],
        messageA_translateY_in: [
          20,
          0,
          {
            start: 0.1,
            end: 0.2,
          },
        ],
        // messageB_opacity: [
        //   0,
        //   1,
        //   {
        //     start: 0.3,
        //     end: 0.4,
        //   },
        // ],
        messageA_opacity_out: [
          1,
          0,
          {
            start: 0.25,
            end: 0.3,
          },
        ],
        messageA_translateY_out: [
          0,
          -20,
          {
            start: 0.25,
            end: 0.3,
          },
        ],
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
      if (sceneInfo[i].type === "sticky") {
        // 현재 사용자의 기기의 높이를 기준 5배(heightNum)
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "nomal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      //  obj에서 불러온 dom의 height 값을 위에서 지정한 사용자 높이로 지정해줌
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
  // opacity 계산용 함수
  // opacity 나타남을 비율에 맞춰 계산해준다
  function calcValues(values, currentYOffset) {
    // 출력용 변수
    let result;
    // 현재 sceneIndex에서 비율로 따진 스크롤 위치
    const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
    // 각 가기별 계산하여 설정한 scene의 height값
    const scrollHeight = sceneInfo[currentScene].scrollHeight;

    if (values.length === 3) {
      // scene에서 start ~ end 사이에 애니메이션 실행 위치 계산
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      //
      const partScrollHeight = partScrollEnd - partScrollStart;
      // yoffset의 위치가 현재씬에서 어디에 위치해있냐에 따른 opacity 상태 설정
      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        // opacity 계산
        result =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        result = values[0];
      } else if (currentYOffset > partScrollEnd) {
        result = values[1];
      }
    } else {
      result = scrollRatio * (values[1] - values[0]) + values[0];
    }
    return result;
  }

  // 현재 위치하는 Scene에서 돌아가는 애니메이션 정하기
  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    // 현재씬의 좌표(비율 아님)
    const currentYOffset = yOffset - prevScrollHeight;
    // 현재씬의 높이
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    // 현재씬의 스크롤 위치 비율
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        // 위에서 계산한 opacity값을 스타일에 적용해줌
        if (scrollRatio <= 0.22) {
          // opacity in animation - 첫번째 씬에서 첫번째 글씨가 나타나는 위치
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          objs.messageA.style.transform = `translateY(${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%)`;
        } else {
          // out animatio - 첫번째 씬에서 첫번째 글씨가 사라지는 위치
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          objs.messageA.style.transform = `translateY(${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%)`;
        }
        console.log(calcValues(values.messageA_opacity_in, currentYOffset));
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
