import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { Utilities } from './Utilities';
import { LkData } from './lkdata';
import { Connection } from './connection';

export class DictQM_D {
    pos: string;
    database: string;
    type: string;

    fieldNumber: string;
    conversionCode: string;
    displayName: string;
    formatSpecification: string;
    singleMultivalueFlag: string;
    associationName: string;
    free1: string;
    reserved1: string;
    reserved2: string;
    free2: string;

    constructor(pos?: string, record?: string) {
        this.database = "QM";
        this.type = "D";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.fieldNumber = DictionariesForm.SetField(lstatts[1]);
            this.conversionCode = DictionariesForm.SetField(lstatts[2]);
            this.displayName = DictionariesForm.SetField(lstatts[3]);
            this.formatSpecification = DictionariesForm.SetField(lstatts[4]);
            this.singleMultivalueFlag = DictionariesForm.SetField(lstatts[5]);
            this.associationName = DictionariesForm.SetField(lstatts[6]);
            this.free1 = DictionariesForm.SetField(lstatts[7]);
            this.reserved1 = DictionariesForm.SetField(lstatts[8]);
            this.reserved2 = DictionariesForm.SetField(lstatts[9]);
            this.free2 = DictionariesForm.SetField(lstatts[10]);
        }
        else if (pos) {
            this.pos = pos;

            this.fieldNumber = "";
            this.conversionCode = "";
            this.displayName = "";
            this.formatSpecification = "";
            this.singleMultivalueFlag = "";
            this.associationName = "";
            this.free1 = "";
            this.reserved1 = "";
            this.reserved2 = "";
            this.free2 = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.fieldNumber + "\xFE" +
            this.conversionCode + "\xFE" +
            this.displayName + "\xFE" +
            this.formatSpecification + "\xFE" +
            this.singleMultivalueFlag + "\xFE" +
            this.associationName + "\xFE" +
            this.free1 + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2 + "\xFE" +
            this.free2;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictQM_D();
        dict.pos = pos.toString();
        dict.database = "QM";
        dict.type = "D";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "fieldNumber"))
                dict.fieldNumber = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "formatSpecification"))
                dict.formatSpecification = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "singleMultivalueFlag"))
                dict.singleMultivalueFlag = values[i].value;
            if (values[i].name == (dict.pos + "associationName"))
                dict.associationName = values[i].value;
            if (values[i].name == (dict.pos + "free1"))
                dict.free1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
            if (values[i].name == (dict.pos + "free2"))
                dict.free2 = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "fieldNumber", "2", "Field Number", this.fieldNumber);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "3", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "4", "Display Name", this.displayName, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "formatSpecification", "5", "Format Specification", this.formatSpecification, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "singleMultivalueFlag", "6", "Single/Multivalue Flag", this.singleMultivalueFlag);
        frm += DictionariesForm.getFieldTemplate(this.pos + "associationName", "7", "Association Name", this.associationName);
        frm += DictionariesForm.getFieldTemplate(this.pos + "free1", "8", "Free", this.free1, "L");
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "9", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "10", "Reserved", this.reserved2, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "free2", "11", "Free", this.free2, "L");
        frm += "</div>";
        return frm;
    }
}

export class DictQM_I {
    pos: string;
    database: string;
    type: string;

    expression: string;
    conversionCode: string;
    displayName: string;
    formatSpecification: string;
    singleMultivalueFlag: string;
    associationName: string;
    free1: string;
    reserved1: string;
    reserved2: string;
    free2: string;

    constructor(pos?: string, record?: string) {
        this.database = "QM";
        this.type = "I";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.expression = DictionariesForm.SetField(lstatts[1]);
            this.conversionCode = DictionariesForm.SetField(lstatts[2]);
            this.displayName = DictionariesForm.SetField(lstatts[3]);
            this.formatSpecification = DictionariesForm.SetField(lstatts[4]);
            this.singleMultivalueFlag = DictionariesForm.SetField(lstatts[5]);
            this.associationName = DictionariesForm.SetField(lstatts[6]);
            this.free1 = DictionariesForm.SetField(lstatts[7]);
            this.reserved1 = DictionariesForm.SetField(lstatts[8]);
            this.reserved2 = DictionariesForm.SetField(lstatts[9]);
            this.free2 = DictionariesForm.SetField(lstatts[10]);
        }
        else if (pos) {
            this.pos = pos;

            this.expression = "";
            this.conversionCode = "";
            this.displayName = "";
            this.formatSpecification = "";
            this.singleMultivalueFlag = "";
            this.associationName = "";
            this.free1 = "";
            this.reserved1 = "";
            this.reserved2 = "";
            this.free2 = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.expression + "\xFE" +
            this.conversionCode + "\xFE" +
            this.displayName + "\xFE" +
            this.formatSpecification + "\xFE" +
            this.singleMultivalueFlag + "\xFE" +
            this.associationName + "\xFE" +
            this.free1 + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2 + "\xFE" +
            this.free2;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictQM_I();
        dict.pos = pos.toString();
        dict.database = "QM";
        dict.type = "I";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "expression"))
                dict.expression = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "formatSpecification"))
                dict.formatSpecification = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "singleMultivalueFlag"))
                dict.singleMultivalueFlag = values[i].value;
            if (values[i].name == (dict.pos + "associationName"))
                dict.associationName = values[i].value;
            if (values[i].name == (dict.pos + "free1"))
                dict.free1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
            if (values[i].name == (dict.pos + "free2"))
                dict.free2 = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail ";
        if (active)
            frm += "tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "expression", "2", "Expression", this.expression);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "3", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "4", "Display Name", this.displayName, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "formatSpecification", "5", "Format Specification", this.formatSpecification, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "singleMultivalueFlag", "6", "Single/Multivalue Flag", this.singleMultivalueFlag);
        frm += DictionariesForm.getFieldTemplate(this.pos + "associationName", "7", "Association Name", this.associationName);
        frm += DictionariesForm.getFieldTemplate(this.pos + "free1", "8", "Free", this.free1, "L");
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "9", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "10", "Reserved", this.reserved2, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "free2", "11", "Free", this.free2, "L");
        frm += "</div>";
        return frm;
    }
}

export class DictQM_A_S {
    pos: string;
    database: string;
    type: string;

    fieldNumber: string;
    displayName: string;
    association: string;
    reserved1: string;
    reserved2: string;
    conversionCode: string;
    correlativeCode: string;
    displayJustification: string;
    displayWidth: string;
    free: string;

    constructor(pos?: string, record?: string, type?: string) {
        this.database = "QM";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.fieldNumber = DictionariesForm.SetField(lstatts[1]);
            this.displayName = DictionariesForm.SetField(lstatts[2]);
            this.association = DictionariesForm.SetField(lstatts[3]);
            this.reserved1 = DictionariesForm.SetField(lstatts[4]);
            this.reserved2 = DictionariesForm.SetField(lstatts[5]);
            this.conversionCode = DictionariesForm.SetField(lstatts[6]);
            this.correlativeCode = DictionariesForm.SetField(lstatts[7]);
            this.displayJustification = DictionariesForm.SetField(lstatts[8]);
            this.displayWidth = DictionariesForm.SetField(lstatts[9]);
            this.free = DictionariesForm.SetField(lstatts[10]);
        }
        else if (pos) {
            this.pos = pos;
            this.type = type;

            this.fieldNumber = "";
            this.displayName = "";
            this.association = "";
            this.reserved1 = "";
            this.reserved2 = "";
            this.conversionCode = "";
            this.correlativeCode = "";
            this.displayJustification = "";
            this.displayWidth = "";
            this.free = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.fieldNumber + "\xFE" +
            this.displayName + "\xFE" +
            this.association + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2 + "\xFE" +
            this.conversionCode + "\xFE" +
            this.correlativeCode + "\xFE" +
            this.displayJustification + "\xFE" +
            this.displayWidth + "\xFE" +
            this.free;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictQM_A_S();
        dict.pos = pos.toString();
        dict.database = "QM";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "fieldNumber"))
                dict.fieldNumber = values[i].value;
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "association"))
                dict.association = values[i].value;
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "correlativeCode"))
                dict.correlativeCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayJustification"))
                dict.displayJustification = values[i].value;
            if (values[i].name == (dict.pos + "displayWidth"))
                dict.displayWidth = values[i].value;
            if (values[i].name == (dict.pos + "free"))
                dict.free = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail ";
        if (active)
            frm += "tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "fieldNumber", "2", "Field Number", this.fieldNumber);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "3", "Display Name", this.displayName, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "association", "4", "Association", this.association);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "5", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "6", "Reserved", this.reserved2, "M", true, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "7", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "correlativeCode", "8", "Correlative Code", this.correlativeCode, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "displayJustification", "9", "Display Justification", this.displayJustification);
        frm += DictionariesForm.getFieldTemplate(this.pos + "displayWidth", "10", "Display Width", this.displayWidth);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "free", "11", "Free", this.free);
        frm += "</div>";
        return frm;
    }
}

export class DictQM_C {
    pos: string;
    database: string;
    type: string;

    basicProgram: string;
    conversionCode: string;
    displayName: string;
    formatSpecification: string;
    singleMultivalueFlag: string;
    associationName: string;
    free1: string;
    reserved1: string;
    reserved2: string;
    free2: string;

    constructor(pos?: string, record?: string) {
        this.database = "QM";
        this.type = "C";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.basicProgram = DictionariesForm.SetField(lstatts[1]);
            this.conversionCode = DictionariesForm.SetField(lstatts[2]);
            this.displayName = DictionariesForm.SetField(lstatts[3]);
            this.formatSpecification = DictionariesForm.SetField(lstatts[4]);
            this.singleMultivalueFlag = DictionariesForm.SetField(lstatts[5]);
            this.associationName = DictionariesForm.SetField(lstatts[6]);
            this.free1 = DictionariesForm.SetField(lstatts[7]);
            this.reserved1 = DictionariesForm.SetField(lstatts[8]);
            this.reserved2 = DictionariesForm.SetField(lstatts[9]);
            this.free2 = DictionariesForm.SetField(lstatts[10]);
        }
        else if (pos) {
            this.pos = pos;

            this.basicProgram = "";
            this.conversionCode = "";
            this.displayName = "";
            this.formatSpecification = "";
            this.singleMultivalueFlag = "";
            this.associationName = "";
            this.free1 = "";
            this.reserved1 = "";
            this.reserved2 = "";
            this.free2 = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.basicProgram + "\xFE" +
            this.conversionCode + "\xFE" +
            this.displayName + "\xFE" +
            this.formatSpecification + "\xFE" +
            this.singleMultivalueFlag + "\xFE" +
            this.associationName + "\xFE" +
            this.free1 + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2 + "\xFE" +
            this.free2;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictQM_C();
        dict.pos = pos.toString();
        dict.database = "QM";
        dict.type = "C";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "basicProgram"))
                dict.basicProgram = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "formatSpecification"))
                dict.formatSpecification = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "singleMultivalueFlag"))
                dict.singleMultivalueFlag = values[i].value;
            if (values[i].name == (dict.pos + "associationName"))
                dict.associationName = values[i].value;
            if (values[i].name == (dict.pos + "free1"))
                dict.free1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
            if (values[i].name == (dict.pos + "free2"))
                dict.free2 = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "basicProgram", "2", "QMBASIC Program", this.basicProgram);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "3", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "4", "Display Name", this.displayName, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "formatSpecification", "5", "Format Specification", this.formatSpecification, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "singleMultivalueFlag", "6", "Single/Multivalue Flag", this.singleMultivalueFlag);
        frm += DictionariesForm.getFieldTemplate(this.pos + "associationName", "7", "Association Name", this.associationName);
        frm += DictionariesForm.getFieldTemplate(this.pos + "free1", "8", "Free", this.free1, "L");
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "9", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "10", "Reserved", this.reserved2, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "free2", "11", "Free", this.free2, "L");
        frm += "</div>";
        return frm;
    }
}

export class DictQM_E {
    pos: string;
    database: string;
    type: string;

    elementPath: string;
    conversionCode: string;
    displayName: string;
    formatSpecification: string;
    singleMultivalueFlag: string;
    associationName: string;
    free1: string;
    reserved1: string;
    reserved2: string;
    free2: string;

    constructor(pos?: string, record?: string) {
        this.database = "QM";
        this.type = "E";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.elementPath = DictionariesForm.SetField(lstatts[1]);
            this.conversionCode = DictionariesForm.SetField(lstatts[2]);
            this.displayName = DictionariesForm.SetField(lstatts[3]);
            this.formatSpecification = DictionariesForm.SetField(lstatts[4]);
            this.singleMultivalueFlag = DictionariesForm.SetField(lstatts[5]);
            this.associationName = DictionariesForm.SetField(lstatts[6]);
            this.free1 = DictionariesForm.SetField(lstatts[7]);
            this.reserved1 = DictionariesForm.SetField(lstatts[8]);
            this.reserved2 = DictionariesForm.SetField(lstatts[9]);
            this.free2 = DictionariesForm.SetField(lstatts[10]);
        }
        else if (pos) {
            this.pos = pos;

            this.elementPath = "";
            this.conversionCode = "";
            this.displayName = "";
            this.formatSpecification = "";
            this.singleMultivalueFlag = "";
            this.associationName = "";
            this.free1 = "";
            this.reserved1 = "";
            this.reserved2 = "";
            this.free2 = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.elementPath + "\xFE" +
            this.conversionCode + "\xFE" +
            this.displayName + "\xFE" +
            this.formatSpecification + "\xFE" +
            this.singleMultivalueFlag + "\xFE" +
            this.associationName + "\xFE" +
            this.free1 + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2 + "\xFE" +
            this.free2;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictQM_E();
        dict.pos = pos.toString();
        dict.database = "QM";
        dict.type = "E";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "elementPath"))
                dict.elementPath = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "formatSpecification"))
                dict.formatSpecification = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "singleMultivalueFlag"))
                dict.singleMultivalueFlag = values[i].value;
            if (values[i].name == (dict.pos + "associationName"))
                dict.associationName = values[i].value;
            if (values[i].name == (dict.pos + "free1"))
                dict.free1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
            if (values[i].name == (dict.pos + "free2"))
                dict.free2 = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "elementPath", "2", "Element Path", this.elementPath);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "3", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "4", "Display Name", this.displayName, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "formatSpecification", "5", "Format Specification", this.formatSpecification, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "singleMultivalueFlag", "6", "Single/Multivalue Flag", this.singleMultivalueFlag);
        frm += DictionariesForm.getFieldTemplate(this.pos + "associationName", "7", "Association Name", this.associationName);
        frm += DictionariesForm.getFieldTemplate(this.pos + "free1", "8", "Free", this.free1, "L");
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "9", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "10", "Reserved", this.reserved2, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "free2", "11", "Free", this.free2, "L");
        frm += "</div>";
        return frm;
    }
}

export class DictQM_L {
    pos: string;
    database: string;
    type: string;

    idExpression: string;
    fileName: string;
    fileExpression: string;

    constructor(pos?: string, record?: string) {
        this.database = "QM";
        this.type = "L";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.idExpression = DictionariesForm.SetField(lstatts[1]);
            this.fileName = DictionariesForm.SetField(lstatts[2]);
            this.fileExpression = DictionariesForm.SetField(lstatts[3]);
        }
        else if (pos) {
            this.pos = pos;

            this.idExpression = "";
            this.fileName = "";
            this.fileExpression = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.idExpression + "\xFE" +
            this.fileName + "\xFE" +
            this.fileExpression;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictQM_L();
        dict.pos = pos.toString();
        dict.database = "QM";
        dict.type = "L";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "idExpression"))
                dict.idExpression = values[i].value;
            if (values[i].name == (dict.pos + "fileName"))
                dict.fileName = values[i].value;
            if (values[i].name == (dict.pos + "fileExpression"))
                dict.fileExpression = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "idExpression", "2", "Id Expression", this.idExpression);
        frm += DictionariesForm.getFieldTemplate(this.pos + "fileName", "3", "File Name", this.fileName, "L");
        frm += DictionariesForm.getFieldTemplate(this.pos + "fileExpression", "4", "File Expression", this.fileExpression, "L");
        frm += "</div>";
        return frm;
    }
}

export class DictQM_PH {
    pos: string;
    database: string;
    type: string;

    phrase: string;

    constructor(pos?: string, record?: string) {
        this.database = "QM";
        this.type = "PH";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.phrase = DictionariesForm.SetField(lstatts[1]);
        }
        else if (pos) {
            this.pos = pos;

            this.phrase = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.phrase;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictQM_PH();
        dict.pos = pos.toString();
        dict.database = "QM";
        dict.type = "PH";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "phrase"))
                dict.phrase = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "phrase", "2", "Phrase", this.phrase);
        frm += "</div>";
        return frm;
    }
}

export class DictQM_X {
    pos: string;
    database: string;
    type: string;

    userData: string;

    constructor(pos?: string, record?: string) {
        this.database = "QM";
        this.type = "X";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.userData = DictionariesForm.SetField(lstatts[1]);
        }
        else if (pos) {
            this.pos = pos;

            this.userData = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.userData;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictQM_X();
        dict.pos = pos.toString();
        dict.database = "QM";
        dict.type = "X";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "userData"))
                dict.userData = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "userData", "2", "User Data", this.userData);
        frm += "</div>";
        return frm;
    }
}

export class DictD3_A_S_X {
    pos: string;
    database: string;
    dictionaryCode: string;

    attributeCount: string;
    substituteHeader: string;
    structure: string;
    reserved1: string;
    reserved2: string;
    outputConversion: string;
    correlative: string;
    attributeType: string;
    columnWidth: string;
    free1: string;
    free2: string;
    free3: string;
    inputConversion: string;
    macro: string;
    reserved3: string;
    description: string;

    constructor(pos?: string, record?: string, type?: string) {
        this.database = "D3";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.dictionaryCode = DictionariesForm.SetField(lstatts[0]);

            this.attributeCount = DictionariesForm.SetField(lstatts[1]);
            this.substituteHeader = DictionariesForm.SetField(lstatts[2]);
            this.structure = DictionariesForm.SetField(lstatts[3]);
            this.reserved1 = DictionariesForm.SetField(lstatts[4]);
            this.reserved2 = DictionariesForm.SetField(lstatts[5]);
            this.outputConversion = DictionariesForm.SetField(lstatts[6]);
            this.correlative = DictionariesForm.SetField(lstatts[7]);
            this.attributeType = DictionariesForm.SetField(lstatts[8]);
            this.columnWidth = DictionariesForm.SetField(lstatts[9]);
            this.free1 = DictionariesForm.SetField(lstatts[10]);
            this.free2 = DictionariesForm.SetField(lstatts[11]);
            this.free3 = DictionariesForm.SetField(lstatts[12]);
            this.inputConversion = DictionariesForm.SetField(lstatts[13]);
            this.macro = DictionariesForm.SetField(lstatts[14]);
            this.reserved3 = DictionariesForm.SetField(lstatts[15]);
            this.description = DictionariesForm.SetField(lstatts[16]);
        }
        else if (pos) {
            this.pos = pos;
            this.dictionaryCode = type;

            this.attributeCount = "";
            this.substituteHeader = "";
            this.structure = "";
            this.reserved1 = "";
            this.reserved2 = "";
            this.outputConversion = "";
            this.correlative = "";
            this.attributeType = "";
            this.columnWidth = "";
            this.free1 = "";
            this.free2 = "";
            this.free3 = "";
            this.inputConversion = "";
            this.macro = "";
            this.reserved3 = "";
            this.description = "";
        }
    }

    public ToRecord(): string {
        return this.dictionaryCode + "\xFE" +
            this.attributeCount + "\xFE" +
            this.substituteHeader + "\xFE" +
            this.structure + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2 + "\xFE" +
            this.outputConversion + "\xFE" +
            this.correlative + "\xFE" +
            this.attributeType + "\xFE" +
            this.columnWidth + "\xFE" +
            this.free1 + "\xFE" +
            this.free2 + "\xFE" +
            this.free3 + "\xFE" +
            this.inputConversion + "\xFE" +
            this.macro + "\xFE" +
            this.reserved3 + "\xFE" +
            this.description;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictD3_A_S_X();
        dict.pos = pos.toString();
        dict.database = "D3";
        dict.dictionaryCode = "A";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "dictionaryCode"))
                dict.dictionaryCode = values[i].value;
            if (values[i].name == (dict.pos + "attributeCount"))
                dict.attributeCount = values[i].value;
            if (values[i].name == (dict.pos + "substituteHeader"))
                dict.substituteHeader = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "structure"))
                dict.structure = values[i].value;
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
            if (values[i].name == (dict.pos + "outputConversion"))
                dict.outputConversion = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "correlative"))
                dict.correlative = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "attributeType"))
                dict.attributeType = values[i].value;
            if (values[i].name == (dict.pos + "columnWidth"))
                dict.columnWidth = values[i].value;
            if (values[i].name == (dict.pos + "free1"))
                dict.free1 = values[i].value;
            if (values[i].name == (dict.pos + "free2"))
                dict.free2 = values[i].value;
            if (values[i].name == (dict.pos + "free3"))
                dict.free3 = values[i].value;
            if (values[i].name == (dict.pos + "inputConversion"))
                dict.inputConversion = values[i].value;
            if (values[i].name == (dict.pos + "macro"))
                dict.macro = values[i].value;
            if (values[i].name == (dict.pos + "reserved3"))
                dict.reserved3 = values[i].value;
            if (values[i].name == (dict.pos + "description"))
                dict.description = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail ";
        if (active)
            frm += "tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "dictionaryCode", "1", "Dictionary Code", this.dictionaryCode, "M", true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "attributeCount", "2", "Attribute Count", this.attributeCount);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "substituteHeader", "3", "Substitute Header", this.substituteHeader, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "structure", "4", "Structure", this.structure);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "5", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "6", "Reserved", this.reserved2, "M", true, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "outputConversion", "7", "Output Conversion", this.outputConversion, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "correlative", "8", "Correlative", this.correlative, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "attributeType", "9", "Attribute Type", this.attributeType);
        frm += DictionariesForm.getFieldTemplate(this.pos + "columnWidth", "10", "Column Width", this.columnWidth, "L");
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "free1", "11", "Free", this.free1);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "free2", "12", "Free", this.free2);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "free3", "13", "Free", this.free3);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "inputConversion", "14", "Input Conversion", this.inputConversion);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "macro", "15", "Macro", this.macro);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved3", "16", "Reserved", this.reserved3, "L", true, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "description", "17", "Description", this.description);
        frm += "</div>";
        return frm;
    }
}

export class DictMB_A_S_I_X {
    pos: string;
    database: string;
    definitionCode: string;

    attributeNumber: string;
    tag: string;
    structure: string;
    reserved1: string;
    reserved2: string;
    conversionCode: string;
    correlativeCode: string;
    justification: string;
    width: string;

    constructor(pos?: string, record?: string, type?: string) {
        this.database = "mvBASE";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.definitionCode = DictionariesForm.SetField(lstatts[0]);

            this.attributeNumber = DictionariesForm.SetField(lstatts[1]);
            this.tag = DictionariesForm.SetField(lstatts[2]);
            this.structure = DictionariesForm.SetField(lstatts[3]);
            this.reserved1 = DictionariesForm.SetField(lstatts[4]);
            this.reserved2 = DictionariesForm.SetField(lstatts[5]);
            this.conversionCode = DictionariesForm.SetField(lstatts[6]);
            this.correlativeCode = DictionariesForm.SetField(lstatts[7]);
            this.justification = DictionariesForm.SetField(lstatts[8]);
            this.width = DictionariesForm.SetField(lstatts[9]);
        }
        else if (pos) {
            this.pos = pos;
            this.definitionCode = type;

            this.attributeNumber = "";
            this.tag = "";
            this.structure = "";
            this.reserved1 = "";
            this.reserved2 = "";
            this.conversionCode = "";
            this.correlativeCode = "";
            this.justification = "";
            this.width = "";
        }
    }

    public ToRecord(): string {
        return this.definitionCode + "\xFE" +
            this.attributeNumber + "\xFE" +
            this.tag + "\xFE" +
            this.structure + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2 + "\xFE" +
            this.conversionCode + "\xFE" +
            this.correlativeCode + "\xFE" +
            this.justification + "\xFE" +
            this.width;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictMB_A_S_I_X();
        dict.pos = pos.toString();
        dict.database = "mvBASE";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "definitionCode"))
                dict.definitionCode = values[i].value;
            if (values[i].name == (dict.pos + "attributeNumber"))
                dict.attributeNumber = values[i].value;
            if (values[i].name == (dict.pos + "tag"))
                dict.tag = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "structure"))
                dict.structure = values[i].value;
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "correlativeCode"))
                dict.correlativeCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "justification"))
                dict.justification = values[i].value;
            if (values[i].name == (dict.pos + "width"))
                dict.width = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail ";
        if (active)
            frm += "tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "definitionCode", "1", "Definition Code", this.definitionCode, "M", true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "attributeNumber", "2", "Attribute Number", this.attributeNumber);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "tag", "Tag", "3", this.tag, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "structure", "4", "Structure", this.structure);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "5", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "6", "Reserved", this.reserved2, "M", true, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "7", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "correlativeCode", "8", "Correlative Code", this.correlativeCode, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "justification", "9", "Justification", this.justification);
        frm += DictionariesForm.getFieldTemplate(this.pos + "width", "10", "Width", this.width);
        frm += "</div>";
        return frm;
    }
}

export class DictUV_D {
    pos: string;
    database: string;
    type: string;

    fieldNumber: string;
    conversionCode: string;
    displayName: string;
    formatSpecification: string;
    singleMultivalueFlag: string;
    associationName: string;
    sqlType: string;

    constructor(pos?: string, record?: string) {
        this.database = "Universe";
        this.type = "D";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.fieldNumber = DictionariesForm.SetField(lstatts[1]);
            this.conversionCode = DictionariesForm.SetField(lstatts[2]);
            this.displayName = DictionariesForm.SetField(lstatts[3]);
            this.formatSpecification = DictionariesForm.SetField(lstatts[4]);
            this.singleMultivalueFlag = DictionariesForm.SetField(lstatts[5]);
            this.associationName = DictionariesForm.SetField(lstatts[6]);
            this.sqlType = DictionariesForm.SetField(lstatts[7]);
        }
        else if (pos) {
            this.pos = pos;

            this.fieldNumber = "";
            this.conversionCode = "";
            this.displayName = "";
            this.formatSpecification = "";
            this.singleMultivalueFlag = "";
            this.associationName = "";
            this.sqlType = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.fieldNumber + "\xFE" +
            this.conversionCode + "\xFE" +
            this.displayName + "\xFE" +
            this.formatSpecification + "\xFE" +
            this.singleMultivalueFlag + "\xFE" +
            this.associationName + "\xFE" +
            this.sqlType;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictUV_D();
        dict.pos = pos.toString();
        dict.database = "Universe";
        dict.type = "D";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "fieldNumber"))
                dict.fieldNumber = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "formatSpecification"))
                dict.formatSpecification = values[i].value.value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "singleMultivalueFlag"))
                dict.singleMultivalueFlag = values[i].value;
            if (values[i].name == (dict.pos + "associationName"))
                dict.associationName = values[i].value;
            if (values[i].name == (dict.pos + "sqlType"))
                dict.sqlType = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "fieldNumber", "2", "Field Number", this.fieldNumber);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "3", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "4", "Display Name", this.displayName, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "formatSpecification", "5", "Format Specification", this.formatSpecification, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "singleMultivalueFlag", "6", "Single/Multivalue Flag", this.singleMultivalueFlag);
        frm += DictionariesForm.getFieldTemplate(this.pos + "associationName", "7", "Association Name", this.associationName);
        frm += DictionariesForm.getFieldTemplate(this.pos + "sqlType", "8", "SQL Type", this.sqlType, "L");
        frm += "</div>";
        return frm;
    }
}

export class DictUV_I {
    pos: string;
    database: string;
    type: string;

    expression: string;
    conversionCode: string;
    displayName: string;
    formatSpecification: string;
    singleMultivalueFlag: string;
    associationName: string;
    sqlType: string;

    constructor(pos?: string, record?: string) {
        this.database = "Universe";
        this.type = "I";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.expression = DictionariesForm.SetField(lstatts[1]);
            this.conversionCode = DictionariesForm.SetField(lstatts[2]);
            this.displayName = DictionariesForm.SetField(lstatts[3]);
            this.formatSpecification = DictionariesForm.SetField(lstatts[4]);
            this.singleMultivalueFlag = DictionariesForm.SetField(lstatts[5]);
            this.associationName = DictionariesForm.SetField(lstatts[6]);
            this.sqlType = DictionariesForm.SetField(lstatts[7]);
        }
        else if (pos) {
            this.pos = pos;

            this.expression = "";
            this.conversionCode = "";
            this.displayName = "";
            this.formatSpecification = "";
            this.singleMultivalueFlag = "";
            this.associationName = "";
            this.sqlType = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.expression + "\xFE" +
            this.conversionCode + "\xFE" +
            this.displayName + "\xFE" +
            this.formatSpecification + "\xFE" +
            this.singleMultivalueFlag + "\xFE" +
            this.associationName + "\xFE" +
            this.sqlType;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictUV_I();
        dict.pos = pos.toString();
        dict.database = "Universe";
        dict.type = "I";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "expression"))
                dict.expression = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "formatSpecification"))
                dict.formatSpecification = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "singleMultivalueFlag"))
                dict.singleMultivalueFlag = values[i].value;
            if (values[i].name == (dict.pos + "associationName"))
                dict.associationName = values[i].value;
            if (values[i].name == (dict.pos + "sqlType"))
                dict.sqlType = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail ";
        if (active)
            frm += "tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "expression", "2", "Expression", this.expression);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "3", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "4", "Display Name", this.displayName, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "formatSpecification", "5", "Format Specification", this.formatSpecification, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "singleMultivalueFlag", "6", "Single/Multivalue Flag", this.singleMultivalueFlag);
        frm += DictionariesForm.getFieldTemplate(this.pos + "associationName", "7", "Association Name", this.associationName);
        frm += DictionariesForm.getFieldTemplate(this.pos + "sqlType", "8", "SQL Type", this.sqlType, "L");
        frm += "</div>";
        return frm;
    }
}

export class DictUV_A_S {
    pos: string;
    database: string;
    type: string;

    fieldNumber: string;
    displayName: string;
    association: string;
    reserved1: string;
    reserved2: string;
    conversionCode: string;
    correlativeCode: string;
    displayJustification: string;
    displayWidth: string;
    free: string;

    constructor(pos?: string, record?: string, type?: string) {
        this.database = "Universe";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.fieldNumber = DictionariesForm.SetField(lstatts[1]);
            this.displayName = DictionariesForm.SetField(lstatts[2]);
            this.association = DictionariesForm.SetField(lstatts[3]);
            this.reserved1 = DictionariesForm.SetField(lstatts[4]);
            this.reserved2 = DictionariesForm.SetField(lstatts[5]);
            this.conversionCode = DictionariesForm.SetField(lstatts[6]);
            this.correlativeCode = DictionariesForm.SetField(lstatts[7]);
            this.displayJustification = DictionariesForm.SetField(lstatts[8]);
            this.displayWidth = DictionariesForm.SetField(lstatts[9]);
            this.free = DictionariesForm.SetField(lstatts[10]);
        }
        else if (pos) {
            this.pos = pos;
            this.type = type;

            this.fieldNumber = "";
            this.displayName = "";
            this.association = "";
            this.reserved1 = "";
            this.reserved2 = "";
            this.conversionCode = "";
            this.correlativeCode = "";
            this.displayJustification = "";
            this.displayWidth = "";
            this.free = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.fieldNumber + "\xFE" +
            this.displayName + "\xFE" +
            this.association + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2 + "\xFE" +
            this.conversionCode + "\xFE" +
            this.correlativeCode + "\xFE" +
            this.displayJustification + "\xFE" +
            this.displayWidth + "\xFE" +
            this.free;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictUV_A_S();
        dict.pos = pos.toString();
        dict.database = "Universe";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "fieldNumber"))
                dict.fieldNumber = values[i].value;
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "association"))
                dict.association = values[i].value;
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "correlativeCode"))
                dict.correlativeCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayJustification"))
                dict.displayJustification = values[i].value;
            if (values[i].name == (dict.pos + "displayWidth"))
                dict.displayWidth = values[i].value;
            if (values[i].name == (dict.pos + "free"))
                dict.free = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail ";
        if (active)
            frm += "tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "fieldNumber", "2", "Field Number", this.fieldNumber);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "3", "Display Name", this.displayName, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "association", "4", "Association", this.association);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "5", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "6", "Reserved", this.reserved2, "M", true, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "7", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "correlativeCode", "8", "Correlative Code", this.correlativeCode, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "displayJustification", "9", "Display Justification", this.displayJustification);
        frm += DictionariesForm.getFieldTemplate(this.pos + "displayWidth", "10", "Display Width", this.displayWidth);
        frm += DictionariesForm.getFieldTemplate(this.pos + "free", "11", "Free", this.free, "L");
        frm += "</div>";
        return frm;
    }
}

export class DictUV_PH {
    pos: string;
    database: string;
    type: string;

    phrase: string;

    constructor(pos?: string, record?: string) {
        this.database = "Universe";
        this.type = "PH";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.phrase = DictionariesForm.SetField(lstatts[1]);
        }
        else if (pos) {
            this.pos = pos;

            this.phrase = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.phrase;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictUV_PH();
        dict.pos = pos.toString();
        dict.database = "Universe";
        dict.type = "PH";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "phrase"))
                dict.phrase = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "phrase", "2", "Phrase", this.phrase);
        frm += "</div>";
        return frm;
    }
}

export class DictUV_X {
    pos: string;
    database: string;
    type: string;

    userData: string;

    constructor(pos?: string, record?: string) {
        this.database = "Universe";
        this.type = "X";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.userData = DictionariesForm.SetField(lstatts[1]);
        }
        else if (pos) {
            this.pos = pos;

            this.userData = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.userData;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictUV_X();
        dict.pos = pos.toString();
        dict.database = "Universe";
        dict.type = "X";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "userData"))
                dict.userData = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "userData", "2", "User Data", this.userData);
        frm += "</div>";
        return frm;
    }
}

export class DictUD_D {
    pos: string;
    database: string;
    type: string;

    location: string;
    conversionCode: string;
    displayName: string;
    formatSpecification: string;
    valueCodSpecifier: string;
    associationName: string;

    constructor(pos?: string, record?: string) {
        this.database = "Unidata";
        this.type = "D";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.location = DictionariesForm.SetField(lstatts[1]);
            this.conversionCode = DictionariesForm.SetField(lstatts[2]);
            this.displayName = DictionariesForm.SetField(lstatts[3]);
            this.formatSpecification = DictionariesForm.SetField(lstatts[4]);
            this.valueCodSpecifier = DictionariesForm.SetField(lstatts[5]);
            this.associationName = DictionariesForm.SetField(lstatts[6]);
        }
        else if (pos) {
            this.pos = pos;

            this.location = "";
            this.conversionCode = "";
            this.displayName = "";
            this.formatSpecification = "";
            this.valueCodSpecifier = "";
            this.associationName = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.location + "\xFE" +
            this.conversionCode + "\xFE" +
            this.displayName + "\xFE" +
            this.formatSpecification + "\xFE" +
            this.valueCodSpecifier + "\xFE" +
            this.associationName;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictUD_D();
        dict.pos = pos.toString();
        dict.database = "Unidata";
        dict.type = "D";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "location"))
                dict.location = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "formatSpecification"))
                dict.formatSpecification = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "valueCodSpecifier"))
                dict.valueCodSpecifier = values[i].value;
            if (values[i].name == (dict.pos + "associationName"))
                dict.associationName = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "location", "2", "Location", this.location, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "3", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "4", "Display Name", this.displayName, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "formatSpecification", "5", "Format Specification", this.formatSpecification, "L");
        frm += DictionariesForm.getFieldTemplate(this.pos + "valueCodSpecifier", "6", "Value Cod Specifier", this.valueCodSpecifier);
        frm += DictionariesForm.getFieldTemplate(this.pos + "associationName", "7", "Association Name", this.associationName);
        frm += "</div>";
        return frm;
    }
}

export class DictUD_I_V {
    pos: string;
    database: string;
    type: string;

    expression: string;
    conversionCode: string;
    displayName: string;
    formatSpecification: string;
    singleMultivalueFlag: string;
    valueCodSpecifier: string;
    reserved1: string;
    reserved2: string;

    constructor(pos?: string, record?: string, type?: string) {
        this.database = "Unidata";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.expression = DictionariesForm.SetField(lstatts[1]);
            this.conversionCode = DictionariesForm.SetField(lstatts[2]);
            this.displayName = DictionariesForm.SetField(lstatts[3]);
            this.formatSpecification = DictionariesForm.SetField(lstatts[4]);
            this.singleMultivalueFlag = DictionariesForm.SetField(lstatts[5]);
            this.valueCodSpecifier = DictionariesForm.SetField(lstatts[6]);
            this.reserved1 = DictionariesForm.SetField(lstatts[7]);
            this.reserved2 = DictionariesForm.SetField(lstatts[8]);
        }
        else if (pos) {
            this.pos = pos;
            this.type = type;

            this.expression = "";
            this.conversionCode = "";
            this.displayName = "";
            this.formatSpecification = "";
            this.singleMultivalueFlag = "";
            this.valueCodSpecifier = "";
            this.reserved1 = "";
            this.reserved2 = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.expression + "\xFE" +
            this.conversionCode + "\xFE" +
            this.displayName + "\xFE" +
            this.formatSpecification + "\xFE" +
            this.singleMultivalueFlag + "\xFE" +
            this.valueCodSpecifier + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictUD_I_V();
        dict.pos = pos.toString();
        dict.database = "Unidata";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "expression"))
                dict.expression = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "formatSpecification"))
                dict.formatSpecification = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "singleMultivalueFlag"))
                dict.singleMultivalueFlag = values[i].value;
            if (values[i].name == (dict.pos + "valueCodSpecifier"))
                dict.valueCodSpecifier = values[i].value;
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail ";
        if (active)
            frm += "tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "expression", "2", "Expression", this.expression);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "3", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "4", "Display Name", this.displayName, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "formatSpecification", "5", "Format Specification", this.formatSpecification, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "singleMultivalueFlag", "6", "Single/Multivalue Flag", this.singleMultivalueFlag);
        frm += DictionariesForm.getFieldTemplate(this.pos + "valueCodSpecifier", "7", "Value Cod Specifier", this.valueCodSpecifier);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "8", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "9", "Reserved", this.reserved2, "M", true, true);
        frm += "</div>";
        return frm;
    }
}

export class DictUD_PH {
    pos: string;
    database: string;
    type: string;

    phrase: string;

    constructor(pos?: string, record?: string) {
        this.database = "Unidata";
        this.type = "PH";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.phrase = DictionariesForm.SetField(lstatts[1]);
        }
        else if (pos) {
            this.pos = pos;

            this.phrase = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.phrase;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictUD_PH();
        dict.pos = pos.toString();
        dict.database = "Unidata";
        dict.type = "PH";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "phrase"))
                dict.phrase = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "phrase", "2", "Phrase", this.phrase);
        frm += "</div>";
        return frm;
    }
}

export class DictUD_X {
    pos: string;
    database: string;
    type: string;

    userData: string;

    constructor(pos?: string, record?: string) {
        this.database = "Unidata";
        this.type = "X";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.userData = DictionariesForm.SetField(lstatts[1]);
        }
        else if (pos) {
            this.pos = pos;

            this.userData = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.userData;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictUD_X();
        dict.pos = pos.toString();
        dict.database = "Unidata";
        dict.type = "X";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "userData"))
                dict.userData = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "userData", "2", "User Data", this.userData);
        frm += "</div>";
        return frm;
    }
}

export class DictJB_D {
    pos: string;
    database: string;
    type: string;

    fieldNumber: string;
    conversionCode: string;
    displayName: string;
    formatSpecification: string;
    reserved1: string;
    reserved2: string;
    reserved3: string;
    reserved4: string;
    reserved5: string;
    reserved6: string;
    reserved7: string;
    reserved8: string;
    reserved9: string;
    reserved10: string;
    reserved11: string;


    constructor(pos?: string, record?: string) {
        this.database = "jBASE";
        this.type = "D";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.fieldNumber = DictionariesForm.SetField(lstatts[1]);
            this.conversionCode = DictionariesForm.SetField(lstatts[2]);
            this.displayName = DictionariesForm.SetField(lstatts[3]);
            this.formatSpecification = DictionariesForm.SetField(lstatts[4]);
            this.reserved1 = DictionariesForm.SetField(lstatts[5]);
            this.reserved2 = DictionariesForm.SetField(lstatts[6]);
            this.reserved3 = DictionariesForm.SetField(lstatts[7]);
            this.reserved4 = DictionariesForm.SetField(lstatts[8]);
            this.reserved5 = DictionariesForm.SetField(lstatts[9]);
            this.reserved6 = DictionariesForm.SetField(lstatts[10]);
            this.reserved8 = DictionariesForm.SetField(lstatts[11]);
            this.reserved9 = DictionariesForm.SetField(lstatts[12]);
            this.reserved10 = DictionariesForm.SetField(lstatts[13]);
            this.reserved11 = DictionariesForm.SetField(lstatts[14]);
        }
        else if (pos) {
            this.pos = pos;

            this.fieldNumber = "";
            this.conversionCode = "";
            this.displayName = "";
            this.formatSpecification = "";
            this.reserved1 = "";
            this.reserved2 = "";
            this.reserved3 = "";
            this.reserved4 = "";
            this.reserved5 = "";
            this.reserved6 = "";
            this.reserved8 = "";
            this.reserved9 = "";
            this.reserved10 = "";
            this.reserved11 = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.fieldNumber + "\xFE" +
            this.conversionCode + "\xFE" +
            this.displayName + "\xFE" +
            this.formatSpecification + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2 + "\xFE" +
            this.reserved3 + "\xFE" +
            this.reserved4 + "\xFE" +
            this.reserved5 + "\xFE" +
            this.reserved6 + "\xFE" +
            this.reserved7 + "\xFE" +
            this.reserved8 + "\xFE" +
            this.reserved9 + "\xFE" +
            this.reserved10 + "\xFE" +
            this.reserved11;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictJB_D();
        dict.pos = pos.toString();
        dict.database = "jBASE";
        dict.type = "D";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "fieldNumber"))
                dict.fieldNumber = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "formatSpecification"))
                dict.formatSpecification = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
            if (values[i].name == (dict.pos + "reserved3"))
                dict.reserved3 = values[i].value;
            if (values[i].name == (dict.pos + "reserved4"))
                dict.reserved4 = values[i].value;
            if (values[i].name == (dict.pos + "reserved5"))
                dict.reserved5 = values[i].value;
            if (values[i].name == (dict.pos + "reserved6"))
                dict.reserved6 = values[i].value;
            if (values[i].name == (dict.pos + "reserved7"))
                dict.reserved7 = values[i].value;
            if (values[i].name == (dict.pos + "reserved8"))
                dict.reserved8 = values[i].value;
            if (values[i].name == (dict.pos + "reserved9"))
                dict.reserved9 = values[i].value;
            if (values[i].name == (dict.pos + "reserved10"))
                dict.reserved10 = values[i].value;
            if (values[i].name == (dict.pos + "reserved11"))
                dict.reserved11 = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail";
        if (active)
            frm += " tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "fieldNumber", "2", "Field Number", this.fieldNumber);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "3", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "4", "Display Name", this.displayName, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "formatSpecification", "5", "Format Specification", this.formatSpecification, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "6", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "7", "Reserved", this.reserved2, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved3", "8", "Reserved", this.reserved3, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved4", "9", "Reserved", this.reserved4, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved5", "10", "Reserved", this.reserved5, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved6", "11", "Reserved", this.reserved6, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved7", "12", "Reserved", this.reserved7, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved8", "13", "Reserved", this.reserved8, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved9", "14", "Reserved", this.reserved9, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved10", "15", "Reserved", this.reserved10, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved11", "16", "Reserved", this.reserved11, "M", true, true);
        frm += "</div>";
        return frm;
    }
}

export class DictJB_I {
    pos: string;
    database: string;
    type: string;

    expression: string;
    conversionCode: string;
    displayName: string;
    formatSpecification: string;
    reserved1: string;
    reserved2: string;
    reserved3: string;
    reserved4: string;
    reserved5: string;
    reserved6: string;
    reserved7: string;
    reserved8: string;
    reserved9: string;
    reserved10: string;
    reserved11: string;

    constructor(pos?: string, record?: string) {
        this.database = "jBASE";
        this.type = "I";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.expression = DictionariesForm.SetField(lstatts[1]);
            this.conversionCode = DictionariesForm.SetField(lstatts[2]);
            this.displayName = DictionariesForm.SetField(lstatts[3]);
            this.formatSpecification = DictionariesForm.SetField(lstatts[4]);
            this.reserved1 = DictionariesForm.SetField(lstatts[5]);
            this.reserved2 = DictionariesForm.SetField(lstatts[6]);
            this.reserved3 = DictionariesForm.SetField(lstatts[7]);
            this.reserved4 = DictionariesForm.SetField(lstatts[8]);
            this.reserved5 = DictionariesForm.SetField(lstatts[9]);
            this.reserved6 = DictionariesForm.SetField(lstatts[10]);
            this.reserved7 = DictionariesForm.SetField(lstatts[11]);
            this.reserved8 = DictionariesForm.SetField(lstatts[12]);
            this.reserved9 = DictionariesForm.SetField(lstatts[13]);
            this.reserved10 = DictionariesForm.SetField(lstatts[14]);
            this.reserved11 = DictionariesForm.SetField(lstatts[15]);
        }
        else if (pos) {
            this.pos = pos;

            this.expression = "";
            this.conversionCode = "";
            this.displayName = "";
            this.formatSpecification = "";
            this.reserved1 = "";
            this.reserved2 = "";
            this.reserved3 = "";
            this.reserved4 = "";
            this.reserved5 = "";
            this.reserved6 = "";
            this.reserved8 = "";
            this.reserved9 = "";
            this.reserved10 = "";
            this.reserved11 = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.expression + "\xFE" +
            this.conversionCode + "\xFE" +
            this.displayName + "\xFE" +
            this.formatSpecification + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2 + "\xFE" +
            this.reserved3 + "\xFE" +
            this.reserved4 + "\xFE" +
            this.reserved5 + "\xFE" +
            this.reserved6 + "\xFE" +
            this.reserved7 + "\xFE" +
            this.reserved8 + "\xFE" +
            this.reserved9 + "\xFE" +
            this.reserved10 + "\xFE" +
            this.reserved11;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictJB_I();
        dict.pos = pos.toString();
        dict.database = "jBASE";
        dict.type = "I";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "expression"))
                dict.expression = values[i].value;
            if (values[i].name == (dict.pos + "conversionCode"))
                dict.conversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "displayName"))
                dict.displayName = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "formatSpecification"))
                dict.formatSpecification = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
            if (values[i].name == (dict.pos + "reserved3"))
                dict.reserved3 = values[i].value;
            if (values[i].name == (dict.pos + "reserved4"))
                dict.reserved4 = values[i].value;
            if (values[i].name == (dict.pos + "reserved5"))
                dict.reserved5 = values[i].value;
            if (values[i].name == (dict.pos + "reserved6"))
                dict.reserved6 = values[i].value;
            if (values[i].name == (dict.pos + "reserved7"))
                dict.reserved7 = values[i].value;
            if (values[i].name == (dict.pos + "reserved8"))
                dict.reserved8 = values[i].value;
            if (values[i].name == (dict.pos + "reserved9"))
                dict.reserved9 = values[i].value;
            if (values[i].name == (dict.pos + "reserved10"))
                dict.reserved10 = values[i].value;
            if (values[i].name == (dict.pos + "reserved11"))
                dict.reserved11 = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail ";
        if (active)
            frm += "tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "expression", "2", "Expression", this.expression);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "conversionCode", "3", "Conversion Code", this.conversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "displayName", "4", "Display Name", this.displayName, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "formatSpecification", "5", "Format Specification", this.formatSpecification, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "6", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "7", "Reserved", this.reserved2, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved3", "8", "Reserved", this.reserved3, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved4", "9", "Reserved", this.reserved4, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved5", "10", "Reserved", this.reserved5, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved6", "11", "Reserved", this.reserved6, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved7", "12", "Reserved", this.reserved7, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved8", "13", "Reserved", this.reserved8, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved9", "14", "Reserved", this.reserved9, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved10", "15", "Reserved", this.reserved10, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved11", "16", "Reserved", this.reserved11, "M", true, true);
        frm += "</div>";
        return frm;
    }
}

export class DictJB_A_S_X {
    pos: string;
    database: string;
    type: string;

    fieldNumber: string;
    columnHeading: string;
    ctrlDeptAttributes: string;
    reserved1: string;
    reserved2: string;
    ioConversionCode: string;
    preConversionCode: string;
    format: string;
    width: string;

    constructor(pos?: string, record?: string, type?: string) {
        this.database = "jBASE";
        if (pos && record) {
            this.pos = pos;
            var lstatts = record.split("\xFE");
            this.type = DictionariesForm.SetField(lstatts[0]);

            this.fieldNumber = DictionariesForm.SetField(lstatts[1]);
            this.columnHeading = DictionariesForm.SetField(lstatts[2]);
            this.ctrlDeptAttributes = DictionariesForm.SetField(lstatts[3]);
            this.reserved1 = DictionariesForm.SetField(lstatts[4]);
            this.reserved2 = DictionariesForm.SetField(lstatts[5]);
            this.ioConversionCode = DictionariesForm.SetField(lstatts[6]);
            this.preConversionCode = DictionariesForm.SetField(lstatts[7]);
            this.format = DictionariesForm.SetField(lstatts[8]);
            this.width = DictionariesForm.SetField(lstatts[9]);
        }
        else if (pos) {
            this.pos = pos;
            this.type = type;

            this.fieldNumber = "";
            this.columnHeading = "";
            this.ctrlDeptAttributes = "";
            this.reserved1 = "";
            this.reserved2 = "";
            this.ioConversionCode = "";
            this.preConversionCode = "";
            this.format = "";
            this.width = "";
        }
    }

    public ToRecord(): string {
        return this.type + "\xFE" +
            this.fieldNumber + "\xFE" +
            this.columnHeading + "\xFE" +
            this.ctrlDeptAttributes + "\xFE" +
            this.reserved1 + "\xFE" +
            this.reserved2 + "\xFE" +
            this.ioConversionCode + "\xFE" +
            this.preConversionCode + "\xFE" +
            this.format + "\xFE" +
            this.width;
    }

    public static FromValues(pos: number, values: any) {
        var dict = new DictJB_A_S_X();
        dict.pos = pos.toString();
        dict.database = "jBASE";
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i].name == (dict.pos + "type"))
                dict.type = values[i].value;
            if (values[i].name == (dict.pos + "fieldNumber"))
                dict.fieldNumber = values[i].value;
            if (values[i].name == (dict.pos + "columnHeading"))
                dict.columnHeading = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "ctrlDeptAttributes"))
                dict.ctrlDeptAttributes = values[i].value;
            if (values[i].name == (dict.pos + "reserved1"))
                dict.reserved1 = values[i].value;
            if (values[i].name == (dict.pos + "reserved2"))
                dict.reserved2 = values[i].value;
            if (values[i].name == (dict.pos + "ioConversionCode"))
                dict.ioConversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "preConversionCode"))
                dict.preConversionCode = values[i].value.split("\n").join(String.fromCharCode(253));
            if (values[i].name == (dict.pos + "format"))
                dict.format = values[i].value;
            if (values[i].name == (dict.pos + "width"))
                dict.width = values[i].value;
        }
        return dict;
    }

    public GetTemplate(id: string, active: boolean): string {
        var frm = "<div class=\"detail ";
        if (active)
            frm += "tab-active";
        frm += "\" id=\"tab" + this.pos + "\"";
        if (!active)
            frm += " style=\"display:none\"";
        frm += " >";
        frm += DictionariesForm.getIdTemplate(id);
        frm += DictionariesForm.getFieldTemplate(this.pos + "type", "1", "Type", this.type, "M", true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "fieldNumber", "2", "Field Number", this.fieldNumber);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "columnHeading", "3", "Column Heading", this.columnHeading, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "ctrlDeptAttributes", "4", "Controlling/Dependent Attributes", this.ctrlDeptAttributes);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved1", "5", "Reserved", this.reserved1, "M", true, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "reserved2", "6", "Reserved", this.reserved2, "M", true, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "ioConversionCode", "7", "I/O Conversion Code", this.ioConversionCode, true);
        frm += DictionariesForm.getTextAreaTemplate(this.pos + "preConversionCode", "8", "Pre Conversion Code", this.preConversionCode, true);
        frm += DictionariesForm.getFieldTemplate(this.pos + "format", "9", "Format", this.format);
        frm += DictionariesForm.getFieldTemplate(this.pos + "width", "10", "Width", this.width);
        frm += "</div>";
        return frm;
    }
}

export class DictionariesForm {

    constructor(private mainContext: vscode.ExtensionContext, private connection: Connection) {

    }

    load(fileName: string) {
        var lstItems = [];
        var title = "Dictionaries: " + fileName;

        var dictsTemplate;
        var detailsTemplate;
        //READ
        var error = "";
        var dataCmd = { FILE_NAME: fileName, CUSTOM_VARS: "", OUTPUT_FORMAT: "MV" };
        var resp = Utilities.requestJson(this.connection.name, this.connection.GetURL(), this.connection.apikey, "dictionaries", dataCmd);
        if (resp && resp.COMMAND) {
            var lkdata = new LkData(resp.COMMAND);
            error = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
        }
        else
            vscode.window.showErrorMessage("Unexpected error");
        if (error) {
            vscode.window.showErrorMessage(error);
        }
        else {
            dictsTemplate = this.getDictList(lkdata);
            var ids = lkdata.OutputDataElements.get(LkData.RECORD_ID_KEY);
            var records = lkdata.OutputDataElements.get(LkData.RECORD_KEY);
            detailsTemplate = "";
            if (ids && records) {
                var lstids = ids.split("\x1E");
                var lstrecords = records.split("\x1E");
                if (lstids.length > 0 && lstrecords.length > 0) {
                    var i;
                    for (i = 0; i < lstrecords.length; i++) {
                        var validType = true;
                        switch (this.connection.database) {
                            case "QM":
                                if (lstrecords[i].toUpperCase().startsWith("D")) {
                                    var dictQMD = new DictQM_D(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictQMD.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("I")) {
                                    var dictQMI = new DictQM_I(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictQMI.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("A") || lstrecords[i].toUpperCase().startsWith("S")) {
                                    var dictQMA = new DictQM_A_S(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictQMA.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("C")) {
                                    var dictQMC = new DictQM_C(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictQMC.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("E")) {
                                    var dictQME = new DictQM_E(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictQME.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("L")) {
                                    var dictQML = new DictQM_L(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictQML.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("PH")) {
                                    var dictQMPH = new DictQM_PH(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictQMPH.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("X")) {
                                    var dictQMX = new DictQM_X(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictQMX.GetTemplate(lstids[i], i == 0);
                                }
                                else
                                    validType = false;
                                break;
                            case "D3":
                                if (lstrecords[i].toUpperCase().startsWith("A") || lstrecords[i].toUpperCase().startsWith("S") || lstrecords[i].toUpperCase().startsWith("X")) {
                                    var dictD3 = new DictD3_A_S_X(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictD3.GetTemplate(lstids[i], i == 0);
                                }
                                else
                                    validType = false;
                                break;
                            case "Universe":
                                if (lstrecords[i].toUpperCase().startsWith("D")) {
                                    var dictUVD = new DictUV_D(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictUVD.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("I")) {
                                    var dictUVI = new DictUV_I(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictUVI.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("A") || lstrecords[i].startsWith("S")) {
                                    var dictUVA = new DictUV_A_S(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictUVA.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("PH")) {
                                    var dictUVPH = new DictUV_PH(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictUVPH.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("X")) {
                                    var dictUVX = new DictUV_X(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictUVX.GetTemplate(lstids[i], i == 0);
                                }
                                else
                                    validType = false;
                                break;
                            case "Unidata":
                                if (lstrecords[i].toUpperCase().startsWith("D")) {
                                    var dictUDD = new DictUD_D(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictUDD.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("I") || lstrecords[i].toUpperCase().startsWith("V")) {
                                    var dictUDI = new DictUD_I_V(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictUDI.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("PH")) {
                                    var dictUDPH = new DictUD_PH(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictUDPH.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("X")) {
                                    var dictUDX = new DictUD_X(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictUDX.GetTemplate(lstids[i], i == 0);
                                }
                                else
                                    validType = false;
                                break;
                            case "mvBASE":
                                if (lstrecords[i].toUpperCase().startsWith("A") || lstrecords[i].toUpperCase().startsWith("S") || lstrecords[i].toUpperCase().startsWith("I") || lstrecords[i].toUpperCase().startsWith("X")) {
                                    var dictMB = new DictMB_A_S_I_X(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictMB.GetTemplate(lstids[i], i == 0);
                                }
                                break;
                            case "jBASE":
                                if (lstrecords[i].toUpperCase().startsWith("D")) {
                                    var dictJBD = new DictJB_D(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictJBD.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("I")) {
                                    var dictJBI = new DictJB_I(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictJBI.GetTemplate(lstids[i], i == 0);
                                }
                                else if (lstrecords[i].toUpperCase().startsWith("A") || lstrecords[i].toUpperCase().startsWith("S") || lstrecords[i].toUpperCase().startsWith("X")) {
                                    var dictJBA = new DictJB_A_S_X(i.toString(), lstrecords[i]);
                                    detailsTemplate += dictJBA.GetTemplate(lstids[i], i == 0);
                                }
                                else
                                    validType = false;
                                break;
                            default:
                                validType = false;
                                break;
                        }
                        if (validType)
                            lstItems.push({ id: lstids[i], pos: i, tabname: "tab" + i.toString(), values: "", isdeleted: false, isnew: false, originalRecord: lstrecords[i] });
                    }
                }
            }

        }

        const panel = vscode.window.createWebviewPanel(
            'dictionariesForm',
            title,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(this.mainContext.extensionPath, 'html', 'css')), vscode.Uri.file(path.join(this.mainContext.extensionPath, 'html', 'js'))]
            }
        );

        const filePath: vscode.Uri = vscode.Uri.file(path.join(this.mainContext.extensionPath, 'html', 'dictionariesPage.html'));
        var str = fs.readFileSync(filePath.fsPath, 'utf8');

        str = str.replace("[%DICTS%]", dictsTemplate);
        str = str.replace("[%DETAIL%]", detailsTemplate);

        var typeOptionsLabel = "Type";
        var typeOptions = "";
        switch (this.connection.database) {
            case "QM":
                typeOptions += "<option value=\"D\" selected>D</option>";
                typeOptions += "<option value=\"I\">I</option>";
                typeOptions += "<option value=\"A\">A</option>";
                typeOptions += "<option value=\"S\">S</option>";
                typeOptions += "<option value=\"C\">C</option>";
                typeOptions += "<option value=\"E\">E</option>";
                typeOptions += "<option value=\"L\">L</option>";
                typeOptions += "<option value=\"PH\">PH</option>";
                typeOptions += "<option value=\"X\">X</option>";
                break;
            case "D3":
                typeOptionsLabel = "Dictionary Code";
                typeOptions += "<option value=\"A\" selected>A</option>";
                typeOptions += "<option value=\"S\">S</option>";
                typeOptions += "<option value=\"X\">X</option>";
                break;
            case "Universe":
                typeOptions += "<option value=\"D\" selected>D</option>";
                typeOptions += "<option value=\"I\">I</option>";
                typeOptions += "<option value=\"A\">A</option>";
                typeOptions += "<option value=\"S\">S</option>";
                typeOptions += "<option value=\"PH\">PH</option>";
                typeOptions += "<option value=\"X\">X</option>";
                break;
            case "Unidata":
                typeOptions += "<option value=\"D\" selected>D</option>";
                typeOptions += "<option value=\"I\">I</option>";
                typeOptions += "<option value=\"V\">V</option>";
                typeOptions += "<option value=\"PH\">PH</option>";
                typeOptions += "<option value=\"X\">X</option>";
                break;
            case "mvBASE":
                typeOptionsLabel = "Definition Code";
                typeOptions += "<option value=\"A\" selected>A</option>";
                typeOptions += "<option value=\"S\">S</option>";
                typeOptions += "<option value=\"I\">I</option>";
                typeOptions += "<option value=\"X\">X</option>";
                break;
            case "jBASE":
                typeOptions += "<option value=\"D\" selected>D</option>";
                typeOptions += "<option value=\"I\">I</option>";
                typeOptions += "<option value=\"A\">A</option>";
                typeOptions += "<option value=\"S\">S</option>";
                typeOptions += "<option value=\"X\">X</option>";
                break;
        }
        str = str.replace("[%TYPE_OPTIONS_LABEL%]", typeOptionsLabel);
        str = str.replace("[%TYPE_OPTIONS%]", typeOptions);

        var jquery = "";

        let jqueryPath = vscode.Uri.file(path.join(this.mainContext.extensionPath, 'html', 'js', 'jquery-3.5.1.min.js')).with({
            scheme: "vscode-resource"
        }).toString();
        jquery += `<script type="text/javascript" src="${jqueryPath}"></script>`;

        str = str.replace("[%JQUERY%]", jquery);

        panel.webview.html = str.replace("[%TITLE%]", title);

        var data = { fileName: fileName, items: lstItems };
        panel.webview.postMessage(data);

        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'notyet':
                        vscode.window.showInformationMessage("Not yet implemented");
                        return;
                    case 'showerror':
                        var errormsg = message.text;
                        vscode.window.showErrorMessage(errormsg);
                        return;
                    case 'create':
                        var createdata = message.data;
                        var createError;
                        var template = "";
                        var lastpos = 0;
                        var itemindex = 0;
                        for (itemindex = 0; itemindex < createdata.filedata.items.length; itemindex++) {
                            if (lastpos < createdata.filedata.items[itemindex].pos)
                                lastpos = createdata.filedata.items[itemindex].pos;
                            if (createdata.filedata.items[itemindex].id == createdata.id)
                                createError = "Duplicated ID: " + createdata.id;
                        }
                        lastpos++;
                        if (createError) {
                            vscode.window.showErrorMessage(createError);
                        }
                        else {
                            var validType = true;
                            switch (this.connection.database) {
                                case "QM":
                                    if (createdata.type.toUpperCase().startsWith("D")) {
                                        var dictQMD = new DictQM_D(lastpos.toString());
                                        template = dictQMD.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("I")) {
                                        var dictQMI = new DictQM_I(lastpos.toString());
                                        template = dictQMI.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("A") || createdata.type.toUpperCase().startsWith("S")) {
                                        var dictQMA = new DictQM_A_S(lastpos.toString(), undefined, createdata.type);
                                        template = dictQMA.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("C")) {
                                        var dictQMC = new DictQM_C(lastpos.toString());
                                        template = dictQMC.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("E")) {
                                        var dictQME = new DictQM_E(lastpos.toString());
                                        template = dictQME.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("L")) {
                                        var dictQML = new DictQM_L(lastpos.toString());
                                        template = dictQML.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("PH")) {
                                        var dictQMPH = new DictQM_PH(lastpos.toString());
                                        template = dictQMPH.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("X")) {
                                        var dictQMX = new DictQM_X(lastpos.toString());
                                        template = dictQMX.GetTemplate(createdata.id, false);
                                    }
                                    else
                                        validType = false;
                                    break;
                                case "D3":
                                    if (createdata.type.toUpperCase().startsWith("A") || createdata.type.toUpperCase().startsWith("S") || createdata.type.toUpperCase().startsWith("X")) {
                                        var dictD3 = new DictD3_A_S_X(lastpos.toString(), undefined, createdata.type);
                                        template = dictD3.GetTemplate(createdata.id, false);
                                    }
                                    else
                                        validType = false;
                                    break;
                                case "Universe":
                                    if (createdata.type.toUpperCase().startsWith("D")) {
                                        var dictUVD = new DictUV_D(lastpos.toString());
                                        template = dictUVD.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("I")) {
                                        var dictUVI = new DictUV_I(lastpos.toString());
                                        template = dictUVI.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("A") || createdata.type.toUpperCase().startsWith("S")) {
                                        var dictUVA = new DictUV_A_S(lastpos.toString(), undefined, createdata.type);
                                        template = dictUVA.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("PH")) {
                                        var dictUVPH = new DictUV_PH(lastpos.toString());
                                        template = dictUVPH.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("X")) {
                                        var dictUVX = new DictUV_X(lastpos.toString());
                                        template = dictUVX.GetTemplate(createdata.id, false);
                                    }
                                    else
                                        validType = false;
                                    break;
                                case "Unidata":
                                    if (createdata.type.toUpperCase().startsWith("D")) {
                                        var dictUDD = new DictUD_D(lastpos.toString());
                                        template = dictUDD.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("I") || createdata.type.toUpperCase().startsWith("V")) {
                                        var dictUDI = new DictUD_I_V(lastpos.toString(), undefined, createdata.type);
                                        template = dictUDI.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("PH")) {
                                        var dictUDPH = new DictUD_PH(lastpos.toString());
                                        template = dictUDPH.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("X")) {
                                        var dictUDX = new DictUD_X(lastpos.toString());
                                        template = dictUDX.GetTemplate(createdata.id, false);
                                    }
                                    else
                                        validType = false;
                                    break;
                                case "mvBASE":
                                    if (createdata.type.toUpperCase().startsWith("A") || createdata.type.toUpperCase().startsWith("S") || createdata.type.toUpperCase().startsWith("I") || createdata.type.toUpperCase().startsWith("X")) {
                                        var dictMBA = new DictMB_A_S_I_X(lastpos.toString(), undefined, createdata.type);
                                        template = dictMBA.GetTemplate(createdata.id, false);
                                    }
                                    else
                                        validType = false;
                                    break;
                                case "jBASE":
                                    if (createdata.type.toUpperCase().startsWith("D")) {
                                        var dictJBD = new DictJB_D(lastpos.toString());
                                        template = dictJBD.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("I")) {
                                        var dictJBI = new DictJB_D(lastpos.toString());
                                        template = dictJBI.GetTemplate(createdata.id, false);
                                    }
                                    else if (createdata.type.toUpperCase().startsWith("A") || createdata.type.toUpperCase().startsWith("S") || createdata.type.toUpperCase().startsWith("X")) {
                                        var dictJBA = new DictJB_A_S_X(lastpos.toString(), undefined, createdata.type);
                                        template = dictJBA.GetTemplate(createdata.id, false);
                                    }
                                    else
                                        validType = false;
                                    break;
                                default:
                                    validType = false;
                                    break;
                            }
                            if (validType) {
                                var tempDict = this.getDict(createdata.id, lastpos, true);
                                createdata.filedata.items.push({ id: createdata.id, pos: lastpos, tabname: "tab" + lastpos.toString(), values: "", isdeleted: false, isnew: true });
                                var tempdata = { template: template, menu: tempDict, select: "tab" + lastpos.toString(), filedata: createdata.filedata };
                                panel.webview.postMessage(tempdata);
                            }
                            else
                                vscode.window.showErrorMessage("Invalid Dictionary Type");
                        }
                        return;
                    case 'save':
                        var filedata = message.data;
                        var saveErrors = this.SaveChanges(filedata);
                        if (saveErrors) {
                            vscode.window.showErrorMessage(saveErrors);
                        }
                        else {
                            vscode.window.showInformationMessage("SAVED CORRECTLY: " + filedata.fileName + "!");
                        }
                        panel.dispose();
                        this.load(filedata.fileName);
                        return;
                    case 'equate':
                        var filedata = message.data;
                        var equates = "";
                        var i;
                        for (i = 0; i < filedata.items.length; i++) {
                            var j;
                            var att1 = "";
                            var att2 = "";
                            var att8 = "";
                            for (j = 0; j < filedata.items[i].values.length; j++) {
                                var attr = filedata.items[i].values[j];
                                switch (attr.number) {
                                    case "1": att1 = attr.value; break;
                                    case "2": att2 = attr.value; break;
                                    case "8": att8 = attr.value; break;
                                }
                            }
                            if (att1 && att2 && (att1.toUpperCase() == "D" || (att1.toUpperCase() == "A" && !att8))) {
                                var num = Number(att2);
                                if (!isNaN(num) && num != 0 && num != 9998 && num != 9999) {
                                    var eq = "equate " + filedata.fileName + "." + filedata.items[i].id + "to    " + att2;
                                    if (equates)
                                        equates += "\r\n" + eq;
                                    else
                                        equates = eq;
                                }
                            }
                        }

                        if (equates) {
                            var lines = equates.split("\r\n");
                            var maxlen = 0;
                            var i;
                            for (i = 0; i < lines.length; i++) {
                                var init = lines[i].substring(0, lines[i].lastIndexOf("to"));
                                if (init.length > maxlen)
                                    maxlen = init.length;
                            }
                            maxlen++;
                            for (i = 0; i < lines.length; i++) {
                                var init = lines[i].substring(0, lines[i].lastIndexOf("to"));
                                var end = lines[i].substring(lines[i].lastIndexOf("to"));
                                var spaces = "";
                                var j;
                                for (j = 0; j < (maxlen - init.length); j++) {
                                    spaces += " ";
                                }
                                lines[i] = init + spaces + end;
                            }
                            equates = lines.join("\r\n");
                            vscode.workspace.openTextDocument({
                                language: "plaintext",
                                content: equates,
                            }).then(document => { vscode.window.showTextDocument(document); });
                        }
                        return;
                    case 'exit':
                        panel.dispose();
                        return;
                    case 'discard':
                        var filedata = message.data;
                        panel.dispose();
                        this.load(filedata.fileName);
                        return;
                }
            },
            undefined,
            this.mainContext.subscriptions
        );
    }

    getDictList(lkdata: LkData): string {
        var template = "";
        var ids = lkdata.OutputDataElements.get(LkData.RECORD_ID_KEY);
        var records = lkdata.OutputDataElements.get(LkData.RECORD_KEY);
        if (ids) {
            var lstids = ids.split("\x1E");
            var lstrecords = records.split("\x1E");
            var i;
            for (i = 0; i < lstids.length; i++) {
                var id = lstids[i];
                var fieldNumber = undefined;
                if (lstrecords[i]) {
                    var lstattrs = lstrecords[i].split("\xFE");
                    if (lstattrs[1]) {
                        var num = Number(lstattrs[1]);
                        if (!isNaN(num))
                            fieldNumber = lstattrs[1];
                    }
                }
                template += this.getDict(id, i, false, fieldNumber);
            }
        }
        return template;
    }

    getDict(id: string, pos: number, isnew?: boolean, fieldNumber?: string): string {
        var template = "";

        template += "<a id=\"menu-tab" + pos.toString() + "\" class=\"dict-menu-item";
        if (pos == 0)
            template += " active";
        if (isnew)
            template += " new";
        template += "\" href=\"javascript:void(0);\" onfocus=\"Navigate('tab" + pos.toString() + "');\" title=\"" + id + "\">" + id +
            "<span class=\"delete\" onclick=\"Delete('" + id + "')\"></span>" +
            (fieldNumber ? "<span style=\"float:right; margin-right:5px; margin-left:5px\">" + fieldNumber + "</span>" : "") +
            "</a>";

        return template;
    }

    static getFieldTemplate(name: string, index: string, description: string, value: string, fieldLength?: string, disabled?: boolean, hidden?: boolean) {
        let re = /\"/gi;
        value = value.replace(re, "&quot;");
        var realLength = "max-width: 300px";
        if (fieldLength == "L")
            realLength = "max-width: 450px;width: 95%";
        return "<div style=\"" + (hidden ? "display:none" : "") + "\">" +
            "<label style=\"width:20px;margin:5px\">" + index + "</label><label for=\"" + name + "\" style=\"min-width: 150px;margin:5px\">" + description + "</label>" +
            "<input type=\"text\" class=\"form-control attnumber-" + index + "\" id=\"" + name + "\" name=\"" + name + "\" value=\"" + value + "\" style=\"display: inline-block;" + realLength + ";margin:5px;\" " +
            (disabled ? "disabled" : "") +
            "/>" +
            "</div>";
    }

    static getTextAreaTemplate(name: string, index: string, description: string, value: string, isMv?: boolean, disabled?: boolean) {
        var finalValue;
        if (isMv)
            finalValue = value.split(String.fromCharCode(253)).join("\n");
        else
            finalValue = value;
        return "<div>" +
            "<label style=\"width:20px;margin:5px;vertical-align: top;\">" + index + "</label><label for=\"" + name + "\" style=\"min-width: 150px;margin:5px;vertical-align: top;\">" + description + "</label>" +
            "<textarea class=\"form-control attnumber-" + index + "\" id=\"" + name + "\" name=\"" + name + "\" style=\"display: inline-block;max-width: 450px;width: 95%;margin:5px;\" " +
            (disabled ? "disabled" : "") +
            ">" + finalValue + "</textarea>" +
            "</div>";
    }

    static getIdTemplate(id: string) {
        return "<div class=\"form-group\">" +
            "<label style=\"width:20px;margin:5px\"></label><label style=\"min-width: 150px;margin:5px\">ID</label>" +
            "<span style=\"display: inline-block;width: 300px;margin:5px;\">" + id + "</span>" +
            "</div>"
    }

    SaveChanges(filedata: any): string {
        var errors = "";
        var deletedIds;
        var deletedORs;
        var newIds;
        var newRecords;
        var updatedIds;
        var updatedRecords;
        var updatedORs;
        var iindex;
        for (iindex = 0; iindex < filedata.items.length; iindex++) {
            if (filedata.items[iindex].isdeleted) {
                if (deletedIds) {
                    deletedIds += "\x1E" + filedata.items[iindex].id;
                    deletedORs += "\x1E" + filedata.items[iindex].originalRecord;
                }
                else {
                    deletedIds = filedata.items[iindex].id;
                    deletedORs = filedata.items[iindex].originalRecord;
                }
            }
            else {
                var type = filedata.items[iindex].values[0];
                var record = "";
                var validType = true;
                switch (this.connection.database) {
                    case "QM":
                        if (type.value.toUpperCase().startsWith("D")) {
                            var dictQMD = DictQM_D.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictQMD.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("I")) {
                            var dictQMI = DictQM_I.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictQMI.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("A") || type.value.toUpperCase().startsWith("S")) {
                            var dictQMA = DictQM_A_S.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictQMA.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("C")) {
                            var dictQMC = DictQM_C.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictQMC.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("E")) {
                            var dictQME = DictQM_E.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictQME.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("L")) {
                            var dictQML = DictQM_L.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictQML.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("PH")) {
                            var dictQMPH = DictQM_PH.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictQMPH.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("X")) {
                            var dictQMX = DictQM_X.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictQMX.ToRecord();
                        }
                        else
                            validType = false;
                        break;
                    case "D3":
                        if (type.value.toUpperCase().startsWith("A") || type.value.toUpperCase().startsWith("S") || type.value.toUpperCase().startsWith("X")) {
                            var dictD3A = DictD3_A_S_X.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictD3A.ToRecord();
                        }
                        else
                            validType = false;
                        break;
                    case "Universe":
                        if (type.value.toUpperCase().startsWith("D")) {
                            var dictUVD = DictUV_D.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictUVD.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("I")) {
                            var dictUVI = DictUV_I.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictUVI.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("A") || type.value.toUpperCase().startsWith("S")) {
                            var dictUVA = DictUV_A_S.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictUVA.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("PH")) {
                            var dictUVPH = DictUV_PH.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictUVPH.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("X")) {
                            var dictUVX = DictUV_X.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictUVX.ToRecord();
                        }
                        else
                            validType = false;
                        break;
                    case "Unidata":
                        if (type.value.toUpperCase().startsWith("D")) {
                            var dictUDD = DictUD_D.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictUDD.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("I") || type.value.toUpperCase().startsWith("V")) {
                            var dictUDI = DictUD_I_V.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictUDI.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("PH")) {
                            var dictUDPH = DictUD_PH.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictUDPH.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("X")) {
                            var dictUDX = DictUD_X.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictUDX.ToRecord();
                        }
                        else
                            validType = false;
                        break;
                    case "mvBASE":
                        if (type.value.toUpperCase().startsWith("A") || type.value.toUpperCase().startsWith("S") || type.value.toUpperCase().startsWith("I") || type.value.toUpperCase().startsWith("X")) {
                            var dictMBA = DictMB_A_S_I_X.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictMBA.ToRecord();
                        }
                        else
                            validType = false;
                        break;
                    case "jBASE":
                        if (type.value.toUpperCase().startsWith("D")) {
                            var dictJBD = DictJB_D.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictJBD.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("I")) {
                            var dictJBI = DictJB_D.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictJBI.ToRecord();
                        }
                        else if (type.value.toUpperCase().startsWith("A") || type.value.toUpperCase().startsWith("S") || type.value.toUpperCase().startsWith("X")) {
                            var dictJBA = DictJB_A_S_X.FromValues(filedata.items[iindex].pos, filedata.items[iindex].values);
                            record = dictJBA.ToRecord();
                        }
                        else
                            validType = false;
                        break;
                    default:
                        validType = false;
                        break;
                }
                if (filedata.items[iindex].isnew) {
                    if (newIds) {
                        newIds += "\x1E" + filedata.items[iindex].id;
                        newRecords += "\x1E" + record;
                    }
                    else {
                        newIds = filedata.items[iindex].id;
                        newRecords = record;
                    }
                }
                else {
                    if (record.localeCompare(filedata.items[iindex].originalRecord) != 0) {
                        if (updatedIds) {
                            updatedIds += "\x1E" + filedata.items[iindex].id;
                            updatedRecords += "\x1E" + record;
                            updatedORs += "\x1E" + filedata.items[iindex].originalRecord;
                        }
                        else {
                            updatedIds = filedata.items[iindex].id;
                            updatedRecords = record;
                            updatedORs = filedata.items[iindex].originalRecord;
                        }
                    }
                }
            }

        }

        var error = "";
        //DELETE
        if (deletedIds) {
            var deletedBuffer = Buffer.from(deletedIds + "\x1C" + deletedORs).toString('base64');
            var deleteCmd = { OPTIMISTIC_LOCK: "False", RECOVER_RECORD_ID_TYPE: "NONE", CUSTOM_VARS: "", INPUT_FORMAT: "MV", OUTPUT_FORMAT: "MV", FILE_NAME: "DICT " + filedata.fileName, RECORDS: deletedBuffer };
            var resp = Utilities.requestJson(this.connection.name, this.connection.GetURL(), this.connection.apikey, "delete", deleteCmd);
            if (resp && resp.COMMAND) {
                var lkdata = new LkData(resp.COMMAND);
                var err = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
                if (err)
                    error += err + "\r\n";
            }
            else
                error += "Unexpected error\r\n";
        }

        //NEW
        if (newIds) {
            var newBuffer = Buffer.from(newIds + "\x1C" + newRecords).toString('base64');
            var newCmd = { NEW_RECORD_ID_TYPE: "NONE", CUSTOM_VARS: "", INPUT_FORMAT: "MV", OUTPUT_FORMAT: "MV", FILE_NAME: "DICT " + filedata.fileName, RECORDS: newBuffer };
            var resp = Utilities.requestJson(this.connection.name, this.connection.GetURL(), this.connection.apikey, "new", newCmd);
            if (resp && resp.COMMAND) {
                var lkdata = new LkData(resp.COMMAND);
                var err = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
                if (err)
                    error += err + "\r\n";
            }
            else
                error += "Unexpected error\r\n";
        }

        //UPDATE
        if (updatedIds) {
            var updatedBuffer = Buffer.from(updatedIds + "\x1C" + updatedRecords + "\x1C" + updatedORs).toString('base64');
            var updateCmd = { OPTIMISTIC_LOCK: "False", INPUT_FORMAT: "MV", OUTPUT_FORMAT: "MV", FILE_NAME: "DICT " + filedata.fileName, RECORDS: updatedBuffer };
            var resp = Utilities.requestJson(this.connection.name, this.connection.GetURL(), this.connection.apikey, "update", updateCmd);
            if (resp && resp.COMMAND) {
                var lkdata = new LkData(resp.COMMAND);
                var err = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
                if (err)
                    error += err + "\r\n";
            }
            else
                error += "Unexpected error\r\n";
        }

        return errors;
    }

    static SetField(field?: string): string {
        if (field)
            return field;
        else
            return "";
    }

}
