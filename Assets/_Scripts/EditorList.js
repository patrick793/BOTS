#pragma strict

/**
This class represents a list of clickable items in the editor GUI
*/
class EditorList{

	//GUI Style
	var style : GUIStyle;
	var scrollSkin : GUISkin;

	//The actual list of strings
	var list : String[];
	
	//Position of the list
	var listPos : Rect;
	var textPos : Rect;
	var scrollBarPos : Rect;
	var scrollPos : float;
	
	//Single click enforcment
	private static var hasClicked : boolean = false;

	function EditorList( list : String[], pos : Rect, style : GUIStyle, scrollSkin : GUISkin ){
		this.list = list;
		refreshPosition(pos);
		this.style = style;
		this.scrollSkin = scrollSkin;
	}
	
	function refreshPosition(pos : Rect){
		listPos = pos;
		textPos = new Rect( 24, pos.y, pos.width - 24, 24 );
		scrollBarPos = new Rect( 0, 0, 12, pos.height );
	}
	
	
	
	
	function draw() : String{
		GUILayout.BeginArea(listPos);
			var r : String = null;
		
			//Draw the scroll bar
			if( list.Length*textPos.height > listPos.height ){
				if( !EditorGUIManager.muteGUI ){
				GUI.skin = scrollSkin;
				scrollPos = GUI.VerticalScrollbar( scrollBarPos, scrollPos, listPos.height/textPos.height, 0, list.Length );
				if( listPos.Contains(Vector2(Input.mousePosition.x,Screen.height-Input.mousePosition.y)) )
					scrollPos -= Input.GetAxis("Mouse ScrollWheel");
				}
			}
		
			//Draw the list items
			for( var i : int = 0; i < list.Length; i++ ){
				textPos.y = (i-scrollPos) * textPos.height;
				if( !EditorGUIManager.muteGUI ){
					if( textPos.Contains(Vector2(Input.mousePosition.x-listPos.x,Screen.height-Input.mousePosition.y-listPos.y)) ){
						if( Input.GetButtonDown("Fire1") && !hasClicked ){
							r = list[i];
							hasClicked = true;
						}
					}
					GUI.Button( textPos, list[i], style );
				}else{
					GUI.Label( textPos, list[i], style );
				}
				
			}
			
			if( !Input.GetButton("Fire1") )
				hasClicked = false;
		
		GUILayout.EndArea();
		return r;
	}

}