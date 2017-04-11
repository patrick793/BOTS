// Target for the minimap.
var target : GameObject;

// Default height to view from.
private var height = 30;

// Is the map currently open?
static var mapOpen = false;

// How much should we move for each small movement on the mouse wheel?
var scrollSensitivity = 3;

// Maximum and minimum heights that the camera can reach.
var maxHeight = 80;
var minHeight = 5;

// Should the minimap rotate with the player?
var rotateWithTarget = true;

function Start() {
    //Screen.lockCursor = true;
    height = PlayerPrefs.GetInt("MinimapCameraHeight");
}

function OnGUI()
{
	// If the minimap button is pressed then toggle the map state.
    if(GUI.Button(Rect(0,0,40,40),"MinimapToggle"))
    {
        toggleMinimap();
    }
	
}


// Where the action is :D
function Update () {

    

    // Update the transformation of the camera as per the target's position.
    transform.position.x = target.transform.position.x;
    transform.position.z = target.transform.position.z;
    // For this, we add the predefined (but variable, see below) height var.
    transform.position.y = target.transform.position.y + height;        
    
    // If the minimap should rotate as the target does, the rotateWithTarget var should be true.
    // An extra catch because rotation with the fullscreen map is a bit weird.
    if(rotateWithTarget && !mapOpen) {
        transform.eulerAngles.y = target.transform.eulerAngles.y;
    }

    // Get the movement of the mouse wheel as an axis. 
    // Needs configuring in your project's input setup.
    var mw : float = Input.GetAxis("MouseScrollWheel");
    
    // If the value is positive, add the height as defined by the sensitivity.
    // Also, save the height to player prefs in both cases with the call to saveHeight().
    if(mw > 0 && height < maxHeight) {
        height += scrollSensitivity;
        saveHeight();
    } 
    // Opposite for negative, just sub the value instead.
    else if(mw < 0 && height > minHeight) {
        height -= scrollSensitivity;
        saveHeight();
    }

}


// Function to open/close the minimap.
function toggleMinimap() {
    if(!mapOpen) {
        // Set the camera to use the entire screen.
        //camera.rect = Rect (0,0,1,1);
        // Update the global so other scripts can know.
        mapOpen = true;
        // Unlock the cursor for proper point/click navigation.
       // Screen.lockCursor = false;
        // Update the relevant PlayerPref key, could be useful for persistence.
        PlayerPrefs.SetInt("mapOpen",1);
    }
    else {
        // Set the camera to use a small portion of the screen.
        //camera.rect = Rect (0.8,0.8,1,1);
        // Update the global so other scripts can know.
        mapOpen = false;
        // Lock the cursor for TPS control.
        //Screen.lockCursor = true;
        // Update the relevant PlayerPref key, could be useful for persistence.
        PlayerPrefs.SetInt("mapOpen",0);
    }
    
    // Debug print the current state of the map.
    print("mapOpen = " + mapOpen);
    
}

// Method to store the height of the camera as a PlayerPref.
function saveHeight() {
    PlayerPrefs.SetInt("MinimapCameraHeight",height);
}
