// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

//the code is based on the json rules in the json tutorial
//the code was originally written using "more" recursion, but that caused a "too much recursion" error due to the call stack overflowing
//so while(1) loops were put in instead and function calls were replaced with calls to "continue"
//whitespaces before or after an object will result in a thrown error; only whitespaces within an array or object are handled correctly

//helper function that parses the passed in json string for the object that the json represents and returns the object
//there are several helper functions contained in this function to handle the various data types
var parseJSONhelper = function(json) {

  //helper function to set a message and throw a syntax error object
  var throwError = function(index, message) {

    var syntaxError = new SyntaxError;

    syntaxError.message = "Error at JSON index: " + index + ", description: " + message;

    throw syntaxError;
  }; 

  //helper function that parses the json string to create a new array
  //this function calls the parseJSONrecursiveHelper function, which can in turn call the handleArray function again for nested arrays
  //the index of the json string and the current parsed object (that is a value to be inserted into the current array) are held in the parameterObj
  //arr is the current array that is being updated
  //valueFound is set to true when a value to go into the array is found in the string and is reset with each comma, 
  //this is done to ensure that more than one value isn't able go into the same index
  var handleArray = function(JSONstr, parameterObj, arr, valueFound) {

    //keep looping until a condition causes the function to return or throw an error
		while(1)
		{
      //throw an error if string index passes the end of the string
		  if(parameterObj['index'] >= JSONstr.length)
		      throwError(parameterObj['index'], "could not find closing array bracket in json string");

      //ignore white spaces
	    while(JSONstr.charAt(parameterObj['index']) === ' ' || JSONstr.charAt(parameterObj['index']) === '\r'
	    	|| JSONstr.charAt(parameterObj['index']) === '\t' || JSONstr.charAt(parameterObj['index']) === '\n')
	    {
	      ++parameterObj['index'];

	      if(parameterObj['index'] >= JSONstr.length)
	        throwError(parameterObj['index'], "could not find closing array bracket in json string");
	    }

      //handle a comma
      //when a comma is seen, push the current object into the array and reset the parameters
	    if(JSONstr.charAt(parameterObj['index']) === ',')
	    { 	
	      arr.push(parameterObj['obj']);

	      valueFound = false;
	      parameterObj['obj'] = undefined;
	      ++parameterObj['index'];

	      continue;
	    } 

      //handle a closing bracket
      //when a closing bracket is seen, push the final value into the array and set the object in the parameter to the array
	    if(JSONstr.charAt(parameterObj['index']) === ']')
	    {
	      if(valueFound !== false) //[] will have no value found and will be a blank array
	      {
	        arr.push(parameterObj['obj']);
	      }

	   	  parameterObj['obj'] = arr;
	   	  ++parameterObj['index'];

	      return;
	    }

	    //at this point, any character that isn't a white space, comma, or closing bracket is at the current index and needs to be handled appropriately
	   
      //if there is a value found at this point, then that means another value is trying to be put into the same index, which is an error
	    if(valueFound !== false)
	      throwError(parameterObj['index'], "two values were parsed for a single array index");

      //call parseJSONrecursiveHelper to get the value that needs to be pushed into the array
	    parseJSONrecursiveHelper(JSONstr, parameterObj);

	    valueFound = true;

	    continue; //not needed here, but kept in to show where the initial function calls were replaced
    }
  };

  //helper function that parses the json string to create a new object
  //this function calls the parseJSONrecursiveHelper function, which can in turn call the handleObject function again for nested objects
  //the index of the json string and the current parsed object (that is a value to be inserted into the current object) are held in the parameterObj
  //obj is the current object that is being updated
  //key holds the current key to go into the object and is reset with each comma
  //valueFound is set to true when a value to go into the object is found in the string and is reset with each comma, 
  //this is done to ensure that more than one value isn't able go into the same index
  var handleObject = function(JSONstr, parameterObj, obj, key, valueFound) {

    //keep looping until a condition causes the function to return or throw an error
		while(1)
		{
      //throw an error if string index passes the end of the string
	    if(parameterObj['index'] >= JSONstr.length)
	      throwError(parameterObj['index'], "could not find closing object braces in json string");

      //ignore white spaces
	    while(JSONstr.charAt(parameterObj['index']) === ' ' || JSONstr.charAt(parameterObj['index']) === '\r'
	    	|| JSONstr.charAt(parameterObj['index']) === '\t' || JSONstr.charAt(parameterObj['index']) === '\n')
	    {
	      ++parameterObj['index'];

	      if(parameterObj['index'] >= JSONstr.length)
	        throwError(parameterObj['index'], "could not find closing object braces in json string");
	    }

      //handle a colon
      //when a colon is seen, the value needs to be parsed, so parseJSONrecursiveHelper is called
	    if(JSONstr.charAt(parameterObj['index']) === ':')
	    {
        //at this point, a key should have been found and value should not have yet been found; otherwise, it is an error
	      if(key === undefined || valueFound !== false)
	        throwError(parameterObj['index'], "either could not parse key or two values parsed for property in object");   	

	      ++parameterObj['index'];

        //ignore white spaces
	      while(JSONstr.charAt(parameterObj['index']) === ' ' || JSONstr.charAt(parameterObj['index']) === '\r'
	    	|| JSONstr.charAt(parameterObj['index']) === '\t' || JSONstr.charAt(parameterObj['index']) === '\n')
	      {
	        ++parameterObj['index'];

	        if(parameterObj['index'] >= JSONstr.length)
	          throwError(parameterObj['index'], "could not find closing object braces in json string");
	      }      

        //call parseJSONrecursiveHelper to get the value to be put at the key position in the object
	      parseJSONrecursiveHelper(JSONstr, parameterObj);

	      valueFound = true;

	      continue;
	    } 

			//handle a comma
			//when a comma is seen, the value needs to be put into the key position in the object
	    if(JSONstr.charAt(parameterObj['index']) === ',')
	    {
        //at this point, both the key and value should have been found; otherwise, it is an error
	      if(key === undefined || valueFound === false)
	        throwError(parameterObj['index'], "either could not parse key or value for property in object");   	

        //put the value into the key position of the object
	      obj[key] = parameterObj['obj'];

        //reset parameters
	      key = undefined;
	      valueFound = false;
	      parameterObj['obj'] = undefined;

	      ++parameterObj['index'];

	      continue;
	    }    

      //handle a closing brace
      //when a closing brace is seen, the value needs to be put into the key position in the object and the object needs to be set in the parameter object
	    if(JSONstr.charAt(parameterObj['index']) === '}')
	    {
	      //at this point, either both the key and value shouldn't have been found (ie. {}) or they should both have been found
	      //otherwise, it is an error
	      if((key === undefined && valueFound !== false)
	      	|| (key !== undefined && valueFound === false))
	        throwError(parameterObj['index'], "object syntax incorrect");     	

	      //put the value into the object at the key position if they exist
	      if(key !== undefined && valueFound !== false)
	      {
	        obj[key] = parameterObj['obj'];
	      }

        //set the object in the parameter object to the current object
	   	  parameterObj['obj'] = obj;
	   	  ++parameterObj['index'];

	      return;
	    }

	    //at this point, any character that isn't a white space, colon, comma, or closing brace is at the current index and needs to be handled appropriately

      //neither the key nor the value should be parsed at this point; otherwise, it is an error
	    if(key !== undefined && valueFound !== false)
	      throwError(parameterObj['index'], "parsed too many keys or values for property in object"); 

      //the following code handles parsing the string for the key that needs to be set in the object

      //handle strings in quotes
			if(JSONstr.charAt(parameterObj['index']) === '"' || JSONstr.charAt(parameterObj['index']) === '\'') 
			{
			  if((parameterObj['index'] + 1) < JSONstr.length)
			  {
			    parameterObj['obj'] = "";
			    ++parameterObj['index'];    

			    handleString(JSONstr, parameterObj, JSONstr.charAt(parameterObj['index'] - 1));

			    key = parameterObj['obj'];
			    parameterObj['obj'] = undefined;

			  }
			  else
			  {
			  	throwError(parameterObj['index'], "could not find closing quotation mark for string for key in object"); 
			  }
			}
			//handle numbers without quotes; note: negatives don't work without quotes
			else if(JSONstr.charAt(parameterObj['index']) === '.' 
			  || (JSONstr.charAt(parameterObj['index']) >= '0' && JSONstr.charAt(parameterObj['index']) <= '9'))
			{
			  parameterObj['obj'] = "";
			  handleNumber(JSONstr, parameterObj);

			  key = String(parameterObj['obj']);
			  parameterObj['obj'] = undefined;
			}
      //handle strings without quotes; note: string without quotes cannot start with a number
			else if((JSONstr.charAt(parameterObj['index']) >= 'A' && JSONstr.charAt(parameterObj['index']) <= 'Z')
		      || (JSONstr.charAt(parameterObj['index']) >= 'a' && JSONstr.charAt(parameterObj['index']) <= 'z')
		      || (JSONstr.charAt(parameterObj['index']) === '_'))
			{
		    var tempKey = "";

		    while((JSONstr.charAt(parameterObj['index']) >= 'A' && JSONstr.charAt(parameterObj['index']) <= 'Z')
		      || (JSONstr.charAt(parameterObj['index']) >= 'a' && JSONstr.charAt(parameterObj['index']) <= 'z')
		      || (JSONstr.charAt(parameterObj['index']) >= '0' && JSONstr.charAt(parameterObj['index']) <= '9')
		      || (JSONstr.charAt(parameterObj['index']) === '_'))
		    {
		      tempKey += JSONstr.charAt(parameterObj['index']);

		      ++parameterObj['index'];

		      if(parameterObj['index'] >= JSONstr.length)
		        throwError(parameterObj['index'], "object syntax incorrect"); 
		    }      

			  key = String(tempKey);
			}

      //the key should have been found at this point; otherwise, it is an error
			if(key === undefined)
        throwError(parameterObj['index'], "could not parse key for object"); 

			continue;
    }
  };

  //helper function that parses the json string to create a new string 
  //the starting symbol is the starting quotation mark of the string (ie. ' or ")
  var handleString = function(JSONstr, parameterObj, startingSymbol) {

    //a map that contains all of the escape characters
  	var escapeCharacterMap = {
      '\'' : '\'',
      '"' : '"',
      '\\' : '\\',
      'n' : '\n',
      'r' : '\r',
      't' : '\t',
      'b' : '\b',
      'f' : '\f'
  	};

   //keep looping until a condition causes the function to return or throw an error
		while(1)
		{
      //throw an error if the json string ends without having a closing quotation mark for the current string
	  	if((JSONstr.charAt(parameterObj['index']) !== startingSymbol) && ((parameterObj['index'] + 1) >= JSONstr.length))
	      throwError(parameterObj['index'], "could not find closing quotation mark for string"); 

      //if a slash is seen and the following character forms an escape character, then need to turn that into the actual escape character
	  	if(JSONstr.charAt(parameterObj['index']) === '\\')
	  	{
        //make sure that the string does not end with a single slash
	  	  if((parameterObj['index'] + 2) < JSONstr.length)
	  	  {
	  	    //check if the character after the slash forms an escape character
	  	    if(escapeCharacterMap.hasOwnProperty(JSONstr.charAt(parameterObj['index'] + 1)) === true)
	  		    parameterObj['obj'] += escapeCharacterMap[JSONstr.charAt(parameterObj['index'] + 1)]; //insert the actual escape character if it does
	  		  else
	  		    parameterObj['obj'] += JSONstr.charAt(parameterObj['index'] + 1); //don't insert anything if it doesn't

	        parameterObj['index'] += 2;

	  		  continue;
	  	  }
	  	  else
	  	  {
	  	  	throwError(parameterObj['index'], "string cannot end with single slash");
	  	  }

  	  }

      //end when the closing symbol of the string is seen
	    if(JSONstr.charAt(parameterObj['index']) === startingSymbol)
	    {
	      ++parameterObj['index'];
	  	  return;
	  	}

      //append the current character to the string and move the index
	    parameterObj['obj'] += JSONstr.charAt(parameterObj['index']);
	    ++parameterObj['index'];

	    continue;
    }
  };

  //helper function that parses the json string to create a new number 
  var handleNumber = function(JSONstr, parameterObj) {

    //keep looping until a condition causes the function to return or throw an error
    while(1)
    {
      //end when either the end of the json string has been reached or a different character is seen
	    if((parameterObj['index'] >= JSONstr.length)
	      || JSONstr.charAt(parameterObj['index']) !== '-' && JSONstr.charAt(parameterObj['index']) !== '.' 
	      && !(JSONstr.charAt(parameterObj['index']) >= '0' && JSONstr.charAt(parameterObj['index']) <= '9'))
	    {
	    	//convert the parsed string into a number using built-in javascript function
	      parameterObj['obj'] = Number(parameterObj['obj']);

        //throw an error if the number is NaN
	      if(isNaN(parameterObj['obj']))
	    	  throwError(parameterObj['index'], "parsed value that appeared to be a number but was NaN");

	    	return;
	    }

      //append the current character to the string that is to be converted to the returned number and move the index
	    parameterObj['obj'] += JSONstr.charAt(parameterObj['index']);
	    ++parameterObj['index'];

	    continue;
    }
  };

  //helper function that parses the json string for boolean and null types
  //note: undefined is not valid in json
  var handleOther = function(JSONstr, parameterObj) {

    //parse up to the next 5 characters including the current to see if the string matches "false"
    var word = JSONstr.substr(parameterObj['index'], 5);
    if(word === "false")
    {
      parameterObj['obj'] = false;
      parameterObj['index'] += 5;
      return;
    }

    //parse up to the next 4 characters including the current to see if the string matches "true" or "null"
    word = word.substr(0, 4);
    if(word === "true")
    {
      parameterObj['obj'] = true;
      parameterObj['index'] += 4;
      return;
    }     
    if(word === "null")
    {
      parameterObj['obj'] = null;
      parameterObj['index'] += 4;
      return;
    }

    //throw an error if the characters form an unrecognizable type
    throwError(parameterObj['index'], "unrecognized characters in json string");
  };        
    
  //helper function that parses the json string and determines what function to call based on the character seen
  //it can be called recursively for arrays and object in order to get the objects to be inserted into those types
  var parseJSONrecursiveHelper = function(JSONstr, parameterObj) {

     //return when the end of the json string has been passed
  	 if(parameterObj['index'] >= JSONstr.length)
  	   return;

     //the type is an array if an opening bracket is seen
     if(JSONstr.charAt(parameterObj['index']) === '[')
     {
       parameterObj['obj'] = undefined;
       ++parameterObj['index'];

       handleArray(JSONstr, parameterObj, [], false);
     }
     //the type is an object if an opening brace is seen
     else if(JSONstr.charAt(parameterObj['index']) === '{')
     {
       parameterObj['obj'] = undefined;
       ++parameterObj['index'];

       handleObject(JSONstr, parameterObj, {}, undefined, false);
     }
     //the type is a string if a quotation mark is seen
     else if(JSONstr.charAt(parameterObj['index']) === '"' || JSONstr.charAt(parameterObj['index']) === '\'') 
     {
     	 //don't allow the json string to end without a closing quotation mark
       if((parameterObj['index'] + 1) < JSONstr.length)
       {
         parameterObj['obj'] = "";
         ++parameterObj['index']; //the passed in index will skip over the first quotation mark

         handleString(JSONstr, parameterObj, JSONstr.charAt(parameterObj['index'] - 1));
       }
       else
       {
       	 throwError(parameterObj['index'], "could not find closing quotation mark for string");
       }
     }
     //the type is a number if a negative sign, decimal sign, or numeric digit is seen
     else if(JSONstr.charAt(parameterObj['index']) === '-' || JSONstr.charAt(parameterObj['index']) === '.' 
       || (JSONstr.charAt(parameterObj['index']) >= '0' && JSONstr.charAt(parameterObj['index']) <= '9'))
     {
       parameterObj['obj'] = "";
       handleNumber(JSONstr, parameterObj);
     }
     //test for boolean or null for any other characters seen
     else 
     {
       handleOther(JSONstr, parameterObj);
     }
  };

  //the parameter object contains the index and object that will be passed into and updated in the function calls
  //the index represents the current index of the json string to look at
  //the object is the object that is parsed from the json string and will ultimately be returned
  var parameterObj = {'index' : 0, 'obj' : undefined}; 

  //call parseJSONrecursiveHelper to start parsing the json string for the objects contained in it
  parseJSONrecursiveHelper(json, parameterObj);

  //return the object contained in the parameter object
  return parameterObj['obj'];

};

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  // your code goes here

  //call parseJSONhelper to get the object represented by the json string
  var JSONobject = parseJSONhelper(json);

  return JSONobject;
};
