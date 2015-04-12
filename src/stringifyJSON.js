// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

//helper function that recursively goes through the object and appends to the string based on object type
var stringifyJSONrecursiveHelper = function(obj, str) {

  //can skip undefined and function types
  if(obj === undefined || typeof(obj) === "function")
  	return str;

  //if the object is an array, then recursively go through every element
  if(Array.isArray(obj) === true)
  {
  	str += "["; //need to put a bracket before and after the array contents
    for(var i = 0; i < obj.length; ++i)
    {
      if(obj[i] !== undefined && typeof(obj[i]) !== "function") //can skip undefined and function types
   	  {
        if(i >= 1)    
   	  	  str += ","; //put a comma before each element except the first
        str = stringifyJSONrecursiveHelper(obj[i], str)
      }
    }	
    str += "]";	
    return str;
  }

  //if the object is not null and is an object type, then recursively go through every property
  if(obj !== null && typeof(obj) === "object")
  {
  	var count = 0;
  	str += "{"; //need to put braces before and after the array contents
    for(var prop in obj)
    {
   	  if(obj[prop] !== undefined && typeof(obj[prop]) !== "function")
   	  {
   	  	if(count === 0)
          str += "\"" + prop + "\"" + ":"; //put the key in quotation marks before every value in the object
    	else
		  str += ",\"" + prop + "\"" + ":"; //put a comma before each property except the first
        str = stringifyJSONrecursiveHelper(obj[prop], str);
        ++count;
      }
    }
    str += "}";
    return str;
  }

  //at this point, the object should be either null or primitive type
  //append to the string appropriately based on the type
  if(obj === null)
  	str += "null";
  else if(typeof(obj) === "string")
  	str += "\"" + obj + "\"";
  else
  	str += obj.toString();

  //return the string; this base case is reached when the object isn't object or array type
  return str;
};

//function that calls a recursive function to build the json string from the passed in object
var stringifyJSON = function(obj) {
  // your code goes here

  var JSONstring = ""; //start with a blank string

  JSONstring = stringifyJSONrecursiveHelper(obj, JSONstring); //call the recursive function, passing in the input object and the blank string

  return JSONstring; //return the updated string representing the input object in json format
};