//print to screen as the user types
  /*eslint-env jquery*/
  /* eslint-env browser */
 /* global document */

function displayWhileTyping(){
    var button = $(".button");
    var displayDiv = $("#displayDiv").find("p");
    var equalsDiv = document.getElementById("equalsBtn");
    var negativeNumberFlag = false;
    var maxChars = 16; //max allowed digits for the user to type in the calculator which is always maxChars - 1
    var userValues = [];
    var operator_regex = /[+*-]|[\u00f7]/g; 
    var number_regex = /[+-]?[0-9]{1,9}(?:\.[0-9]{1,})?/g;
    var answer = 0;
    var userValueAdded = 0;
    
    button.on("click", function(e){  
        if(userValues[userValueAdded] !== undefined){
            if(isNumberCorrect(userValues[userValueAdded].substr(0, userValues[userValueAdded].length-1))){
                equalsDiv.disabled = false;
            }else{
                equalsDiv.disabled = true;
            }
        }
        
        if(answer != 0){
            if(number_regex.test($(this).html())){
                $("#exprDiv").html("");
            }
        }
        
        if($(this).html() === "clr all"){
            userValues.length = 0;
            displayDiv.html("");
            $("#exprDiv").html("");
        }else if($(this).html() === "clr"){
            clear("clr");
        }else{
            if($(this).html() === "(-)"){ 
                var n = displayDiv.html();
                n = n * -1;
                displayDiv.html(n);
                negativeNumberFlag = true;
            }
            //if not negative
            if($(this).html() !== "(-)"){
                //if user clicks decimal button, prepend a zero
                if(($(this).html() === ".") && (displayDiv.html().length === 0)){
                    displayDiv.prepend("0")
                }
                
                if(displayDiv.html().charAt(0) === "-"){
                   negativeNumberFlag = true;
                }else{
                    negativeNumberFlag = false;
                }
                
                //if + - / * clicked
                if(operator_regex.test($(this).html())){
                    equalsDiv.disabled = false;
                    displayDiv.append($(this).html());
                    userValues.push(displayDiv.html());
                    userValueAdded++;
                    displayDiv.html("")
                    
                    if(userValueAdded[userValueAdded-1] === undefined){
                        userValueAdded = 1;
                    }

                }else if($(this).html() === "="){
                    var errorsFound = false;
                    
                    if(userValues.length == 0){
                        equalsDiv.disabled = true;
                    }else{
                        equalsDiv.disabled = false;
                    }
                    
                    e.preventDefault();
                    
                    userValues.push(displayDiv.html() + "=");
                    
                    for(var i = 0; i<userValues.length; i++){
                        //scientific notation is of course not an error
                        if(userValues[i].substr(0, userValues[i].length-1).indexOf("e+") !== -1){
                            errorsFound = false;
                            answer = 0;
                            break;
                        }
                        
                        if(!isNumberCorrect(userValues[i].substr(0, userValues[i].length-1))){
                            errorsFound = true;
                            answer = "error";
                            break;
                        }
                    }
                    
                    var expression = createExpression(userValues);
                    
                    if(!/[error]/g.test(expression)){
                        if(expression.length < 50){
                            $("#exprDiv").html(expression);
                        }else{
                            $("#exprDiv").html(expression.substr(0, 50) + "...")
                        }
                    }

                    if(/\({1,}\s(([-])?[0-9]{1,}\.?[0-9]{1,}\)){2,}/g.test(expression)){
                        expression = "";
                    }else{
                        if(!errorsFound){
                            answer = eval(expression);
                        }
                    }
                    
                    if(answer > 999999999 && !errorsFound){
                        answer = answer.toExponential(7);
                    }else if(isNaN(parseFloat(answer)) || errorsFound){
                        answer = "error";
                    }
                    
                    displayDiv.html(answer);
                    userValues.length = 0;
                    userValueAdded = 0;
                    equalsDiv.disabled = true;           
                }else{   
                    if( (displayDiv.html() === "error")){
                        e.preventDefault();
                    }else{
                        if(displayDiv.html().length < maxChars ){
                            if(!operator_regex.test($(this).html())){ 
                                displayDiv.append($(this).html());
                            }   
                        }        
                    }
                } // end check if operator
            }           
        } // end clears
    });
}

function createExpression(arr){
  var expr = "", count = 0, leftParens = "", errorFound = false;
  for(var i = 0; i<arr.length; i++){      
    expr += arr[i].substr(0, arr[i].length-1) + ") " + arr[i].charAt(arr[i].length-1);
    count++;
  }
  
  leftParens += "(".repeat(count);
  expr = expr.replace("--", "-");
  expr = expr.replace(new RegExp("--", 'g'), "-");
  expr = expr.replace(/^/, leftParens);
  expr = expr.replace(" =", "");
  expr = expr.replace(/[\u00f7]/g, "/");
  expr = expr.substr(0, count) + " " + expr.substr(count, expr.length); 
  return expr;
}

//checks for proper floating point numbers or integers.  Returns false if two or more decimals.  Basically a proper number
//For example 3.44.8 or 3..448 would be returned false, because there are two decimal symbols.
function isNumberCorrect(str){
    var numberRegex = /^\-?\s*(?=.*[0-9])\d*(?:\.\d{1,})?\s*$/g;
    if(numberRegex.test(str)){
       return true;
    }
    return false;
}

function clear(str){
    var displayDiv = document.getElementById("displayDiv").getElementsByTagName("p")[0];
    if(str == "clr all"){
        displayDiv.innerHTML = displayDiv.innerHTML.slice(0);
    }else if(str == "clr"){
        var trimmedString = displayDiv.innerHTML.slice(0, -1);
        displayDiv.innerHTML = trimmedString;
        //displayDiv.html(displayDiv.html().slice(0,-1));
    }
}

  document.addEventListener("DOMContentLoaded", function(event) {
      displayWhileTyping();
  });
