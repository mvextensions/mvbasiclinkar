import * as vscode from 'vscode';

export class Utilities {

	//CHANGES IN ORIGINAL LIBRARY (ManualChanges.txt)
	static req = require('xmlhttprequest');

	static requestJson(name: string, url: string, apikey: string, operation: string, data: any): any {
		try {
			var fulldata = { APIKey: apikey, Data: data };
			var xhttp = new Utilities.req.XMLHttpRequest();

			xhttp.open("POST", url + operation, false, false, false);
			xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			var strfulldata = JSON.stringify(fulldata);
			xhttp.send(strfulldata);
			if (xhttp.status === 200) {
				return JSON.parse(xhttp.responseText);
			}
			else {
				vscode.window.showErrorMessage("ERROR in " + name + "!\r\nRequest: " + url + operation + "\r\nResponse: " + xhttp.status + " - " + xhttp.responseText);
				return undefined;
			}
		}
		catch (error) {
			vscode.window.showErrorMessage("ERROR in " + name + "!\r\nRequest: " + url + operation + "\r\nException: " + error.message);
			return undefined;
		}
	}
}