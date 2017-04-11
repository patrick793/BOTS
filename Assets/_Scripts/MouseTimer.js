#pragma strict

class MouseTimer{

	//Info box
	public static final var INFO_WIDTH : float= 256;
	public static final var INFO_MIN_HEIGHT : float = 44;
	private var infoStyle : GUIStyle;
	private var showInfoBox : boolean = false;
	private var infoString : String;
	private var timer : float;
	private var fade : float;
	
	//Singleton construction
	public static function Get(){
		if( instance == null ){
			instance = new MouseTimer();
		}
		return instance;
	}
	private static var instance : MouseTimer;
	private function MouseTimer(){
		infoStyle = new GUIStyle();
	}
	
	
	
	
	/**
	*Use this function to set the GUIStyle for the info bubble
	*/
	public function setStyle( style : GUIStyle ){
		infoStyle = style;
	}
	
	/**
	*This function will actually draw the info bubble
	*/
	function Draw(){
	
		//Check for movement
		if( Input.GetAxis("Mouse X") != 0 || Input.GetAxis("Mouse Y") != 0 || Input.GetMouseButton(0) || Input.GetMouseButton(1) || Input.GetMouseButton(2) || Input.GetAxis( "Mouse ScrollWheel" ) != 0 ){
			showInfoBox = false;
			timer = 1.5;
		}
		timer -= Time.deltaTime;
		if( timer < 0 )
			timer = 0;
	
		//Draw the box
		if( infoString != null )
			if( showInfoBox && !"".Equals(infoString) ){
				fade = Mathf.MoveTowards( fade, 1, 4*Time.deltaTime );
				GUI.color.a = fade;
				var pos : Rect = Rect( Input.mousePosition.x, Screen.height - Input.mousePosition.y, INFO_WIDTH, infoStyle.CalcHeight(GUIContent(infoString),INFO_WIDTH) );
				if( pos.height < INFO_MIN_HEIGHT )
					pos.height = INFO_MIN_HEIGHT;
				if( pos.x > Screen.width - pos.width )
					pos.x = Screen.width - pos.width;
				if( pos.y > Screen.height - pos.height )
					pos.y = Screen.height - pos.height;
				GUI.Box( pos, infoString, infoStyle );
				GUI.color.a = 1;
			}else{
				fade = Mathf.MoveTowards( fade, 0, 4*Time.deltaTime );
			}
	
	}
	
	
	
	
	//Function to show the info string
	static function ShowInfoString( s : String ){
		if( instance != null )
			if( instance.timer == 0 ){
				instance.infoString = s;
				instance.showInfoBox = true;
			}
	}
	
}




