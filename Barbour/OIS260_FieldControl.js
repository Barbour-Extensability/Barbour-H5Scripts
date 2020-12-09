/*

    Author				:	Neil Johnson
    Date				:	2020-09-02
    ISO version			:	10.2.1.1.5
    Script name 		:	OIS260_FieldControl
    Script arguments	:
    Prerequisites		:
            
    Enables control of fields in OIS260 E panle and H panel by role
*/
var OIS260_FieldControl = /** @class */ (function () {
    function OIS260_FieldControl(scriptArgs) {
        this.allowedPanels = ["OIA260E0", "OIA260H0"];
        this.CS_OIS260_E_Fields = ["WWXFNC", "WWINCI", "WFFACI", "WTFACI", "WFFWHL", "WFTWHL", "WFSTYN", "WTSTYN",
            "WFCOLO", "WTCOLO", "WFFITN", "WFTITN", "WFORDT", "WTORDT", "WFFCOD", "WFTCOD", "WFLDED", "WTLDED", "WFPROJ", "WTPROJ",
            "WFELNO", "WTELNO", "WFSMCD", "WTSMCD", "WFCUNO", "WTCUNO", "WFPYNO", "WTPYNO", "WFORTP", "WTORTP",
            "WFORNO", "WTORNO", "WFPRMO", "WTPRMO", "WFPRRF", "WTPRRF", "WFCMNO", "WTCMNO"];
        this.CS_OIS260_H_Fields = ["W1RCSP", "W1DWDT", "W1DWDX", "W1PLDT", "W1PLDX", "W1FDED", "W1FDEX",
            "W1LDED", "W1LDEX", "W1RSCD", "W1RSCX", "W1RSC1", "W1RS1X", "W1JDCD", "W1JDCX", "W1PRIO", "W1PRIX",
            "W1ELNO", "W1ELNX", "W1MODL", "W1MODX", "W1TEDL", "W1TEDX", "W1DLSP", "W1DLSX", "W1ROUT", "W1ROUX",
            "W1RODN", "W1RODX"];
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        //  Set debug on to be true
        this.debugOn = true;
    }
    /**
     * Script initialization function.
     */
    OIS260_FieldControl.Init = function (args) {
        new OIS260_FieldControl(args).run();
    };
    OIS260_FieldControl.prototype.run = function () {
        var _this = this;
        //  Get panel name 
        this.panelName = this.controller.GetPanelName();
        //  Check panel
        if (this.allowedPanels.indexOf(this.panelName, 0) < 0) {
            this.log.Error("Script cannot be run in " + this.panelName);
            return;
        }
        // Parse the script argument string and return if the arguments are invalid.
        if (!this.parseArgs(this.args)) {
            return;
        }
        if (this.panelName == "OIA260E0") {
            if (this.role == "CS_OIS260") {
                for (var i = 0; i < this.CS_OIS260_E_Fields.length; i++) {
                    this.setDisabled(this.CS_OIS260_E_Fields[i]);
                }
            }
            this.unsubscribeRequesting_OIS260E0 = this.controller.Requesting.On(function (e) {
                _this.onRequesting_OIS260E0(e);
            });
            this.unsubscribeRequested_OIS260E0 = this.controller.Requested.On(function (e) {
                _this.onRequested_OIS260E0(e);
            });
        }
        if (this.panelName == "OIA260H0") {
            if (this.role == "CS_OIS260") {
                for (var i = 0; i < this.CS_OIS260_H_Fields.length; i++) {
                    this.setDisabled(this.CS_OIS260_H_Fields[i]);
                }
            }
            this.unsubscribeRequesting_OIS260H0 = this.controller.Requesting.On(function (e) {
                _this.onRequesting_OIS260H0(e);
            });
            this.unsubscribeRequested_OIS260H0 = this.controller.Requested.On(function (e) {
                _this.onRequested_OIS260H0(e);
            });
        }
    };
    OIS260_FieldControl.prototype.parseArgs = function (args) {
        try {
            //  Split arguments
            var split = args.split(",");
            this.debug("I", "number of args:" + split.length);
            if (split.length >= 1) {
                if (split[0] != null && split[0] != "") {
                    this.role = split[0];
                }
            }
            return true;
        }
        catch (ex) {
            this.log.Error("Failed to parse argument string " + args, ex);
            return false;
        }
    };
    OIS260_FieldControl.prototype.setDisabled = function (field) {
        try {
            var $field = this.controller.ParentWindow.find("#" + field);
            if ($field.length = 1) {
                $field.attr('disabled', "true");
            }
        }
        catch (_a) {
        }
    };
    OIS260_FieldControl.prototype.removeDisabled = function (field) {
        try {
            var $field = this.controller.ParentWindow.find("#" + field);
            if ($field.length = 1) {
                $field.removeAttr('disabled');
            }
        }
        catch (_a) {
        }
    };
    OIS260_FieldControl.prototype.continueProcess = function () {
        var _this = this;
        this.debug("I", "continueProcess : " + this.cmdType + " " + this.cmdValue);
        setTimeout(function () {
            _this.debug("I", "cmdType:" + _this.cmdType);
            _this.debug("I", "cmdValue:" + _this.cmdValue);
            if (_this.cmdType === "KEY") {
                _this.controller.PressKey(_this.cmdValue);
            }
            else {
                _this.controller.ListOption(_this.cmdValue);
            }
        }, 0);
    };
    OIS260_FieldControl.prototype.onRequesting_OIS260E0 = function (args) {
        this.debug("I", "onRequesting_OIS260E0");
        this.cmdType = args.commandType;
        this.cmdValue = args.commandValue;
        this.debug("I", "cmdType : " + this.cmdType);
        this.debug("I", "cmdValue : " + this.cmdValue);
    };
    OIS260_FieldControl.prototype.onRequested_OIS260E0 = function (args) {
        this.unsubscribeRequested_OIS260E0();
        this.unsubscribeRequesting_OIS260E0();
    };
    OIS260_FieldControl.prototype.onRequesting_OIS260H0 = function (args) {
        this.debug("I", "onRequesting_OIS260H0");
        this.cmdType = args.commandType;
        this.cmdValue = args.commandValue;
        this.debug("I", "cmdType : " + this.cmdType);
        this.debug("I", "cmdValue : " + this.cmdValue);
    };
    OIS260_FieldControl.prototype.onRequested_OIS260H0 = function (args) {
        this.unsubscribeRequested_OIS260H0();
        this.unsubscribeRequesting_OIS260H0();
    };
    OIS260_FieldControl.prototype.debug = function (type, message) {
        if (this.debugOn) {
            if (type == "I")
                this.log.Info(message);
            if (type == "D")
                this.log.Debug(message);
            if (type == "E")
                this.log.Error(message);
        }
    };
    return OIS260_FieldControl;
}());
//# sourceMappingURL=OIS260_FieldControl.js.map