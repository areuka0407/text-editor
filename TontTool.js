class FontTool {
    constructor(textarea, $toolbar){
        this.textarea = textarea;
        this.$sizeSel = $toolbar.querySelector(".sel-size");
        this.$boldBtn = $toolbar.querySelector(".btn-bold");

        this.event();
    }

    event(){
        this.$sizeSel.addEventListener("input", e => {
            document.execCommand("fontSize", false, e.target.value);
        });

        this.$boldBtn.addEventListener("click", () => {
            document.execCommand("bold");
        });
    }  
}