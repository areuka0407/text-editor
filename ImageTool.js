class ImageTool {
    constructor(textarea, $toolbar){
        this.textarea = textarea;
        this.$imageBtn = $toolbar.querySelector(".btn-image");

        this.event();
    }

    event(){
        this.$imageBtn.addEventListener("click", () => {
            let $input = document.createElement("input");
            $input.type = "file";
            $input.hidden = true;
            document.body.append($input);
            $input.click();

            $input.addEventListener("change", () => {
                let file = $input.files.length > 0 ? $input.files[0] : null;
                file !== null && this.getImageURL(file);
                $input.remove();
            });
        });
    }

    getImageURL(file){
        return new Promise((res, rej) => {
            let url = URL.createObjectURL(file);

            let html = `<img src=${url} width="500">`;

            document.execCommand("insertHTML", false, html);
        });
    }
}   