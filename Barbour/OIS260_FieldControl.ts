/*

	Author				:	Neil Johnson
	Date				:	2020-09-02
	ISO version			:	10.2.1.1.5
	Script name 		:	OIS260_FieldControl
	Script arguments	:	
	Prerequisites		:	
			
	Enables control of fields in OIS260 E panle and H panel by role
*/
class OIS260_FieldControl {
    private controller: IInstanceController;
    private log: IScriptLog;

    private unsubscribeRequesting_OIS260E0: Function;
    private unsubscribeRequested_OIS260E0: Function;
    private unsubscribeRequesting_OIS260H0: Function;
    private unsubscribeRequested_OIS260H0: Function;

    private args: string;

    private debugOn: boolean;

    private cmdType: string;
    private cmdValue: string;

    private panelName: string;
    private allowedPanels = ["OIA260E0", "OIA260H0"];

    private role: string;

    private CS_OIS260_E_Fields = ["WWXFNC", "WWINCI", "WFFACI", "WTFACI", "WFFWHL", "WFTWHL", "WFSTYN", "WTSTYN",
        "WFCOLO", "WTCOLO", "WFFITN", "WFTITN", "WFORDT", "WTORDT", "WFFCOD", "WFTCOD", "WFLDED", "WTLDED", "WFPROJ", "WTPROJ",
        "WFELNO", "WTELNO", "WFSMCD", "WTSMCD", "WFCUNO", "WTCUNO", "WFPYNO", "WTPYNO", "WFORTP", "WTORTP",
        "WFORNO", "WTORNO", "WFPRMO", "WTPRMO", "WFPRRF", "WTPRRF", "WFCMNO", "WTCMNO"]

    private CS_OIS260_H_Fields = ["W1RCSP", "W1DWDT", "W1DWDX", "W1PLDT", "W1PLDX", "W1FDED", "W1FDEX",
        "W1LDED", "W1LDEX", "W1RSCD", "W1RSCX", "W1RSC1", "W1RS1X", "W1JDCD", "W1JDCX", "W1PRIO", "W1PRIX",
        "W1ELNO", "W1ELNX", "W1MODL", "W1MODX", "W1TEDL", "W1TEDX", "W1DLSP", "W1DLSX", "W1ROUT", "W1ROUX",
        "W1RODN", "W1RODX"];
     
    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;

        //  Set debug on to be true
        this.debugOn = true;
    }

    /**
	 * Script initialization function.
	 */
    public static Init(args: IScriptArgs): void {
        new OIS260_FieldControl(args).run();
    }

    private run(): void {
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
            this.unsubscribeRequesting_OIS260E0 = this.controller.Requesting.On((e) => {
                this.onRequesting_OIS260E0(e);
            });
            this.unsubscribeRequested_OIS260E0 = this.controller.Requested.On((e) => {
                this.onRequested_OIS260E0(e);
            });
        }
        if (this.panelName == "OIA260H0") {
            if (this.role == "CS_OIS260") {
                for (var i = 0; i < this.CS_OIS260_H_Fields.length; i++) {
                    this.setDisabled(this.CS_OIS260_H_Fields[i]);
                }
            }
            this.unsubscribeRequesting_OIS260H0 = this.controller.Requesting.On((e) => {
                this.onRequesting_OIS260H0(e);
            });
            this.unsubscribeRequested_OIS260H0 = this.controller.Requested.On((e) => {
                this.onRequested_OIS260H0(e);
            });
        }
    }

    private parseArgs(args: string): boolean {

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
        } catch (ex) {
            this.log.Error("Failed to parse argument string " + args, ex);
            return false;
        }
    }

    private setDisabled(field: string): void {
        try {
            const $field = this.controller.ParentWindow.find("#" + field);
            if ($field.length = 1) {
                $field.attr('disabled', `true`);
            }
        }
        catch {
        }
    }

    private removeDisabled(field: string): void {
        try {
            const $field = this.controller.ParentWindow.find("#" + field);
            if ($field.length = 1) {
                $field.removeAttr('disabled');
            }
        }
        catch {
        } 
    }

    private continueProcess(): void {
        this.debug("I", "continueProcess : " + this.cmdType + " " + this.cmdValue);
        setTimeout(() => {
            this.debug("I", "cmdType:" + this.cmdType);
            this.debug("I", "cmdValue:" + this.cmdValue);
            if (this.cmdType === "KEY") {
                this.controller.PressKey(this.cmdValue);
            } else {
                this.controller.ListOption(this.cmdValue);
            }

        }, 0);
    }


    private onRequesting_OIS260E0(args: CancelRequestEventArgs) {
        this.debug("I", "onRequesting_OIS260E0");

        this.cmdType = args.commandType;
        this.cmdValue = args.commandValue;
        this.debug("I", "cmdType : " + this.cmdType);
        this.debug("I", "cmdValue : " + this.cmdValue);
    }

    private onRequested_OIS260E0(args: RequestEventArgs): void {
        this.unsubscribeRequested_OIS260E0();
        this.unsubscribeRequesting_OIS260E0();
    }

    private onRequesting_OIS260H0(args: CancelRequestEventArgs) {
        this.debug("I", "onRequesting_OIS260H0");

        this.cmdType = args.commandType;
        this.cmdValue = args.commandValue;
        this.debug("I", "cmdType : " + this.cmdType);
        this.debug("I", "cmdValue : " + this.cmdValue);
    }

    private onRequested_OIS260H0(args: RequestEventArgs): void {
        this.unsubscribeRequested_OIS260H0();
        this.unsubscribeRequesting_OIS260H0();
    }

    private debug(type: string, message: string) {
        if (this.debugOn) {
            if (type == "I") this.log.Info(message);
            if (type == "D") this.log.Debug(message);
            if (type == "E") this.log.Error(message);
        }
    }

}