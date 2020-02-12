class Textarea {
    constructor(rootSelector, toolSelector){
        // 노드 저장
        this.$root = document.querySelector(rootSelector);
        this.$linkBtn = this.$root.querySelector(".btn-link");

        // 커서
        this.cursor = {};

        // 도구
        this.$tool = document.querySelector(toolSelector);
        this.linkTool = new LinkTool(this, this.$tool);
        this.imageTool = new ImageTool(this, this.$tool);
        this.fontTool = new FontTool(this, this.$tool);

        this.cursorEvent();
    }

    // 텍스트 에리어 내에 커서가 존재한다면, 커서가 드래그된 텍스트를 가져온다.
    getCursorText(){
        let _sel = getSelection();
        let parent = _sel.baseNode && _sel.baseNode.parentElement;
        while(parent && parent.id !== "text-contents") parent = parent.parentElement;
        return parent === this.$root && !_sel.isCollapsed ? _sel.toString() : false;
    }


    cursorEvent(){
            /* 커서 변경 이벤트
            */ 
           document.addEventListener("selectionchange", e => {
            let _sel = getSelection();
            if(_sel.type === "none" || _sel.rangeCount === 0) return;

            let range = _sel.getRangeAt(0);


            // 이벤트 대상이 이 편집기 내에서 발생한 것이라면?
            let parent = _sel.baseNode && _sel.baseNode.parentElement;
            while(parent && parent.id !== "text-contents") parent = parent.parentElement;
            if(parent === this.$root){
                // 커서의 데이터를 저장한다.
                this.cursor = {
                    startNode: range.startContainer,
                    startOffset: range.startOffset,
                    endNode: range.endContainer,
                    endOffset: range.endOffset,
                    contain: range.commonAncestorContainer
                };
            }
        });
    }
}