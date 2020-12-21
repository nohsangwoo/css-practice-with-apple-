(() => {
  let yOffset = 0; //window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; //현재 활성화된(눈 앞에 보고잇는) 씬(scroll-section) index

  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      //   objs: 해당 아이디를 가진 dom을 불러와서 저장해둔다.
      objs: {
        container: document.querySelector("#scroll-section-0"),
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
      // 현재 사용자의 기기의 높이를 기준 5배
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      //  obj에서 불러온 dom의 height 값을 위에서 지정한 사용자 기기높이의 5배로 지정해줌
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
    // window의 크기가 변하면(사용자 기기의 브라우저의 크기를 임의로 변경시) setLayout을 실행해준다(창의 높이를 재설정해준다)
    window.addEventListener("resize", setLayout);

    // 스크롤된 이전의 height 총합
    function scrollLoop() {
      prevScrollHeight = 0;
      for (let i = 0; i < currentScene; i++) {
        prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
      }

      //   만약 yOffset(현재 스크롤 위치) 가  prevScrollHeight(상단영역의 총합)보다 커진다면  currentScene을 +1해줌
      if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
        currentScene = currentScene + 1;
      }
      if (yOffset < prevScrollHeight) {
        if (currentScene > 0) {
          currentScene = currentScene - 1;
        } else {
          return;
        }
      }
      console.log(
        "현재스크롤위치: ",
        yOffset,
        "//  상단 화면의 총합: ",
        prevScrollHeight,
        " // 현재 인덱스: ",
        currentScene
      );

      console.log();

      console.log();
    }
    // 스크롤될때 이벤트 작동
    window.addEventListener("scroll", () => {
      // 현재 스크롤의 위치를 가져옴
      yOffset = window.pageYOffset;
      scrollLoop();
    });
  }
  setLayout();
})();
