/**
#pragma strict
import System.Collections.Generic;

enum OperatorType { Plus, Minus }
enum ControlType { For, While, If }
enum ConditionalType { Equals, LessThan, GreaterThan, LessThanEquals, GreaterThanEquals }


//Actual function elements
class CodeElement{
	
	var isEmpty = true;
	var name : String;
	
	var type : String = "Generic";
	var style : String = "GenericElement";
	var isContainer = false;
	var isParameter = false;
	var index : int = -1;
	
	var functionName : String;
	var parameterList : List.<CodeElement>;
	var expectedList : List.<CodeElement>;
	var counterpart : CodeElement;
	
	var C_BUTTON_WIDTH : int = 140;
	var C_BUTTON_HEIGHT : int = 40;
	
	function CodeElement( name : String, functionName : String ){
			this.isEmpty = false;
			this.name = name;
			this.functionName = functionName;
			this.style = "GenericElement";
			
			C_BUTTON_HEIGHT = 40;
			C_BUTTON_WIDTH = 140;
	}
	
	function CodeElement( element : CodeElement) //copy constructor should produce a copy (by value) of the element passed in
	{
		this.isEmpty = element.isEmpty;
		this.name = element.name;
		this.functionName = element.functionName;
		if (element.type)
			type = element.type;
		if (element.parameterList)
			parameterList = new List.<CodeElement>(element.parameterList.ToArray());
		if (element.expectedList)
			expectedList = new List.<CodeElement>(element.expectedList.ToArray());
			
			isContainer = element.isContainer;
			isParameter = element.isParameter;
			style = element.style;
			
			C_BUTTON_WIDTH = element.C_BUTTON_HEIGHT;
			C_BUTTON_WIDTH = element.C_BUTTON_WIDTH;
	}
	
	//displays the button, and returns a boolean of whether or not the button was clicked this frame
	function Draw (x : int, y: int) : boolean
	{
		if (GUI.RepeatButton(new Rect(x,y,C_BUTTON_WIDTH,C_BUTTON_HEIGHT), index + ": " + name, style))
		{
			return true;
		}
		return false;
	}
	
	function Update()
	{
		
	}
	
	 function IsEmpty() : boolean
	 {
	 	return isEmpty;
	 } 
	
}

//Parameter elements
class ContainerElement extends CodeElement{
	
	function ContainerElement(name : String, functionName : String)
	{
		super(name, functionName);
		isContainer = true;
		parameterList = new List.<ContainerElement>();
		style = "ContainerElement";
	}
}

class ParameterElement extends CodeElement{

	function ParameterElement(name : String, functionName : String)
	{
		super(name, functionName);
		isParameter = true;
		style = "ParameterElement";
		C_BUTTON_WIDTH = 30;
		C_BUTTON_HEIGHT = 30;
	}
}

class VariableElement extends ParameterElement{

function VariableElement(name : String, functionName : String)
	{
		super(name, functionName);
	}	
}

class ValueElement extends ParameterElement{
function ValueElement(name : String)
	{
		super(name, "Value");
	}
}

class OperatorElement extends ParameterElement{

function OperatorElement(name : String, functionName : String)
	{
		super(name, functionName);
	}
}

class ControlElement extends ContainerElement{

	function ControlElement(name : String, functionName : String)
	{	
		super(name, functionName);
		type = "Control";
	}

}

class BreakElement extends ContainerElement{
	function BreakElement(name : String, functionName : String)
	{		
		super(name, functionName);
		name = "END";
		type = "Break";
	}
}

*/