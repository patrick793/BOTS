/*
#pragma strict
class CodeElementSource
{
	var myElement : CodeElement = null;
	
	var C_BUTTON_WIDTH = 140;
	var C_BUTTON_HEIGHT = 40;
	function CodeElementSource()
	{
		myElement = new CodeElement("Generic Element","GenericElement");
	}
	
	function CodeElementSource(name : String)
	{
		myElement = new CodeElement(name, "GenericElement");
	}
	
	function CodeElementSource(element : CodeElement)
	{
		myElement = element;
	}
	
	function Start () {
	
	}
	
	function Update () {
	
	}
	
	//displays the button, and returns whether or not the button was clicked this frame.
	function Draw (x : int, y: int) : boolean
	{
		if (GUI.RepeatButton(new Rect(x,y,C_BUTTON_WIDTH,C_BUTTON_HEIGHT), myElement.name, "GenericElementSource") && !GUIManager.GetInstance().IsHoldingElement())
		{
			//HACKY CODE WARNING: updating mousebutton stuff handled in Draw call because of Unity's GUI
			//may be able to subvert this by using custom stuff instead of buttons
			GUIManager.GetInstance().PickUp(new CodeElement(myElement));
			Debug.Log("clicked");
			return true;
		}
		return false;
	}
	
	  

}

*/