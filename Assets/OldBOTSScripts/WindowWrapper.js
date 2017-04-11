class WindowWrapper {
	var uniqueID: int;
	var type: int;
		
	var currentIndex: int;
	var title: String;
	
	function WindowWrapper( uid: int, t: int, ci: int)
	{
		uniqueID = uid;
		type = t;
		currentIndex = ci;
	}
	
	function WindowWrapper( uid: int, t: int, ci: int, ti: String)
	{
		uniqueID = uid;
		type = t;
		currentIndex = ci; 
		title = ti;
	}
}