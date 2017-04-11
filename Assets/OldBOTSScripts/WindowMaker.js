var mySkin : GUISkin;

function OnGUI () {
	
	GUI.skin = mySkin;
    GUI.Window (2, Rect (10,10,300,400), DoWindow0, "");
}

// Make the contents of the window.
function DoWindow0 (windowID : int) {
	
	
	
	
//    if(GUI.Button (Rect (10,30, 80,20), "Done"))
//    {	
//    	GUI.BringWindowToBack(windowID);
//    }
}


/**BringWindowToFront, BringWindowToBack**/

