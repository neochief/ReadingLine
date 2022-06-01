var ReadingLine = {
    active: false,
    hidden: false,
    div: null,
    init: function () {
        // Cleanup existing div just in case.
        var div = document.getElementById("ReadingLine");
        if (div) {
            document.body.removeChild(div);
        }

        this.div = document.createElement("div");
        this.div.id = "ReadingLine";
        this.div.style.top = "-100px";

        this.mouseMove = this.mouseMove.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.shortCut = this.shortCut.bind(this);
        this.checkStatus = this.checkStatus.bind(this);

        document.addEventListener("keydown", this.shortCut, false);

        this.checkStatus();

        // The interval will make sure the content script will get disabled on
        // extension uninstall.
        setInterval(this.checkStatus, 5000);
    },
    checkStatus: function(){
        try {
            chrome.runtime.sendMessage("ReadingLine-status", function (status) {
                if (status) {
                    this.enable();
                }
                else {
                    this.disable();
                }
            }.bind(this));
        }
        catch (e) {
        }
    },
    enable: function () {
        if (this.active) return;

        document.body.appendChild(this.div);
        document.addEventListener("mousedown", this.mouseMove);
        document.addEventListener("mouseup", this.mouseMove);
        document.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("mouseover", this.mouseMove);
        document.addEventListener("mouseout", this.mouseOut);
        this.active = true;
    },
    disable: function () {
        if (!this.active) return;

        var div = document.getElementById("ReadingLine");
        if (div) {
            document.body.removeChild(div);
        }
        document.removeEventListener("mousedown", this.mouseMove);
        document.removeEventListener("mouseup", this.mouseMove);
        document.removeEventListener("mousemove", this.mouseMove);
        document.removeEventListener("mouseover", this.mouseMove);
        document.removeEventListener("mouseout", this.mouseOut);
        this.active = false;
    },
    mouseMove: function (e) {
        this.div.className = "active";
        this.div.style.top = (e.clientY) + "px";
        this.hidden = false;
    },
    mouseOut: function (e) {
        if (e.toElement == null && e.relatedTarget == null) {
            this.div.className = "hidden";
            this.hidden = true;
        }
    },
    shortCut: function (e) {
        // Ctrl/Cmd + Alt + -
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.keyCode === 189) {
            if (!this.active) {
                this.enable();
                chrome.runtime.sendMessage("ReadingLine-enable");
            }
            else {
                this.disable();
                chrome.runtime.sendMessage("ReadingLine-disable");
            }
        }
    }
};

ReadingLine.init();

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    switch (msg.action) {
        case "ReadingLine-enable":
            ReadingLine.enable();
            break;
        case "ReadingLine-disable":
            ReadingLine.disable();
            break;
    }
    sendResponse(msg.data, true);
});