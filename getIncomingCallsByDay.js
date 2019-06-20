function getIncomingCallsByDay() {
  var spreadsheet = SpreadsheetApp.getActive();
  // specify which sheet and from what cells you want to take the date and year. If left blank, the program will assume 
  // the current value of each element
  // ensure that all referenced sheets here actually exist 

  var ss = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Sheet1'), true);
  var year = ss.getRange('A1').getValue();
  var month = ss.getRange('A2').getValue();
  var day = ss.getRange('A3').getValue();

  // enter the relevant URL & API Key. You can also add additional constraints such as time for each day
  // the API will only send back data for a single day at the most 
  var response = UrlFetchApp.fetch(
    "https://api.placetel.de/api/getIncomingCallsByDay.json",
    {
      method: "post",
      payload: {
        'year' : year,
        'month' : month,
        'day' : day,
        'api_key' :
          "Your_API_Key"
      }
    }
  );

  var body = response.getContentText();
  var spreadsheet = SpreadsheetApp.getActive();

  // set the output sheet 
  var ss = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Sheet2'), true);
  var data = JSON.parse(body);
  Logger.log(data);

  // the get range command defines which row and then which column to put the data in. 
  // first line is the header
  ss.getRange(6, 1).setValue("To Number");
  ss.getRange(6, 2).setValue("From Number");
  ss.getRange(6, 3).setValue("Date");
  ss.getRange(6, 4).setValue("Typ");
  
  // this is the actual data outputted. 
  // second data point in the getRange defines which output is mapped to what header 
  // increase i by 1 more than the header so that the program does not overwrite data (also i starts at 0 so at least + 1)
  for (var i = 0; i < data.length; i++) {
    ss.getRange(i + 7, 1, 1).setValue(data[i].toNumber);
    ss.getRange(i + 7, 2, 1).setValue(data[i].fromNumber);
    ss.getRange(i + 7, 3, 1).setValue(data[i].received_at);
    ss.getRange(i + 7, 4, 1).setValue(data[i].callType);
  }
  
  // not necessary but if you want the view to switch to another sheet after completion 
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Sheet1'), true);
}