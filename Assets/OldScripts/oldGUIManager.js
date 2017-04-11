#pragma strict
/*
Class ProgrammingGUI – allows the player to modify the program of a selected robot. Toolbox only draws CodeElementOrigin for CodeElements that that robot understands
toolbox – array containing CodeElementOrigin objects, each of which has an attached CodeElement, clones that element when clicked, and attaches it to the mouse

PickUp()
Called on mouseclick over the program area. Taking into account the current mouse position, either
-attaches the CodeElement in the Robot’s programArray to the mouse, or
-attaches the CodeElement in the parameterArray of the CodeElement to the mouse

Drop()
Called when mouse released over program area. Taking into account the current mouse position and held CodeElement, either
-inserts the CodeElement on the mouse into the Robot’s programArray at the appropriate index, or
-inserts the CodeElement into the parameterArray of the CodeElement at that index
*/
/**
class GUIManager extends MonoBehaviour
{
	//singletonize this class
	private static var instance : GUIManager; 
	
	var toolbox : List.< List.<CodeElementSource> >;
	var toolboxTab : int = 0;
	var toolboxTabNames : String[] = ["Actions", "Controls", "Functions", "Variables"];
	var program : List.<CodeElement>;
	var robot : Bot;
	var programIsDirty : boolean = false;
	
	var x : int; //x position to draw (toolbox + program)
	var y : int; //y position to draw (toolbox + program)

	private var currentElement : CodeElement; //element currently attached to the mouse
	
	var oldSkin : GUISkin;
	var newSkin : GUISkin;
	
	var C_PROG_WIDTH : int;
	var C_PROG_HEIGHT : int;
	var C_PROG_WINDOW : Rect;
	var C_PROG_X_SPACING : int;
	var C_PROG_Y_SPACING : int;
	
	var C_TOOLBOX_WIDTH : int;
	var C_TOOLBOX_HEIGHT : int;
	var C_TOOLBOX_WINDOW : Rect;
	var C_TOOLBOX_X_SPACING : int;
	var C_TOOLBOX_Y_SPACING : int;
	
	var C_BUTTONBOX_WIDTH : int;
	var C_BUTTONBOX_HEIGHT : int;
	var C_BUTTONBOX_WINDOW : Rect;
	var C_BUTTONBOX_X_SPACING : int;
	var C_BUTTONBOX_Y_SPACING : int;
	
	var MousePosition : Vector2;
	
	function InitConstants() //prevent the inspector from meddling with values
	{
		 C_PROG_WIDTH = 150;
		 C_PROG_HEIGHT = 560;
		 C_PROG_WINDOW  = new Rect(800, 20, C_PROG_WIDTH, C_PROG_HEIGHT);
		 C_PROG_X_SPACING = 150;
		 C_PROG_Y_SPACING = 50;
		
		 C_TOOLBOX_WIDTH = 600;
		 C_TOOLBOX_HEIGHT = 200;
		 C_TOOLBOX_WINDOW = new Rect(10,30,C_TOOLBOX_WIDTH, C_TOOLBOX_HEIGHT);
		 C_TOOLBOX_X_SPACING = 150;
		 C_TOOLBOX_Y_SPACING = 50;
		 
		 C_BUTTONBOX_WIDTH = 250;
		 C_BUTTONBOX_HEIGHT = 80;
		 C_BUTTONBOX_WINDOW = new Rect(700,600,C_BUTTONBOX_WIDTH,C_BUTTONBOX_HEIGHT);
	}
	
	public static function GetInstance() : GUIManager
	{
		return instance;
	}
	
	function Awake() {
		instance = this;
		
		currentElement = null;
	}
	
	function Start () {
		InitToolbox();
		InitConstants();
		currentElement = null;
		robot=GameObject.Find("Bot(Clone)").GetComponent("Bot");
	}
	
	function Update () {
		
		Debug.Log(currentElement);
		MousePosition = new Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y);
		UpdateHeldElement();
		
	}
	
	function InitToolbox() //initializes the toolbox to a generic default for testing
	{

		
		toolbox = new List.< List.<CodeElementSource> >();
		for(var tab=0; tab < 4; tab++)
		{
			toolbox.Add(new List.<CodeElementSource>());
			//for(var i = 0; i < 9; i++)
			//{
			//	toolbox[tab].Add(new CodeElementSource(toolboxTabNames[tab]));
			//}
			switch(tab)
			{
				case 0:
					toolbox[tab].Add(new CodeElementSource(new CodeElement("Move Forward", "MoveForward")));
					toolbox[tab].Add(new CodeElementSource(new CodeElement("Move Backward", "MoveBackward")));
					toolbox[tab].Add(new CodeElementSource(new CodeElement("Turn Left", "TurnLeft")));
					toolbox[tab].Add(new CodeElementSource(new CodeElement("Turn Right", "TurnRight")));
					toolbox[tab].Add(new CodeElementSource(new CodeElement("Climb Up","ClimbUp")));
					toolbox[tab].Add(new CodeElementSource(new CodeElement("Climb Down","ClimbDown")));
					toolbox[tab].Add(new CodeElementSource(new CodeElement("Pick Up", "PickUp")));
					toolbox[tab].Add(new CodeElementSource(new CodeElement("Put Down", "PutDown")));
					break;
				case 1:
					toolbox[tab].Add(new CodeElementSource(new ControlElement("For...", "ForLoop")));
					toolbox[tab].Add(new CodeElementSource(new ControlElement("While...","WhileLoop")));
					toolbox[tab].Add(new CodeElementSource(new ControlElement("If...","IfStatement")));
					break;
				case 2:
					toolbox[tab].Add(new CodeElementSource("Placeholder"));
					break;
				case 3:
					toolbox[tab].Add(new CodeElementSource(new ParameterElement("Math","GenericElement")));
					break;
			}
		}
	}
	
	function OnGUI () 
	{	
		//sets the gui skin
		oldSkin = GUI.skin;
		GUI.skin = newSkin;	
		
		DrawToolbox();
		DrawHeldElement();
		DrawProgram();
		DrawButtons();
		
		//puts it back the way it was found
		GUI.skin = oldSkin;
	}
	
	
	function DrawToolbox()
	{
		x = 0;
		y = 0; //y_start
		//iterate through CodeElementSource in toolbox, drawing those which are relevant to the current robot
		toolboxTab = GUI.Toolbar (Rect (C_TOOLBOX_WINDOW.x, C_TOOLBOX_WINDOW.y - 20, C_TOOLBOX_WIDTH, 20), toolboxTab, toolboxTabNames);
		
		//toolbox tabs
		//Actions
		
		//Controls
		
		//Functions
		
		//Variables	
		
		for(var c : CodeElementSource in toolbox[toolboxTab])
		{
			c.Draw(C_TOOLBOX_WINDOW.x + x,C_TOOLBOX_WINDOW.y + y);
			ToolboxIncrement();
		}
	}
	
	function DrawHeldElement()
	{
		var height = 40;
		var width = 80;
		
		if(IsHoldingElement())
		{
			GUI.Button(new Rect(
				Input.mousePosition.x,
				Screen.height - Input.mousePosition.y,
				width,
				height), currentElement.name, "GenericElementSource");
		}
	}
	
	function UpdateHeldElement()
	{
		if(IsHoldingElement() && Input.GetMouseButtonUp(0))
		{
			if(DropIntoProgram()) return;
			if(DropIntoWindow()) return;
			
			//otherwise we delete
			Debug.Log("dropped");
			
			if(currentElement.counterpart)
				program.Remove(currentElement.counterpart);
			if(currentElement.index >= 0) 
				program.RemoveAt(currentElement.index);
			currentElement = null;
		}
	}
	
	function DrawProgram()
	{
		x = 0;
		y = 0;
		var tab = new List.<CodeElement>();
		
		
		
		if (robot == null) //if there is no active robot, draw nothing
			return;
			
		GUI.Box(C_PROG_WINDOW, "program"); //draw the box and applicable buttons
		GUI.Button(Rect(C_PROG_WINDOW.x-40, C_PROG_WINDOW.y, 40, 40), "Main");
		GUI.Button(Rect(C_PROG_WINDOW.x-40, C_PROG_WINDOW.y + 45, 40, 40), "f1");
		GUI.Button(Rect(C_PROG_WINDOW.x-40, C_PROG_WINDOW.y + 90, 40, 40), "f2");
			
		program = robot.program;
		
		//iterate through CodeElement in robot.program, drawing each
		for(var i=0; i<program.Count; i++)
		{
			var c = program[i];
			
			//this will maintain current indices.
			if (programIsDirty)
				c.index = i;
			
			
			//Handle tabbing over of displaying Controls/Break elements. Maintain appropriate pairs.			
			if (c.type == "Break" && tab.Count > 0)
			{				
				tab[tab.Count-1].counterpart = c;
				c.counterpart = tab[tab.Count-1];
				tab.RemoveAt(tab.Count - 1);
			}
						
			var tabspacing = Mathf.Clamp(tab.Count, 0, 5);
				
			var x_position = C_PROG_WINDOW.x + x + (tabspacing * 20);
			var y_position = C_PROG_WINDOW.y + y;
			
			//Draws "wires" that connect a control to its counter-part END block
			for (var j = 0; j < tab.Count; j++)
			{
				var pos = Rect(C_PROG_WINDOW.x + x + (j * 20), C_PROG_WINDOW.y + y - 10, 5, 60); //magic numbers! :C
				GUI.Box(pos, "", "Wires");
			}
			
			
			if(c != currentElement && c.Draw(x_position, y_position) && !IsHoldingElement())
			{
				PickUp(c);
				//program.Remove(c);				
			}
			
			//Handle drawing parameters
			if (c.parameterList)
			{
				var param_x = 40;
				var param_y = 5;
				for (var e : CodeElement in c.parameterList)
				{
					//we'll draw the contained elements
					if(e.Draw(x_position + param_x, y_position + param_y) && !IsHoldingElement())
					{
						PickUp(e);
						c.parameterList.Remove(e);
					}	
					param_x += 35;				
				}
			}
			
			//Handle tabbing over of controls/break elements. 
			if (c.type == "Control")
			{
				tab.Add(c);
			}
				
			//changes the X and Y position for the next element to draw	
			ProgramIncrement();
		}
	}
	
	function DrawButtons()
	{
		GUI.Box(C_BUTTONBOX_WINDOW, "");
		
		GUI.Button(Rect(700,600,80,80), "Run");
		GUI.Button(Rect(785,600,80,80), "Step");
		GUI.Button(Rect(870,600,80,80), "End");
		
	}
	
	function ToolboxIncrement() //moves to the next appropriate location to draw a codeElement
	{
		x +=  C_TOOLBOX_X_SPACING;
		if (x > C_TOOLBOX_WIDTH - C_TOOLBOX_X_SPACING)
		{
			x = 0;
			y += C_TOOLBOX_Y_SPACING;
		}
	}
	
	function ProgramIncrement() //moves to the next appropriate location to draw a codeElement
	{
		x += C_PROG_X_SPACING;
		if (x > C_PROG_WIDTH - C_PROG_X_SPACING)
		{
			x = 0;
			y += C_PROG_Y_SPACING;
		}
	}
	
	//Pick Up and Drop Elements
	function PickUp(element : CodeElement) //picks up a button if possible
	{
		if (IsHoldingElement())
		{
			return;
		}
		else
		{
			currentElement = element;
		}
	}
	
	function DropIntoProgram() : boolean
	{
		programIsDirty = true;
		if(C_PROG_WINDOW.Contains(MousePosition))
		{
			var rows = MousePosition.y - C_PROG_WINDOW.y;
			var rownum : int = rows / C_PROG_Y_SPACING;
			Debug.Log(rownum);
			
			//check if the element I am over contains Parameters
			if(program.Count > rownum && program[rownum].isContainer && currentElement.isParameter){
				//consider dropping an element into the container?
				if (DropIntoElement(program[rownum]))
				{
					currentElement = null;
					return true;
				}
			}
			
			//put the dropped element into the program	
			if(currentElement.index >= 0)
				program.RemoveAt(currentElement.index);	
			program.Insert(Mathf.Clamp(rownum,0,program.Count), currentElement);
			
			
			//insert the end block if this is a "Control"
			if(currentElement.type && currentElement.type == "Control" && !currentElement.counterpart)
			{
				var endblock = new BreakElement("end","GenericElement");
				endblock.counterpart = currentElement;
				currentElement.counterpart = endblock;
				program.Insert(Mathf.Clamp(rownum+1,0,program.Count), endblock);

			}
			
			
			//drop the current element from the GUI Manager
			currentElement = null;
			return true;
		}
		return false;
	}
	
	function DropIntoElement(container : CodeElement) : boolean
	{
		container.parameterList.Add(currentElement);
		return true;
	}
	
	function DropIntoWindow() : boolean
	{
		return false;
	}
	
	
	function IsHoldingElement() : boolean //returns if the player is currently holding a codeelement
	{
		return !(currentElement == null || currentElement.IsEmpty());
	}
	
}
*/