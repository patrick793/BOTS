
function Start()
{
	test_astar();
}

function astar(start : SolutionState, goal : SolutionState) {

	var closedSet = PriorityQueue();
	var openSet = PriorityQueue();
	var cameFrom = new Dictionary.<String, SolutionState>();
	var gScore = new Dictionary.<String, int>();
	var blah = 0;
	
	openSet.push(start, 0 + start.GetHeuristic());
	gScore.Add(start.Key(), 0);
	
	var currentState : SolutionState;
	
	while (openSet.size() > 0)
	{
		currentState = openSet.pop();
		Debug.Log(currentState.Key());
		blah++;
		if (blah > 1000)
		{
			Debug.Log("too many");
			break;
		}
			
		closedSet.push(currentState, gScore[currentState.Key()]);
		
		if (currentState.GetHeuristic() == 0)
		{
			Debug.Log("goal");
			//return pathBack(cameFrom, currentState);
			return null;
		}

		
		var children = currentState.GetChildren();
		var childG = gScore[currentState.Key()] + 1;
		for (child in children)
		{
			if (!gScore.ContainsKey(child.Key()))
				gScore.Add(child.Key(), 1000000);
				
			if (closedSet.contains(child) && childG >= gScore[child.Key()])
				continue;
			
			if (!openSet.contains(child) || childG < gScore[child.Key()])
			{
				cameFrom.Remove(child.Key());
				cameFrom.Add(child.Key(), currentState);
				gScore[child.Key()] = childG;
				openSet.push(child, childG + child.GetHeuristic());
			}
		}
	}
	return null;
}

function test_astar()
{
	start = new SolutionState();
	start.robotX = 0;
	start.robotY = 0;
	start.robotFace = 0;
	start.robotHolding = false;
	start.boxLocations.Add(new Point(0,9));
	start.switchLocations.Add(new Point(9,0));
	start.switchLocations.Add(new Point(9,9));
	
	for (i=0;i<10;i++)
	{
		for (j=0;j<10;j++)
		{
			if( (i==0 || i==9) || (j==0 || j==9) )
				start.heightMap[i,j] = 1;
			else
				start.heightMap[i,j] = 5;
		}
	}
	
	/*children1 = start.GetChildren();
	children2 = start.GetChildren();
	for (child in children1)
	{
		for (match in children2)
		{
			if (child.equals(match))
			{	
				Debug.Log("yes");
				continue;
			}
		}
	}*/
	
	path = astar(start, start);
	Debug.Log(path);
}

function pathBack(map : Dictionary.<String, SolutionState>, node : SolutionState) : int
{	
	Debug.Log("path " + node.Key());
	try{
		pathBack(map, map[node.Key()]);
	}
	catch(err)
	{
		Debug.Log("done");
	}
	return 0;
}

/*function findBestPath(var startState : SolutionState, var finalState : SolutionState){
	var openSet : SolutionState = [];
	var closedSet : SolutionState = [];
	var curState;
	openSet.push(startState);
	
	while(openSet.length > 0){
		curState = getLowest(openSet);
		if(curState == finalState){
			return curState;
		}
		closedSet.push(curState);
		openSet.pop(curState);
		var children : SolutionState = [];
		for(i = 0; i < children.length; i++){
			if(isIn)
		}
	}
} */

/*  function A*(start,goal)
     closedset := the empty set    // The set of nodes already evaluated.
     openset := {start}    // The set of tentative nodes to be evaluated, initially containing the start node
     came_from := the empty map    // The map of navigated nodes.
 
     g_score[start] := 0    // Cost from start along best known path.
     // Estimated total cost from start to goal through y.
     f_score[start] := g_score[start] + heuristic_cost_estimate(start, goal)
 
     while openset is not empty
         current := the node in openset having the lowest f_score[] value
         if current = goal
             return reconstruct_path(came_from, goal)
 
         remove current from openset
         add current to closedset
         for each neighbor in neighbor_nodes(current)
             tentative_g_score := g_score[current] + dist_between(current,neighbor)
             if neighbor in closedset
                 if tentative_g_score >= g_score[neighbor]
                     continue
 
             if neighbor not in openset or tentative_g_score < g_score[neighbor] 
                 came_from[neighbor] := current
                 g_score[neighbor] := tentative_g_score
                 f_score[neighbor] := g_score[neighbor] + heuristic_cost_estimate(neighbor, goal)
                 if neighbor not in openset
                     add neighbor to openset
 
     return failure
 
 function reconstruct_path(came_from, current_node)
     if current_node in came_from
         p := reconstruct_path(came_from, came_from[current_node])
         return (p + current_node)
     else
         return current_node
         */