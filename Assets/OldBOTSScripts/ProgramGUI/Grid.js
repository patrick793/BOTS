class Grid
{
	var rows : int;
	var cols : int;
	var objX : float;
	var objZ : float;
	var objIndex : int;
	
	var containers : Point3D[];
	
	function Grid(r : int, c : int)
	{
	 rows = r;
	 cols = c;
	 containers = new Array();
	 InitGrid();	

	}
	
	function GetRows() : int
	{
		return rows;
	}
	
	function GetCols() : int
	{
	    return cols;	
		
	}
	
	function InitGrid()
	{
		
		
		for( var i = 0.0; i < rows; i++)
			for(var j = 0.0; j < cols; j++){
				containers.push(new Point3D(i,j));
			}
		//default height of 1
		
		SetHeightAll(1);	
		
	}
	
	function SetHeightAll(h : int)
	{
		for(i = 0; i < containers.length; i++)
		{
		  containers[i].height = h;		 	
		}			
		
	}
	
	function SetHeight(h: int, pos: int)
	{
	 containers[pos].height = h;	
	}
	
	function GridLocationIndex(objVector : Vector3 ) : int
	{
		var max_distance = 10;
    	var distances = new Array();
    	
    	for(var i = 0; i < containers.length; i++)
    	{
    	 var dx = Mathf.Pow(objVector.x - containers[i].GetX(), 2);
    	 var dz = Mathf.Pow(objVector.z - containers[i].GetZ(), 2);
    	 var dist = Mathf.Sqrt(dx + dz);
    	 distances[i] = dist;    		
    	}
    	    	
   		var cheapest_index = 0;
		var cheapest_move = distances[0];
		for(var j = 0; j < distances.length; j++)
		{
		 	if(cheapest_move > distances[j])
		  	{
		 		cheapest_move = distances[j];
		    	cheapest_index = j;
		  	}
		}
		
		if (cheapest_move <= max_distance)
		{
			objIndex = cheapest_index;
			return cheapest_index;
		}
		return -1; 
		
	}
	
	function GridX(objVector : Vector3 ) : float
	{
	 //should return the x coordinate for which the robot is standing on or is closest to	
	 var index;
	 index = GridLocationIndex(objVector);
	 objX = containers[index].GetX();
	 return objX;	
	}
	
	function GridZ(objVector : Vector3 ) : float
	{
	 //should return the y coordinate for which the robot is standing on or is closest to
	 var index;
	 index = GridLocationIndex(objVector);	
	 objZ = containers[index].GetZ();
	 return objZ;
	 
	}
	
	
}