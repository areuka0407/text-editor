
/**
 * 토스트 메세지
 */
function toast(message, background = "bg-red"){
    let current_queue = document.querySelectorAll(".toast-message");

    if(current_queue.length > 0){
        current_queue.forEach(item => {
            clearTimeout(item.current_anime);
            item.style.transition = "0.5s";
            item.style.bottom = "80px";
            item.style.opacity = "0";
    
            setTimeout(() => item.remove(), 500);
        });
    }

    message = Array.isArray(message) ? message : [message];

    message.forEach((item, i) => {
        let $box = document.createElement("div");
        $box.classList.add("toast-message");
        $box.classList.add(background);
        $box.innerText = item;

        const baseBottom = 60;
        const unitBottom = 60;
        $box.style.bottom = (unitBottom * i + baseBottom - 20) + "px";
        document.body.append($box);


        setTimeout(() => {
            $box.style.bottom = unitBottom * i + baseBottom + "px";
            $box.style.opacity = "1";
            $box.animateQueue = setTimeout(() => {
                $box.style.transition = "0.5s";
                $box.style.bottom = (unitBottom * i + baseBottom - 20) + "px";
                $box.style.opacity = "0";
                $box.animateQueue = setTimeout(() => {
                    $box.remove();
                    $box = null;
                }, 500);
            }, 2000);
        });
    });    
}

/**
 * 모달창
 */

function createModal(content){
    // 모달 생성
    let $modal = document.createElement("div");
    $modal.classList.add("modal-wrap");
    $modal.innerHTML = content;
    
    // 닫기 버튼
    let $close = document.createElement("button");
    $close.classList.add("btn-close");
    $close.innerHTML = `&times;`;

    let $contents = $modal.querySelector(".contents");
    if($contents) $contents.append($close);
    else $modal.append($close);
    $close.addEventListener("click", () => {
        $modal.remove();
    });    

    return $modal;
 }

 function showModal($modal){
    // 기존의 모달은 삭제
    let existList = document.querySelectorAll(".modal-wrap");
    if(existList.length > 0){
        existList.forEach(exist => {
            exist.remove();
        });
    }
    // 새로운 모달 추가
    document.body.append($modal);
 }

 function hideModal($modal){
    $modal.remove();
 }
