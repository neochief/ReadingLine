var ReadingLine = {
    active: false,
    hidden: false,
    div: null,
    init: function () {
        this.div = document.createElement('div');
        this.div.id = 'ReadingLine';

        this.mouseMove = this.mouseMove.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.shortCut = this.shortCut.bind(this);

        document.addEventListener('keydown', this.shortCut, false);
    },
    toggle: function () {
        if (!this.active) {
            this.enable();
        }
        else {
            this.disable();
        }
    },
    enable: function () {
        document.body.appendChild(this.div);
        document.addEventListener("mousedown", this.mouseMove);
        document.addEventListener("mouseup", this.mouseMove);
        document.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("mouseover", this.mouseMove);
        document.addEventListener("mouseout", this.mouseOut);
        this.active = true;
        chrome.runtime.sendMessage({"message": "enable"});
    },
    disable: function () {
        document.body.removeChild(this.div);
        document.removeEventListener("mousedown", this.mouseMove);
        document.removeEventListener("mouseup", this.mouseMove);
        document.removeEventListener("mousemove", this.mouseMove);
        document.removeEventListener("mouseover", this.mouseMove);
        document.removeEventListener("mouseout", this.mouseOut);
        this.active = false;
        chrome.runtime.sendMessage({"message": "disable"});
    },
    mouseMove: function (e) {
        this.div.className = 'active';
        this.div.style.top = (e.clientY) + 'px';
        this.hidden = false;
    },
    mouseOut: function (e) {
        if (e.toElement == null && e.relatedTarget == null) {
            this.div.className = 'hidden';
            this.hidden = true;
        }
    },
    shortCut: function(e) {
        // Ctrl/Cmd + Alt + -
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.keyCode == 189) {
            this.toggle();
        }
    }
};

ReadingLine.init();

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action == 'toggle') {
        ReadingLine.toggle();
    }
});