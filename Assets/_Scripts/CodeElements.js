 #pragma strict

enum CodeType { COMMAND, PARAMETER }
interface CodeElement{

	function SetUp();
	function getName() : String;
	function Clone() : CodeElement;
	function Draw() : boolean;
	function setPos( pos : Vector2 );
	function setTargetPos( pos : Vector2 );
	function getPos() : Vector2;
	function getCodeType() : CodeType;
	function ColorSet( c : Color );
	function ColorGray();
	function ColorReset();
	function getIndex() : int;
	function setIndex(index : int);
	function slideUp();
	function slideDown();
	function toPrettyString() : String;
	
}


enum StackOp { NULL, PUSH, PULL }
class CommandElement implements CodeElement {
	
	public var name : String;
	public var functionName : String;
	public var description : String;
	public var icon : Texture2D;
	public var color : Color = Color(1,1,1,1);
	public var paramList : ParamElement[];
	public var paramSlot : ParamSlot[];
	public var stackOp : StackOp;
	public var isFunction : boolean;
	@System.NonSerialized 
	public var partner : CommandElement;
	@System.NonSerialized 
	public var funcProgram : List.<CommandElement>;
	public static var editVal : ParamSlot;
	public static var editValStr : String;
	private var paramRect : Rect[];
	private var manager : GUIManager;
	private var mouseTimer : MouseTimer;
	private var pos : Vector2;
	private var targetPos : Vector2;
	private var oldColor : Color;
	private static var mousePressed : boolean;
	private var labelSize : int;
	private var textSize : int;
	private var cloned : boolean = false;
	private var funcPointerAng : float;
	private var programIndex : int;
	@HideInInspector public var isSourceInstance : boolean = true;
	public static final var LABEL_MIN_SIZE = 176;
	
	//Setup
	function SetUp(){
		this.manager = GUIManager.Get();
		this.mouseTimer = MouseTimer.Get();
		paramList = new ParamElement[paramSlot.Length];
		if( isSourceInstance )
		{
			Debug.Log("I actually Did This butt dong");
			funcProgram = new List.<CommandElement>();
		}
		textSize = manager.commandTxtStyle.CalcSize(GUIContent(name)).x+8;
		labelSize = textSize;
		if( paramSlot.Length > 0 ){
			labelSize += paramSlot.Length*30 + 15;
			paramRect = new Rect[paramSlot.Length];
		}
		if( labelSize < LABEL_MIN_SIZE )
			labelSize = LABEL_MIN_SIZE;
	}
	
	function toPrettyString() : String{
		if (paramSlot.Length == 0)
			return getName();
		var my_string = getName() + " ";
		var i = 0;
		for (var el in paramList)
		{
			if(el)		
				my_string += el.getName() + " ";
			else
				my_string += paramSlot[i].val + " ";
			i++;
		}
		return my_string; 
	}
	
	//Constructor
	function CommandElement( name : String, functionName : String ){
		this.name = name;
		this.functionName = functionName;
		
		//HACK: fix weird function initialization bug?
		//if (functionName.Contains("Function"))
		//{
		//	Debug.Log("Called the HACK");
		//	funcProgram = new List.<CommandElement>();
		//}
		
		this.paramList = new ParamElement[0];
		this.paramSlot  = new ParamSlot[0];
		labelSize = LABEL_MIN_SIZE;
		textSize = 178;
	}
	
	//Function to clone a command element (like when it's pulled from the toolbox)
	function Clone() : CodeElement{
		var e = new CommandElement( this.name, this.functionName );
		e.description = this.description;
		e.icon = this.icon;
		e.ColorSet(this.color);
		e.paramList = new ParamElement[this.paramSlot.Length];
		e.paramSlot = new ParamSlot[this.paramSlot.Length];
		e.stackOp = this.stackOp;
		e.funcProgram = this.funcProgram;
		e.isFunction = this.isFunction;
		e.isSourceInstance = false;
		e.SetUp();
		e.hasBeenCloned();
		
		//this is probably what I want
		for( var i : int = 0; i < paramSlot.Length; i++ ){
			e.paramSlot[i] = this.paramSlot[i].Clone();
			if( this.paramList[i] != null ){
				e.paramList[i] = this.paramList[i].Clone();
				//if( e.functionName.Equals("Change Variable") && e.paramList[i].type == ParameterType.VALUE ){
				//	e.paramList[i].val = 1;
				//} 
			}
				
		}
			
		return e;
	}
	
	static function EndBlock( startBlock : CommandElement ) : CommandElement{
		startBlock.partner = new CommandElement( "End " + startBlock.name, "End" + startBlock.functionName );
		startBlock.partner.SetUp();
		startBlock.partner.icon = startBlock.icon;
		startBlock.partner.description = "This command ends a previous "+startBlock.name.ToLower()+" block. Any commands after this will not be part of the "+startBlock.name.ToLower()+" statement.";
		startBlock.partner.ColorSet(startBlock.color);
		startBlock.partner.stackOp = StackOp.PULL;
		startBlock.partner.partner = startBlock;
		return startBlock.partner;
	}
	
	//Getters and setters for the positions
	function setPos( pos : Vector2 ){
		this.pos = pos;
		this.targetPos = pos;
	}
	function setTargetPos( pos : Vector2 ){
		this.targetPos = pos;
	}
	function getPos() : Vector2{
		return pos;
	}
	function getIndex() : int{
		return programIndex;
		}
	function setIndex(index : int) {
		programIndex = index;
	}
	function getName() : String {
		return name;
	}
	function slideUp() {
		programIndex--;
		if(programIndex < 0)
			Debug.Log("Slid beyond top of program.");
	}
	function slideDown() {
		programIndex++;
		if(programIndex > manager.botVar.program.Count)
			Debug.Log("Slid past end of program.");
	}
	
	//Draw function
	function Draw() : boolean{
		
		//Find positions
		var i : int = 0;
		pos.x += Time.deltaTime*(targetPos.x - pos.x)*5;
		pos.y += Time.deltaTime*(targetPos.y - pos.y)*5;
		var elmRect = Rect( pos.x-88, pos.y-24, 48, 48 );
		var iconRect = Rect( pos.x-84, pos.y-20, 40, 40 );
		var labelRect = Rect( pos.x-88, pos.y-24, labelSize, 48 );
		
		
		//Draw the edit button
		if( isFunction && !cloned ){
			var editRect = Rect( pos.x + 16 + LABEL_MIN_SIZE/2, pos.y-12, 64, 24 );
			var wiresRect = Rect( pos.x, pos.y-12, 16 + LABEL_MIN_SIZE/2, 24 );
			GUI.color = color;
			GUI.DrawTexture( wiresRect, manager.editFuncWires, ScaleMode.StretchToFill );
			if( manager.Button( editRect, "Edit", manager.editFuncStyle, null, "Click to edit this function." ) ){
				manager.botObj = manager.functionBot;
				manager.botVar = manager.functionBot.GetComponent(Bot);
				manager.botVar.botName = name;
				if( funcProgram == null )
				{
					Debug.Log("gfdashjfdasjhgkadfs");
					funcProgram = new List.<CommandElement>();
				}
				manager.botVar.program = funcProgram;
				manager.botVar.color = color;
				manager.indentCode();
			}
			//if( manager.botObj == manager.functionBot && manager.functionBot.GetComponent(Bot).botName.Equals(name) ){
			//	funcPointerAng += 2.5*Time.deltaTime;
			//	GUI.DrawTexture( Rect( editRect.x + 52+4*Mathf.Sin(funcPointerAng), editRect.y, 24, 24 ), manager.funcPointer );
			//}
			
			GUI.color = Color.white;
		}
		
		//Find parameter positions
		var mouseOnParam : int = -1;
		if( paramRect != null )
			for( i = 0; i < paramRect.Length; i++ ){
				paramRect[i] = Rect( pos.x + textSize-88+(30*i), pos.y-15, 30, 30 );
				if( paramRect[i].Contains(GUIManager.mousePos)  && cloned  && color.Equals(oldColor) ){
					mouseOnParam = i;
				}
			}
		
		//Checking for mouse events
		var isClicked : boolean = false;
		GUI.color = Color(color.r*0.7,color.g*0.7,color.b*0.7,1);
		if( labelRect.Contains(GUIManager.mousePos) && ((manager.mouseElement == null && mouseOnParam < 0) || manager.mouseElement == this) && color.Equals(oldColor) && !manager.muteGUI){
			GUI.color = color;
			manager.mouseOnCode = true;
			mouseTimer.ShowInfoString( description );
			if( Input.GetButtonDown("Fire1") ){
				if( !mousePressed ){
					isClicked = true;
					mousePressed = true;
				}
			}else{
				mousePressed = false;
			}
		}else{
				
		}
		
		//Draw the element icon
		GUI.DrawTexture( elmRect, manager.commandElementImg, ScaleMode.StretchToFill );
		GUI.DrawTexture( iconRect, icon, ScaleMode.StretchToFill );
		
		//Draw the element label
		GUI.Box( labelRect, "", manager.commandElmStyle );
		
		//Draw the parameter slots
		var oldParamColor = GUI.color;
		for( i = 0; i < paramSlot.Length; i++ ){
		
			//Check if there is a parameter in the slot
			var paramInSlot : boolean = false;
			if( paramList[i] != null )
				if( paramList[i].name != null )
					paramInSlot = true;
				
			//Check if the mouse is over this parameter slot
			if( mouseOnParam == i  && !manager.muteGUI ){
			
				//If the mouse isn't carrying anything
				if( manager.mouseElement == null ){
				
					if( paramSlot[i].type == ParameterType.VALUE ){
						if( !paramInSlot )
							if( Input.GetButton("Fire1") ){
								editVal = paramSlot[i];
								editValStr = paramSlot[i].val.ToString();
							}else{
								GUI.color = color;
							}
					}else{
						GUI.color = Color(color.r*0.85,color.g*0.85,color.b*0.85,1);
					}
					
					MouseTimer.ShowInfoString( paramSlot[i].description );
					if( paramInSlot ){
						manager.mouseOnElement = this;
						manager.mouseOnParamIndex = i;
						GUI.color = color;
					} 
					
				}else{
			
					//If the mouse is carrying a param element of the same type
					if( manager.mouseElement.getCodeType() == CodeType.PARAMETER ){
						var pe : ParamElement = manager.mouseElement;
						if( pe.type == paramSlot[i].type || (pe.type == ParameterType.VARIABLE && paramSlot[i].type == ParameterType.VALUE) ){
							GUI.color = color;
							manager.mouseOnElement = this;
							manager.mouseOnParamIndex = i;
						}
					}
					
				}
			}
		
			//Param specific draws and functionality
			switch(paramSlot[i].type){
				case ParameterType.VARIABLE:
					GUI.DrawTexture( paramRect[i], manager.paramVarSlotImg );
				break;
				case ParameterType.VALUE:
					GUI.DrawTexture( paramRect[i], manager.paramValSlotImg );
				break;
				case ParameterType.CONDITIONAL:
					GUI.DrawTexture( paramRect[i], manager.paramCndSlotImg );
				break;
				case ParameterType.BOT:
					GUI.DrawTexture( paramRect[i], manager.paramBotSlotImg );
				break;
			}
			
			//Draw the actual element if it's there
			if( paramInSlot ){
			
				paramList[i].setPos( Vector2(paramRect[i].x+15,paramRect[i].y+15) );
				paramList[i].DrawSimple( paramRect[i], (GUI.color == color) );
				
			}else{
				
				//Value parameters
				if( paramSlot[i].type == ParameterType.VALUE && cloned){
					GUI.color = Color.white;
					if( editVal == paramSlot[i] ){
						editSlotValue( paramSlot[i], i, paramRect[i] );
					}else{
						GUI.Label( paramRect[i], paramSlot[i].val.ToString(), manager.paramTxtStyle );
					}
				}
				
			}
			
			//Change back to old color
			GUI.color = oldParamColor;

		}
		
		
		//Draw the label text
		GUI.color = Color(1,1,1,1);
		GUI.Box( labelRect, name, manager.commandTxtStyle );
		
		return isClicked;
	}
	
	//Function to just draw the element icon in a specific place
	function DrawIcon( position : Vector2 ){
		//do a bunch of null checks
		if(manager == null)
			return;
		if(manager.commandElementImg == null)
			return;
		if(icon == null)
			return;
			
		var elmRect = Rect( position.x-24, position.y-24, 48, 48 );
		var iconRect = Rect( position.x-20, position.y-20, 40, 40 );
		GUI.color = color;
		GUI.DrawTexture( elmRect, manager.commandElementImg, ScaleMode.StretchToFill );
		GUI.DrawTexture( iconRect, icon, ScaleMode.StretchToFill );
		GUI.color = Color.white;
	}
	
	//Return that this is a command element
	function getCodeType() : CodeType{
		return CodeType.COMMAND;
	}
	
	//Functions to recolor the element
	function ColorSet( c : Color ){
		color = c;
		oldColor  = c;
	}
	function ColorGray(){
		//var avg : float = ( oldColor.r + oldColor.g + oldColor.b )/3.0;
		color.r = 0.5 + oldColor.r*0.25;
		color.g = 0.5 + oldColor.g*0.25;
		color.b = 0.5 + oldColor.b*0.25;
	}
	function ColorReset(){
		color = oldColor;
	}
	
	//Function to let the element know that it has been cloned
	function hasBeenCloned(){
		cloned = true;
	}
	
	
	//Function to get the value in a parameter slot
	function getParamValue( param : int ){
		if( paramList[param] != null )
			if( paramList[param].name != null ){
				var v : Variables = Variables.Get();
				return v.getVal( paramList[param].name );
			}
		return paramSlot[param].val;
	}
	
	//Function to get the name of a parameter
	function getParamName( param : int ) : String{
		if( paramList[param] != null )
			if( paramList[param].name != null ){
				return paramList[param].name;
			}
		return "";
	}
	
	//Function to get the bot referenced by a parameter
	function getParamBot( param : int ) : Bot{
		var botVar : Bot = null;
		for( var bt : BotType in WorldManager.botsList ){
			if( bt.obj != null ){
				
				botVar = bt.obj.GetComponent(Bot);
				if( botVar.color == paramList[param].color )
					return botVar;
			
			}
		}
		return null;
	}
	
	//Type for parameter slots'
	class ParamSlot{
		public var type : ParameterType;
		public var val : int;
		public var description : String;
		function Clone() : ParamSlot{
			var clone : ParamSlot = new ParamSlot();
			clone.type = type;
			clone.val = val;
			clone.description = description;
			return clone;
		}
	}
	
	
	
	//Function for editing a value slot's value
	function editSlotValue( slot : ParamSlot, slotIndex : int, pos : Rect ){
		var oldString : String = editValStr;
		editValStr = GUI.TextField( pos, editValStr, 3, manager.paramTxtStyle );
		
		//Security
		var chars : char[] = editValStr.ToCharArray();
		var c : char;
		for( var i : int = 0; i < chars.Length; i++ ){
			c = chars[i];
			if( !((c >= "0"[0] && c <= "9"[0]) || (c == "-"[0] && i == 0)) )
				editValStr = oldString;
		}
		if( chars.Length > 0 )
			if( chars[0] != "-"[0] && chars.Length > 2 )
				editValStr = oldString;
		
		//reset the slot's value
		try{
			slot.val = int.Parse(editValStr);
		}catch(err){
			slot.val = 0;
		}
		
		if( (Input.GetButtonDown("Fire1") && !pos.Contains(manager.mousePos)) )
		{
			manager.dm.CreateLog("CLICK PARAM " + manager.botVar.botName + ", " + getIndex() + ", " + slot.val + ", " + slotIndex); 
			editVal = null;
		}
		
	}

}




//Class for parameters
enum ParameterType { VARIABLE, VALUE, CONDITIONAL, BOT }
class ParamElement implements CodeElement {

	public var name : String;
	public var description : String;
	public var color : Color = Color.black;
	public var type : ParameterType;
	private var pos : Vector2;
	private var manager : GUIManager;
	private var mouseTimer : MouseTimer;
	private var oldColor : Color;
	private var img : Texture2D;
	
	
	//Setup
	function SetUp(){
		this.manager = GUIManager.Get();
		this.mouseTimer = MouseTimer.Get();
		if( type == ParameterType.VARIABLE ){
			img = manager.paramVarImg;
			if( this.name != null ){
				Variables.Get().registerVariable(this.name);
			}
		}
		if( type == ParameterType.CONDITIONAL )
			img = manager.paramCndImg;
		if( type == ParameterType.BOT )
			img = manager.paramBotImg;
			
	}
	
	//PrettyPrint
	function toPrettyString() : String {
		return getName();
	}
	
	//Constructor
	function ParamElement( name : String ){
		this.name = name;
	}
	
	//Function to clone a command element (like when it's pulled from the toolbox)
	function Clone() : CodeElement{
		var pe = new ParamElement( this.name );
		pe.color = this.color;
		pe.type = this.type;
		pe.setPos( this.pos );
		pe.SetUp();
		return pe;
	}
	
	static function EndBlock( startBlock : CommandElement ) : CommandElement{
		return null;
	}
	
	//Getters and setters for the positions
	function setPos( pos : Vector2 ){
		this.pos = pos;
	}
	function setTargetPos( pos : Vector2 ){
	}
	function getPos() : Vector2{
		return pos;
	}
	
	//Draw function
	function Draw() : boolean{
		
		var beenClicked : boolean = false;
		var imgRect : Rect = Rect(pos.x-15,pos.y-15,30,30);
		var drawBright : boolean = true;
		
		if( imgRect.Contains(GUIManager.mousePos)  && !manager.muteGUI ){
			MouseTimer.ShowInfoString(description);
			if( Input.GetButtonDown("Fire1") )
				
					beenClicked = true;
		}else{
			drawBright = false;
		}
	
		//Actually draw the element
		DrawSimple(imgRect, drawBright );
		GUI.color = Color.white;
		
		
		return beenClicked;
	}
	
	function DrawSimple( imgRect : Rect, drawBright : boolean ){
		var oldGUIColor = GUI.color;
		if( drawBright ){
			GUI.color = color;
		}else{
			GUI.color = Color(color.r*0.7,color.g*0.7,color.b*0.7,1);
		}
		GUI.DrawTexture( imgRect, img );
		GUI.color = Color.white;
		GUI.Box( imgRect, name, manager.paramTxtStyle );
		GUI.color = oldGUIColor;
	}
	
	//Return that this is a command element
	function getCodeType() : CodeType{
		return CodeType.PARAMETER;
	}
	
	function getName()
	{
		return name;
	}
	
	//Functions to recolor the element
	function ColorSet( c : Color ){
		color = c;
		oldColor = c;
	}
	function ColorGray(){
		oldColor = color;
		color.r = 0.5 + oldColor.r*0.25;
		color.g = 0.5 + oldColor.g*0.25;
		color.b = 0.5 + oldColor.b*0.25;
	}
	function ColorReset(){
		color = oldColor;
	}
	
}