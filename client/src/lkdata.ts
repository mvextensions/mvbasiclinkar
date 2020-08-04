export class LkData {

  public static TOTAL_RECORDS: string = "TOTAL_RECORDS";
  public static RECORD_ID_KEY: string = "RECORD_ID";
  public static RECORD_KEY: string = "RECORD";
  public static CALCULATED_KEY: string = "CALCULATED";
  public static RECORD_DICTS_KEY: string = "RECORD_DICTS";
  public static RECORD_ID_DICTS_KEY: string = "RECORD_ID_DICTS";
  public static CALCULATED_DICTS_KEY: string = "CALCULATED_DICTS";
  public static DICTIONARIES_ID_KEY: string = "DICTIONARIES_ID";
  public static DICTIONARIES_KEY: string = "DICTIONARIES";
  public static ARGUMENTS_KEY: string = "ARGUMENTS";
  public static ORIGINAL_RECORD_KEY: string = "ORIGINAL_RECORD_KEY";
  public static FORMAT_KEY: string = "FORMAT";
  public static CONVERSION_KEY: string = "CONVERSION";
  public static CAPTURING_KEY: string = "CAPTURING";
  public static RETURNING_KEY: string = "RETURNING";
  public static ROWHEADERS_KEY: string = "ROWHEADERS";
  public static ERRORS_KEY: string = "ERRORS";

  OutputData: string = "";
  OutputDataElements: Map<string, string> = new Map<string, string>();
  ThisList: string[] = [];

  constructor(outputData: string) {
    if (outputData) {
      this.OutputData = Buffer.from(outputData, 'base64').toString()
      var parts = this.OutputData.split("\x1C");
      if (parts.length >= 1) {
        this.ThisList = parts[0].split('\xFE');
        var i = 0;
        for (i = 0; i < this.ThisList.length; i++)
          this.OutputDataElements.set(this.ThisList[i], parts[i]);
      }
    }
  }

}