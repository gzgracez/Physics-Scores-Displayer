function myFunction() {
  var q1 = new Date(2014, 10, 10);
  var q2 = new Date(2015, 0, 20);
  var q3 = new Date(2015, 3, 13);
  
  var spreadsheet = SpreadsheetApp.openById("idToOriginalTextFiles");
  var origSheet = spreadsheet.getSheets()[0];
  var origRange = origSheet.getDataRange();
  var origValues = origRange.getValues();
  var origRows = origRange.getNumRows();
  var origCols = origRange.getNumColumns();
  var origFontRange = origSheet.getRange("A10:A55");
  var origFonts = origFontRange.getFontWeights();
  
  var studentSheet =  spreadsheet.getSheetByName("Student1");//Student Name Goes Here
  var sRange = studentSheet.getDataRange();
  var sValues = sRange.getValues();
  var sRows = sRange.getNumRows();
  var sCols = sRange.getNumColumns();
  
  var scoreSpreadsheet = SpreadsheetApp.openById("ifToResultsGoogleSpreadsheet");
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
  
  for (var i=0; i<46; i++) {
    if (origFonts[i][0]=="normal"){
      objectives.push(origValues[i+9][0].split(" ")[0]);
    }
  }
  
  for (var i=0; i<objectives.length; i++){
    proficiencies.push(["q1","q2","q3","q4"]);
  }
  
  var tempObjective=sValues[1][0].split(" ")[0];
  var tempIndex=objectives.indexOf(tempObjective);
  var tq1, tq2, tq3, tq4;
  for (var r=2; r<sRows; r++){
    if (sValues[r][0]==""){
      tempObjective=sValues[r+2][0].split(" ")[0];
      tempIndex=objectives.indexOf(tempObjective);
      r+=2;
    }
    else{
      var tempLongDate=sValues[r][0].split(" - ")[0];
      var tempDate=new Date(tempLongDate.split("-")[0],tempLongDate.split("-")[1]-1,tempLongDate.split("-")[2]);
      tq1=proficiencies[tempIndex].indexOf("q1");
      tq2=proficiencies[tempIndex].indexOf("q2");
      tq3=proficiencies[tempIndex].indexOf("q3");
      tq4=proficiencies[tempIndex].indexOf("q4");
      if (sValues[r][0].split(": ")[1]==2){
        var tempQuizNumberBeforeColon=sValues[r][0].split(": ")[0].split(" ");
        var tempQuizNumber=tempQuizNumberBeforeColon[tempQuizNumberBeforeColon.length-1];
        if (tempDate<q1){
          proficiencies[tempIndex].splice(tq1,0,tempQuizNumber);
        }
        else if (tempDate<q2){
          proficiencies[tempIndex].splice(tq2,0,tempQuizNumber);
        }
        else if (tempDate<q3){
          proficiencies[tempIndex].splice(tq3,0,tempQuizNumber);
        }
        else {
          proficiencies[tempIndex].splice(tq4,0,tempQuizNumber);
        }
      }
    }
  }
  /*for (var i=0; i<objectives.length; i++){
    Logger.log(objectives[i] + " : " + proficiencies[i]);
  }*/
  
for (var i=0; i<bgColors.length; i++) {
   var sTempObjective=fullScoreValues[i+9][0].split(" ")[0];
   for (var j in bgColors[i]) {
     if (bgColors[i][j]=="#cfe2f3"){
       var quarter=Math.floor(j/3)+1;
       var objectivesRow=objectives.indexOf(sTempObjective);
       var q1Index=proficiencies[objectivesRow].indexOf("q1");
       var q2Index=proficiencies[objectivesRow].indexOf("q2");
       var q3Index=proficiencies[objectivesRow].indexOf("q3");
       var q4Index=proficiencies[objectivesRow].indexOf("q4");
       if (quarter==1) {
         if (q1Index!=0){
           scoreValues[i][j]=proficiencies[objectivesRow][0];
           proficiencies[objectivesRow].splice(0,1);
         }
         else {
           scoreValues[i][j]="";
         }
         //Logger.log(sTempObjective+ " " + q1Index + " " + scoreValues[i][j] + " " + quarter + " " + proficiencies[objectivesRow]);
       }
       else if (quarter==2){
         if ((q2Index-q1Index)>1){
           scoreValues[i][j]=proficiencies[objectivesRow][q1Index+1];
           proficiencies[objectivesRow].splice(q1Index+1,1);
         }
         else {
           scoreValues[i][j]="";
         }
         //Logger.log(scoreValues[i][j]);
       }
       else if (quarter==3){
         if ((q3Index-q2Index)>1){
           scoreValues[i][j]=proficiencies[objectivesRow][q2Index+1];
           proficiencies[objectivesRow].splice(q2Index+1,1);
         }
         else {
           scoreValues[i][j]="";
         }
         //Logger.log(scoreValues[i][j]);
       }
       else {
         if ((q4Index-q3Index)>1){
           scoreValues[i][j]=proficiencies[objectivesRow][q3Index+1];
           proficiencies[objectivesRow].splice(q3Index+1,1);
         }
         else {
           scoreValues[i][j]="";
         }
         //Logger.log(scoreValues[i][j]);
       }
       //Logger.log(proficiencies[i][j]);
       //Logger.log(bgColors[i][j]);
     }
   }
  }
  colorRange.setNumberFormat('@STRING@').setHorizontalAlignment("center").setVerticalAlignment("middle");
  colorRange.setValues(scoreValues);
};
