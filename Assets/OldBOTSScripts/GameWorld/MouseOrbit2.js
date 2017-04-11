var target : Transform;
var distance = 20.0;

var xSpeed = 250.0;
var ySpeed = 120.0;

var yMinLimit = -20;
var yMaxLimit = 80;
var rFactor = 3;

var mouseLimit : Vector2;
var maximized : boolean;

private var x = 0.0;
private var y = 0.0;

var cam1 : boolean = false;

var rotDeg : float = 2.5;
var theta = 0.0;
var autoRot : boolean;
var drawMinMax : boolean;

var mySkin :GUISkin;
var buttonSize : Vector2;
var buttonOffset : int;
var program : ProgramGUI;
var windowList : Array;

var minZoom = 30;
var maxZoom = 70;
private var targetView = maxZoom; // not zoomed at start
var zoomStep = 17;
var zoomVel = 0.0;
var damp = .3;

var savedCameraPos : Vector3;
var savedCameraRot : Quaternion;
var savedOrthographicSize : int;

var screenShotURL;
var width;
var height;
var screenshotTexture;
var bytes;

var resWidth = 2550;
var resHeight = 3300;
var renderTexture;
var newCameraCapture;
var cameraCaptureBytes : Array;
var filename;

//@script AddComponentMenu("Camera-Control/Mouse Orbit")

function Start () {
    var angles = transform.eulerAngles;
    x = angles.y;
    y = angles.x;
    
    mouseLimit = new Vector2(Screen.width * .325, Screen.height * .325);

	// Make the rigid body not change rotation
   	if (rigidbody)
		rigidbody.freezeRotation = true;
		
	maximized = false;	
	cam1 = true;	
	ResetCamera();
	
	//Set bools for Minimap default functions
	drawMinMax = true;
	autoRot = false;
}

function UpdateValues(newSkin : GUISkin, bSize : Vector2, bOffset : int, prog : ProgramGUI, wList : Array) {
	mySkin = newSkin;
	buttonSize = bSize;
	buttonOffset = bOffset;
	program = prog;
	windowList = wList;
}

function OnGUI()
{
	//If the camera should not render Min-Max buttons, skip
	if(!drawMinMax){
		return;
	}
	
 	 if(!GameObject.Find("/Main Camera"))
 	 	return;
 	 
 	 if(Input.GetMouseButton(1) && Input.mousePosition.x <= mouseLimit.x && Input.mousePosition.y <= mouseLimit.y)    
 	 	ResetCamera();
 	 
	 
 	 if(!maximized)	
 	 {
 	 	rFactor = 3;
	 	 if(GUI.Button(new Rect(Screen.width * .318, Screen.height * .688,Screen.width*24/897,Screen.height*24/598),"+"))
	 	 {
	 	 	maximized = true;
	 	 	(gameObject.GetComponent("Camera") as Camera).rect.width = 1;
	 	 	(gameObject.GetComponent("Camera") as Camera).rect.height = 1;
	 	 	mouseLimit = new Vector2(Screen.width, Screen.height);
	 	 }
	 	 else
	 	 {
	 	 	maximized = false;
	 	 	(gameObject.GetComponent("Camera") as Camera).rect.width = .3354;
	 	 	(gameObject.GetComponent("Camera") as Camera).rect.height = .306;
	 	 	mouseLimit = new Vector2(Screen.width * .325, Screen.height * .325);
	 	 }
	 }
	 else
	 {
	 	if(GUI.Button(Rect(Screen.width-30, 1, 30, 30), "-"))
	 	{
	 		maximized = false;
	 	 	(gameObject.GetComponent("Camera") as Camera).rect.width = .325;
	 	 	(gameObject.GetComponent("Camera") as Camera).rect.height = .325;
	 	 	mouseLimit = new Vector2(Screen.width * .325, Screen.height * .325);
	 	}
	 	else
	 	{
	 		maximized = true;
	 	 	(gameObject.GetComponent("Camera") as Camera).rect.width = 1;
	 	 	(gameObject.GetComponent("Camera") as Camera).rect.height = 1;
	 	 	mouseLimit = new Vector2(Screen.width, Screen.height);
	 	 }	 
	 }
	 
}

function LateUpdate () {
	//Should be set by Minimap
	if(autoRot){
		theta += rotDeg;
		var arotation = Quaternion.Euler(0, Mathf.Repeat(theta,360), 0);
		var aposition = arotation * Vector3(4, 6, -distance + 10) + target.position;
		transform.rotation = arotation;
		transform.position = aposition;
	}
	else
	{
	    if (target && cam1 && 
	    	GameObject.Find("/Main Camera").GetComponent("ProgramGUI").heldButton == null && 
	    	!GameObject.Find("/Main Camera").GetComponent("ProgramGUI").displayMessage) 
	    {
	    	Zoom();
	    	SkyView();
	    	if(Input.GetMouseButton(0) && Input.mousePosition.x <= mouseLimit.x && Input.mousePosition.y <= mouseLimit.y)
	    	{
			    x += Input.GetAxis("Mouse X") * xSpeed * 0.02 * rFactor;
			    y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02 * rFactor;
				
				y = ClampAngle(y, yMinLimit, yMaxLimit);
				       
			    var rotation = Quaternion.Euler(y, x, 0);
			    var position = rotation * Vector3(0.0, 0.0, -distance) + target.position;
			    
			    transform.rotation = rotation;
			    transform.position = position;
			    
	        }

	    }
    
    }
}


function SkyView()
{
	// switch camera to high orthographic view
//WORKING
	 if(Input.GetKeyDown("space"))
	 {
		savedCameraPos = camera.transform.position;
		savedCameraRot = camera.transform.rotation;
		savedOrthographicSize = camera.orthographicSize;
		
		camera.transform.position = Vector3(5, 56, -5);
		camera.transform.rotation = Quaternion.Euler(80, 0, 0);
		camera.orthographic = true;
		camera.orthographicSize = 6;
 	}
 	else if(Input.GetKeyUp("space"))
 	{
 		camera.transform.position = savedCameraPos;
 		camera.transform.rotation = savedCameraRot;
 		camera.orthographic = false;
 		camera.orthographicSize = savedOrthographicSize;
 	}
}	

function ScreenShot()//Current screen
{
	// Grab a screen shot and upload it to a CGI script.
	// The CGI script must be able to handle form uploads.
	screenShotURL = "http://www.my-server.com/cgi-bin/screenshot.pl";//edit


   // We should only read the screen after all rendering is complete
    yield WaitForEndOfFrame();
    // Create a texture the size of the screen, RGB24 format
    width = Screen.width;
    height = Screen.height;
    screenshotTexture = new Texture2D( width, height, TextureFormat.RGB24, false );
    // Read screen contents into the texture
    screenshotTexture.ReadPixels( Rect(0, 0, width, height), 0, 0 );
    screenshotTexture.Apply();
    // Encode texture into PNG
    bytes = screenshotTexture.EncodeToPNG();
    Destroy(screenshotTexture);
    



}  

function CameraCapture()
{
	renderTexture = RenderTexture(resWidth, resHeight, 24);
	camera.targetTexture = renderTexture;
	
	newCameraCapture = new Texture2D(resWidth, resHeight, TextureFormat.RGB24, false);
	camera.Render();
	
	RenderTexture.active = renderTexture;
	newCameraCapture.ReadPixels(new Rect(0, 0, resWidth, resHeight), 0, 0);
	
	camera.targetTexture = null;
	RenderTexture.active = null; // JC: added to avoid errors
	
	Destroy(renderTexture);
	
	cameraCaptureBytes = newCameraCapture.EncodeToPNG();
	filename = "cameraCapture" + resWidth + "x" + resHeight + ".png";
}

function UploadPNG() {
 
    // Create a Web Form
    var form = new WWWForm();
    form.AddField("frameCount", Time.frameCount.ToString());
    form.AddBinaryData("fileUpload", bytes, "screenShot.png", "image/png");
    // Upload to a cgi script
    var w = WWW(screenShotURL, form);
    yield w;
    if (!String.IsNullOrEmpty(w.error))
        print(w.error);
    else
        print("Finished Uploading Screenshot");
}

/*function Start() {
	// Take a screen shot immediately
    UploadPNG();
}*/

function Zoom()
{
    targetView -= Input.GetAxis("Mouse ScrollWheel") * zoomStep;
    targetView = Mathf.Clamp(targetView, minZoom, maxZoom);
    camera.fieldOfView = Mathf.SmoothDamp(camera.fieldOfView, targetView, zoomVel, damp);
}

function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}

function SetCam1Toggle(toggle : boolean)
{
	if(toggle)
	 cam1 = false;
	else
	 cam1 = true;
	
}

function ResetCamera()
{
	transform.position.x = 6;
	transform.position.y = 12;
	transform.position.z = -12;
	
	transform.rotation = rotation = Quaternion.Euler(33, 0, 0);
}