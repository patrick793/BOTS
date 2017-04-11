class SolutionState{

var heightMap : int[,] = new int[10,10];

var robotX : int;
var robotY : int;
var robotFace : int;
var robotHolding : boolean;
//0: +x
//1: -y
//2: -x
//3: +y
var boxLocations = new ArrayList();
var switchLocations = new ArrayList();

function GetChildren() : Object
{
	var children = new ArrayList();
	var child : SolutionState;
//StepForward
	if(IsStepForwardable())
	{
		child = this.clone();
		switch (robotFace)
		{
		case 0: child.robotX++; break;
		case 1: child.robotY--; break;
		case 2: child.robotX--; break;
		case 3: child.robotY++; break;
		}
		children.Add(child);
	}
//StepBackward
	if(IsStepBackable())
	{
		child = this.clone();
		switch (robotFace)
		{
		case 0: child.robotX--; break;
		case 1: child.robotY++; break;
		case 2: child.robotX++; break;
		case 3: child.robotY--; break;
		}
		children.Add(child);
	}
//TurnLeft
	child = this.clone();
	child.robotFace = (child.robotFace + 4 - 1) % 4; 
	children.Add(child);
//TurnRight
	child = this.clone();
	child.robotFace = (child.robotFace + 1) % 4; 
	children.Add(child);
//Pickup/Putdown
	if(IsPickUpable())
	{
		child = this.clone();
		var newX = robotX;
		var newY = robotY;
		switch (robotFace)
		{
			case 0: newX++; break;
			case 1: newY--; break;
			case 2: newX--; break;
			case 3: newY++; break;
		}
		
		if(robotHolding)
		{
			child.robotHolding = false;
			child.boxLocations.Add(new Point(newX, newY));
			child.ResolveGoals(new Point(newX, newY));
			children.Add(child);
		}
		else
		{
			for (box in boxLocations)
			{
				var i : Point = box;
				if(i.X == newX && i.Y == newY)
				{
					child.boxLocations.Remove(i);
					child.robotHolding = true;
					children.Add(child);
					break;
				}
			}
		}
	}
//Jump
/*
	if(IsJumpable())
	{
		child = this.clone();
		switch (robotFace)
		{
		case 0: child.robotX++; break;
		case 1: child.robotY--; break;
		case 2: child.robotX--; break;
		case 3: child.robotY++; break;
		}
		children.Add(child);
	}*/
	return children;
}

function GetHeuristic() : int
{
	var h = 0;
	var i : Point;
	var j : Point;
	var min = 100;
	var distance = 100;
//for robot, distance to closest box
//if no box, distance to closest goal
	if (!robotHolding && boxLocations.Count == 0)
	{
		Debug.Log("no boxes");
		min = 1000;
		for (switchen in switchLocations)
		{
			j = switchen;
			distance = Mathf.Abs(robotX - j.X) + Mathf.Abs(robotY - j.Y);
			if (distance < min)
				min = distance;
		}
		h += min;				
	}
	else
	{

		min = 100;
		if(!robotHolding)
		{
			for (switchen in boxLocations)
			{
				j = switchen;
				distance = Mathf.Abs(robotX - j.X) + Mathf.Abs(robotY - j.Y);
				if (distance < min)
					min = distance;
			}
			h += min;
		}

		//for each goal, distance to the closest box (or the one I'm holding)
		for (switchen in switchLocations)
		{
			i = switchen;
			min = 100;
			for (box in boxLocations)
			{
				j = box;
				distance = Mathf.Abs(i.X - j.X) + Mathf.Abs(i.Y - j.Y);
				if (distance < min)
					min = distance;
			}
			distance = Mathf.Abs(robotX - i.X) + Mathf.Abs(robotY - i.Y);
				if (distance < min)
					min = distance;
			
			h += min;
		}
	}
//when a box is placed on a goal, we remove it
	return h;
}

function IsJumpable()
{
	//if the spot in front of the robot is empty and same level or lower we can do this
	if (SpotInFront() != null && SpotInFront() == 1)
		return true;
		
	return false;
}

function IsPickUpable()
{
	//if the spot in front of the robot contains a box we can pick up
	if (!robotHolding && SpotInFront() == 3) 
		return true;
	//if we're holding a box, and the spot in front of the robot is empty, we can put down
	if (robotHolding && SpotInFront() != 3 && SpotInFront() < 1)
		return true;
		
	return false;
}

function IsStepForwardable()
{
	//if the spot in front of the robot is empty and same level or lower we can do this
	if (SpotInFront() != 3 && SpotInFront() < 1)
		return true;
		
	return false;
}

function IsStepBackable()
{
	//if the spot behind the robot is empty and same level or lower we can do this
	if (SpotBehind() != 3 && SpotBehind() < 1)
		return true;
		
	return false;
}

//returns 2 if much higher or off edge, 1 if the spot in front is one higher, 0 if same, -1 if lower, 3 if full
function SpotInFront() : int
{
	var newX = robotX;
	var newY = robotY;
	switch (robotFace)
	{
		case 0: newX++; break;
		case 1: newY--; break;
		case 2: newX--; break;
		case 3: newY++; break;
	}
	
	if (newX > 9 || newX < 0 || newY > 9 || newY < 0)
		return 2;
	
	for (box in boxLocations)
	{
		var i : Point = box;
		if (i.X == newX && i.Y == newY)
			return 3;
	}
			
	if (heightMap[robotX, robotY] + 1 == heightMap[newX, newY])
		return 1;
	else if (heightMap[robotX, robotY] < heightMap[newX, newY])
		return 2;
	else if (heightMap[robotX, robotY] == heightMap[newX, newY])
		return 0;
	else
		return -1;
}

//returns 2 if off edge, 1 if the spot behind is higher, 0 if same, -1 if lower, 3 if full
function SpotBehind() : int
{
	var newX = robotX;
	var newY = robotY;
	switch (robotFace)
	{
		case 0: newX--; break;
		case 1: newY++; break;
		case 2: newX++; break;
		case 3: newY--; break;
	}
	
	if (newX > 9 || newX < 0 || newY > 9 || newY < 0)
		return 2;
	
	for ( box in boxLocations )
	{
		var i : Point = box;
		if (i.X == newX && i.Y == newY)
			return 3;
	}
	
	if (heightMap[robotX, robotY] < heightMap[newX, newY])
		return 1;
	else if (heightMap[robotX, robotY] == heightMap[newX, newY])
		return 0;
	else
		return -1;
}

function ResolveGoals(Box : Point) : boolean
{
	for (i in switchLocations)
		{
			if (Point.isEqual(i, Box))
			{

				for (j in boxLocations)
					{
						if (Point.isEqual(j, Box))
						{
							switchLocations.Remove(i);
							boxLocations.Remove(j);
							return true;
						}
					}
				
				}
		}
	return false;
}

function clone()
{
	baby = new SolutionState();
	
	baby.heightMap = new int[10,10];
	baby.heightMap = heightMap;

	baby.robotX = robotX;
	baby.robotY = robotY;
	baby.robotFace = robotFace;
	baby.robotHolding = robotHolding;
	
	baby.boxLocations = boxLocations.Clone();
	baby.switchLocations = switchLocations.Clone();
	
	return baby;
}

function Equals(baby : Object)
{
	if(baby.heightMap == heightMap &&
	baby.robotX == robotX &&
	baby.robotY == robotY &&
	baby.robotFace == robotFace &&
	baby.robotHolding == robotHolding)
	{
		if (boxLocations.Count != baby.boxLocations.Count || switchLocations.Count != baby.switchLocations.Count)
			return false;
			
		for (box in boxLocations)
			{
				if(!baby.boxLocations.Contains(box))
				{
				return false;
				}
			}
		for (switcher in switchLocations)
		{
			if(!baby.switchLocations.Contains(switcher))
			{
			return false;
			}
		}
		return true;
	}
	else
		return false;
}

function Key(){
	var output = robotX + " " + robotY + " " + robotFace + " " + robotHolding + " ";
	for (box in boxLocations)
		{
			output += "b(" + box.X + " " + box.Y + ") ";
		}
	for (switcher in switchLocations)
		{
			output += "s(" + switcher.X + " " + switcher.Y + ") ";
		}
	output += GetHeuristic();
	return output;
}

}