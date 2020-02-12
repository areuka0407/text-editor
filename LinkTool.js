class LinkTool {
    constructor(textarea, $toolbar){
        this.textarea = textarea;
        this.$linkBtn = $toolbar.querySelector(".btn-link");

        // 모달창
        this.$modal = createModal(`<div class="contents">
                                <div class="form-group">
                                    <label for="link-text">텍스트</label>
                                    <input type="text" id="link-text" class="form-control" value="NAVER">
                                </div>
                                <div class="form-group">
                                    <label for="link">링크</label>
                                    <input type="text" id="link" class="form-control" value="https://naver.com">
                                </div>
                                <button class="btn-insert btn btn-success">링크 삽입</button>
                            </div>`);
        this.$modal.$i_text = this.$modal.querySelector("#link-text");
        this.$modal.$i_link = this.$modal.querySelector("#link");

        this.event();
    }

    event(){
        // 링크 버튼을 누를 때
        this.$linkBtn.addEventListener("click", e => {
            showModal(this.$modal);

            this.$modal.$i_text.value = this.$modal.$i_link.value = "";
            
            
            let result = this.textarea.getCursorText();
            if(result !== false){
                this.$modal.$i_text.value = result;
            }
        });

        // 모달의 링크 삽입 버튼을 누를 때
        this.$modal.querySelector(".btn-insert").addEventListener("click", () => {
            let text = this.$modal.$i_text.value;
            let link = this.$modal.$i_link.value;
            let {startNode, endNode, startOffset, endOffset, contain} = this.textarea.cursor;
            
            let selection = getSelection();

            // 노드가 존재하지 않을 경우 = 선택한게 없는 경우
            if(!contain){
                let a = document.createElement("a");
                a.href = link;
                a.innerText = text;
                this.textarea.$root.append(a);
                
                let range = document.createRange();
                range.setStartAfter(a);
                selection.addRange(range);
            }

            // 시작 노드와 끝 노드가 같은 경우
            else if(startNode === endNode) {
                // range일 경우 start가 end보다 클 수도 있기 때문에 바꿔준다.
                if(startOffset > endOffset){
                    let temp = startOffset;
                    startOffset = endOffset;
                    endOffset = temp;
                }

                // 커서 위치에 텍스트를 삽입한다.
                let head = contain.data.substr(0, startOffset);
                let foot = contain.data.substr(endOffset);
                contain.data = head + text + foot;

                // 삽입한 텍스트 위치에 Range를 씌워서 링크를 건다.
                let range = document.createRange();
                range.setStart(contain, startOffset);
                range.setEnd(contain, startOffset + text.length);
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand("CreateLink", false, link);
                selection.removeAllRanges();
            }
            // 시작 노드와 끝 노드가 다른 경우
            else {
                // startNode와 endNode를 $root의 자식이 되도록 끄집어낸다.
                while(startNode.parentElement.id !== "text-contents") startNode = startNode.parentElement;
                while(endNode.parentElement.id !== "text-contents") endNode = endNode.parentElement;
                
                // startNode와 endNode가 $root에서 몇번째 자식인지 알아낸다.
                let children = Array.from(this.textarea.$root.childNodes);
                let startIdx = children.findIndex(x => x === startNode);
                let endIdx = children.findIndex(x => x === endNode);

                // startNode와 endNode 사이의 노드는 모두 삭제한다.
                // console.log(Array.from(children));
                children.splice(startIdx, endIdx - startIdx + 1);
                // console.log(Array.from(children));

                // startNode와 endNode 내의 텍스트를 가져와서...
                let head = startNode.nodeName === "#text" ? startNode.data : startNode.innerText;
                let foot = endNode.nodeName === "#text" ? endNode.data : endNode.innerText;

                // offset만큼 잘라준다.
                head = document.createTextNode( head.substr(0, startOffset) );
                foot = document.createTextNode( foot.substr(endOffset) );
                // console.log("시작:" + head.data, "끝:" + foot.data);

                // 그 사이에 a 태그를 삽입해 원래 자식 배열 위치에 삽입한다.
                let a = document.createElement("a");
                a.href = link;
                a.innerText = text;

                let insert = [head, a, foot];

                
                children.splice(startIdx, 0, ...insert);
                // console.log(Array.from(children));

                // $root를 모두 비우고 자식 배열로 재구성한다.
                this.textarea.$root.innerHTML = "";
                children.forEach(x => this.textarea.$root.append(x));
            }

            this.$modal.remove();
        });
    }
}