class Component{
	var target_name : String;
	var target : Component;
	var id : String;
	
	var visible : boolean = false;
	
	var grid_x : int;
	var grid_y : int;
	var grid_z : int;
	
	var absolute_x : float;
	var absolute_y : float;
	var absolute_z : float;
	

	function Start () {

	}

	function Update () {
		if (!target) {
			setTarget(target_name);
		}
		
		
	}
	
	function setTarget(t : String) {
		if (!target_name) {
			target_name = t;
		}
		
		
		
	}
	
	function isTarget() : String {
		return target_name;
	}
	
	function getTarget() : Component {
		return target;
	}
	
	function setVisible(v : boolean) {
		visible = v;
	}
	
	function isVisible() : boolean {
		return visible;
	}
	
	function getID() : String {
		return id;
	}
	
	function getX() : int {
		return grid_x;
	}
	
	function getY() : int {
		return grid_y;
	}
	
	function getZ() : int {
		return grid_z;
	}
	
	function setX(x : int) {
		grid_x = x;
	}
	
	function setY(y : int) {
		grid_y = y;
	}
	
	function setZ(z : int) {
		grid_z = z;
	}
	
	function setX(x : float) {
		grid_x = x;
	}
	
	function setY(y : float) {
		grid_y = y;
	}
	
	function setZ(z : float) {
		grid_z = z;
	}
}