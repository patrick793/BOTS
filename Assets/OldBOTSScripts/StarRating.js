
class StarRating
{
	var levelName : String;
	var userID : int;
	var puzzleID : int;
	var personalRating : int = 0;
	var publicRating : float=0.0;
	var start : Vector2;
	var end :Vector2;
	var offset : Vector3;

	var isRated : boolean =false;
	var fifth =0;
	var open : Texture2D;
	var close : Texture2D;
	var amnt;
	var clicked: boolean = false;
	var isSubmit : boolean;
  var dm : DataManager;
	function StarRating(s : Vector2, e : Vector2, uID : int, pID : int)
	{

		userID = uID;
		puzzleID = pID;
		start =s;
		end = e;
		offset = new Vector3(0,0,0);
		isSubmit = false;
    dm = GameObject.Find("DataManager").GetComponent(DataManager);
	}

	function isPersonalRated()
	{
		if(personalRating > 0)
		{
			isRated = true;
		}
		return isRated;
	}

	function getLevelName()
	{
		return levelName;
	}

	function getUserID()
	{
		return userID;
	}

	function getPuzzleID()
	{
		return puzzleID;
	}

	function getPersonalRating()
	{
		return personalRating;
	}

	function getPublicRating()
	{
		return publicRating;
	}

	function setLevelName(name : String)
	{
		levelName = name;
	}

	function setUserID(ID : int)
	{
		userID = ID;
	}

	function setPuzzleID(pID : int)
	{
		puzzleID = pID;
	}

	function setPublicRating(rat : float)
	{
		publicRating += rat;
		publicRating = publicRating/2;
	}

	function setPublicRating(ratList : Array)
	{
		for(var j =0; j <ratList.length; j++)
		{
			publicRating+= ratList[j];
		}
		publicRating = publicRating/ratList.length;
	}

	/*Sets the offset for the mouse*/
	function setZeroZero(o : Vector3)
	{
		offset = o;
	}

	function isSubmitted()
	{
		return isSubmit;
	}

	/*Draws a set of 5 stars that can are filled based on rate */
	function draw(open : Texture2D, close : Texture2D, rate:int)
	{
		//Debug.Log("start: "+start);
		//Debug.Log("end: "+end);
		var length = end.x - start.x;
		var width = end.y - start.y;
		var starAmnt = 5;
		fifth = length/starAmnt;
		var posX = start.x;
		var starLen = fifth;
		var tex : Texture2D = close;
		for(var i = 0; i < starAmnt; i++)
		{
			if(i > rate-1)
			{
				tex = open;
			}
			GUI.Label(Rect(posX, start.y, starLen, width), tex);
			starLen += fifth;
			posX += fifth;
		}
	}

	/*This allows the user to set the amonut of stars they want (up to 5) */
	function setStars()
	{
		var pos = Input.mousePosition;

		pos -= offset;
		if(!clicked)
		{
				if(pos.x >= start.x && pos.x < fifth*1 && (Screen.height - pos.y) >= start.y && (Screen.height - pos.y) < end.y)
				{
					amnt = 1;
					if(Input.GetMouseButtonDown(0))
					{
					clicked = true;
					isRated = true;
					SubmitRating(amnt);
					}
				}
				else if(pos.x >= fifth*1 && pos.x < fifth*2 && (Screen.height - pos.y) >= start.y && (Screen.height - pos.y) < end.y)
				{
					amnt = 2;
					if(Input.GetMouseButtonDown(0))
					{
					clicked = true;
					isRated = true;
					SubmitRating(amnt);
					}
				}
				else if(pos.x >= fifth*2 && pos.x < fifth*3 && (Screen.height - pos.y) >= start.y && (Screen.height - pos.y) < end.y)
				{
					amnt = 3;
					if(Input.GetMouseButtonDown(0))
					{
					clicked = true;
					isRated = true;
					SubmitRating(amnt);
					}
				}
				else if(pos.x >= fifth*3 && pos.x < fifth*4 && (Screen.height - pos.y) >= start.y && (Screen.height - pos.y) < end.y)
				{
					amnt = 4;
					if(Input.GetMouseButtonDown(0))
					{
					clicked = true;
					isRated = true;
					SubmitRating(amnt);
					}
				}
				else if(pos.x >= fifth*4 && pos.x < fifth*5 && (Screen.height - pos.y) >= start.y && (Screen.height - pos.y) < end.y)
				{
					amnt = 5;
					if(Input.GetMouseButtonDown(0))
					{
					clicked = true;
					isRated = true;
					SubmitRating(amnt);
					}
				}
				else
				{
					amnt = 0;
				}

				/*if(Input.GetMouseButtonDown(0))
				{
					clicked = true;
					isRated = true;
					SubmitRating(amnt);
				}*/
		}
			personalRating = amnt;
			return amnt;
	}

	function SubmitRating(amnt : int)
	{
		Debug.Log(amnt + " rate");
		var www : WWW = WWW(dm.location + "drupal-6.2/scripts/bots/addRating.php?userid=" + GLOBALS.USER_ID + "&puzzleid=" + puzzleID + "&stars=" + amnt);
		Debug.Log("submitted rating! - " + amnt);
		isSubmit = true;
	}


}
