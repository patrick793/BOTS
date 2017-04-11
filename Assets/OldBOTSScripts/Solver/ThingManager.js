#pragma strict

class ThingManager extends MonoBehaviour
{
	//singletonize this class
	//private static var instance : GUIManager; 

	var currentElement : Thing; //element currently attached to the mouse

	
	/*public static function GetInstance() : GUIManager
	{
		return instance;
	}*/
	
	function Awake() {
		//currentElement = null;
	}
	
	function Start () {
		currentElement = null;
	}
	
	function Update () {		
		Debug.Log(currentElement);
		currentElement = null;	
	}
}