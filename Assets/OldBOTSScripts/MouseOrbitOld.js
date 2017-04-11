var target : Transform;
var distance = 15.0;

var xSpeed = 250.0;
var ySpeed = 120.0;

var yMinLimit = -20;
var yMaxLimit = 80;

private var x = 0.0;
private var y = 0.0;

static var cam1 : boolean = false;

@script AddComponentMenu("Camera-Control/Mouse Orbit")

function Start () {
    var angles = transform.eulerAngles;
    x = angles.y;
    y = angles.x;

	// Make the rigid body not change rotation
   	if (rigidbody)
		rigidbody.freezeRotation = true;
}

function OnGUI()
{
 	if(GUI.Button(Rect(100,430,80,20),"Cam"))
    {
        SetCam1Toggle(cam1);
    }
    
    if(cam1)
    {
    	if(GUI.Button(Rect(180,430,20,20),"+"))
        {
         distance -= 1;
        }
        if(GUI.Button(Rect(200,430,20,20),"-"))
        {
         distance += 1;
        }

    	
    }

}
function LateUpdate () {
    if (target && cam1 && Input.GetMouseButton(0)) 
    {
        x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
        y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
 		
 		y = ClampAngle(y, yMinLimit, yMaxLimit);
 		       
        var rotation = Quaternion.Euler(y, x, 0);
        var position = rotation * Vector3(0.0, 0.0, -distance) + target.position;
        
        transform.rotation = rotation;
        transform.position = position;
    }
}

static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}

static function SetCam1Toggle(toggle : boolean)
{
	if(toggle)
	 cam1 = false;
	else
	 cam1 = true;
	
}