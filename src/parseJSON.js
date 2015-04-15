// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

var parseJSONhelper = function(json) {

  var handleArray = function(JSONstr, parameterObj, arr, valueFound) {

    if(parameterObj['index'] >= JSONstr.length)
      throw "SyntaxError";


    while(JSONstr.charAt(parameterObj['index']) === ' ')
    {
      ++parameterObj['index'];

      if(parameterObj['index'] >= JSONstr.length)
        throw "SyntaxError";
    }

    if(JSONstr.charAt(parameterObj['index']) === ',')
    { 	

      arr.push(parameterObj['obj']);

      valueFound = false;
      parameterObj['obj'] = undefined;
      ++parameterObj['index'];

      handleArray(JSONstr, parameterObj, arr, valueFound);

      return;
    } 

    if(JSONstr.charAt(parameterObj['index']) === ']')
    {
      if(valueFound !== false)
      {
        arr.push(parameterObj['obj']);
      }


   	  parameterObj['obj'] = arr;
   	  ++parameterObj['index'];

      return;
    }
   

    if(valueFound !== false)
      throw "SyntaxError";

    parseJSONrecursiveHelper(JSONstr, parameterObj);

    valueFound = true;

    handleArray(JSONstr, parameterObj, arr, valueFound);

  };

  var handleObject = function(JSONstr, parameterObj, obj, key, valueFound) {

    if(parameterObj['index'] >= JSONstr.length)
      throw "SyntaxError";


    while(JSONstr.charAt(parameterObj['index']) === ' ')
    {
      ++parameterObj['index'];

      if(parameterObj['index'] >= JSONstr.length)
        throw "SyntaxError";
    }




    if(JSONstr.charAt(parameterObj['index']) === ':')
    {

      if(key === undefined || valueFound !== false)
        throw "SyntaxError";     	

      ++parameterObj['index'];

      while(JSONstr.charAt(parameterObj['index']) === ' ')
      {
        ++parameterObj['index'];

        if(parameterObj['index'] >= JSONstr.length)
          throw "SyntaxError";
      }      

      parseJSONrecursiveHelper(JSONstr, parameterObj);


      valueFound = true;

      handleObject(JSONstr, parameterObj, obj, key, valueFound);

      return;
    } 


    if(JSONstr.charAt(parameterObj['index']) === ',')
    {

      if(key === undefined || valueFound === false)
        throw "SyntaxError";     	


      obj[key] = parameterObj['obj'];





      key = undefined;
      valueFound = false;

      parameterObj['obj'] = undefined;

      ++parameterObj['index'];

      handleObject(JSONstr, parameterObj, obj, key, valueFound);

      return;
    }    




    if(JSONstr.charAt(parameterObj['index']) === '}')
    {
      
      if((key === undefined && valueFound !== false)
      	|| (key !== undefined && valueFound === false))
        throw "SyntaxError";     	


     
      if(key !== undefined && valueFound !== false)
      {
        obj[key] = parameterObj['obj'];
      }



   	  parameterObj['obj'] = obj;
   	  ++parameterObj['index'];

      return;
    }


    if(key !== undefined && valueFound !== false)
      throw "SyntaxError";



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
	  	throw "SyntaxError";
	  }
	}

	else if(JSONstr.charAt(parameterObj['index']) === '.' 
	  || (JSONstr.charAt(parameterObj['index']) >= '0' && JSONstr.charAt(parameterObj['index']) <= '9'))
	{
	  parameterObj['obj'] = "";
	  handleNumber(JSONstr, parameterObj);

	  key = String(parameterObj['obj']);
	  parameterObj['obj'] = undefined;
	}

	else if((JSONstr.charAt(parameterObj['index']) >= 'A' && JSONstr.charAt(parameterObj['index']) <= 'Z')
      || (JSONstr.charAt(parameterObj['index']) >= 'a' && JSONstr.charAt(parameterObj['index']) <= 'z'))
	{
      var tempKey = "";

	  
      while((JSONstr.charAt(parameterObj['index']) >= 'A' && JSONstr.charAt(parameterObj['index']) <= 'Z')
        || (JSONstr.charAt(parameterObj['index']) >= 'a' && JSONstr.charAt(parameterObj['index']) <= 'z'))
      {
        tempKey += JSONstr.charAt(parameterObj['index']);

        ++parameterObj['index'];

        if(parameterObj['index'] >= JSONstr.length)
          throw "SyntaxError";
      }      

	  key = String(tempKey);

	}


	handleObject(JSONstr, parameterObj, obj, key, valueFound);

  };

  var handleString = function(JSONstr, parameterObj, startingSymbol) {

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


  	if((JSONstr.charAt(parameterObj['index']) !== startingSymbol) && ((parameterObj['index'] + 1) >= JSONstr.length))
      throw "SyntaxError";


  	if(JSONstr.charAt(parameterObj['index']) === '\\')
  	{


  	  if((parameterObj['index'] + 2) < JSONstr.length)
  	  {
  	  	if(escapeCharacterMap.hasOwnProperty(JSONstr.charAt(parameterObj['index'] + 1)) === true)
  		  parameterObj['obj'] += escapeCharacterMap[JSONstr.charAt(parameterObj['index'] + 1)];
  		else
  		  parameterObj['obj'] += JSONstr.charAt(parameterObj['index'] + 1);

        parameterObj['index'] += 2;
  		handleString(JSONstr, parameterObj, startingSymbol);

  		return;
  	  }
  	  else
  	  {
  	  	throw "SyntaxError";
  	  }

  	}




    if(JSONstr.charAt(parameterObj['index']) === startingSymbol)
    {
      ++parameterObj['index'];
  	  return;
  	}

    parameterObj['obj'] += JSONstr.charAt(parameterObj['index']);
    ++parameterObj['index'];

    handleString(JSONstr, parameterObj, startingSymbol);
  };

  var handleNumber = function(JSONstr, parameterObj) {

    if((parameterObj['index'] >= JSONstr.length)
      || JSONstr.charAt(parameterObj['index']) !== '-' && JSONstr.charAt(parameterObj['index']) !== '.' 
      && !(JSONstr.charAt(parameterObj['index']) >= '0' && JSONstr.charAt(parameterObj['index']) <= '9'))
    {
        parameterObj['obj'] = Number(parameterObj['obj']);

        if(isNaN(parameterObj['obj']))
    	  throw "SyntaxError";


    	return;
    }


    parameterObj['obj'] += JSONstr.charAt(parameterObj['index']);
    ++parameterObj['index'];

    handleNumber(JSONstr, parameterObj);
    
  };

  var handleOther = function(JSONstr, parameterObj) {


    var word = JSONstr.substr(parameterObj['index'], 9);
    if(word === "undefined")
    {
      parameterObj['obj'] = undefined;
      parameterObj['index'] += 9;
      return;
    }

    word = word.substr(0, 5);
    if(word === "false")
    {
      parameterObj['obj'] = false;
      parameterObj['index'] += 5;
      return;
    }

    word = word.substr(0, 4);
    if(word === "null")
    {
      parameterObj['obj'] = null;
      parameterObj['index'] += 4;
      return;
    }
    if(word === "true")
    {
      parameterObj['obj'] = true;
      parameterObj['index'] += 4;
      return;
    }  

    throw "SyntaxError";

  };        
    

  var parseJSONrecursiveHelper = function(JSONstr, parameterObj) {

  	if(parameterObj['index'] >= JSONstr.length)
  	  return;

    if(JSONstr.charAt(parameterObj['index']) === '[')
    {
      parameterObj['obj'] = undefined;
      ++parameterObj['index'];

      handleArray(JSONstr, parameterObj, [], false);
    }
    else if(JSONstr.charAt(parameterObj['index']) === '{')
    {
      parameterObj['obj'] = undefined;
      ++parameterObj['index'];

      handleObject(JSONstr, parameterObj, {}, undefined, false);
    }
    else if(JSONstr.charAt(parameterObj['index']) === '"' || JSONstr.charAt(parameterObj['index']) === '\'') 
    {
      if((parameterObj['index'] + 1) < JSONstr.length)
      {
        parameterObj['obj'] = "";
        ++parameterObj['index'];    

        handleString(JSONstr, parameterObj, JSONstr.charAt(parameterObj['index'] - 1));
      }
      else
      {
      	throw "SyntaxError";
      }
    }
    else if(JSONstr.charAt(parameterObj['index']) === '-' || JSONstr.charAt(parameterObj['index']) === '.' 
      || (JSONstr.charAt(parameterObj['index']) >= '0' && JSONstr.charAt(parameterObj['index']) <= '9'))
    {
      parameterObj['obj'] = "";
      handleNumber(JSONstr, parameterObj);
    }
    else 
    {
      handleOther(JSONstr, parameterObj);
    }
  };


  var parameterObj = {'index' : 0, 'obj' : undefined}; 

  parseJSONrecursiveHelper(json, parameterObj);

  return parameterObj['obj'];

};

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  // your code goes here

  var JSONobject = parseJSONhelper(json);

  return JSONobject;
};
