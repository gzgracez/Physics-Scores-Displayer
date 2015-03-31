function textByStudent(){
  var spreadsheet = SpreadsheetApp.openById("1Zg9iM9QKHmsKKlNlfrk_JId9J3ziRXiVxiSDD__df8M");
  var origSheet = spreadsheet.getSheets()[1];
  var origRange = origSheet.getDataRange();
  var origValues = origRange.getValues();
  var origRows = origRange.getNumRows();
  
  var sSpreadsheet = SpreadsheetApp.openById("1X2yqkhiZ-SIzF_igEzKvn0dRp6bV9QOWxsglW9-nt2k");
  var sSheet = spreadsheet.getSheets()[0];
  var sRange = origSheet.getDataRange();
  var sValues = origRange.getValues();
  var sRows = origRange.getNumRows();
  
  var studentNames=[];
  var studentDivs=[];
  
  var tempRowStart=0;
  for (var i=0; i<origRows; i++){
    if (origValues[i][0]=="###"){
      studentNames.push(origValues[i+1][0]);
      studentDivs.push(i-2);
      studentDivs.push(i+4);
    }
  }
  studentDivs.push(sRows-1);
  studentDivs.splice(0,1);
  for (var i=0; i<studentNames.length; i++){
    if (sSpreadsheet.getSheetByName(studentNames[i])==null){
      sSpreadsheet.insertSheet().setName(studentNames[i]);
    }
  }
  
  for (var i=0; i<studentNames.length; i++){
    var range=sSpreadsheet.getSheetByName(studentNames[i]).getRange(1,1,(studentDivs[i*2+1]-studentDivs[i*2]+1));
    var tempRange=origSheet.getRange(studentDivs[i*2]+1,1,(studentDivs[i*2+1]-studentDivs[i*2]+1));
    var tempValues=tempRange.getValues();
    range.setValues(tempValues);
  }
}

function allStudents(){//Run this function! Will generate sheets for all students at once!
  textByStudent();
  var spreadsheet = SpreadsheetApp.openById("1X2yqkhiZ-SIzF_igEzKvn0dRp6bV9QOWxsglW9-nt2k");
  var numSheets = spreadsheet.getNumSheets();
  var names=[];
  for (var i=1; i<numSheets; i++){
    names.push(spreadsheet.getSheets()[i].getSheetName());
  }
  for (i in names){
    myFunction(names[i]);
  }
}

function myFunction(studentName) {
  var q1 = new Date(2014, 10, 10);
  var q2 = new Date(2015, 0, 20);
  var q3 = new Date(2015, 3, 13);
  
  var spreadsheet = SpreadsheetApp.openById("1X2yqkhiZ-SIzF_igEzKvn0dRp6bV9QOWxsglW9-nt2k");
  var origSheet = spreadsheet.getSheets()[0];
  var origRange = origSheet.getDataRange();
  var origValues = origRange.getValues();
  var origRows = origRange.getNumRows();
  var origCols = origRange.getNumColumns();
  var origFontRange = origSheet.getRange("A10:A55");
  var origFonts = origFontRange.getFontWeights();
  
  var studentSheet =  spreadsheet.getSheetByName(studentName);
  var sRange = studentSheet.getDataRange();
  var sValues = sRange.getValues();
  var sRows = sRange.getNumRows();
  var sCols = sRange.getNumColumns();
  
  var scoreSpreadsheet = SpreadsheetApp.openById("16H910KQjeWMM0kCfK2LhCaj0DqAFji6-AueJBo8fRr8");
  if (scoreSpreadsheet.getSheetByName(studentSheet.getName() + " Scores")==null){
    origSheet.copyTo(scoreSpreadsheet).setName(studentSheet.getName() + " Scores");
  }
  var sScoreSheet=scoreSpreadsheet.getSheetByName(studentSheet.getName() + " Scores");
  var colorRange = sScoreSheet.getRange("B10:M55");
  var bgColors = colorRange.getBackgrounds();
  var fullScoreValues=sScoreSheet.getDataRange().getValues();
  var scoreValues = sScoreSheet.getRange("B10:M55").getValues();
  
  var objectives = [];
  var proficiencies = [];//dates & # of 2's
  
  Logger.log(origRows);
  for (var i=0; i<origRows-17; i++) {
    if (origFonts[i][0]=="normal"){
      objectives.push(origValues[i+9][0].split(" ")[0]);
    }
  }
  
  for (var i=0; i<objectives.length; i++){
    proficiencies.push([]);
  }
  
  var tempObjective=sValues[1][0].split(" ")[0];
  var tempIndex=objectives.indexOf(tempObjective);
  for (var r=2; r<sRows; r++){
    if (sValues[r][0]==""){
      tempObjective=sValues[r+2][0].split(" ")[0];
      tempIndex=objectives.indexOf(tempObjective);
      r+=2;
    }
    else{
      if (sValues[r][0].split(": ")[1]==2){
        var tempQuizNumberBeforeColon=sValues[r][0].split(": ")[0].split(" ");
        var tempQuizNumber=tempQuizNumberBeforeColon[tempQuizNumberBeforeColon.length-1];
        proficiencies[tempIndex].push(tempQuizNumber);
      }
    }
  }
  
  for (var i=0; i<bgColors.length; i++) {
   var sTempObjective=fullScoreValues[i+9][0].split(" ")[0];
   for (var j in bgColors[i]) {
     if (bgColors[i][j]=="#cfe2f3"){
       var objectivesRow=objectives.indexOf(sTempObjective);
       if (proficiencies[objectivesRow].length!=0){
           scoreValues[i][j]=proficiencies[objectivesRow][proficiencies[objectivesRow].length-1];
           proficiencies[objectivesRow].splice(proficiencies[objectivesRow].length-1,proficiencies[objectivesRow].length);
       }
       else {
           scoreValues[i][j]="";
       }
     }
   }
  }
  colorRange.setNumberFormat('@STRING@').setHorizontalAlignment("center").setVerticalAlignment("middle");
  colorRange.setValues(scoreValues);
  var nameRange=sScoreSheet.getRange("A2");
  nameRange.setValue(studentName);
};
